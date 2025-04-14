import {useEffect, useRef} from 'react';
import {useDispatch, useSelector} from 'react-redux';
import {
  accelerometer,
  setUpdateIntervalForType,
  SensorTypes,
} from 'react-native-sensors';
import AsyncStorage from '@react-native-async-storage/async-storage';
import {
  incrementSteps,
  setSteps,
  setWorkouts,
  setIsTracking,
  resetSteps,
} from '../redux/stepTracker';

const STORAGE_KEYS = {
  STEPS: 'steps',
  WORKOUTS: 'workouts',
  LAST_RESET: 'lastReset',
};

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

  const lastAccelerationRef = useRef({x: 0, y: 0, z: 0});
  const lastStepTimeRef = useRef(0);
  const isCooldownRef = useRef(false);
  const hasPeakedRef = useRef(false);
  const dayCheckIntervalRef = useRef(null);
  const motionDetectedRef = useRef(false);

  const getCurrentDayIndex = () => {
    const day = new Date().getDay();
    return day === 0 ? 6 : day - 1; // Remap Sunday (0) to 6, and shift others back by 1
  };

  const calculateCalories = stepCount => {
    const CALORIES_PER_STEP = 0.03;
    return Math.round(stepCount * CALORIES_PER_STEP);
  };

  const loadData = async () => {
    try {
      const [stepsData, workoutsData, lastResetData] = await Promise.all([
        AsyncStorage.getItem(STORAGE_KEYS.STEPS),
        AsyncStorage.getItem(STORAGE_KEYS.WORKOUTS),
        AsyncStorage.getItem(STORAGE_KEYS.LAST_RESET),
      ]);

      if (stepsData) dispatch(setSteps(JSON.parse(stepsData)));
      if (workoutsData) dispatch(setWorkouts(JSON.parse(workoutsData)));

      await checkDayChange();
    } catch (error) {
      console.error('Error loading data:', error);
    }
  };

  const saveData = async () => {
    try {
      await Promise.all([
        AsyncStorage.setItem(STORAGE_KEYS.STEPS, JSON.stringify(steps)),
        AsyncStorage.setItem(STORAGE_KEYS.WORKOUTS, JSON.stringify(workouts)),
      ]);
    } catch (error) {
      console.error('Error saving data:', error);
    }
  };

  const checkDayChange = async () => {
    try {
      const now = new Date();
      const lastResetData = await AsyncStorage.getItem(STORAGE_KEYS.LAST_RESET);
      const lastReset = lastResetData
        ? new Date(JSON.parse(lastResetData))
        : new Date(0);

      if (
        now.getDate() !== lastReset.getDate() ||
        now.getMonth() !== lastReset.getMonth() ||
        now.getFullYear() !== lastReset.getFullYear()
      ) {
        dispatch(resetSteps());
        await AsyncStorage.setItem(
          STORAGE_KEYS.LAST_RESET,
          JSON.stringify(now.toISOString()),
        );
        console.log('Step counter reset for new day');
      }
    } catch (error) {
      console.error('Error checking day change:', error);
    }
  };

  const calculateMagnitude = (x, y, z) => {
    return Math.sqrt(x * x + y * y + z * z) - 9.8;
  };

  const detectStep = ({x, y, z}) => {
    const currentTime = Date.now();
    const timeDiff = currentTime - lastStepTimeRef.current;

    const magnitude = calculateMagnitude(x, y, z);
    const absMagnitude = Math.abs(magnitude);

    if (absMagnitude > MOTION_THRESHOLD) {
      motionDetectedRef.current = true;
    } else {
      motionDetectedRef.current = false;
      return;
    }

    if (isCooldownRef.current) {
      lastAccelerationRef.current = {x, y, z};
      return;
    }

    if (!hasPeakedRef.current && magnitude > PEAK_THRESHOLD) {
      hasPeakedRef.current = true;
    } else if (hasPeakedRef.current && magnitude < VALLEY_THRESHOLD) {
      if (timeDiff > MIN_STEP_DELAY) {
        dispatch(incrementSteps());
        lastStepTimeRef.current = currentTime;
        isCooldownRef.current = true;
        hasPeakedRef.current = false;

        setTimeout(() => {
          isCooldownRef.current = false;
        }, COOLDOWN_TIME);
      }
    }

    lastAccelerationRef.current = {x, y, z};
  };

  useEffect(() => {
    loadData();
    let subscription;

    const startTracking = async () => {
      try {
        setUpdateIntervalForType(SensorTypes.accelerometer, 100);
        subscription = accelerometer.subscribe(acceleration => {
          detectStep(acceleration);
        });
        dispatch(setIsTracking(true));
      } catch (error) {
        console.error('Error starting tracking:', error);
        dispatch(setIsTracking(false));
      }
    };

    startTracking();

    dayCheckIntervalRef.current = setInterval(checkDayChange, 60000);

    return () => {
      if (subscription) subscription.unsubscribe();
      if (dayCheckIntervalRef.current)
        clearInterval(dayCheckIntervalRef.current);
    };
  }, []);

  useEffect(() => {
    saveData();
  }, [steps, workouts]);

  return {
    steps,
    calories: calculateCalories(steps),
    workouts,
    currentDay: getCurrentDayIndex(),
    isTracking,
  };
};
