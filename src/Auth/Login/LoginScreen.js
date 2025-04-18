import React, { useState } from 'react';
import {
  Alert,
  SafeAreaView,
  ScrollView,
  StyleSheet,
  Text,
  TextInput,
  ToastAndroid,
  TouchableOpacity,
  View,
  Image,
  Dimensions,
} from 'react-native';
import { scale, verticalScale } from 'react-native-size-matters';
import AntDesign from 'react-native-vector-icons/AntDesign';
import NutriumLogo from '../../assets/Images/logoGreen.svg';

import {Color} from '../../assets/styles/Colors';
import {useDispatch, useSelector} from 'react-redux';
import {ForgotPasswordApi, GoogleLogin, Login} from '../../Apis/Login/AuthApis';

import {
  GoogleSignin,
  GoogleSigninButton,
} from '@react-native-google-signin/google-signin';
import { loginData, profileData, setToken } from '../../redux/user';
import { GetAdminProfileData } from '../../Apis/AdminScreenApi/ProfileApi';
import Ionicons from 'react-native-vector-icons/Ionicons';
import { useNavigation } from '@react-navigation/native';
import CustomAlert from '../../Components/CustomAlert';
import LoginHeader from '../../assets/Images/loginHeader.svg';
import IconStyle from '../../assets/styles/Icon';
import { Shadow } from 'react-native-shadow-2';
import Google from '../../assets/Icon/google.svg';
import { Font } from '../../assets/styles/Fonts';
import { ShadowValues } from '../../assets/styles/Shadow';
import CustomShadow from '../../Components/CustomShadow';
import useKeyboardHandler from '../../Components/useKeyboardHandler';
import CustomLoader from '../../Components/CustomLoader';

const LoginScreen = () => {
  const dispatch = useDispatch();
  const navigation = useNavigation();

  useKeyboardHandler();

  const [loading, setLoading] = useState(false);
  const [isAgree, setIsAgree] = useState(false);
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [emailError, setEmailError] = useState('');
  const [passwordError, setPasswordError] = useState('');
  const [passwordVisible, setPasswordVisible] = useState(false);
  const [alertVisible, setAlertVisible] = useState(false);
  const [passwordAlertVisible, setPasswordAlertVisible] = useState(false);
  const [loginAlert, setLoginAlert] = useState([]);
  const [forgotPassword, setForgotPassword] = useState([]);

  const handlePassword = () => {
    setPasswordVisible(!passwordVisible);
  };

  const FCMtoken = useSelector(state => state?.user?.fcmToken);
  console.log('FCMtoken', FCMtoken)

  const validateEmail = value => {
    setEmail(value);
    const emailRegex = /^\w+([\.+]?\w+)*@\w+([\.-]?\w+)*(\.\w\w+)+$/;
    if (!value) {
      setEmailError('Email is required');
    } else if (!emailRegex.test(value)) {
      setEmailError('Enter a valid email');
    } else {
      setEmailError('');
    }
  };

  const validatePassword = value => {
    setPassword(value);
    if (!value) {
      setPasswordError('Password is required');
    } else if (value.length < 8) {
      setPasswordError('Password must be at least 8 characters');
    } else {
      setPasswordError('');
    }
  };

  const handleLogin = async () => {
    const emailRegex = /^\w+([\.+]?\w+)*@\w+([\.-]?\w+)*(\.\w{2,})+$/;

    if (!email || !emailRegex.test(email) || !password || password.length < 8 || !isAgree) {
      let message = '';

      if (!email) {
        message += 'Email is required.\n';
      } else if (!emailRegex.test(email)) {
        message += 'Enter a valid email.\n';
      }

      if (!password) {
        message += 'Password is required.\n';
      } else if (password.length < 8) {
        message += 'Password must be at least 8 characters.\n';
      }
      if(!isAgree) {
        message += 'Please agree a terms and condition before login'
      }

      Alert.alert('Error', message.trim());
      return;
    }

    setEmailError('');
    setPasswordError('');

    const body = {
      email: email,
      password: password,
      deviceToken: FCMtoken,
    };

    try {
      setLoading(true);
      const response = await Login(body);
      setLoginAlert(response?.message);

      const storeTokenId = {
        token: response?.token,
        id: response?.userData?._id,
      };
      console.log(response);
      

      if (response) {
        dispatch(loginData(response));
        dispatch(setToken(storeTokenId));
      } else {
        setAlertVisible(true);
        setLoading(false);
      }
      setLoading(false);
    } catch (error) {
      setLoading(false);
    }
  };

  GoogleSignin.configure({
    webClientId:
      '737792334349-eefln2o4gd1ovb2vs0kdct1hgfg5raf9.apps.googleusercontent.com',
    iosClientId:
      '737792334349-qeadje2231rg3g49s78vo7mh8rsq613j.apps.googleusercontent.com',
  });

  const signInWithGoogle = async () => {
    try {
      setLoading(true);
      await GoogleSignin.hasPlayServices();
      const userInfo = await GoogleSignin.signIn();

      if (userInfo) {
        await GoogleSignin.revokeAccess();
      }

      const googleId = userInfo?.data?.user?.id;
      const email = userInfo?.data?.user?.email;

      const body = {
        googleId: googleId,
        email: email,
        deviceToken: FCMtoken,
      };

      const response = await GoogleLogin(body);
      setLoginAlert(response?.message);

      const storeTokenId = {
        token: response?.token,
        id: response?.user?._id,
      };

      if (response?.message == 'Login successfully' || response?.token) {
        dispatch(loginData(response));
        dispatch(setToken(storeTokenId));
      } else {
        setAlertVisible(true);
        setLoading(false);
      }
      setLoading(false);
    } catch (error) {
      setLoading(false);
    }
  };

  const alertMessage = () => {
    if (loginAlert === undefined) {
      return 'Network Error';
    } else {
      return loginAlert;
    }
  };

  const showToast = () => {
    ToastAndroid.show(forgotPassword?.message, ToastAndroid.SHORT);
  };

  const handleForgetPassword = async () => {
    navigation.navigate('forgotPassword', {data: email})
    const body = {
      email: email,
    };
    try {
      const response = await ForgotPasswordApi(body);
      setForgotPassword(response);
      setPasswordAlertVisible(true);
      console.log(response);
    } catch (error) {
      console.log(error);
    }
  };

  

  return (
    <SafeAreaView style={styles.container}>
      <CustomAlert
        visible={alertVisible}
        message={alertMessage()}
        onClose={() => setAlertVisible(false)}
        singleButton={true}
      />
      {passwordAlertVisible && showToast()}

      <TouchableOpacity
        onPress={() => navigation.goBack()}
        style={{
          justifyContent: 'center',
          padding: scale(8),
          margin: scale(8),
          alignSelf: 'flex-start',
          position: 'absolute',
          zIndex: 1,
        }}>
        <AntDesign
          name="arrowleft"
          size={IconStyle.headerIconSize}
          color={Color.primaryColor}
        />
      </TouchableOpacity>

      <View style={styles.mainContainer}>
        <ScrollView
          contentContainerStyle={styles.scrollContent}
          showsVerticalScrollIndicator={false}>
          <LoginHeader
            width={'100%'}
            style={{ alignSelf: 'center', marginTop: verticalScale(50) }}
          />
          <NutriumLogo
            width={'100%'}
            height={scale(30)}
            style={{ alignSelf: 'center', marginVertical: verticalScale(20) }}
          />

          <View style={{ paddingHorizontal: scale(16) }}>
            <CustomShadow
              color={emailError ? 'rgba(255,0,0,0.3)' : undefined}>
              <View
                style={{
                  height: verticalScale(38),
                  justifyContent: 'center',
                  paddingHorizontal: scale(5),
                  backgroundColor: Color.white,
                  borderRadius: scale(6),
                }}>
                <TextInput
                  value={email}
                  placeholder="Email"
                  onChangeText={validateEmail}
                  fontFamily={Font?.Poppins}
                  placeholderTextColor={Color.textColor}
                  style={styles.titleText}
                  multiline={false}
                />
              </View>
            </CustomShadow>

            <CustomShadow

              color={passwordError ? 'rgba(255,0,0,0.3)' : undefined}>
              <View
                style={{
                  flexDirection: 'row',
                  alignItems: 'center',
                  justifyContent: 'space-between',
                  backgroundColor: Color.white,
                  marginVertical: verticalScale(13),
                  borderRadius: scale(6)
                }}>
                <View
                  style={{
                    height: verticalScale(38),
                    justifyContent: 'center',
                    width: '87%',
                    paddingHorizontal: scale(5),
                  }}>
                  <TextInput
                    value={password}
                    placeholder="Password"
                    onChangeText={validatePassword}
                    fontFamily={Font?.Poppins}
                    placeholderTextColor={Color.textColor}
                    style={styles.titleText}
                    multiline={false}
                    secureTextEntry={!passwordVisible}
                  />
                </View>
                <TouchableOpacity
                  onPress={handlePassword}
                  style={{
                    paddingHorizontal: scale(10),
                    paddingVertical: scale(5),
                  }}>
                  <Ionicons
                    name={passwordVisible ? 'eye-off-outline' : 'eye-outline'}
                    color={Color?.primaryColor}
                    size={24}
                  />
                </TouchableOpacity>
              </View>
            </CustomShadow>

            <TouchableOpacity onPress={() => handleForgetPassword()}>
              <Text style={styles.forgotText}>Forgot Password ?</Text>
            </TouchableOpacity>

            <View style={styles.termsContainer}>
              <TouchableOpacity
                style={[
                  styles.checkbox,
                  { backgroundColor: isAgree ? Color.primaryColor : Color.white },
                ]}
                onPress={() => setIsAgree(!isAgree)}>
                {isAgree && (
                  <View style={styles.checkedBox}>
                    <AntDesign name="check" color={Color.white} size={16} />
                  </View>
                )}
              </TouchableOpacity>
              <Text style={styles.termsText}>
                I agree to the terms and conditions
              </Text>
            </View>
          </View>

          <View
            style={{
              justifyContent: 'center',
              bottom: verticalScale(25),
              position: 'absolute',
              width: '100%',
              paddingHorizontal: scale(16),
            }}>
            <TouchableOpacity
              onPress={handleLogin}
              style={[styles.button, { backgroundColor: Color.primaryColor }]}>
              {loading ? (
                <CustomLoader color={Color.white} size={'small'} />
              ) : (
                <Text style={[styles.buttonText, { color: Color.white }]}>
                  Login
                </Text>
              )}
            </TouchableOpacity>

            <TouchableOpacity
              onPress={signInWithGoogle}
              style={[
                styles.button,
                {
                  backgroundColor: Color.white,
                  borderWidth: 2,
                  marginTop: verticalScale(8),
                  flexDirection: 'row',
                  alignItems: 'center',
                },
              ]}>
              <Google />
              <Text
                style={[
                  styles.buttonText,
                  { color: Color.primaryColor, marginHorizontal: scale(8) },
                ]}>
                Continue With Google
              </Text>
            </TouchableOpacity>
          </View>
        </ScrollView>
      </View>
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: Color.white,
  },
  mainContainer: {
    flex: 1,
    display: 'flex',
    flexDirection: 'column',
  },
  scrollContent: {
    flexGrow: 1,
    paddingBottom: '35%',
  },
  buttonContainer: {
    width: '100%',
    paddingBottom: verticalScale(15),
  },
  errorMessage: {
    color: '#F44336',
    fontSize: scale(13),
    marginTop: verticalScale(4),
  },
  forgotText: {
    color: Color?.textColor,
    fontSize: scale(12),
    fontWeight: '600',
    alignSelf: 'flex-end',
    letterSpacing: 1,
    fontFamily: Font.PoppinsMedium,
  },
  termsContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    marginTop: verticalScale(15),
  },
  checkbox: {
    width: scale(18),
    height: scale(18),
    borderWidth: 1,
    borderRadius: scale(2),
    marginRight: scale(11),
    alignItems: 'center',
    justifyContent: 'center',
    borderColor: Color.primaryColor,
  },
  checkedBox: {
    alignItems: 'center',
    justifyContent: 'center',
  },
  termsText: {
    color: Color.black,
    fontSize: scale(12),
    fontWeight: '400',
    fontFamily: Font.Poppins,
  },
  googleButton: {
    flexDirection: 'row',
    height: verticalScale(38),
    borderRadius: scale(8),
    borderWidth: 1,
    borderColor: Color?.primaryColor,
    justifyContent: 'center',
    alignItems: 'center',
    marginBottom: verticalScale(10),
    marginTop: scale(15),
  },
  googleIcon: {
    width: scale(22),
    height: scale(22),
    marginRight: 8,
  },
  googleText: {
    color: Color.primaryColor,
    fontSize: scale(14),
    fontWeight: '600',
  },
  buttonText: {
    fontSize: scale(14),
    fontWeight: '600',
    fontFamily: Font.PoppinsMedium,
    textAlign: 'center',
    letterSpacing: 1,
    marginTop: verticalScale(2),
  },
  button: {
    borderColor: Color.primaryColor,
    borderRadius: scale(8),
    height: verticalScale(35),
    alignItems: 'center',
    justifyContent: 'center',
  },
  titleText: {
    height: '100%',
    paddingVertical: 0,
    fontSize: 14,
    color: Color.textColor,
  },
});

export default LoginScreen;
