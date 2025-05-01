import {useCallback, useEffect, useRef} from 'react';
import {useDispatch, useSelector} from 'react-redux';
import {AppState} from 'react-native';
import {
  incrementSteps,
  setWorkouts,
  setIsTracking,
  resetSteps,
  setSteps,
} from '../redux/stepTracker';
import {connectSocket, getSocket} from './SocketService';
import {
  accelerometer,
  SensorTypes,
  setUpdateIntervalForType,
} from 'react-native-sensors';
import {GetClientData} from '../Apis/AdminScreenApi/ClientApi';
import BackgroundService from 'react-native-background-actions';
import AsyncStorage from '@react-native-async-storage/async-storage';

const PEAK_THRESHOLD = 1.2;
const VALLEY_THRESHOLD = -1.0;
const MIN_STEP_DELAY = 200;
const COOLDOWN_TIME = 300;
const MOTION_THRESHOLD = 0.2;

const backgroundOptions = {
  taskName: 'StepTracker',
  taskTitle: 'Step Tracking',
  taskDesc: 'Tracking your steps in background',
  taskIcon: {
    name: 'ic_launcher',
    type: 'mipmap',
  },
  color: '#ffffff',
};

export const useStepTracking = () => {
  const dispatch = useDispatch();
  const {steps, workouts, currentDay, isTracking} = useSelector(
    state => state.stepTracker,
  );

  const appStateRef = useRef(AppState.currentState);
  const subscriptionRef = useRef(null);
  const stopListenerRef = useRef(null);

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
  const isBackgroundRunningRef = useRef(false);

  const calculateCalories = stepCount => {
    const CALORIES_PER_STEP = 0.03;
    return Math.round(stepCount * CALORIES_PER_STEP);
  };

  const fetchHistoricalStepsData = useCallback(async () => {
    console.log(`Fetching historical data for user ${id}`);
    try {
      const response = await GetClientData(token, id);
      const stepLogsData = response[0]?.stepLogs;
      const updatedWorkouts = {};

      const today = new Date().toISOString().split('T')[0];

      dispatch(resetSteps());

      stepLogsData.forEach(entry => {
        const date = new Date(entry.date).toISOString().split('T')[0];
        const dayOfWeek = new Date(entry.date).getDay();
        const adjustedIndex = dayOfWeek === 0 ? 6 : dayOfWeek - 1;

        if (date === today) {
          dispatch(setSteps(entry.steps));
          lastSyncedStepsRef.current = entry.steps;
          console.log(
            `Fetched current day steps for user ${id}: ${entry.steps}`,
          );
        } else {
          updatedWorkouts[adjustedIndex] = entry.steps;
        }
      });

      dispatch(setWorkouts(updatedWorkouts));
    } catch (error) {
      console.error('Error fetching step history:', error);
    }
  }, [id, token, dispatch]);

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

      const lastCheckedDay = workouts.lastCheckedDay || '';
      const todayString = today.toISOString().split('T')[0];

      if (
        todayString !== lastCheckedDay &&
        today.getTime() !== storedDate.getTime()
      ) {
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
          lastCheckedDay: todayString,
        };

        dispatch(setWorkouts(updatedWorkouts));
        dispatch(resetSteps());
      }
    } catch (error) {
      console.error('Error checking day change:', error);
    }
  };

  const lowPassFilter = (current, previous, alpha = 0.6) => {
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
    try {
      const currentTime = Date.now();
      const timeDiff = currentTime - lastStepTimeRef.current;

      const filteredAccel = lowPassFilter(
        {x, y, z},
        lastAccelerationRef.current,
      );
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

      if (isCooldownRef.current || timeDiff < MIN_STEP_DELAY) {
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
    } catch (error) {
      console.error('Error in detectStep:', error);
    }
  };

  const syncStepsToServer = useCallback(() => {
    try {
      const socket = getSocket();
      if (!socket || !socket.connected) {
        console.log('Socket not connected, skipping sync');
        return;
      }

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
    } catch (error) {
      console.error('Error syncing steps to server:', error);
    }
  }, [steps, id]);

  const initializeSocket = useCallback(() => {
    try {
      const socket = connectSocket();

      socket.on('connect', () => {
        console.log('-special to step tracking server');

        socket.emit('getCurrentDaySteps', {userId: id}, response => {
          if (response && response.steps !== undefined) {
            dispatch(setSteps(response.steps));
            lastSyncedStepsRef.current = response.steps;
            console.log(
              'Fetched current day steps from server:',
              response.steps,
            );
          }
        });

        syncStepsToServer();

        if (socketIntervalRef.current) {
          clearInterval(socketIntervalRef.current);
        }

        socketIntervalRef.current = setInterval(() => {
          syncStepsToServer();
        }, 5000);
      });

      socket.on('progressUpdated', data => {
        console.log('Server acknowledged steps:', data);
      });
    } catch (error) {
      console.error('Error initializing socket:', error);
    }
  }, [syncStepsToServer, id, dispatch]);

  const cleanupOnTermination = useCallback(async () => {
    console.log('Initiating cleanup on app termination');
    await AsyncStorage.setItem('isAppActive', 'false');
    await stopBackgroundService();
  }, [stopBackgroundService]);

  const handleLogout = useCallback(async () => {
    try {
      await AsyncStorage.removeItem('isAppActive');
      await stopBackgroundService();
      dispatch(resetSteps());
      dispatch(setWorkouts({}));
    } catch (error) {
      console.error('Error during logout:', error);
    }
  }, [stopBackgroundService, dispatch]);

  const backgroundTaskHandler = async () => {
    const isAppActive = await AsyncStorage.getItem('isAppActive');
    if (!isLoggedIn || isAppActive !== 'true') {
      console.log('App is not active, stopping background service');
      await BackgroundService.stop();
      return;
    }

    let subscription = null;
    let bgSocketInterval = null;

    try {
      await new Promise(resolve => {
        console.log('Starting background task');
        setUpdateIntervalForType(SensorTypes.accelerometer, 100);
        subscription = accelerometer.subscribe(
          acceleration => detectStep(acceleration),
          error => console.error('Background accelerometer error:', error),
        );

        bgSocketInterval = setInterval(syncStepsToServer, 15000);

        const checkAppAlive = setInterval(async () => {
          if (AppState.currentState !== 'background') {
            console.log('App is no longer in background, stopping task');
            clearInterval(checkAppAlive);
            if (subscription) subscription.unsubscribe();
            if (bgSocketInterval) clearInterval(bgSocketInterval);
            await BackgroundService.stop();
            resolve();
          }
        }, 10000);

        stopListenerRef.current = () => {
          console.log('Background task stopped via stop event');
          clearInterval(checkAppAlive);
          if (subscription) subscription.unsubscribe();
          if (bgSocketInterval) clearInterval(bgSocketInterval);
          resolve();
        };

        BackgroundService.on('stopped', stopListenerRef.current);
      });
    } catch (error) {
      console.error('Background task error:', error);
    } finally {
      console.log('Cleaning up background task');
      if (subscription) subscription.unsubscribe();
      if (bgSocketInterval) clearInterval(bgSocketInterval);
      if (stopListenerRef.current) {
        BackgroundService.off('stopped', stopListenerRef.current);
        stopListenerRef.current = null;
      }
      isBackgroundRunningRef.current = false;
      console.log('Background task fully cleaned up');
    }
  };

  const startBackgroundService = useCallback(async () => {
    if (isBackgroundRunningRef.current) {
      return;
    }

    try {
      await BackgroundService.start(backgroundTaskHandler, backgroundOptions);
      isBackgroundRunningRef.current = true;
    } catch (error) {
      console.error('Failed to start background service:', error);
      isBackgroundRunningRef.current = false;
    }
  }, []);

  const stopBackgroundService = useCallback(async () => {
    if (!isBackgroundRunningRef.current) {
      console.log('Background service not running');
      return;
    }

    try {
      await BackgroundService.stop();
      isBackgroundRunningRef.current = false;
    } catch (error) {
      console.error('Failed to stop background service:', error);
    }
  }, []);

  const startForegroundTracking = useCallback(() => {
    try {
      if (subscriptionRef.current) {
        subscriptionRef.current.unsubscribe();
        subscriptionRef.current = null;
      }

      setUpdateIntervalForType(SensorTypes.accelerometer, 100);
      subscriptionRef.current = accelerometer.subscribe(
        acceleration => {
          detectStep(acceleration);
        },
        error => {
          console.error('Foreground accelerometer error:', error);
          dispatch(setIsTracking(false));
        },
      );

      dispatch(setIsTracking(true));
      initializeSocket();
    } catch (error) {
      console.error('Error starting foreground tracking:', error);
      dispatch(setIsTracking(false));
    }
  }, [dispatch, initializeSocket]);

  const handleAppStateChange = useCallback(
    nextAppState => {
      const previousState = appStateRef.current;
      appStateRef.current = nextAppState;

      console.log(`App state changed from ${previousState} to ${nextAppState}`);

      if (nextAppState === 'background' || nextAppState === 'inactive') {
        if (subscriptionRef.current) {
          subscriptionRef.current.unsubscribe();
          subscriptionRef.current = null;
        }

        if (isLoggedIn) {
          syncStepsToServer();
          startBackgroundService();
        }
      } else if (nextAppState === 'active') {
        stopBackgroundService();

        setTimeout(() => {
          startForegroundTracking();
        }, 500);
      }
    },
    [
      isLoggedIn,
      syncStepsToServer,
      dispatch,
      startBackgroundService,
      stopBackgroundService,
      startForegroundTracking,
    ],
  );

  useEffect(() => {
    if (isLoggedIn) {
      console.log(
        `Running useEffect for user ${id}, resetting steps and fetching data`,
      );
      dispatch(resetSteps());
      fetchHistoricalStepsData();
      logLast7DaysSteps();
    }
  }, [id, isLoggedIn, fetchHistoricalStepsData, dispatch]);

  useEffect(() => {
    if (dayCheckIntervalRef.current) {
      clearInterval(dayCheckIntervalRef.current);
    }

    checkDayChange();
    dayCheckIntervalRef.current = setInterval(checkDayChange, 60 * 60 * 1000);

    const appStateSubscription = AppState.addEventListener(
      'change',
      handleAppStateChange,
    );

    if (AppState.currentState === 'active') {
      startForegroundTracking();
    } else if (isLoggedIn && AppState.currentState !== 'active') {
      startBackgroundService();
      dispatch(setIsTracking(true));
    }

    return () => {
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

      if (stopListenerRef.current) {
        BackgroundService.off('stopped', stopListenerRef.current);
        stopListenerRef.current = null;
      }
    };
  }, [
    dispatch,
    handleAppStateChange,
    isLoggedIn,
    startForegroundTracking,
    startBackgroundService,
    stopBackgroundService,
  ]);

  useEffect(() => {
    if (isLoggedIn && steps > lastSyncedStepsRef.current) {
      setTimeout(() => {
        syncStepsToServer();
      }, 1000);
    }
  }, [isLoggedIn, steps, syncStepsToServer]);

  useEffect(() => {
    AsyncStorage.setItem('isAppActive', 'true');
    return () => {
      AsyncStorage.setItem('isAppActive', 'false');
      cleanupOnTermination();
    };
  }, [cleanupOnTermination]);

  return {
    steps,
    calories: calculateCalories(steps),
    workouts,
    currentDay,
    isTracking,
    logLast7DaysSteps,
    isLoggedIn,
    handleLogout,
  };
};
