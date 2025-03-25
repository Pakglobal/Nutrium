import {StyleSheet} from 'react-native';
import React, {useEffect} from 'react';
import RootNavigation from './src/Navigation/RootNavigation';
import messaging from '@react-native-firebase/messaging';
import {firebaseApp} from './src/firebaseConfig';
import {Provider, useSelector, useDispatch} from 'react-redux';
import {setFcmToken} from './src/redux/user';
import {store} from './src/redux/Store';

const AppContent = () => {
  const dispatch = useDispatch();
  const getToken = useSelector(state => state?.user?.userInfo);
  console.log('getToken',getToken);
  
  const token = getToken?.token;
  const id = getToken?.userData?._id || getToken?.user?._id;

  useEffect(() => {
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

        // if (fcmToken && token && id) {
        //   sendTokenToBackend(fcmToken);
        // }
      } catch (error) {
        console.error('Error getting FCM Token:', error);
      }
    };

    fetchToken();


    const unsubscribe = messaging().onTokenRefresh(fcmToken => {
      if (fcmToken) {
        dispatch(setFcmToken(fcmToken));
      }
    });

    return () => unsubscribe();
  }, [token, id]);

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
