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
import io from 'socket.io-client';

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
const SOCKET_SERVER_URL = 'https://nutrium-back-end-1.onrender.com';
const SOCKET_UPDATE_INTERVAL = 5000;

export const useStepTracking = () => {
  const dispatch = useDispatch();
  const {steps, workouts, currentDay, isTracking} = useSelector(
    state => state.stepTracker,
  );

  const tokenId = useSelector(state => state?.user?.token);
  const guestTokenId = useSelector(state => state?.user?.guestToken);
  const id = tokenId?.id || guestTokenId?.id;

  const lastAccelerationRef = useRef({x: 0, y: 0, z: 0});
  const lastStepTimeRef = useRef(0);
  const isCooldownRef = useRef(false);
  const hasPeakedRef = useRef(false);
  const dayCheckIntervalRef = useRef(null);
  const motionDetectedRef = useRef(false);
  const socketRef = useRef(null);
  const socketIntervalRef = useRef(null);
  const lastSyncedStepsRef = useRef(0);

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

  const syncStepsToServer = () => {
    if (!socketRef.current || !socketRef.current.connected) return;

    if (steps > lastSyncedStepsRef.current) {
      const stepData = {
        participantedId: id,
        value: steps,
        date: new Date().toISOString(),
        // calories: calculateCalories(steps),
        // dayIndex: currentDay,
      };

      socketRef.current.emit('logProgressSocket', stepData);
      lastSyncedStepsRef.current = steps;
      console.log('Steps synced to server:', stepData);
    }
  };

  const initializeSocket = () => {
    try {
      socketRef.current = io(SOCKET_SERVER_URL);

      socketRef.current.on('connect', () => {
        console.log('Connected to step tracking server');

        // syncStepsToServer();

        socketIntervalRef.current = setInterval(() => {
          syncStepsToServer();
        }, SOCKET_UPDATE_INTERVAL);
      });

      socketRef.current.on('disconnect', () => {
        console.log('Disconnected from step tracking server');
        if (socketIntervalRef.current) {
          clearInterval(socketIntervalRef.current);
        }
      });

      socketRef.current.on('connect_error', error => {
        console.error('Socket connection error:', error);
      });

      socketRef.current.on('progressUpdated', data => {
        console.log('Server acknowledged steps:', data);
      });
    } catch (error) {
      console.error('Error initializing socket:', error);
    }
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
        initializeSocket();
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
      if (socketIntervalRef.current) clearInterval(socketIntervalRef.current);
      if (socketRef.current) socketRef.current.disconnect();
    };
  }, []);

  useEffect(() => {
    saveData();
  }, [steps, workouts]);

  return {
    steps,
    calories: calculateCalories(steps),
    workouts,
    currentDay,
    isTracking,
  };
};
