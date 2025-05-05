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

const USER_STEPS_CACHE = {};

export const useStepTracking = () => {
  const dispatch = useDispatch();
  const {steps, workouts, currentDay, isTracking} = useSelector(
    state => state.stepTracker,
  );

  const tokenId = useSelector(state => state?.user?.token);
  const guestTokenId = useSelector(state => state?.user?.guestToken);
  const token = tokenId?.token || guestTokenId?.token;
  const id = tokenId?.id || guestTokenId?.id;
  const isLoggedIn = !!id;

  const appStateRef = useRef(AppState.currentState);
  const subscriptionRef = useRef(null);
  const stopListenerRef = useRef(null);
  const lastAccelerationRef = useRef({x: 0, y: 0, z: 0});
  const lastStepTimeRef = useRef(0);
  const isCooldownRef = useRef(false);
  const hasPeakedRef = useRef(false);
  const dayCheckIntervalRef = useRef(null);
  const motionDetectedRef = useRef(false);
  const socketIntervalRef = useRef(null);
  const lastSyncedStepsRef = useRef(0);
  const isBackgroundRunningRef = useRef(false);
  const prevUserIdRef = useRef(null);
  const dataLoadedForUserRef = useRef(null);

  const calculateCalories = stepCount => {
    const CALORIES_PER_STEP = 0.03;
    return Math.round(stepCount * CALORIES_PER_STEP);
  };

  const fetchHistoricalStepsData = useCallback(async () => {
    console.log(`Fetching historical data for user ${id}`);
    if (!id) return;
    if (dataLoadedForUserRef.current === id) {
      console.log(`Data already loaded for user ${id}, skipping fetch`);
      return;
    }
  
    try {
      const response = await GetClientData(token, id);
      const stepLogsData = response[0]?.stepLogs;
      const updatedWorkouts = {};
  
      const today = new Date().toISOString().split('T')[0];
  
      let todaySteps = USER_STEPS_CACHE[id] || 0; // Start with cached steps
      let latestTimestamp = 0;
  
      if (stepLogsData && stepLogsData.length > 0) {
        stepLogsData.forEach(entry => {
          const date = new Date(entry.date).toISOString().split('T')[0];
          const entryTimestamp = new Date(entry.date).getTime();
          const dayOfWeek = new Date(entry.date).getDay();
          const adjustedIndex = dayOfWeek === 0 ? 6 : dayOfWeek - 1;
  
          if (date === today) {
            // Update todaySteps only if this entry is more recent or has more steps
            if (entryTimestamp > latestTimestamp || entry.steps > todaySteps) {
              todaySteps = entry.steps;
              latestTimestamp = entryTimestamp;
            }
            console.log(
              `Fetched current day steps for user ${id}: ${entry.steps} (timestamp: ${entry.date})`,
            );
          } else {
            updatedWorkouts[adjustedIndex] = entry.steps;
          }
        });
  
        // Only update steps if server data is valid and not lower than cached steps
        if (todaySteps >= (USER_STEPS_CACHE[id] || 0)) {
          dispatch(setSteps(todaySteps));
          lastSyncedStepsRef.current = todaySteps;
          USER_STEPS_CACHE[id] = todaySteps;
        } else {
          console.log(
            `Preserving cached steps (${USER_STEPS_CACHE[id]}) over server steps (${todaySteps})`,
          );
        }
      } else {
        // No server data; use cached steps or 0
        dispatch(setSteps(todaySteps));
        lastSyncedStepsRef.current = todaySteps;
        USER_STEPS_CACHE[id] = todaySteps;
      }
  
      dispatch(setWorkouts(updatedWorkouts));
      dataLoadedForUserRef.current = id;
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
      const todayString = today.toISOString().split('T')[0];
  
      const storedDay = workouts.lastReset
        ? new Date(workouts.lastReset)
        : new Date(0);
      const storedDate = new Date(
        storedDay.getFullYear(),
        storedDay.getMonth(),
        storedDay.getDate(),
      );
  
      const lastCheckedDay = workouts.lastCheckedDay || '';
  
      // Only reset if the day has changed
      if (
        todayString !== lastCheckedDay &&
        today.getTime() > storedDate.getTime()
      ) {
        console.log('Day changed, archiving steps and resetting');
        console.log(
          `Today: ${today.toISOString()}, Stored day: ${storedDate.toISOString()}`,
        );
  
        const updatedWorkouts = {
          ...workouts,
          [currentDay]: steps,
          lastReset: today.toISOString(),
          lastCheckedDay: todayString,
        };
  
        dispatch(setWorkouts(updatedWorkouts));
        dispatch(resetSteps());
  
        // Clear cache and synced steps
        Object.keys(USER_STEPS_CACHE).forEach(userId => {
          USER_STEPS_CACHE[userId] = 0;
        });
        lastSyncedStepsRef.current = 0;
      } else {
        console.log('No day change detected, maintaining current steps');
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
      if (!id) return;

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
      if (!id) return;

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
        USER_STEPS_CACHE[id] = steps;
        console.log('Steps synced to server:', stepData);
      }
    } catch (error) {
      console.error('Error syncing steps to server:', error);
    }
  }, [steps, id]);

  const initializeSocket = useCallback(() => {
    if (!id) return;

    try {
      const socket = connectSocket();

      socket.on('connect', () => {
        console.log('Connected to step tracking server');

        socket.emit('getCurrentDaySteps', {userId: id}, response => {
          if (response && response.steps !== undefined) {
            if (id === prevUserIdRef.current) {
              dispatch(setSteps(response.steps));
              lastSyncedStepsRef.current = response.steps;
              USER_STEPS_CACHE[id] = response.steps;
              console.log(
                `Fetched current day steps from server: ${response.steps} for user ${id}`,
              );
            }
          }
        });

        syncStepsToServer();

        if (socketIntervalRef.current) {
          clearInterval(socketIntervalRef.current);
        }

        socketIntervalRef.current = setInterval(() => {
          if (id === prevUserIdRef.current) {
            syncStepsToServer();
          }
        }, 5000);
      });

      socket.on('progressUpdated', data => {
        console.log('Server acknowledged steps:', data);
      });
    } catch (error) {
      console.error('Error initializing socket:', error);
    }
  }, [syncStepsToServer, id, dispatch]);

  const handleLogout = useCallback(async () => {
    try {
      if (id) {
        console.log(`Logging out user ${id} with ${steps} steps`);
        USER_STEPS_CACHE[id] = steps;
        syncStepsToServer();
      }

      await stopBackgroundService();
      dispatch(resetSteps());
      dispatch(setWorkouts({}));
      dispatch(setIsTracking(false));

      lastSyncedStepsRef.current = 0;
      dataLoadedForUserRef.current = null;
    } catch (error) {
      console.error('Error during logout:', error);
    }
  }, [stopBackgroundService, dispatch, id, syncStepsToServer, steps]);

  const backgroundTaskHandler = async () => {
    if (!isLoggedIn) {
      console.log('App is not active, stopping background service');
      await BackgroundService.stop();
      isBackgroundRunningRef.current = false;
      return;
    }

    let subscription = null;
    let bgSocketInterval = null;
    let checkAppAliveInterval = null;

    try {
      await new Promise(resolve => {
        console.log('Starting background task');
        setUpdateIntervalForType(SensorTypes.accelerometer, 100);

        subscription = accelerometer.subscribe(
          acceleration => detectStep(acceleration),
          error => console.error('Background accelerometer error:', error),
        );

        bgSocketInterval = setInterval(() => {
          if (id) {
            syncStepsToServer();
          }
        }, 15000);

        checkAppAliveInterval = setInterval(async () => {
          if (AppState.currentState !== 'background') {
            console.log(
              'App is no longer in background or active state changed, stopping task',
            );
            clearInterval(checkAppAliveInterval);
            resolve();
          }
        }, 10000);

        stopListenerRef.current = () => {
          console.log('Background task stopped via stop event');
          if (checkAppAliveInterval) clearInterval(checkAppAliveInterval);
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
      if (subscription) {
        subscription.unsubscribe();
        subscription = null;
      }

      if (bgSocketInterval) {
        clearInterval(bgSocketInterval);
        bgSocketInterval = null;
      }

      if (checkAppAliveInterval) {
        clearInterval(checkAppAliveInterval);
        checkAppAliveInterval = null;
      }

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
      // Sync steps to ensure server data is up-to-date
      syncStepsToServer();
    } catch (error) {
      console.error('Error starting foreground tracking:', error);
      dispatch(setIsTracking(false));
    }
  }, [dispatch, initializeSocket, syncStepsToServer]);

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
  
        if (isLoggedIn && dataLoadedForUserRef.current !== id) {
          fetchHistoricalStepsData();
          setTimeout(() => {
            startForegroundTracking();
          }, 500);
        } else if (isLoggedIn) {
          setTimeout(() => {
            startForegroundTracking();
          }, 500);
        }
      }
    },
    [
      isLoggedIn,
      syncStepsToServer,
      startBackgroundService,
      stopBackgroundService,
      startForegroundTracking,
      fetchHistoricalStepsData,
      id,
    ]
  );

  useEffect(() => {
    if (id !== prevUserIdRef.current) {
      console.log(
        `User changed from ${prevUserIdRef.current || 'none'} to ${
          id || 'none'
        }`,
      );
  
      // Save steps for the previous user
      if (prevUserIdRef.current && steps > 0) {
        USER_STEPS_CACHE[prevUserIdRef.current] = steps;
        console.log(
          `Saved ${steps} steps for previous user ${prevUserIdRef.current}`,
        );
      }
  
      prevUserIdRef.current = id;
  
      // Restore steps from cache if available
      if (id && USER_STEPS_CACHE[id] !== undefined) {
        console.log(
          `Restoring cached steps (${USER_STEPS_CACHE[id]}) for user ${id}`,
        );
        dispatch(setSteps(USER_STEPS_CACHE[id]));
        lastSyncedStepsRef.current = USER_STEPS_CACHE[id];
        // Fetch data only if not already loaded
        if (dataLoadedForUserRef.current !== id) {
          fetchHistoricalStepsData();
        }
      } else if (id) {
        // Fetch data for new user
        fetchHistoricalStepsData();
      } else {
        // No user logged in
        dispatch(resetSteps());
        dispatch(setWorkouts({}));
        lastSyncedStepsRef.current = 0;
        dataLoadedForUserRef.current = null;
      }
    }
  }, [id, dispatch, steps, fetchHistoricalStepsData]);

  useEffect(() => {
    if (isLoggedIn && dataLoadedForUserRef.current !== id) {
      console.log(
        `Running useEffect for user ${id}, resetting steps and fetching data`,
      );
      fetchHistoricalStepsData();
      logLast7DaysSteps();
    }
  }, [id, isLoggedIn, fetchHistoricalStepsData]);

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

