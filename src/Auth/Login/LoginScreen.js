import React, {useState, useEffect, useRef} from 'react';
import {
  Keyboard,
  SafeAreaView,
  ScrollView,
  StyleSheet,
  Text,
  TextInput,
  TouchableOpacity,
  View,
  Animated,
  Easing,
} from 'react-native';
import {scale, verticalScale} from 'react-native-size-matters';
import AntDesign from 'react-native-vector-icons/AntDesign';
import NutriumLogo from '../../assets/Images/logoGreen.svg';
import {Color} from '../../assets/styles/Colors';
import {useDispatch, useSelector} from 'react-redux';
import {ForgotPasswordApi, GoogleLogin, Login} from '../../Apis/Login/AuthApis';
import {GoogleSignin} from '@react-native-google-signin/google-signin';
import {
  guestLoginData,
  loginData,
  setGuestToken,
  setToken,
} from '../../redux/user';
import Ionicons from 'react-native-vector-icons/Ionicons';
import {useNavigation} from '@react-navigation/native';
import LoginHeader from '../../assets/Images/loginHeader.svg';
import Google from '../../assets/Icon/google.svg';
import {Font} from '../../assets/styles/Fonts';
import CustomShadow from '../../Components/CustomShadow';
import CustomLoader from '../../Components/CustomLoader';
import CustomAlertBox from '../../Components/CustomAlertBox';
import useKeyboardHandler from '../../Components/useKeyboardHandler';

const LoginScreen = () => {
  const dispatch = useDispatch();
  const navigation = useNavigation();

  useKeyboardHandler();

  const headerImageAnim = useRef(new Animated.Value(-200)).current;
  const logoAnim = useRef(new Animated.Value(0)).current;
  const formAnim = useRef(new Animated.Value(50)).current;
  const formOpacity = useRef(new Animated.Value(0)).current;
  const buttonAnim = useRef(new Animated.Value(100)).current;
  const buttonOpacity = useRef(new Animated.Value(0)).current;

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

  useEffect(() => {
    const animationSequence = Animated.sequence([
      Animated.timing(headerImageAnim, {
        toValue: 0,
        duration: 800,
        easing: Easing.out(Easing.cubic),
        useNativeDriver: true,
      }),
      Animated.spring(logoAnim, {
        toValue: 1,
        tension: 100,
        friction: 8,
        useNativeDriver: true,
      }),
      Animated.parallel([
        Animated.timing(formAnim, {
          toValue: 0,
          duration: 600,
          easing: Easing.out(Easing.quad),
          useNativeDriver: true,
        }),
        Animated.timing(formOpacity, {
          toValue: 1,
          duration: 600,
          useNativeDriver: true,
        }),
      ]),
      Animated.parallel([
        Animated.timing(buttonAnim, {
          toValue: 0,
          duration: 500,
          easing: Easing.out(Easing.quad),
          useNativeDriver: true,
        }),
        Animated.timing(buttonOpacity, {
          toValue: 1,
          duration: 500,
          useNativeDriver: true,
        }),
      ]),
    ]);

    // Start animation after a short delay
    setTimeout(() => {
      animationSequence.start();
    }, 100);
  }, []);

  const animateButtonPress = callback => {
    const scale = new Animated.Value(1);

    Animated.sequence([
      Animated.timing(scale, {
        toValue: 0.95,
        duration: 100,
        useNativeDriver: true,
      }),
      Animated.timing(scale, {
        toValue: 1,
        duration: 100,
        useNativeDriver: true,
      }),
    ]).start();

    setTimeout(callback, 150);
  };

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

  const showAlert = (message, type = 'warning') => {
    setLoginAlert(message);
    setAlertType(type);
    setAlertVisible(true);
  };

  const handleLogin = async () => {
    const emailRegex = /^\w+([\.+]?\w+)*@\w+([\.-]?\w+)*(\.\w{2,})+$/;

    if (!email && !password) {
      return showAlert('Both fields are required');
    }
    if (!email) {
      return showAlert('Email is required');
    }
    if (!emailRegex.test(email)) {
      return showAlert('Enter a valid email');
    }

    if (!password) {
      return showAlert('Password is required');
    }
    if (password.length < 8) {
      return showAlert('Password must be at least 8 characters');
    }

    if (!isAgree) {
      return showAlert('Please agree to the terms and conditions');
    }

    setEmailError('');
    setPasswordError('');

    const body = {
      email,
      password,
      deviceToken: FCMtoken,
    };

    try {
      setLoading(true);
      const response = await Login(body);
      console.log('response', response);

      if (response?.message && !response?.status === 200) {
        showAlert(response.message, 'error');
        setLoading(false);
        return;
      } else if (
        response?.message === 'User not found.' ||
        response?.message === 'Invalid Credentials'
      ) {
        showAlert(response.message, 'error');
        setLoading(false);
        return;
      } else if (response?.message === 'Login successful') {
        const storeTokenId = {
          token: response.token,
          id: response.userData?._id,
        };
        dispatch(loginData(response));
        dispatch(setToken(storeTokenId));
      } else if (response?.message === 'Demo client login successful') {
        const storeTokenId = {
          token: response?.token,
          id: response?.userData?._id,
          demoClient: response?.userData?.isDemoClient,
        };
        dispatch(setGuestToken(storeTokenId));
        dispatch(guestLoginData(response));
      } else {
        showAlert('something went wrong, please try again.', 'error');
        setLoading(false);
      }

      setLoading(false);
    } catch (error) {
      showAlert('Something went wrong. Please try again.', 'error');
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
        message={loginAlert}
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
            <Animated.View
              style={[
                styles.headerImageContainer,
                {
                  transform: [{translateY: headerImageAnim}],
                },
              ]}>
              <LoginHeader
                width={'100%'}
                style={{alignSelf: 'center', marginTop: verticalScale(50)}}
              />
            </Animated.View>

            <View style={{paddingHorizontal: scale(8)}}>
              <Animated.View
                style={[
                  styles.logoContainer,
                  {
                    transform: [
                      {
                        scale: logoAnim.interpolate({
                          inputRange: [0, 1],
                          outputRange: [0.8, 1],
                        }),
                      },
                    ],
                    opacity: logoAnim,
                  },
                ]}>
                <NutriumLogo
                  width={'100%'}
                  height={scale(30)}
                  style={{
                    alignSelf: 'center',
                    marginVertical: verticalScale(25),
                  }}
                />
              </Animated.View>

              <Animated.View
                style={[
                  styles.formContainer,
                  {
                    transform: [{translateY: formAnim}],
                    opacity: formOpacity,
                  },
                ]}>
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
                        name={
                          passwordVisible ? 'eye-off-outline' : 'eye-outline'
                        }
                        color={Color?.primaryColor}
                        size={24}
                      />
                    </TouchableOpacity>
                  </View>
                </CustomShadow>

                <TouchableOpacity
                  style={{alignSelf: 'flex-end'}}
                  onPress={() => handleForgetPassword()}>
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
                    onPress={() => {
                      Keyboard.dismiss();
                      setTimeout(() => {
                        setIsAgree(!isAgree);
                      }, 200);
                    }}>
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
              </Animated.View>

              <View style={{height: verticalScale(100)}} />
            </View>
          </View>

          <Animated.View
            style={[
              styles.fixedButtonContainer,
              {
                transform: [{translateY: buttonAnim}],
                opacity: buttonOpacity,
              },
            ]}>
            <TouchableOpacity
              onPress={() => animateButtonPress(handleLogin)}
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
              onPress={() => animateButtonPress(signInWithGoogle)}
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
          </Animated.View>
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
  headerImageContainer: {
    overflow: 'hidden',
  },
  logoContainer: {
    alignItems: 'center',
  },
  formContainer: {
    flex: 1,
  },
  forgotText: {
    color: Color?.textColor,
    fontSize: scale(12),
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
    paddingHorizontal: scale(8),
    paddingBottom: verticalScale(15),
    paddingTop: verticalScale(10),
    backgroundColor: Color.white,
  },
});

export default LoginScreen;
