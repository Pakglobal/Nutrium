import {useCallback, useEffect, useRef, useState} from 'react';
import {useDispatch, useSelector} from 'react-redux';
import {AppState} from 'react-native';
import {
  incrementSteps,
  setSteps,
  setWorkouts,
  setIsTracking,
  resetSteps,
} from '../redux/stepTracker';
import {connectSocket, getSocket} from './SocketService';
import {
  startBackgroundStepTracking,
  stopBackgroundStepTracking,
} from './BackgroundStepTracking';
import sensors, {
  accelerometer,
  SensorTypes,
  setUpdateIntervalForType,
} from 'react-native-sensors';
import {store} from '../redux/Store';
import {GetClientData} from '../Apis/AdminScreenApi/ClientApi';

const PEAK_THRESHOLD = 1.5;
const VALLEY_THRESHOLD = -1.2;
const MIN_STEP_DELAY = 300;
const COOLDOWN_TIME = 500;
const MOTION_THRESHOLD = 0.3;

export const useStepTracking = () => {
  const dispatch = useDispatch();
  const {steps, workouts, currentDay, isTracking} = useSelector(
    state => state.stepTracker,
  );

  const appStateRef = useRef(AppState.currentState);
  const subscriptionRef = useRef(null);

  const tokenId = useSelector(state => state?.user?.token);
  const guestTokenId = useSelector(state => state?.user?.guestToken);
  const token = tokenId?.token || guestTokenId?.token;
  const id = tokenId?.id || guestTokenId?.id;
  const isLoggedIn = !!id;

  const lastAccelerationRef = useRef({x: 0, y: 0, z: 0});
  const lastStepTimeRef = useRef(0);
  const isCooldownRef = useRef(false);
  const hasPeakedRef = useRef(false);
  const dayCheckIntervalRef = useRef(null);
  const motionDetectedRef = useRef(false);
  const socketIntervalRef = useRef(null);
  const lastSyncedStepsRef = useRef(0);

  const calculateCalories = stepCount => {
    const CALORIES_PER_STEP = 0.03;
    return Math.round(stepCount * CALORIES_PER_STEP);
  };

  const fetchHistoricalStepsData = useCallback(async () => {
    try {
      const response = await GetClientData(token, id);
      const userData = response[0];
      const stepLogsData = userData?.stepLogs || [];

      const updatedWorkouts = {...workouts};

      stepLogsData.forEach(entry => {
        const date = new Date(entry.date);
        const dayOfWeek = date.getDay();
        const adjustedIndex = dayOfWeek === 0 ? 6 : dayOfWeek - 1;
        updatedWorkouts[adjustedIndex] = entry.steps;
      });

      dispatch(setWorkouts(updatedWorkouts));
    } catch (error) {
      console.error('Error fetching step history:', error);
    }
  }, [id, token, workouts, dispatch]);

  const logLast7DaysSteps = () => {
    const daysOfWeek = [
      'Monday',
      'Tuesday',
      'Wednesday',
      'Thursday',
      'Friday',
      'Saturday',
      'Sunday',
    ];
    const today = new Date();
    today.setHours(0, 0, 0, 0);
    const todayIndex = currentDay;

    for (let i = 0; i < 7; i++) {
      const dayIndex = (todayIndex - i + 7) % 7;
      const stepsForDay = i === 0 ? steps : workouts[dayIndex] || 0;
      const date = new Date(today);
      date.setDate(today.getDate() - i);

      console.log(
        `${
          daysOfWeek[dayIndex]
        } (${date.toLocaleDateString()}): ${stepsForDay} steps (dayIndex: ${dayIndex})`,
      );
    }
  };

  const checkDayChange = () => {
    try {
      const now = new Date();
      const today = new Date(now.getFullYear(), now.getMonth(), now.getDate());

      const storedDay = workouts.lastReset
        ? new Date(workouts.lastReset)
        : new Date(0);

      const storedDate = new Date(
        storedDay.getFullYear(),
        storedDay.getMonth(),
        storedDay.getDate(),
      );

      if (today.getTime() !== storedDate.getTime()) {
        console.log('Day changed, archiving steps and resetting');
        console.log(
          'Today:',
          today.toISOString(),
          'Stored day:',
          storedDate.toISOString(),
        );

        const updatedWorkouts = {
          ...workouts,
          [currentDay]: steps,
          lastReset: today.toISOString(), 
        };

        dispatch(setWorkouts(updatedWorkouts));
        dispatch(resetSteps());
      }
    } catch (error) {
      console.error('Error checking day change:', error);
    }
  };

  const lowPassFilter = (current, previous, alpha = 0.8) => {
    return {
      x: previous.x + alpha * (current.x - previous.x),
      y: previous.y + alpha * (current.y - previous.y),
      z: previous.z + alpha * (current.z - previous.z),
    };
  };

  const calculateMagnitude = (x, y, z) => {
    return Math.sqrt(x * x + y * y + z * z) - 9.8;
  };

  const detectStep = ({x, y, z}) => {
    const currentTime = Date.now();
    const timeDiff = currentTime - lastStepTimeRef.current;

    const filteredAccel = lowPassFilter({x, y, z}, lastAccelerationRef.current);
    const magnitude = calculateMagnitude(
      filteredAccel.x,
      filteredAccel.y,
      filteredAccel.z,
    );

    const absMagnitude = Math.abs(magnitude);

    if (absMagnitude > MOTION_THRESHOLD) {
      motionDetectedRef.current = true;
    } else {
      motionDetectedRef.current = false;
      lastAccelerationRef.current = {x, y, z};
      return;
    }

    if (isCooldownRef.current) {
      lastAccelerationRef.current = {x, y, z};
      return;
    }

    if (timeDiff < MIN_STEP_DELAY) {
      lastAccelerationRef.current = {x, y, z};
      return;
    }

    if (magnitude > PEAK_THRESHOLD && !hasPeakedRef.current) {
      hasPeakedRef.current = true;
    } else if (hasPeakedRef.current && magnitude < VALLEY_THRESHOLD) {
      dispatch(incrementSteps());
      lastStepTimeRef.current = currentTime;
      isCooldownRef.current = true;
      hasPeakedRef.current = false;

      setTimeout(() => {
        isCooldownRef.current = false;
      }, COOLDOWN_TIME);
    }

    lastAccelerationRef.current = {x, y, z};
  };

  const syncStepsToServer = useCallback(() => {
    const socket = getSocket();
    if (!socket || !socket.connected) return;

    if (steps > lastSyncedStepsRef.current) {
      const stepData = {
        userId: id,
        value: steps,
        date: new Date().toISOString(),
      };

      socket.emit('logProgressSocket', stepData);
      lastSyncedStepsRef.current = steps;
      console.log('Steps synced to server:', stepData);
    }
  }, [steps, id]);

  const initializeSocket = useCallback(() => {
    const socket = connectSocket();

    socket.on('connect', () => {
      console.log('Connected to step tracking server');
      syncStepsToServer();
      
      if (socketIntervalRef.current) {
        clearInterval(socketIntervalRef.current);
      }

      socketIntervalRef.current = setInterval(() => {
        syncStepsToServer();
      }, 5000);
    });

    socket.on('disconnect', () => {
      console.log('Disconnected from step tracking server');
      if (socketIntervalRef.current) {
        clearInterval(socketIntervalRef.current);
      }
    });

    socket.on('progressUpdated', data => {
      console.log('Server acknowledged steps:', data);
    });
  }, [syncStepsToServer]);

  const startTracking = useCallback(async () => {
    try {
      console.log('Starting step tracking');
      
      if (subscriptionRef.current) {
        subscriptionRef.current.unsubscribe();
        subscriptionRef.current = null;
      }
      
      setUpdateIntervalForType(SensorTypes.accelerometer, 200);
      subscriptionRef.current = accelerometer.subscribe(
        acceleration => {
          detectStep(acceleration);
        },
        error => {
          console.error('Accelerometer error:', error);
          dispatch(setIsTracking(false));
        }
      );
      
      dispatch(setIsTracking(true));
      console.log('Step tracking started successfully');
      initializeSocket();
    } catch (error) {
      console.error('Error starting tracking:', error);
      dispatch(setIsTracking(false));
    }
  }, [dispatch, initializeSocket]);

  const handleAppStateChange = useCallback(
    nextAppState => {
      const previousState = appStateRef.current;
      appStateRef.current = nextAppState;
      
      console.log(`App state changed from ${previousState} to ${nextAppState}`);
  
      if (nextAppState === 'background' || nextAppState === 'inactive') {
        console.log('App in background, saving current state and switching to native tracking');
        if (subscriptionRef.current) {
          subscriptionRef.current.unsubscribe();
          subscriptionRef.current = null;
        }
        
        if (isLoggedIn) {
          syncStepsToServer();
          startBackgroundStepTracking();
        }
      } else if (nextAppState === 'active') {
        console.log('App in foreground, resuming JS step counting');
        
        if (isLoggedIn) {
          stopBackgroundStepTracking();
        }
        
        setTimeout(() => {
          if (subscriptionRef.current) {
            subscriptionRef.current.unsubscribe();
            subscriptionRef.current = null;
          }
          
          setUpdateIntervalForType(SensorTypes.accelerometer, 200);
          subscriptionRef.current = accelerometer.subscribe(acceleration => {
            detectStep(acceleration);
          });
          
          dispatch(setIsTracking(true));
          console.log('Accelerometer subscription reestablished');
        }, 500);
      }
    },
    [isLoggedIn, syncStepsToServer, dispatch],
  );

  useEffect(() => {
    console.log('Setting up AppState listener and initial tracking');
    
    if (dayCheckIntervalRef.current) {
      clearInterval(dayCheckIntervalRef.current);
    }
    
    checkDayChange();
    dayCheckIntervalRef.current = setInterval(checkDayChange, 60 * 60 * 1000);
    
    const appStateSubscription = AppState.addEventListener('change', handleAppStateChange);
    
    if (AppState.currentState === 'active') {
      console.log('App starting in active state, initializing tracking');
      startTracking();
    } else if (isLoggedIn && AppState.currentState !== 'active') {
      console.log('App starting in background state, initializing background tracking');
      startBackgroundStepTracking();
      dispatch(setIsTracking(true));
    }
    
    return () => {
      console.log('Cleaning up AppState listener and services');
      appStateSubscription.remove();
      
      if (subscriptionRef.current) {
        subscriptionRef.current.unsubscribe();
        subscriptionRef.current = null;
      }
      
      if (socketIntervalRef.current) {
        clearInterval(socketIntervalRef.current);
      }
      
      if (dayCheckIntervalRef.current) {
        clearInterval(dayCheckIntervalRef.current);
      }
      
      const socket = getSocket();
      if (socket) socket.disconnect();
    };
  }, [dispatch, handleAppStateChange, isLoggedIn, startTracking]);

  useEffect(() => {
    if (isLoggedIn && steps > lastSyncedStepsRef.current) {
      syncStepsToServer();
    }
  }, [isLoggedIn, steps, syncStepsToServer]);

  useEffect(() => {
    if (isLoggedIn) {
      fetchHistoricalStepsData();
    }
  }, [isLoggedIn, fetchHistoricalStepsData]);

  return {
    steps,
    calories: calculateCalories(steps),
    workouts,
    currentDay,
    isTracking,
    logLast7DaysSteps,
    isLoggedIn,
  };
};