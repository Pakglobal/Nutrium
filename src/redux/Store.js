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