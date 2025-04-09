import React, {useState} from 'react';
import {
  ActivityIndicator,
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
import {scale, verticalScale} from 'react-native-size-matters';
import AntDesign from 'react-native-vector-icons/AntDesign';
import NutriumLogo from '../../assets/Images/logoGreen.svg';
import Color, {Font, ShadowValues} from '../../assets/colors/Colors';
import {useDispatch, useSelector} from 'react-redux';
import {GoogleLogin, Login} from '../../Apis/Login/AuthApis';
import {
  GoogleSignin,
  GoogleSigninButton,
} from '@react-native-google-signin/google-signin';
import {
  loginData,
  profileData,
  setGuestMode,
  setIsGuest,
  setToken,
} from '../../redux/user';
import {GetAdminProfileData} from '../../Apis/AdminScreenApi/ProfileApi';
import Ionicons from 'react-native-vector-icons/Ionicons';
import {useNavigation} from '@react-navigation/native';
import CustomAlert from '../../Components/CustomAlert';
import LoginHeader from '../../assets/Images/loginHeader.svg';
import IconStyle from '../../assets/styles/Icon';
import {Shadow} from 'react-native-shadow-2';
import Google from '../../assets/Icon/google.svg';

const screenHeight = Dimensions.get('window').height;

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
  const [login, setLogin] = useState([]);

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

    let emailError = '';
    let passwordError = '';

    if (!email) {
      emailError = 'Email is required';
    }
    if (!password) {
      passwordError = 'Password is required';
    }

    if (email && !emailRegex.test(email)) {
      emailError = 'Enter a valid email';
    }
    if (password && password.length < 8) {
      passwordError = 'Password must be at least 8 characters';
    }

    setEmailError(emailError);
    setPasswordError(passwordError);

    if (emailError || passwordError) {
      return;
    }

    const body = {
      email: email,
      password: password,
      deviceToken: FCMtoken,
    };

    try {
      setLoading(true);
      const response = await Login(body);
      
      setLogin(response);

      const storeTokenId = {
        token: response?.token,
        id: response?.userData?._id,
      };

      if (response?.message == 'Login successful' || response?.token) {
        dispatch(loginData(response));
        dispatch(setToken(storeTokenId));

        if (response) {
          const token = response?.token;
          const getProfileData = await GetAdminProfileData(token);

          dispatch(profileData(getProfileData));
          setLoading(false);
        }
        setLoading(false);
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
      setLogin(response);

      const storeTokenId = {
        token: response?.token,
        id: response?.user?._id,
      };

      if (response?.message == 'Login successfully' || response?.token) {
        dispatch(loginData(response));
        dispatch(setToken(storeTokenId));

        if (response) {
          const token = response?.token;
          const getProfileData = await GetAdminProfileData(token);

          dispatch(profileData(getProfileData));
        }
      } else {
        setAlertVisible(true);
        setLoading(false);
      }
      setLoading(false);
    } catch (error) {
      setLoading(false);
    }
  };

  return (
    <SafeAreaView style={styles.container}>
      <CustomAlert
        visible={alertVisible}
        message={login.message}
        onClose={() => setAlertVisible(false)}
        singleButton={true}
      />

      <TouchableOpacity
        onPress={() => navigation.goBack()}
        style={{
          height: '7%',
          justifyContent: 'center',
          paddingHorizontal: scale(16),
          alignSelf: 'flex-start'
        }}>
        <AntDesign
          name="arrowleft"
          size={IconStyle.headerIconSize}
          color={Color.primaryColor}
        />
      </TouchableOpacity>

      <ScrollView showsVerticalScrollIndicator={false} style={{flex: 1}}>
        <View
          style={{
            height: '40%',
            width: '100%',
            alignItems: 'center',
            justifyContent: 'center',
          }}>
          <LoginHeader />
        </View>

        <View
          style={{
            height: '10%',
            width: '40%',
            alignSelf: 'center',
          }}>
          <NutriumLogo height={'100%'} width={'100%'} />
        </View>

        <View
          style={{
            height: '30%',
            marginHorizontal: scale(16),
          }}>
          <View style={styles.inputContainer}>
            <Shadow
              distance={ShadowValues.distance}
              startColor={emailError ? 'rgba(255,0,0,0.3)' : Color.primaryColor}
              style={{width: '100%', borderRadius: scale(5)}}>
              <TextInput
                value={email}
                placeholder="Username"
                onChangeText={validateEmail}
                placeholderTextColor={Color.textColor}
                style={styles.input}
              />
            </Shadow>
          </View>
          {/* {emailError ? (
            <Text style={styles.errorMessage}>{emailError}</Text>
          ) : null} */}

          <View style={styles.inputContainer}>
            <Shadow
              distance={ShadowValues.distance}
              startColor={
                passwordError ? 'rgba(255,0,0,0.3)' : Color.primaryColor
              }
              style={{width: '100%', borderRadius: scale(5)}}>
              <TextInput
                value={password}
                placeholder="Password"
                onChangeText={validatePassword}
                placeholderTextColor={Color.textColor}
                style={[styles.input, {paddingRight: scale(35)}]}
                secureTextEntry={!passwordVisible}
              />
              <TouchableOpacity
                onPress={handlePassword}
                style={styles.eyeIconContainer}>
                <Ionicons
                  name={passwordVisible ? 'eye-off-outline' : 'eye-outline'}
                  color={Color?.primaryColor}
                  size={24}
                />
              </TouchableOpacity>
            </Shadow>
          </View>
          {/* {passwordError ? (
            <Text style={styles.errorMessage}>{passwordError}</Text>
          ) : null} */}

          <TouchableOpacity>
            <Text style={styles.forgotText}>Forgot Password ?</Text>
          </TouchableOpacity>

          <View style={styles.termsContainer}>
            <TouchableOpacity
              style={[
                styles.checkbox,
                {backgroundColor: isAgree ? Color.primaryColor : Color.white},
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
            height: '20%',
            justifyContent: 'center',
          }}>
          <TouchableOpacity
            disabled={!isAgree}
            onPress={handleLogin}
            style={[styles.button, {backgroundColor: Color.primaryColor}]}>
            {loading ? (
              <ActivityIndicator size="small" color={Color.white} />
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
                flexDirection: 'row',
                alignItems: 'center',
              },
            ]}>
            <View style={{marginHorizontal: scale(8)}}>
              <Google />
            </View>
            <Text style={[styles.buttonText, {color: Color.primaryColor}]}>
              Continue With Google
            </Text>
          </TouchableOpacity>
        </View>
      </ScrollView>
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: Color.white,
  },
  scrollView: {
    paddingHorizontal: scale(16),
  },
  inputContainer: {
    position: 'relative',
    width: '100%',
    marginTop: verticalScale(15),
  },
  input: {
    height: verticalScale(38),
    justifyContent: 'center',
    alignItems: 'center',
    marginTop: scale(4),
    borderRadius: scale(5),
    paddingHorizontal: scale(8),
    fontSize: scale(14),
    fontWeight: '500',
    fontFamily: Font.Poppins,
    letterSpacing: 1,
    color: Color.textColor,
  },
  eyeIconContainer: {
    position: 'absolute',
    right: scale(8),
    top: scale(10),
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
    marginTop: verticalScale(10),
    alignSelf: 'flex-end',
    letterSpacing: 1,
    fontFamily: Font.Poppins,
  },
  termsContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    marginTop: verticalScale(15),
    marginBottom: verticalScale(10),
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
    fontSize: scale(16),
    fontWeight: '600',
    fontFamily: Font.Poppins,
    textAlign: 'center',
    letterSpacing: 1,
    marginTop: verticalScale(2),
  },
  button: {
    borderColor: Color.primaryColor,
    marginVertical: verticalScale(5),
    borderRadius: scale(8),
    height: verticalScale(42),
    alignItems: 'center',
    justifyContent: 'center',
    marginHorizontal: scale(16),
  },
});

export default LoginScreen;
