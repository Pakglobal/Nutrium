import firebase from '@react-native-firebase/app';
import '@react-native-firebase/messaging';

const firebaseConfig = {
  apiKey: 'AIzaSyA-Gxy3Q3gNC7epdR8ndoU77PeXplskAMY',
  authDomain: 'nutrium-app.firebaseapp.com',
  projectId: 'nutrium-app',
  storageBucket: 'nutrium-app.appspot.com',
  messagingSenderId: '737792334349',
  appId: '1:737792334349:android:19803dbe18ee6747411344',
  databaseURL: 'https://nutrium-app-default-rtdb.firebaseio.com',
};

// Initialize Firebase properly with promise handling
const initializeFirebase = async () => {
  try {
    if (!firebase.apps.length) {
      return firebase.initializeApp(firebaseConfig);
    } else {
      return firebase.app();
    }
  } catch (error) {
    console.error("Firebase initialization error:", error);
    throw error; // Re-throw to handle in the component
  }
};

export { initializeFirebase };