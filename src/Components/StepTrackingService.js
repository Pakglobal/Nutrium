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
     
      if (isLoggedIn && !isBackgroundTrackingActive()) {
        startBackgroundStepTracking();
      }
    } else if (appState.match(/inactive|background/) && nextAppState === 'active') {
     
      syncStepsToServer();
    }
    
    setAppState(nextAppState);
  }, [appState, isLoggedIn, syncStepsToServer]);

 
  useEffect(() => {
   
    const subscription = AppState.addEventListener('change', handleAppStateChange);

   
    if (isLoggedIn) {
      if (appState === 'active') {
       
        startBackgroundStepTracking();
        dispatch(setIsTracking(true));
      } else {
       
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