import {configureStore, combineReducers} from '@reduxjs/toolkit';
import {persistStore, persistReducer} from 'redux-persist';
import AsyncStorage from '@react-native-async-storage/async-storage';
import thunk from 'redux-thunk';
import user from './user';
import drawer from './drawer';
import admin from './admin';
import client from './client';
import stepTracker from './stepTracker';
import unit from './unit';

const persistConfig = {
  key: 'root',
  storage: AsyncStorage,
  whitleList: ['user', 'stepTracker'],
  timeout: 0,
};

const rootReducer = combineReducers({
  user: user,
  drawer: drawer,
  admin: admin,
  client: client,
  stepTracker: stepTracker,
  unit: unit,
});

const persistedReducer = persistReducer(persistConfig, rootReducer);

export const store = configureStore({
  reducer: persistedReducer,
  middleware: (getDefaultMiddleware) =>
    getDefaultMiddleware({
      serializableCheck: false, 
    }).concat(thunk),
});

export const persistor = persistStore(store);

// import { configureStore, combineReducers } from '@reduxjs/toolkit';
// import {
//   persistStore,
//   persistReducer,
//   FLUSH,
//   REHYDRATE,
//   PAUSE,
//   PERSIST,
//   PURGE,
//   REGISTER,
//   createMigrate
// } from 'redux-persist';
// import AsyncStorage from '@react-native-async-storage/async-storage';
// import user from './user';
// import drawer from './drawer';
// import client from './client';

// // First, let's clear any existing persist storage on load to rule out corruption
// // Comment this out after confirming it fixes the issue
// const clearStorage = async () => {
//   try {
//     await AsyncStorage.removeItem('persist:root');
//     console.log('Storage successfully cleared');
//   } catch (error) {
//     console.error('Error clearing storage:', error);
//   }
// };
// clearStorage();

// // Debug callback to track persist operations
// const persistDebug = (key) => ({
//   beforePersist: () => {
//     console.log(`Starting persist for ${key}`);
//   },
//   afterPersist: () => {
//     console.log(`Finished persist for ${key}`);
//   },
// });

// // Version migrations in case of state structure changes
// const migrations = {
//   0: (state) => {
//     return {
//       ...state,
//       // Add any state migrations here if needed
//     };
//   }
// };

// const persistConfig = {
//   key: 'root',
//   storage: AsyncStorage,
//   whitelist: ['user'],
//   timeout: 20000, // Increased timeout
//   debug: true, // Enable debug mode
//   version: 0, // Add version control
//   migrate: createMigrate(migrations, { debug: true }),
//   stateReconciler: (inboundState, originalState, reducedState, config) => {
//     console.log('State reconciliation running');
//     return reducedState; // Or implement custom reconciliation
//   },
//   writeFailHandler: (error) => {
//     console.error('Persist write failed:', error);
//   },
//   serialize: true, // Force serialization
//   deserialize: true, // Force deserialization
//   ...persistDebug('root'),
// };

// const rootReducer = combineReducers({
//   user,
//   drawer,
//   client,
// });

// // Wrap the reducer to catch and log any errors
// const errorCatchingReducer = (state, action) => {
//   try {
//     return persistedReducer(state, action);
//   } catch (error) {
//     console.error('Reducer error:', error);
//     return state;
//   }
// };

// const persistedReducer = persistReducer(persistConfig, rootReducer);

// export const store = configureStore({
//   reducer: errorCatchingReducer,
//   middleware: getDefaultMiddleware =>
//     getDefaultMiddleware({
//       serializableCheck: {
//         ignoredActions: [FLUSH, REHYDRATE, PAUSE, PERSIST, PURGE, REGISTER],
//         warnAfter: 128,
//         ignoredPaths: ['some.path.here'],
//       },
//       immutableCheck: {
//         warnAfter: 128,
//       },
//     }).concat(/* any additional middleware */),
//   devTools: true,
// });

// // Create persistor with error handling
// export const persistor = persistStore(store, null, () => {
//   console.log('Rehydration complete');
// });

// // Add persistor event listeners
// persistor.subscribe(() => {
//   const { bootstrapped } = persistor.getState();
//   console.log('Persist state updated, bootstrapped:', bootstrapped);
// });

// // Export a function to purge persisted state if needed
// export const purgeStore = () => {
//   persistor.purge();
// };

// // Export a function to pause persistence if needed
// export const pausePersistor = () => {
//   persistor.pause();
// };
