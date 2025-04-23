// import {
//   SafeAreaView,
//   StyleSheet,
//   Text,
//   TouchableOpacity,
//   View,
//   Alert,
//   BackHandler,
//   TextInput,
// } from 'react-native';
// import React, {useState} from 'react';
// import FontAwesome from 'react-native-vector-icons/FontAwesome';
// import FontAwesome5 from 'react-native-vector-icons/FontAwesome5';
// import {scale, verticalScale} from 'react-native-size-matters';
// import {useFocusEffect, useNavigation} from '@react-navigation/native';
// import {Shadow} from 'react-native-shadow-2';
// import Feather from 'react-native-vector-icons/Feather';
// import Octicons from 'react-native-vector-icons/Octicons';
// import {useDispatch} from 'react-redux';
// import {Color} from '../../assets/styles/Colors';
// import {Font} from '../../assets/styles/Fonts';
// import {LeftIcon} from '../../assets/styles/Icon';
// import Header from '../../assets/Images/forgotPassword.svg';
// import CustomShadow from '../../Components/CustomShadow';
// import { shadowStyle } from '../../assets/styles/Shadow';

// const ForgotPasswordScreen = ({route}) => {
//   const email = route?.params?.data;

//   const navigation = useNavigation();

//   return (
//     <SafeAreaView style={styles.container}>
//       <LeftIcon onGoBack={() => navigation.goBack()} />

//       <Header height={'40%'} width={'100%'} style={{marginTop: 50}} />

//       <View style={styles.formContainer}>
//         <Text style={styles.titleText}>Please Enter your Registered Email</Text>

//         <Text
//           style={[
//             styles.titleText,
//             {
//               color: '#838688',
//               fontSize: scale(12),
//               paddingHorizontal: scale(16),
//             },
//           ]}>
//           We will send a verification code to your registered email{' '}
//         </Text>
//         <View style={{marginTop: verticalScale(20)}}>
//           <CustomShadow>
//             <View
//               style={{
//                 height: verticalScale(38),
//                 justifyContent: 'center',
//                 paddingHorizontal: scale(5),
//                 backgroundColor: Color.white,
//                 borderRadius: scale(6)
//               }}>
//               <TextInput
//                 value={email}
//                 placeholderTextColor={Color.textColor}
//                 style={[
//                   styles.titleText,
//                   {
//                     fontSize: scale(12),
//                     marginTop: verticalScale(2),
//                     marginVertical: verticalScale(0),
//                   },
//                 ]}
//                 editable={false}
//               />
//             </View>
//           </CustomShadow>
//         </View>
//       </View>

//       <View
//         style={{
//           justifyContent: 'center',
//           bottom: verticalScale(25),
//           position: 'absolute',
//           width: '100%',
//           paddingHorizontal: scale(16),
//         }}>
//         <TouchableOpacity
//           style={[styles.button, {backgroundColor: Color.primaryColor}]}>
//           <Text style={[styles.buttonText, {color: Color.white}]}>Next</Text>
//         </TouchableOpacity>
//       </View>
//     </SafeAreaView>
//   );
// };

// export default ForgotPasswordScreen;

// const styles = StyleSheet.create({
//   container: {
//     flex: 1,
//     backgroundColor: Color.white,
//   },
//   titleText: {
//     fontSize: scale(14),
//     color: Color.textColor,
//     letterSpacing: 1,
//     fontFamily: Font.PoppinsMedium,
//     marginVertical: scale(4),
//     textAlign: 'center',
//   },
//   formContainer: {
//     paddingHorizontal: scale(16),
//     marginTop: verticalScale(20),
//   },
//   buttonText: {
//     fontSize: scale(14),
//     fontWeight: '600',
//     fontFamily: Font.PoppinsMedium,
//     textAlign: 'center',
//     letterSpacing: 1,
//     marginTop: verticalScale(2),
//   },
//   button: {
//     borderColor: Color.primaryColor,
//     borderRadius: scale(8),
//     height: verticalScale(35),
//     alignItems: 'center',
//     justifyContent: 'center',
//   },
// });

import {
  SafeAreaView,
  StyleSheet,
  Text,
  TouchableOpacity,
  View,
  Alert,
  TextInput,
  Keyboard,
  ActivityIndicator,
  Linking,
} from 'react-native';
import React, { useEffect, useState } from 'react';
import { useNavigation } from '@react-navigation/native';
import { scale, verticalScale } from 'react-native-size-matters';
import { Color } from '../../assets/styles/Colors';
import { Font } from '../../assets/styles/Fonts';
import { LeftIcon } from '../../assets/styles/Icon';
import Header from '../../assets/Images/forgotPassword.svg';
import CustomShadow from '../../Components/CustomShadow';
import { ForgotPasswordApi } from '../../Apis/Login/AuthApis';

const ForgotPasswordScreen = ({ route }) => {
  const navigation = useNavigation();
  const [email, setEmail] = useState('');
  const [loading, setLoading] = useState(false);


  const handleSubmit = async () => {
    Keyboard.dismiss();
  
    if (!email || !email.includes('@')) {
      Alert.alert('Invalid Email', 'Please enter a valid email address.');
      return;
    }
  
    const body = {
      email: email,
    };
  
    try {
      setLoading(true);
  
      const response = await ForgotPasswordApi(body);
      console.log('response=====', response);
  
      const successMsg = 'Password reset email sent.';
  
      if (response?.message?.includes(successMsg)) {
        Alert.alert(
          'Email Sent',
          successMsg,
          [{
            text: 'OK',
            onPress: () => {
              const encodedEmail = encodeURIComponent(email);
              Linking.openURL(
                `https://nutrium-front-end-ci66-git-feature-val-rahulbodaras-projects.vercel.app/accounts/clientPassword/resetPassword?email=${encodedEmail}`
              );
              navigation?.navigate('loginScreen');
            }
          }]
        );
      } else {
        Alert.alert('Error', response?.message || 'Failed to send reset email.');
      }
    } catch (error) {
      Alert.alert('Error', 'Something went wrong. Please try again later.');
    } finally {
      setLoading(false);
    }
  };
  

  return (
    <SafeAreaView style={styles.container}>

      <LeftIcon onGoBack={() => navigation.goBack()} />
      <Header height="40%" width="100%" style={{ marginTop: 50 }} />

      <View style={styles.formContainer}>
        <Text style={styles.titleText}>Please Enter your Registered Email</Text>
        <Text style={styles.subtitleText}>
          We will send a verification link to your email to reset your password.
        </Text>

        <View style={{ marginTop: verticalScale(20) }}>
          <CustomShadow>
            <View style={styles.inputWrapper}>
              <TextInput
                placeholder="Enter your email"
                value={email}
                onChangeText={setEmail}
                placeholderTextColor={Color.textColor}
                style={styles.textInput}
                keyboardType="email-address"
                autoCapitalize="none"
              />
            </View>
          </CustomShadow>
        </View>
      </View>

      <View style={styles.buttonWrapper}>
        <TouchableOpacity
          onPress={handleSubmit}
          disabled={loading}
          style={[styles.button, { backgroundColor: Color.primaryColor }]}>
          {loading ? (
            <ActivityIndicator size="small" color={Color.white} />
          ) : (
            <Text style={[styles.buttonText, { color: Color.white }]}>Send Reset Link</Text>
          )}
        </TouchableOpacity>
      </View>
    </SafeAreaView>
  );
};

export default ForgotPasswordScreen;

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: Color.white,
  },
  titleText: {
    fontSize: scale(14),
    color: Color.textColor,
    fontFamily: Font.PoppinsMedium,
    textAlign: 'center',
    marginBottom: verticalScale(4),
  },
  subtitleText: {
    color: '#838688',
    fontSize: scale(12),
    textAlign: 'center',
    paddingHorizontal: scale(16),
    fontFamily: Font.PoppinsRegular,
  },
  formContainer: {
    paddingHorizontal: scale(16),
    marginTop: verticalScale(20),
  },
  inputWrapper: {
    height: verticalScale(38),
    justifyContent: 'center',
    paddingHorizontal: scale(10),
    backgroundColor: Color.white,
    borderRadius: scale(6),
  },
  textInput: {
    fontSize: scale(12),
    color: Color.textColor,
    fontFamily: Font.PoppinsMedium,
  },
  buttonWrapper: {
    justifyContent: 'center',
    bottom: verticalScale(25),
    position: 'absolute',
    width: '100%',
    paddingHorizontal: scale(16),
  },
  button: {
    borderRadius: scale(8),
    height: verticalScale(35),
    alignItems: 'center',
    justifyContent: 'center',
  },
  buttonText: {
    fontSize: scale(14),
    fontFamily: Font.PoppinsMedium,
    textAlign: 'center',
  },
});
