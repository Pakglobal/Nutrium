// import {createSlice} from '@reduxjs/toolkit';
// import AsyncStorage from '@react-native-async-storage/async-storage';

// const STORAGE_KEYS = {
//   STEPS: 'steps',
//   WORKOUTS: 'workouts',
//   LAST_RESET: 'lastReset',
// };

// const initialState = {
//   steps: 0,
//   workouts: Array(7).fill(0),
//   currentDay: (() => {
//     const jsDay = new Date().getDay();
//     return jsDay === 0 ? 6 : jsDay - 1;
//   })(),
//   isTracking: false,
//   lastReset: new Date().toISOString(),
// };

// const saveToStorage = async (key, value) => {
//   try {
//     await AsyncStorage.setItem(key, JSON.stringify(value));
//   } catch (error) {
//     console.error(`Error saving ${key}:`, error);
//   }
// };

// const stepTrackerSlice = createSlice({
//   name: 'stepTracker',
//   initialState,
//   reducers: {
//     incrementSteps: state => {
//       state.steps += 1;
//       saveToStorage(STORAGE_KEYS.STEPS, state.steps);
//     },
//     setSteps: (state, action) => {
//       state.steps = action.payload;
//       saveToStorage(STORAGE_KEYS.STEPS, state.steps);
//     },
//     setWorkouts: (state, action) => {
//       state.workouts = action.payload;
//       saveToStorage(STORAGE_KEYS.WORKOUTS, state.workouts);
//     },
//     resetSteps: state => {
//       state.workouts[state.currentDay] = state.steps;
//       state.steps = 0;
//       const jsDay = new Date().getDay();
//       state.currentDay = jsDay === 0 ? 6 : jsDay - 1;
//       state.lastReset = new Date().toISOString();
//       saveToStorage(STORAGE_KEYS.STEPS, state.steps);
//       saveToStorage(STORAGE_KEYS.WORKOUTS, state.workouts);
//       saveToStorage(STORAGE_KEYS.LAST_RESET, state.lastReset);
//     },
//     setIsTracking: (state, action) => {
//       state.isTracking = action.payload;
//     },
//   },
// });

// export const {
//   incrementSteps,
//   setSteps,
//   setWorkouts,
//   resetSteps,
//   setIsTracking,
// } = stepTrackerSlice.actions;
// export default stepTrackerSlice.reducer;

import {createSlice} from '@reduxjs/toolkit';
import AsyncStorage from '@react-native-async-storage/async-storage';

const STORAGE_KEYS = {
  STEPS: 'steps',
  WORKOUTS: 'workouts',
  CURRENT_DAY: 'currentDay',
  LAST_RESET: 'lastReset',
};

const getCurrentDayIndex = () => {
  const jsDay = new Date().getDay();
  return jsDay === 0 ? 6 : jsDay - 1;
};

const initialState = {
  steps: 0,
  workouts: {
    0: 0,
    1: 0,
    2: 0,
    3: 0,
    4: 0,
    5: 0,
    6: 0,
    lastReset: new Date().toISOString(),
  },
  currentDay: getCurrentDayIndex(),
  isTracking: false,
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
      if (Array.isArray(action.payload)) {
        const workoutObj = {...state.workouts};
        action.payload.forEach((steps, index) => {
          if (index < 7) workoutObj[index] = steps;
        });
        state.workouts = workoutObj;
      } else {
        state.workouts = {
          ...state.workouts,
          ...action.payload,
        };
      }
      saveToStorage(STORAGE_KEYS.WORKOUTS, state.workouts);
    },
    resetSteps: state => {
      state.workouts[state.currentDay] = state.steps;
      state.steps = 0;
      state.currentDay = getCurrentDayIndex();
      state.workouts.lastReset = new Date().toISOString();

      saveToStorage(STORAGE_KEYS.STEPS, state.steps);
      saveToStorage(STORAGE_KEYS.WORKOUTS, state.workouts);
      saveToStorage(STORAGE_KEYS.CURRENT_DAY, state.currentDay);
    },
    setIsTracking: (state, action) => {
      state.isTracking = action.payload;
    },
    hydrateFromStorage: (state, action) => {
      const {steps, workouts, currentDay} = action.payload;
      if (steps !== undefined) state.steps = steps;
      if (workouts !== undefined) state.workouts = workouts;
      if (currentDay !== undefined) state.currentDay = currentDay;
    },
  },
});

export const {
  incrementSteps,
  setSteps,
  setWorkouts,
  resetSteps,
  setIsTracking,
  hydrateFromStorage,
} = stepTrackerSlice.actions;

export const loadStepDataFromStorage = () => async dispatch => {
  try {
    const [stepsData, workoutsData, currentDayData] = await Promise.all([
      AsyncStorage.getItem(STORAGE_KEYS.STEPS),
      AsyncStorage.getItem(STORAGE_KEYS.WORKOUTS),
      AsyncStorage.getItem(STORAGE_KEYS.CURRENT_DAY),
    ]);

    const payload = {};

    if (stepsData) payload.steps = JSON.parse(stepsData);
    if (workoutsData) payload.workouts = JSON.parse(workoutsData);
    if (currentDayData) payload.currentDay = JSON.parse(currentDayData);

    dispatch(hydrateFromStorage(payload));
  } catch (error) {
    console.error('Error loading step data from storage:', error);
  }
};

export default stepTrackerSlice.reducer;
