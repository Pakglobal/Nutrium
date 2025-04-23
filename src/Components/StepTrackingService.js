// import {useCallback, useEffect, useRef} from 'react';
// import {useDispatch, useSelector} from 'react-redux';
// import {
//   accelerometer,
//   setUpdateIntervalForType,
//   SensorTypes,
// } from 'react-native-sensors';
// import {
//   incrementSteps,
//   setSteps,
//   setWorkouts,
//   setIsTracking,
//   resetSteps,
// } from '../redux/stepTracker';
// import io from 'socket.io-client';
// import {connectSocket, getSocket} from './SocketService';

// const PEAK_THRESHOLD = 1.5;
// const VALLEY_THRESHOLD = -1.2;
// const MIN_STEP_DELAY = 300;
// const COOLDOWN_TIME = 500;
// const MOTION_THRESHOLD = 0.3;

// export const useStepTracking = () => {
//   const dispatch = useDispatch();
//   const {steps, workouts, currentDay, isTracking} = useSelector(
//     state => state.stepTracker,
//   );

//   const tokenId = useSelector(state => state?.user?.token);
//   const guestTokenId = useSelector(state => state?.user?.guestToken);
//   const id = tokenId?.id || guestTokenId?.id;

//   const lastAccelerationRef = useRef({x: 0, y: 0, z: 0});
//   const lastStepTimeRef = useRef(0);
//   const isCooldownRef = useRef(false);
//   const hasPeakedRef = useRef(false);
//   const dayCheckIntervalRef = useRef(null);
//   const motionDetectedRef = useRef(false);
//   const socketIntervalRef = useRef(null);
//   const lastSyncedStepsRef = useRef(0);

//   const calculateCalories = stepCount => {
//     const CALORIES_PER_STEP = 0.03;
//     return Math.round(stepCount * CALORIES_PER_STEP);
//   };

//   const logLast7DaysSteps = () => {
//     const daysOfWeek = [
//       'Monday',
//       'Tuesday',
//       'Wednesday',
//       'Thursday',
//       'Friday',
//       'Saturday',
//       'Sunday',
//     ];
//     const today = new Date();
//     today.setHours(0, 0, 0, 0);
//     const todayIndex = currentDay;

//     for (let i = 0; i < 7; i++) {
//       const dayIndex = (todayIndex - i + 7) % 7;
//       const stepsForDay = i === 0 ? steps : workouts[dayIndex] || 0;
//       const date = new Date(today);
//       date.setDate(today.getDate() - i);

//       console.log(
//         `${
//           daysOfWeek[dayIndex]
//         } (${date.toLocaleDateString()}): ${stepsForDay} steps`,
//       );
//     }
//   };

//   const checkDayChange = () => {
//     try {
//       const now = new Date();
//       const today = new Date(now.getFullYear(), now.getMonth(), now.getDate());
//       const storedDay = new Date(workouts.lastReset || 0);

//       if (
//         today.getDate() !== storedDay.getDate() ||
//         today.getMonth() !== storedDay.getMonth() ||
//         today.getFullYear() !== storedDay.getFullYear()
//       ) {
//         console.log('Day changed, resetting steps');
//         dispatch(resetSteps());
//         dispatch(setWorkouts({...workouts, lastReset: now.toISOString()}));
//       }
//     } catch (error) {
//       console.error('Error checking day change:', error);
//     }
//   };

//   const calculateMagnitude = (x, y, z) => {
//     return Math.sqrt(x * x + y * y + z * z) - 9.8;
//   };

//   const detectStep = ({x, y, z}) => {
//     const currentTime = Date.now();
//     const timeDiff = currentTime - lastStepTimeRef.current;

//     const magnitude = calculateMagnitude(x, y, z);
//     const absMagnitude = Math.abs(magnitude);

//     if (absMagnitude > MOTION_THRESHOLD) {
//       motionDetectedRef.current = true;
//     } else {
//       motionDetectedRef.current = false;
//       return;
//     }

//     if (isCooldownRef.current) {
//       lastAccelerationRef.current = {x, y, z};
//       return;
//     }

//     if (!hasPeakedRef.current && magnitude > PEAK_THRESHOLD) {
//       hasPeakedRef.current = true;
//     } else if (hasPeakedRef.current && magnitude < VALLEY_THRESHOLD) {
//       if (timeDiff > MIN_STEP_DELAY) {
//         dispatch(incrementSteps());
//         lastStepTimeRef.current = currentTime;
//         isCooldownRef.current = true;
//         hasPeakedRef.current = false;

//         setTimeout(() => {
//           isCooldownRef.current = false;
//         }, COOLDOWN_TIME);
//       }
//     }

//     lastAccelerationRef.current = {x, y, z};
//   };

//   const syncStepsToServer = () => {
//     const socket = getSocket();
//     if (!socket || !socket.connected) return;

//     if (steps > lastSyncedStepsRef.current) {
//       const stepData = {
//         userid: id,
//         value: steps,
//         date: new Date().toISOString(),
//       };

//       socket.emit('logProgressSocket', stepData);
//       lastSyncedStepsRef.current = steps;
//       console.log('Steps synced to server:', stepData);
//     }
//   };

//   const initializeSocket = () => {
//     const socket = connectSocket();

//     socket.on('connect', () => {
//       console.log('Connected to step tracking server');
//       syncStepsToServer();

//       socketIntervalRef.current = setInterval(() => {
//         syncStepsToServer();
//       }, 5000);
//     });

//     socket.on('disconnect', () => {
//       console.log('Disconnected from step tracking server');
//       if (socketIntervalRef.current) {
//         clearInterval(socketIntervalRef.current);
//       }
//     });

//     socket.on('progressUpdated', data => {
//       console.log('Server acknowledged steps:', data);
//     });
//   };

//   useEffect(() => {
//     let subscription;

//     const startTracking = async () => {
//       try {
//         setUpdateIntervalForType(SensorTypes.accelerometer, 200);
//         subscription = accelerometer.subscribe(acceleration => {
//           detectStep(acceleration);
//         });
//         dispatch(setIsTracking(true));
//         initializeSocket();
//       } catch (error) {
//         console.error('Error starting tracking:', error);
//         dispatch(setIsTracking(false));
//       }
//     };

//     startTracking();
//     dayCheckIntervalRef.current = setInterval(checkDayChange, 60000);

//     return () => {
//       if (subscription) subscription.unsubscribe();
//       if (socketIntervalRef.current) clearInterval(socketIntervalRef.current);
//       if (dayCheckIntervalRef.current)
//         clearInterval(dayCheckIntervalRef.current);
//       const socket = getSocket();
//       if (socket) socket.disconnect();
//     };
//   }, []);

//   useEffect(() => {
//     logLast7DaysSteps();
//   }, [steps, workouts]);

//   return {
//     steps,
//     calories: calculateCalories(steps),
//     workouts,
//     currentDay,
//     isTracking,
//     logLast7DaysSteps,
//   };
// };




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
import { isBackgroundTrackingActive, startBackgroundStepTracking, stopBackgroundStepTracking } from './BackgroundStepTracking';

export const useStepTracking = () => {
  const dispatch = useDispatch();
  const {steps, workouts, currentDay, isTracking} = useSelector(
    state => state.stepTracker,
  );
  const [appState, setAppState] = useState(AppState.currentState);

  const tokenId = useSelector(state => state?.user?.token);
  const guestTokenId = useSelector(state => state?.user?.guestToken);
  const id = tokenId?.id || guestTokenId?.id;
  const isLoggedIn = !!id;

  const socketIntervalRef = useRef(null);
  const lastSyncedStepsRef = useRef(0);

  const calculateCalories = stepCount => {
    const CALORIES_PER_STEP = 0.03;
    return Math.round(stepCount * CALORIES_PER_STEP);
  };

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
        } (${date.toLocaleDateString()}): ${stepsForDay} steps`,
      );
    }
  };

  const syncStepsToServer = useCallback(() => {
    const socket = getSocket();
    if (!socket || !socket.connected) return;

    if (steps > lastSyncedStepsRef.current) {
      const stepData = {
        userid: id,
        value: steps,
        date: new Date().toISOString(),
      };

      socket.emit('logProgressSocket', stepData);
      lastSyncedStepsRef.current = steps;
      console.log('Steps synced to server:', stepData);
    }
  }, [steps, id]);

  const handleAppStateChange = useCallback((nextAppState) => {
    if (appState === 'active' && nextAppState.match(/inactive|background/)) {
      // App is going to background - make sure background tracking is active
      if (isLoggedIn && !isBackgroundTrackingActive()) {
        startBackgroundStepTracking();
      }
    } else if (appState.match(/inactive|background/) && nextAppState === 'active') {
      // App is coming to foreground - sync steps if needed
      syncStepsToServer();
    }
    
    setAppState(nextAppState);
  }, [appState, isLoggedIn, syncStepsToServer]);

  // Start tracking on component mount
  useEffect(() => {
    // Set up app state change listener
    const subscription = AppState.addEventListener('change', handleAppStateChange);

    // Start tracking if logged in
    if (isLoggedIn) {
      if (appState === 'active') {
        // App is in foreground
        startBackgroundStepTracking();
        dispatch(setIsTracking(true));
      } else {
        // App started in background
        startBackgroundStepTracking();
      }
    }

    return () => {
      subscription.remove();
      if (socketIntervalRef.current) {
        clearInterval(socketIntervalRef.current);
      }
    };
  }, [dispatch, handleAppStateChange, isLoggedIn, appState]);

  // Set up socket connection for step syncing
  useEffect(() => {
    if (isLoggedIn && appState === 'active') {
      const socket = connectSocket();

      socket.on('connect', () => {
        console.log('Connected to step tracking server');
        syncStepsToServer();

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

      return () => {
        if (socketIntervalRef.current) {
          clearInterval(socketIntervalRef.current);
        }
        socket.disconnect();
      };
    }
  }, [isLoggedIn, appState, syncStepsToServer]);

  // Login state effect
  useEffect(() => {
    if (isLoggedIn) {
      startBackgroundStepTracking();
      dispatch(setIsTracking(true));
    } else {
      stopBackgroundStepTracking();
      dispatch(setIsTracking(false));
    }
  }, [isLoggedIn, dispatch]);

  useEffect(() => {
    logLast7DaysSteps();
  }, [steps, workouts]);

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