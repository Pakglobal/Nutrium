import {Alert, PermissionsAndroid, StyleSheet, View} from 'react-native';
import React, {useEffect, useState} from 'react';
import RootNavigation from './src/Navigation/RootNavigation';
import messaging from '@react-native-firebase/messaging';
import {firebaseApp} from './src/firebaseConfig';
import {Provider, useSelector, useDispatch} from 'react-redux';
import {setFcmToken} from './src/redux/user';
import {store} from './src/redux/Store';

const AppContent = () => {
  const dispatch = useDispatch();
  const [FCMtoken, setFCMtoken] = useState('');

  const fetchToken = async () => {
    try {
      if (!firebaseApp) {
        console.error('Firebase is not initialized. Retrying...');
        return;
      }
      
      const fcmToken = await messaging().getToken();
      console.log('FCM Token:', fcmToken);

      setFCMtoken(fcmToken);
      if (fcmToken) {
        dispatch(setFcmToken(fcmToken));
      }
    } catch (error) {
      console.error('Error getting FCM Token:', error);
    }
  };

  useEffect(() => {
    fetchToken();
  }, [FCMtoken]);

  async function requestUserPermission() {
    const authStatus = await messaging().requestPermission();
    const enabled =
      authStatus === messaging.AuthorizationStatus.AUTHORIZED ||
      authStatus === messaging.AuthorizationStatus.PROVISIONAL;

    if (enabled) {
      console.log('Authorization status:', authStatus, enabled);
    }
  }

  // messaging().onMessage(async remoteMessage => {
  //   console.log('remoteMessage', remoteMessage);

  //   Alert.alert('A new FCM message arrived!', JSON.stringify(remoteMessage));
  // });

  // messaging().setBackgroundMessageHandler(async remoteMessage => {
  //   console.log('Message handled in the background!', remoteMessage);
  // });

  useEffect(() => {
    requestUserPermission();
  }, []);
  

  return (
      <RootNavigation />
  );
};

const App = () => {
  return (
    <Provider store={store}>
      <AppContent />
    </Provider>
  );
};

export default App;

const styles = StyleSheet.create({});
