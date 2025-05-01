import { AppRegistry, AppState } from 'react-native';
import { accelerometer, setUpdateIntervalForType, SensorTypes } from 'react-native-sensors';
import { incrementSteps, setIsTracking, setWorkouts } from '../redux/stepTracker';
import { connectSocket, getSocket } from './SocketService';
import { store } from '../redux/Store';

// Constants from your original implementation
const PEAK_THRESHOLD = 1.5;
const VALLEY_THRESHOLD = -1.2;
const MIN_STEP_DELAY = 300;
const COOLDOWN_TIME = 500;
const MOTION_THRESHOLD = 0.3;

// State variables (kept in memory)
const lastAcceleration = { x: 0, y: 0, z: 0 };
const state = {
  lastStepTime: 0,
  isCooldown: false,
  hasPeaked: false,
  motionDetected: false,
  lastSyncedSteps: 0,
  subscription: null,
  socketInterval: null,
  dayCheckInterval: null,
  appState: AppState.currentState
};

// Calculate magnitude of acceleration
const calculateMagnitude = (x, y, z) => {
  return Math.sqrt(x * x + y * y + z * z) - 9.8;
};

// Step detection algorithm
const detectStep = ({ x, y, z }) => {
  const currentTime = Date.now();
  const timeDiff = currentTime - state.lastStepTime;

  const magnitude = calculateMagnitude(x, y, z);
  const absMagnitude = Math.abs(magnitude);

  if (absMagnitude > MOTION_THRESHOLD) {
    state.motionDetected = true;
  } else {
    state.motionDetected = false;
    return;
  }

  if (state.isCooldown) {
    lastAcceleration.x = x;
    lastAcceleration.y = y;
    lastAcceleration.z = z;
    return;
  }

  if (!state.hasPeaked && magnitude > PEAK_THRESHOLD) {
    state.hasPeaked = true;
  } else if (state.hasPeaked && magnitude < VALLEY_THRESHOLD) {
    if (timeDiff > MIN_STEP_DELAY) {
      store.dispatch(incrementSteps());
      state.lastStepTime = currentTime;
      state.isCooldown = true;
      state.hasPeaked = false;

      setTimeout(() => {
        state.isCooldown = false;
      }, COOLDOWN_TIME);
    }
  }

  lastAcceleration.x = x;
  lastAcceleration.y = y;
  lastAcceleration.z = z;
};

// Sync steps to server
const syncStepsToServer = () => {
  const socket = getSocket();
  if (!socket || !socket.connected) return;

  const steps = store.getState().stepTracker.steps;
  const id = store.getState().user?.token?.id || store.getState().user?.guestToken?.id;

  if (steps > state.lastSyncedSteps) {
    const stepData = {
      userid: id,
      value: steps,
      date: new Date().toISOString(),
    };

    socket.emit('logProgressSocket', stepData);
    state.lastSyncedSteps = steps;
    console.log('Background step sync to server:', stepData);
  }
};

// Check for day change
const checkDayChange = () => {
  try {
    const stepTracker = store.getState().stepTracker;
    const workouts = stepTracker.workouts;
    
    const now = new Date();
    const today = new Date(now.getFullYear(), now.getMonth(), now.getDate());
    const storedDay = new Date(workouts.lastReset || 0);

    if (
      today.getDate() !== storedDay.getDate() ||
      today.getMonth() !== storedDay.getMonth() ||
      today.getFullYear() !== storedDay.getFullYear()
    ) {
      console.log('Day changed in background, resetting steps');
      store.dispatch(resetSteps());
      store.dispatch(setWorkouts({...workouts, lastReset: now.toISOString()}));
    }
  } catch (error) {
    console.error('Error checking day change in background:', error);
  }
};

// Socket initialization
const initializeSocket = () => {
  const socket = connectSocket();

  socket.on('connect', () => {
    console.log('Background service connected to step tracking server');
    syncStepsToServer();

    state.socketInterval = setInterval(() => {
      syncStepsToServer();
    }, 5000);
  });

  socket.on('disconnect', () => {
    console.log('Background service disconnected from step tracking server');
    if (state.socketInterval) {
      clearInterval(state.socketInterval);
    }
  });
};

// Start tracking steps
const startTracking = async () => {
  try {
    setUpdateIntervalForType(SensorTypes.accelerometer, 200);
    state.subscription = accelerometer.subscribe(acceleration => {
      detectStep(acceleration);
    });
    store.dispatch(setIsTracking(true));
    initializeSocket();
    state.dayCheckInterval = setInterval(checkDayChange, 60000);
    
    console.log('Background step tracking service started');
  } catch (error) {
    console.error('Error starting background tracking:', error);
    store.dispatch(setIsTracking(false));
  }
};

// Stop tracking steps
const stopTracking = () => {
  if (state.subscription) {
    state.subscription.unsubscribe();
    state.subscription = null;
  }
  
  if (state.socketInterval) {
    clearInterval(state.socketInterval);
    state.socketInterval = null;
  }
  
  if (state.dayCheckInterval) {
    clearInterval(state.dayCheckInterval);
    state.dayCheckInterval = null;
  }
  
  const socket = getSocket();
  if (socket) socket.disconnect();
  
  store.dispatch(setIsTracking(false));
  console.log('Background step tracking service stopped');
};

// Handle app state changes
const handleAppStateChange = (nextAppState) => {
  if (state.appState === 'active' && nextAppState.match(/inactive|background/)) {
    // App is going to background
    console.log('App going to background, continuing step tracking');
  } else if (state.appState.match(/inactive|background/) && nextAppState === 'active') {
    // App is coming to foreground
    console.log('App coming to foreground');
  }
  
  state.appState = nextAppState;
};

// Initialize the background service
const BackgroundStepTrackingService = async () => {
  // Set up app state change listener
  AppState.addEventListener('change', handleAppStateChange);
  
  // Start tracking
  startTracking();
  
  // Return a headless task
  return () => {
    // This function gets called when the app is terminated
    stopTracking();
    AppState.removeEventListener('change', handleAppStateChange);
  };
};

// Register the background service
AppRegistry.registerHeadlessTask('BackgroundStepTrackingService', () => BackgroundStepTrackingService);

// Export functions to be used from your main app
export const startBackgroundStepTracking = () => {
  if (!state.subscription) {
    startTracking();
  }
};

export const stopBackgroundStepTracking = () => {
  console.log('stopBackgroundStepTracking');
  
  stopTracking();
};

export const isBackgroundTrackingActive = () => {
  console.log('isBackgroundTrackingActive');
  
  return !!state.subscription;
};