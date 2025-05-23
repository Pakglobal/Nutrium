import React, {createRef, useEffect, useState} from 'react';
import {Alert, AppState, PermissionsAndroid, Platform} from 'react-native';
import {Provider, useDispatch, useSelector} from 'react-redux';
import {store} from './src/redux/Store';
import RootNavigation from './src/Navigation/RootNavigation';
import SplashScreen from 'react-native-splash-screen';
import NetInfo from '@react-native-community/netinfo';
import RNRestart from 'react-native-restart';
import messaging from '@react-native-firebase/messaging';
import AsyncStorage from '@react-native-async-storage/async-storage';
import PushNotification, {Importance} from 'react-native-push-notification';
import PushNotificationIOS from '@react-native-community/push-notification-ios';
import {setFcmToken} from './src/redux/user';

const AppContent = () => {
  const dispatch = useDispatch();
  const user = useSelector(state => state.user.userInfo);
  const userId = user?.userData?._id;
  const userName = user?.userData?.fullName;
  const otherUserId = user?.userData?.userId;
  const navigationRef = createRef();

  const [appState, setAppState] = useState(AppState.currentState);
  const [messages, setMessages] = useState([]);

  const requestUserPermission = async () => {
    if (Platform.OS === 'ios') {
      const authStatus = await messaging().requestPermission();
      const enabled =
        authStatus === messaging.AuthorizationStatus.AUTHORIZED ||
        authStatus === messaging.AuthorizationStatus.PROVISIONAL;
      if (enabled) {
        console.log('iOS notification permission granted');
      }
    } else {
      const granted = await PermissionsAndroid.request(
        PermissionsAndroid.PERMISSIONS.POST_NOTIFICATIONS,
      );
      if (granted === PermissionsAndroid.RESULTS.GRANTED) {
        console.log('Android notification permission granted');
      }
    }
  };

  const fetchToken = async () => {
    try {
      await messaging().registerDeviceForRemoteMessages();
      const token = await messaging().getToken();
      if (token) {
        console.log('FCM Token:', token);
        dispatch(setFcmToken(token));
      }
    } catch (error) {
      console.error('FCM token fetch error:', error);
    }
  };

  const setupNetworkListener = () => {
    const unsubscribe = NetInfo.addEventListener(state => {
      if (!state.isConnected) {
        Alert.alert('No Internet', 'Please connect to the internet.', [
          {
            text: 'Reload App',
            onPress: () => RNRestart.restart(),
          },
        ]);
      }
    });
    return unsubscribe;
  };

  const displayNotification = async remoteMessage => {
    try {
      const title =
        remoteMessage.notification?.title ||
        remoteMessage.data?.title ||
        'New Message';
      const body =
        remoteMessage.notification?.body ||
        remoteMessage.data?.body ||
        'You have a new message';

      PushNotification.localNotification({
        channelId: 'default',
        title,
        message: body,
        userInfo: remoteMessage.data || {},
        playSound: true,
        soundName: 'default',
        importance: Importance.HIGH,
        vibrate: true,
      });
    } catch (error) {
      console.error('Display notification error:', error);
    }
  };

  const storeNotification = async notification => {
    try {
      const existing = await AsyncStorage.getItem('notifications');
      const notifications = existing ? JSON.parse(existing) : [];

      const newNotif = {
        id:
          notification.id ||
          notification.data?.messageId ||
          Date.now().toString(),
        title: notification.title || notification.data?.title || 'New Message',
        body:
          notification.message ||
          notification.data?.body ||
          'You have a new message',
        senderId: notification.data?.senderId,
        receiverId: notification.data?.receiverId,
        timestamp: new Date().toISOString(),
        seen: false,
      };

      notifications.push(newNotif);
      await AsyncStorage.setItem(
        'notifications',
        JSON.stringify(notifications),
      );
    } catch (error) {
      console.error('Store notification error:', error);
    }
  };

  const messageHandler = async (newMessage, isPush = false) => {
    if (!newMessage?._id || !newMessage?.senderId || !newMessage?.receiverId)
      return;

    if (
      newMessage.senderId !== userId &&
      newMessage.receiverId === userId &&
      appState === 'active' &&
      isPush
    ) {
      await displayNotification({
        notification: {
          title: `New Message from ${userName || 'User'}`,
          body: newMessage.message || 'You have a new message',
        },
        data: {
          messageId: newMessage._id,
          senderId: newMessage.senderId,
          receiverId: newMessage.receiverId,
        },
      });
    }

    setMessages(prev => [newMessage, ...prev]);

    // mark seen messages (pseudo-function)
    if (
      newMessage.senderId !== userId &&
      newMessage.receiverId === userId &&
      !newMessage.seen &&
      appState === 'active'
    ) {
      // Replace with your markMessagesAsSeen logic
      console.log('Marking message as seen:', newMessage._id);
    }
  };

  const initNotifications = () => {
    PushNotification.createChannel(
      {
        channelId: 'default',
        channelName: 'Default Channel',
        soundName: 'default',
        importance: Importance.HIGH,
        vibrate: true,
      },
      created => console.log(`Notification channel created: ${created}`),
    );

    PushNotification.configure({
      onNotification: async notification => {
        console.log('Notification received:', notification);
        await storeNotification(notification);

        if (notification.foreground) {
          const newMsg = {
            _id: notification.id || notification.data?.messageId,
            senderId: notification.data?.senderId,
            receiverId: notification.data?.receiverId,
            message: notification.message || notification.data?.body,
            seen: false,
            tempId: notification.data?.tempId || null,
          };
          await messageHandler(newMsg, true);
        }

        if (Platform.OS === 'ios') {
          notification.finish(PushNotificationIOS.FetchResult.NoData);
        }
      },
      onAction: notification => {
        console.log('Notification action:', notification);
        if (
          notification.data?.receiverId &&
          notification.data?.senderId &&
          navigationRef.isReady()
        ) {
          navigationRef.navigate('MessageScreen', {
            userId: notification.data.receiverId,
            otherUserId: notification.data.senderId,
            userName: notification.data.userName || 'User',
          });
        }
      },
      permissions: {
        alert: true,
        badge: true,
        sound: true,
      },
      popInitialNotification: true,
      requestPermissions: false,
    });
  };

  useEffect(() => {
    SplashScreen.hide();
    requestUserPermission();
    fetchToken();
    const unsubscribeNet = setupNetworkListener();
    initNotifications();

    const unsubscribeApp = AppState.addEventListener('change', setAppState);

    const unsubscribeMessage = messaging().onMessage(async remoteMessage => {
      console.log('Foreground message:', remoteMessage);
      await displayNotification(remoteMessage);
    });

    messaging().setBackgroundMessageHandler(async remoteMessage => {
      console.log('Background FCM message:', remoteMessage);
    });

    return () => {
      unsubscribeNet();
      unsubscribeApp.remove();
      unsubscribeMessage();
    };
  }, []);

  return <RootNavigation />;
};

const App = () => (
  <Provider store={store}>
    <AppContent />
  </Provider>
);

export default App;
