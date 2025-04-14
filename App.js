// import { Alert, PermissionsAndroid, StyleSheet } from 'react-native';
// import React, { useEffect } from 'react';
// import RootNavigation from './src/Navigation/RootNavigation';
// import messaging from '@react-native-firebase/messaging';
// import {firebaseApp} from './src/firebaseConfig';
// import {Provider, useSelector, useDispatch} from 'react-redux';
// import {setFcmToken} from './src/redux/user';
// import {store} from './src/redux/Store';
// import SplashScreen from 'react-native-splash-screen'

// const AppContent = () => {
//   const dispatch = useDispatch();

//   const fetchToken = async () => {

//     try {
//       console.log("-=-=--=-=", !firebaseApp);

//       if (!firebaseApp) {
//         console.error('Firebase is not initialized. Retrying...');
//         return;
//       }

//       const fcmToken = await messaging().getToken();
//       console.log("===>");
//       console.log('FCM Token:', fcmToken);

//       if (fcmToken) {
//         dispatch(setFcmToken(fcmToken));
//       }
//     } catch (error) {
//       console.error('Error getting FCM Token:', error);
//     }
//   };

//   async function requestUserPermission() {
//     const authStatus = await messaging().requestPermission();
//     const enabled =
//       authStatus === messaging.AuthorizationStatus.AUTHORIZED ||
//       authStatus === messaging.AuthorizationStatus.PROVISIONAL;

//     if (enabled) {
//       console.log('Authorization status:', authStatus, enabled);
//       fetchToken();
//     }
//   }

//   messaging().onMessage(async remoteMessage => {
//     console.log('remoteMessage', remoteMessage);

//     Alert.alert('A new FCM message arrived!', JSON.stringify(remoteMessage));
//   });

//   messaging().setBackgroundMessageHandler(async remoteMessage => {
//     console.log('Message handled in the background!', remoteMessage);
//   });

//   useEffect(() => {
//     requestUserPermission();
//     fetchToken();
//   }, [FCMtoken]);

// useEffect(() => {
//   SplashScreen.hide();
// }, [])

//   return (
//       <RootNavigation />
//   );
// };

// const App = () => {
//   return (
//     <Provider store={store}>
//       <AppContent />
//     </Provider>
//   );
// };

// export default App;

// const styles = StyleSheet.create({});

import {Alert, PermissionsAndroid, StyleSheet} from 'react-native';
import React, {useEffect} from 'react';
import RootNavigation from './src/Navigation/RootNavigation';
import messaging from '@react-native-firebase/messaging';
import {firebaseApp} from './src/firebaseConfig';
import {Provider, useSelector, useDispatch} from 'react-redux';
import {setFcmToken} from './src/redux/user';
import {store} from './src/redux/Store';
import SplashScreen from 'react-native-splash-screen';
import NetInfo from '@react-native-community/netinfo';
import RNRestart from 'react-native-restart';

const AppContent = () => {
  const dispatch = useDispatch();

  const fetchToken = async () => {
    try {
      if (!firebaseApp) {
        console.error('Firebase is not initialized. Retrying...');
        return;
      }
      const fcmToken = await messaging().getToken();
      console.log('FCM Token:', fcmToken);
      if (fcmToken) {
        dispatch(setFcmToken(fcmToken));
      }
    } catch (error) {
      console.error('Error getting FCM Token:', error);
    }
  };

  async function requestUserPermission() {
    const authStatus = await messaging().requestPermission();
    const enabled =
      authStatus === messaging.AuthorizationStatus.AUTHORIZED ||
      authStatus === messaging.AuthorizationStatus.PROVISIONAL;

    if (enabled) {
      fetchToken();
    }
  }

  messaging().onMessage(async remoteMessage => {
    console.log('remoteMessage', remoteMessage);
    Alert.alert('A new FCM message arrived!', JSON.stringify(remoteMessage));
  });

  messaging().setBackgroundMessageHandler(async remoteMessage => {
    console.log('Message handled in the background!', remoteMessage);
  });

  useEffect(() => {
    requestUserPermission();

    SplashScreen.hide();

    const netInfo = NetInfo.addEventListener(state => {
      try {
        console.log('Network state:', state.type, state.isConnected);
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

    netInfo();
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

const styles = StyleSheet.create({});
