// import { useEffect, useRef } from 'react';
// import { Platform } from 'react-native';
// import { useDispatch, useSelector } from 'react-redux';
// import { accelerometer, setUpdateIntervalForType, SensorTypes } from 'react-native-sensors';
// import AsyncStorage from '@react-native-async-storage/async-storage';
// import {
//   incrementSteps,
//   setSteps,
//   setWorkouts,
//   setIsTracking,
//   resetSteps
// } from '../redux/stepTracker';

// const STORAGE_KEYS = {
//   STEPS: 'steps',
//   WORKOUTS: 'workouts',
//   LAST_RESET: 'lastReset'
// };

// const STEP_THRESHOLD = 5;
// const MIN_STEP_DELAY = 250;

// export const useStepTracking = () => {
//   const dispatch = useDispatch();
//   const lastAccelerationRef = useRef(0);
//   const lastStepTimeRef = useRef(0);
  
//   const { steps, workouts, currentDay, isTracking } = useSelector(state => state.stepTracker);

//   const calculateCalories = (stepCount) => {
//     const CALORIES_PER_STEP = 0.04;
//     return Math.round(stepCount * CALORIES_PER_STEP);
//   };

//   const saveData = async (key, value) => {
//     try {
//       await AsyncStorage.setItem(key, JSON.stringify(value));
//     } catch (error) {
//       console.error(`Error saving ${key}:`, error);
//     }
//   };

//   const loadData = async () => {
//     try {
//       const [stepsData, workoutsData, lastResetData] = await Promise.all([
//         AsyncStorage.getItem(STORAGE_KEYS.STEPS),
//         AsyncStorage.getItem(STORAGE_KEYS.WORKOUTS),
//         AsyncStorage.getItem(STORAGE_KEYS.LAST_RESET)
//       ]);

//       if (stepsData) dispatch(setSteps(JSON.parse(stepsData)));
//       if (workoutsData) dispatch(setWorkouts(JSON.parse(workoutsData)));
      
//       const lastReset = lastResetData ? new Date(JSON.parse(lastResetData)) : new Date();
//       const now = new Date();
//       if (lastReset.getDate() !== now.getDate()) {
//         dispatch(resetSteps());
//       }
//     } catch (error) {
//       console.error('Error loading data:', error);
//     }
//   };

//   const detectStep = (acceleration) => {
//     const currentTime = Date.now();
//     const timeDiff = currentTime - lastStepTimeRef.current;

//     if (timeDiff > MIN_STEP_DELAY) {
//       const accelerationDelta = Math.abs(acceleration - lastAccelerationRef.current);

//       if (accelerationDelta > STEP_THRESHOLD) {
//         dispatch(incrementSteps());
//         saveData(STORAGE_KEYS.STEPS, steps + 1);
//         lastStepTimeRef.current = currentTime;
//       }
//     }

//     lastAccelerationRef.current = acceleration;
//   };

//   useEffect(() => {
//     loadData();
//     let subscription;

//     const startTracking = async () => {
//       try {
//         setUpdateIntervalForType(SensorTypes.accelerometer, 100);
        
//         subscription = accelerometer.subscribe(({ x, y, z }) => {
//           const acceleration = Math.sqrt(x * x + y * y + z * z);
//           detectStep(acceleration);
//         });

//         dispatch(setIsTracking(true));
//       } catch (error) {
//         console.error('Error starting tracking:', error);
//         dispatch(setIsTracking(false));
//       }
//     };

//     startTracking();

//     return () => {
//       if (subscription) {
//         subscription.unsubscribe();
//       }
//     };
//   }, []);

//   useEffect(() => {
//     const timer = setInterval(() => {
//       const now = new Date();
//       if (now.getDay() !== currentDay) {
//         dispatch(resetSteps());
//       }
//     }, 60000);

//     return () => clearInterval(timer);
//   }, [currentDay, steps, workouts]);

//   return {
//     steps,
//     calories: calculateCalories(steps),
//     workouts,
//     currentDay,
//     isTracking
//   };
// };





import { useEffect, useRef } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { accelerometer, setUpdateIntervalForType, SensorTypes } from 'react-native-sensors';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { incrementSteps, setSteps, setWorkouts, setIsTracking, resetSteps } from '../redux/stepTracker';

const STORAGE_KEYS = {
  STEPS: 'steps',
  WORKOUTS: 'workouts',
  LAST_RESET: 'lastReset'
};

const STEP_THRESHOLD = 6;
const MIN_STEP_DELAY = 250;

export const useStepTracking = () => {
  const dispatch = useDispatch();
  const lastAccelerationRef = useRef(0);
  const lastStepTimeRef = useRef(0);

  const { steps, workouts, currentDay, isTracking } = useSelector(state => state.stepTracker);

  const calculateCalories = (stepCount) => {
    const CALORIES_PER_STEP = 0.03;
    return Math.round(stepCount * CALORIES_PER_STEP);
  };

  // Load saved steps and workouts from AsyncStorage
  const loadData = async () => {
    try {
      const [stepsData, workoutsData, lastResetData] = await Promise.all([
        AsyncStorage.getItem(STORAGE_KEYS.STEPS),
        AsyncStorage.getItem(STORAGE_KEYS.WORKOUTS),
        AsyncStorage.getItem(STORAGE_KEYS.LAST_RESET)
      ]);

      if (stepsData) dispatch(setSteps(JSON.parse(stepsData)));
      if (workoutsData) dispatch(setWorkouts(JSON.parse(workoutsData)));

      const lastReset = lastResetData ? new Date(JSON.parse(lastResetData)) : new Date();
      const now = new Date();

      if (lastReset.getDate() !== now.getDate()) {
        dispatch(resetSteps());
      }
    } catch (error) {
      console.error('Error loading data:', error);
    }
  };

  // Detect steps based on accelerometer data
  const detectStep = (acceleration) => {
    const currentTime = Date.now();
    const timeDiff = currentTime - lastStepTimeRef.current;

    if (timeDiff > MIN_STEP_DELAY) {
      const accelerationDelta = Math.abs(acceleration - lastAccelerationRef.current);

      if (accelerationDelta > STEP_THRESHOLD) {
        dispatch(incrementSteps());
      }
    }

    lastAccelerationRef.current = acceleration;
  };

  useEffect(() => {
    loadData();
    let subscription;

    const startTracking = async () => {
      try {
        setUpdateIntervalForType(SensorTypes.accelerometer, 100);

        subscription = accelerometer.subscribe(({ x, y, z }) => {
          const acceleration = Math.sqrt(x * x + y * y + z * z);
          detectStep(acceleration);
        });

        dispatch(setIsTracking(true));
      } catch (error) {
        console.error('Error starting tracking:', error);
        dispatch(setIsTracking(false));
      }
    };

    startTracking();

    return () => {
      if (subscription) {
        subscription.unsubscribe();
      }
    };
  }, []);

  // Reset steps at midnight
  useEffect(() => {
    const timer = setInterval(() => {
      const now = new Date();
      if (now.getDay() !== currentDay) {
        dispatch(resetSteps());
      }
    }, 60000);

    return () => clearInterval(timer);
  }, [currentDay, steps, workouts]);

  return {
    steps,
    calories: calculateCalories(steps),
    workouts,
    currentDay,
    isTracking
  };
};
