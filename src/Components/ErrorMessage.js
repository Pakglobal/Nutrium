// export const handleApiError = (error) => {
//   if (axios.isAxiosError(error)) {
//     const status = error.response?.status;
//     console.log(status, 'bgf');

//     switch (status) {
//       case 401: // Unauthorized
//         console.log('Unauthorized! Redirecting to login...');
//         // Logout user and navigate to login
//         break;

//       case 502: // Bad Gateway
//         console.log('Server issue. Please try again later.');
//         // Show a user-friendly message
//         break;

//       case 500: // Internal Server Error
//         console.log('Something went wrong on the server.');
//         break;

//       case 404: // Not Found
//         console.log('Resource not found.');
//         break;

//         case 400: // Not Found
//         console.log('Bad request.');
//         break;

//       default:
//         console.log('An unexpected error occurred:', error.message);
//     }
//   } else {
//     console.log('Network error:', error.message);
//   }
// };

import {StyleSheet, Text, View} from 'react-native';
import React from 'react';
import Toast from 'react-native-simple-toast';

const ErrorMessage = ({message}) => {
  const showToast = message => {
    Toast.show(message, Toast.LONG, Toast.BOTTOM);
  };

  return <View>{showToast(message)}</View>;
};

export default ErrorMessage;

const styles = StyleSheet.create({});
