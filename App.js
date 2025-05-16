import {
  Alert,
  Linking,
  PermissionsAndroid,
  Platform,
  StyleSheet,
} from 'react-native';
import React, {useEffect, useState} from 'react';
import RootNavigation from './src/Navigation/RootNavigation';
import messaging from '@react-native-firebase/messaging';
import {firebaseApp} from './src/firebaseConfig';
import {Provider, useDispatch} from 'react-redux';
import {setFcmToken} from './src/redux/user';
import {store} from './src/redux/Store';
import SplashScreen from 'react-native-splash-screen';
import NetInfo from '@react-native-community/netinfo';
import RNRestart from 'react-native-restart';
import notifee from '@notifee/react-native';

const AppContent = () => {
  const dispatch = useDispatch();

  const fetchToken = async () => {
    try {
      if (!firebaseApp) {
        console.error('Firebase is not initialized. Retrying...');
        return;
      }
      await messaging().registerDeviceForRemoteMessages();
      console.log('Device registered for remote messages');

      const fcmToken = await messaging().getToken();
      console.log('FCM Token:', fcmToken);
      if (fcmToken) {
        dispatch(setFcmToken(fcmToken));
      }
    } catch (error) {
      console.error('Error getting FCM Token:', error);
    }
  };

  const requestUserPermissionIos = async () => {
    try {
      const authStatusIOS = await messaging().requestPermission();
      const enabled =
        authStatusIOS === messaging.AuthorizationStatus.AUTHORIZED ||
        authStatusIOS === messaging.AuthorizationStatus.PROVISIONAL;

      if (enabled) {
        console.log('iOS notification permission granted');
        fetchToken();
      } else {
        console.log('iOS notification permission denied');
        Alert.alert(
          'Notification Permission Required',
          'Please enable notification permissions to receive important updates.',
          [
            {text: 'Cancel', style: 'cancel'},
            {
              text: 'Open Settings',
              onPress: () => Linking.openSettings(),
            },
          ],
        );
      }
    } catch (error) {
      console.error('Error requesting iOS permission:', error);
    }
  };

  const requestUserPermissionAndroid = async () => {
    try {
      if (Platform.Version >= 33) {
        const authStatusAndroid = await PermissionsAndroid.request(
          PermissionsAndroid.PERMISSIONS.POST_NOTIFICATIONS,
        );
        console.log('authStatusAndroid', authStatusAndroid);

        if (authStatusAndroid === PermissionsAndroid.RESULTS.GRANTED) {
          console.log('Android notification permission granted');
          fetchToken();
        } else if (authStatusAndroid === PermissionsAndroid.RESULTS.DENIED) {
          console.log(
            'Android notification permission denied but can ask again',
          );
          Alert.alert(
            'Notification Permission Required',
            'Notifications help you stay updated with important information.',
            [
              {text: 'Not Now', style: 'cancel'},
              {
                text: 'Try Again',
                onPress: () => requestUserPermissionAndroid(),
              },
            ],
          );
        } else if (
          authStatusAndroid === PermissionsAndroid.RESULTS.NEVER_ASK_AGAIN
        ) {
          console.log('Android notification permission denied permanently');
          Alert.alert(
            'Notification Permission Required',
            'Please enable notification permissions from settings.',
            [
              {text: 'Cancel', style: 'cancel'},
              {
                text: 'Open Settings',
                onPress: () => Linking.openSettings(),
              },
            ],
          );
        }
      } else {
        console.log('Android < 13, no explicit permission needed');
        fetchToken();
      }
    } catch (error) {
      console.error('Error requesting Android permission:', error);
      fetchToken();
    }
  };

  const setupNetworkListener = () => {
    return NetInfo.addEventListener(state => {
      try {
        if (state.isConnected === false) {
          Alert.alert('No Internet', 'Please Connect!', [
            {
              text: 'Reload app',
              onPress: () => {
                try {
                  RNRestart.restart();
                } catch (restartError) {
                  console.error('Error restarting app:', restartError);
                }
              },
            },
          ]);
        }
      } catch (netInfoError) {
        console.error('Error in NetInfo callback:', netInfoError);
      }
    });
  };

  // const onDisplayNotification = async remoteMessage => {
  //   try {
  //     const channelId = await notifee.createChannel({
  //       id: 'default',
  //       name: 'Default Channel',
  //     });

  //     await notifee.displayNotification({
  //       title: remoteMessage.notification?.title || 'New Notification',
  //       body: remoteMessage.notification?.body || 'You have a new notification',
  //       android: {
  //         channelId,
  //         pressAction: {
  //           id: 'default',
  //         },
  //       },
  //     });
  //   } catch (error) {
  //     console.error('Error displaying notification:', error);
  //   }
  // };

  const onDisplayNotification = async remoteMessage => {
    try {
      if (!remoteMessage || !remoteMessage.notification) {
        console.warn('Invalid or missing notification data:', remoteMessage);
        return;
      }

      const channelId = await notifee.createChannel({
        id: 'default',
        name: 'Default Channel',
      });

      await notifee.displayNotification({
        title: remoteMessage.notification.title || 'New Notification',
        body: remoteMessage.notification.body || 'You have a new notification',
        android: {
          channelId,
          pressAction: {
            id: 'default',
          },
        },
        ios: {
          // Add iOS-specific configuration if needed
        },
      });
    } catch (error) {
      console.error('Error displaying notification:', error);
    }
  };

  useEffect(() => {
    const initializeNotifee = async () => {
      try {
        await notifee.requestPermission();
        console.log('Notifee initialized');
      } catch (error) {
        console.error('Error initializing Notifee:', error);
      }
    };
    initializeNotifee();

    if (Platform.OS === 'android') {
      requestUserPermissionAndroid();
    } else if (Platform.OS === 'ios') {
      requestUserPermissionIos();
    }

    const unsubscribe = messaging().onMessage(async remoteMessage => {
      if (remoteMessage) {
        console.log('Foreground message received:', remoteMessage);
        await onDisplayNotification(remoteMessage);
      } else {
        console.warn('Received empty foreground message');
      }
    });

    messaging().setBackgroundMessageHandler(async remoteMessage => {
      if (remoteMessage) {
        console.log('Background message received:', remoteMessage);
        await onDisplayNotification(remoteMessage);
      } else {
        console.warn('Received empty background message');
      }
    });

    return () => {
      unsubscribe();
    };
  }, []);

  useEffect(() => {
    SplashScreen.hide();
    const unsubscribeNetInfo = setupNetworkListener();

    return () => {
      unsubscribeNetInfo && unsubscribeNetInfo();
    };
  }, []);



  return <RootNavigation />;
};

const App = () => {
  return (
    <Provider store={store}>
      <AppContent />
    </Provider>
  );
};

export default App;

