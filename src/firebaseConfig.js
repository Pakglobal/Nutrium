// import {initializeApp, getApps, getApp} from '@react-native-firebase/app';
// import '@react-native-firebase/messaging'

// const firebaseConfig = {
//   apiKey: 'AIzaSyA-Gxy3Q3gNC7epdR8ndoU77PeXplskAMY',
//   authDomain: 'nutrium-app.firebaseapp.com',
//   projectId: 'nutrium-app',
//   storageBucket: 'nutrium-app.appspot.com',
//   messagingSenderId: '737792334349',
//   appId: '1:737792334349:android:19803dbe18ee6747411344',
//   databaseURL: 'https://nutrium-app-default-rtdb.firebaseio.com',
// };

// let firebaseApp;

// if (!getApps().length) {
//   firebaseApp = initializeApp(firebaseConfig);
// } else {
//   firebaseApp = getApp();
// }

// export {firebaseApp};

import {initializeApp, getApps, getApp} from '@react-native-firebase/app';

const firebaseConfig = {
  apiKey: 'AIzaSyA-Gxy3Q3gNC7epdR8ndoU77PeXplskAMY',
  authDomain: 'nutrium-app.firebaseapp.com',
  projectId: 'nutrium-app',
  storageBucket: 'nutrium-app.appspot.com',
  messagingSenderId: '737792334349',
  appId: '1:737792334349:android:19803dbe18ee6747411344',
  databaseURL: 'https://nutrium-app-default-rtdb.firebaseio.com',
};

let firebaseApp;

if (!getApps().length) {
  firebaseApp = initializeApp(firebaseConfig);
} else {
  firebaseApp = getApp();
}

export {firebaseApp};
