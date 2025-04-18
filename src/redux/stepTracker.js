import {createSlice} from '@reduxjs/toolkit';
import AsyncStorage from '@react-native-async-storage/async-storage';

const STORAGE_KEYS = {
  STEPS: 'steps',
  WORKOUTS: 'workouts',
  LAST_RESET: 'lastReset',
};

const initialState = {
  steps: 0,
  workouts: Array(7).fill(0),
  currentDay: (() => {
    const jsDay = new Date().getDay();
    return jsDay === 0 ? 6 : jsDay - 1;
  })(),
  isTracking: false,
  lastReset: new Date().toISOString(),
};

const saveToStorage = async (key, value) => {
  try {
    await AsyncStorage.setItem(key, JSON.stringify(value));
  } catch (error) {
    console.error(`Error saving ${key}:`, error);
  }
};

const stepTrackerSlice = createSlice({
  name: 'stepTracker',
  initialState,
  reducers: {
    incrementSteps: state => {
      state.steps += 1;
      saveToStorage(STORAGE_KEYS.STEPS, state.steps);
    },
    setSteps: (state, action) => {
      state.steps = action.payload;
      saveToStorage(STORAGE_KEYS.STEPS, state.steps);
    },
    setWorkouts: (state, action) => {
      state.workouts = action.payload;
      saveToStorage(STORAGE_KEYS.WORKOUTS, state.workouts);
    },
    resetSteps: state => {
      state.workouts[state.currentDay] = state.steps;
      state.steps = 0;
      const jsDay = new Date().getDay(); 
      state.currentDay = jsDay === 0 ? 6 : jsDay - 1;
      state.lastReset = new Date().toISOString();
      saveToStorage(STORAGE_KEYS.STEPS, state.steps);
      saveToStorage(STORAGE_KEYS.WORKOUTS, state.workouts);
      saveToStorage(STORAGE_KEYS.LAST_RESET, state.lastReset);
    },
    setIsTracking: (state, action) => {
      state.isTracking = action.payload;
    },
  },
});

export const {
  incrementSteps,
  setSteps,
  setWorkouts,
  resetSteps,
  setIsTracking,
} = stepTrackerSlice.actions;
export default stepTrackerSlice.reducer;
