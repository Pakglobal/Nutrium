import React, {useState} from 'react';
import {
  Dimensions,
  Keyboard,
  SafeAreaView,
  ScrollView,
  StyleSheet,
  Text,
  TextInput,
  TouchableOpacity,
  View,
  Platform,
} from 'react-native';
import {scale, verticalScale} from 'react-native-size-matters';
import AntDesign from 'react-native-vector-icons/AntDesign';
import NutriumLogo from '../../assets/Images/logoGreen.svg';
import {Color} from '../../assets/styles/Colors';
import {useDispatch, useSelector} from 'react-redux';
import {ForgotPasswordApi, GoogleLogin, Login} from '../../Apis/Login/AuthApis';
import {GoogleSignin} from '@react-native-google-signin/google-signin';
import {loginData, setToken} from '../../redux/user';
import Ionicons from 'react-native-vector-icons/Ionicons';
import {useNavigation} from '@react-navigation/native';
import LoginHeader from '../../assets/Images/loginHeader.svg';
import Google from '../../assets/Icon/google.svg';
import {Font} from '../../assets/styles/Fonts';
import CustomShadow from '../../Components/CustomShadow';
import CustomLoader from '../../Components/CustomLoader';
import CustomAlertBox from '../../Components/CustomAlertBox';

const height = Dimensions.get('screen').height;

const LoginScreen = () => {
  const dispatch = useDispatch();
  const navigation = useNavigation();

  const [loading, setLoading] = useState(false);
  const [isAgree, setIsAgree] = useState(false);
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [emailError, setEmailError] = useState('');
  const [passwordError, setPasswordError] = useState('');
  const [passwordVisible, setPasswordVisible] = useState(false);
  const [alertVisible, setAlertVisible] = useState(false);
  const [loginAlert, setLoginAlert] = useState([]);
  const [alertType, setAlertType] = useState('');

  const handlePassword = () => {
    setPasswordVisible(!passwordVisible);
  };

  const FCMtoken = useSelector(state => state?.user?.fcmToken);

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

    if (!email) {
      setLoginAlert('Email is required');
      setAlertType('warning');
      setAlertVisible(true);
      return;
    }

    if (!emailRegex.test(email)) {
      setLoginAlert('Enter a valid email');
      setAlertType('warning');
      setAlertVisible(true);
      return;
    }

    if (!password) {
      setLoginAlert('Password is required');
      setAlertType('warning');
      setAlertVisible(true);
      return;
    }

    if (password.length < 8) {
      setLoginAlert('Password must be at least 8 characters');
      setAlertType('warning');
      setAlertVisible(true);
      return;
    }

    if (!isAgree) {
      setLoginAlert('Please agree to the terms and conditions');
      setAlertType('warning');
      setAlertVisible(true);
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
      setAlertType('success');
      setAlertVisible(true);

      if (
        response?.message === 'User not found.' ||
        response?.message === 'Invalid Credentials'
      ) {
        setLoginAlert(response?.message);
        setAlertType('error');
        setAlertVisible(true);
      }

      const storeTokenId = {
        token: response?.token,
        id: response?.userData?._id,
      };

      if (response) {
        dispatch(loginData(response));
        dispatch(setToken(storeTokenId));
      } else {
        setAlertVisible(true);
        setLoading(false);
      }
      setLoading(false);
    } catch (error) {
      setAlertType('error');
      setLoginAlert('Something went wrong. Please try again.');
      setAlertVisible(true);
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
      setLoginAlert('Google Sign-In failed. Please try again.');
      setAlertType('error');
      setAlertVisible(true);
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

  const handleForgetPassword = async () => {
    navigation.navigate('forgotPassword', {data: email});
    const body = {
      email: email,
    };
    try {
      const response = await ForgotPasswordApi(body);
    } catch (error) {
      console.error('error', error);
    }
  };

  return (
    <SafeAreaView style={styles.container}>
      <CustomAlertBox
        visible={alertVisible}
        type={alertType}
        message={alertMessage()}
        closeAlert={() => setAlertVisible(false)}
        onClose={() => {
          setAlertVisible(false);
        }}
      />

      <TouchableOpacity
        onPress={() => {
          Keyboard.dismiss();
          setTimeout(() => {
            navigation.goBack();
          }, 200);
        }}
        style={{
          justifyContent: 'center',
          padding: scale(8),
          margin: scale(8),
          alignSelf: 'flex-start',
          position: 'absolute',
          zIndex: 1,
        }}>
        <AntDesign name="arrowleft" size={26} color={Color.primaryColor} />
      </TouchableOpacity>

      <View style={styles.mainContainer}>
        <ScrollView
          contentContainerStyle={styles.scrollContent}
          showsVerticalScrollIndicator={false}
          keyboardShouldPersistTaps="handled">
          <View style={styles.contentContainer}>
            <LoginHeader
              width={'100%'}
              style={{alignSelf: 'center', marginTop: verticalScale(50)}}
            />

            <View style={{paddingHorizontal: scale(16)}}>
              <NutriumLogo
                width={'100%'}
                height={scale(30)}
                style={{
                  alignSelf: 'center',
                  marginVertical: verticalScale(25),
                }}
              />
              <CustomShadow
                color={emailError ? 'rgba(255,0,0,0.3)' : undefined}>
                <View
                  style={{
                    height: verticalScale(37),
                    justifyContent: 'center',
                    paddingHorizontal: scale(5),
                    backgroundColor: Color.white,
                    borderRadius: scale(6),
                  }}>
                  <TextInput
                    value={email}
                    placeholder="Email"
                    onChangeText={val => {
                      setEmail(val);
                      validateEmail(val);
                    }}
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
                    borderRadius: scale(6),
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
                      onChangeText={val => {
                        setPassword(val);
                        validatePassword(val);
                      }}
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
                    {
                      backgroundColor: isAgree
                        ? Color.primaryColor
                        : Color.white,
                    },
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

              <View style={{height: verticalScale(100)}} />
            </View>
          </View>
          <View style={styles.fixedButtonContainer}>
            <TouchableOpacity
              onPress={handleLogin}
              style={[styles.button, {backgroundColor: Color.primaryColor}]}>
              {loading ? (
                <CustomLoader color={Color.white} size={'small'} />
              ) : (
                <Text style={[styles.buttonText, {color: Color.white}]}>
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
                  {color: Color.primaryColor, marginHorizontal: scale(8)},
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
  },
  contentContainer: {
    flexGrow: 1,
  },
  scrollContent: {
    flexGrow: 1,
    paddingBottom: '5%',
  },
  forgotText: {
    color: Color?.textColor,
    fontSize: scale(12),
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
    fontFamily: Font.Poppins,
  },
  buttonText: {
    fontSize: scale(14),
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
  fixedButtonContainer: {
    width: '100%',
    position: 'absolute',
    bottom: 0,
    left: 0,
    right: 0,
    paddingHorizontal: scale(16),
    paddingBottom: verticalScale(15),
    paddingTop: verticalScale(10),
    backgroundColor: Color.white,
  },
});

export default LoginScreen;
