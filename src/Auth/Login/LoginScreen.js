import React, {useState} from 'react';
import {
  ActivityIndicator,
  Alert,
  SafeAreaView,
  StyleSheet,
  Text,
  ToastAndroid,
  TouchableOpacity,
  View,
} from 'react-native';
import {scale, verticalScale} from 'react-native-size-matters';
import {useNavigation} from '@react-navigation/native';
import FontAwesome from 'react-native-vector-icons/FontAwesome';
import NutriumLogo from '../../assets/Icon/NutriumLogo.svg';
import NTextInput from '../../Components/NTextInput';
import Color from '../../assets/colors/Colors';
import {useDispatch} from 'react-redux';
import {GoogleLogin, Login} from '../../Apis/Login/AuthApis';
import {
  GoogleSignin,
  GoogleSigninButton,
} from '@react-native-google-signin/google-signin';
import CustomButton from '../../Components/Button';
import Spinner from 'react-native-loading-spinner-overlay';
import {loginData, profileData} from '../../redux/user';
import {GetAdminProfileData} from '../../Apis/AdminScreenApi/ProfileApi';
import Toast from 'react-native-simple-toast';

const LoginScreen = () => {
  const navigation = useNavigation();
  const dispatch = useDispatch();

  const [loading, setLoading] = useState(false);
  const [isAgree, setIsAgree] = useState(false);
  // const [email, setEmail] = useState('val.globalia@gmail.com');
  // const [email, setEmail] = useState('vatsal.r.lakhani2626+88@gmail.com');
  // const [password, setPassword] = useState('password123#');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [emailError, setEmailError] = useState('');
  const [passwordError, setPasswordError] = useState('');

  const showToast = message => {
    Toast.show(message, Toast.LONG, Toast.BOTTOM);
  };

  if (loading) {
    return (
      <View
        style={{
          flex: 1,
          justifyContent: 'center',
          alignItems: 'center',
        }}>
        <ActivityIndicator size="large" color={Color.primaryGreen} />
      </View>
    );
  }

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
    if (emailError || passwordError) {
      Alert.alert('Error', 'Please correct the errors before submitting.');
      return;
    }

    const body = {
      email: email,
      password: password,
    };
    try {
      setLoading(true);
      const response = await Login(body);

      if (response?.message == 'Login successful' || response?.token) {
        dispatch(loginData(response));

        if (response) {
          const token = response?.token;
          const getProfileData = await GetAdminProfileData(token);

          dispatch(profileData(getProfileData));
          setLoading(false);
        }
        setLoading(false);
      } else {
        showToast(response?.message);
        setLoading(false);
      }
    } catch (error) {
      showToast(error);
    } finally {
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
      };
      const response = await GoogleLogin(body);

      if (response?.message == 'Login successfully' || response?.token) {
        dispatch(loginData(response));

        if (response) {
          const token = response?.token;
          const getProfileData = await GetAdminProfileData(token);
          dispatch(profileData(getProfileData));
          setLoading(false);
        }
        setLoading(false);
      } else {
        showToast(response?.message);
        setLoading(false);
      }
    } catch (error) {
      showToast(error);
    } finally {
      setLoading(false);
    }
  };

  return (
    <SafeAreaView style={styles.container}>
      <View style={{marginHorizontal: verticalScale(20)}}>
        <View style={styles.logoContainer}>
          <NutriumLogo height={scale(71)} width={scale(290)} />
        </View>

        <View>
          <NTextInput
            onChangeText={validateEmail}
            values={email}
            placeholder={'Email'}
            errorMessage={emailError}
            inputPlaceHolder={'Enter email'}
            textInputStyle={{
              borderColor: emailError ? 'red' : Color.borderColor,
            }}
          />
          <NTextInput
            onChangeText={validatePassword}
            placeholder={'Password'}
            values={password}
            eyeIcon={true}
            textContainerStyle={{marginTop: verticalScale(15)}}
            errorMessage={passwordError}
            inputPlaceHolder={'Enter password'}
            textInputStyle={{
              borderColor: passwordError ? 'red' : Color.borderColor,
            }}
          />
        </View>

        <View>
          <Text style={styles.forgotText}>Forgot your Password?</Text>
          <View style={styles.privacyView}>
            <TouchableOpacity
              style={[
                styles.checBoxView,
                {borderColor: isAgree ? Color.secondary : 'grey'},
              ]}
              onPress={() => setIsAgree(!isAgree)}>
              {isAgree ? (
                <FontAwesome
                  name="check"
                  color={Color.secondary}
                  size={verticalScale(16)}
                />
              ) : null}
            </TouchableOpacity>
            <Text style={styles.privacyText}>
              I accept the{' '}
              <Text
                onPress={() => console.log('Conditions')}
                style={{color: Color.secondary}}>
                Terms and Conditions of Use
              </Text>{' '}
              and the{' '}
              <Text
                onPress={() => console.log('Privacy')}
                style={{color: Color.secondary}}>
                Privacy Policy
              </Text>{' '}
              of Nutrium
            </Text>
            <View />
          </View>
        </View>

        <CustomButton
          onPress={handleLogin}
          disabled={!isAgree}
          backgroundColor={isAgree ? Color.secondary : Color.borderColor}
          txtColor={isAgree ? Color.primary : Color.txt}
          text="Sign In"
          marginTop={verticalScale(40)}
          iconColor={isAgree ? Color.primary : Color.txt}
        />

        <View>
          {/* <TouchableOpacity
            activeOpacity={0.7}
            onPress={() => {
              navigation.navigate('registrationType');
            }}>
            <Text style={styles.accountTxt}>I don't have an account</Text>
          </TouchableOpacity> */}
          <View style={styles.orContainer}>
            <View style={styles.devider}></View>
            <Text style={styles.textStyle}> or </Text>
            <View style={styles.devider}></View>
          </View>
        </View>

        <View style={{alignItems: 'center', marginTop: verticalScale(10)}}>
          <GoogleSigninButton
            size={GoogleSigninButton.Size.Wide}
            color={GoogleSigninButton.Color.Dark}
            onPress={signInWithGoogle}
            disabled={false}
            style={styles.signInButton}
          />
        </View>
      </View>
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  logoContainer: {
    marginVertical: verticalScale(50),
    justifyContent: 'center',
    alignItems: 'center',
  },
  forgotText: {
    marginTop: verticalScale(25),
    fontSize: verticalScale(12),
    fontWeight: '700',
    color: Color.txt,
  },
  privacyView: {
    flexDirection: 'row',
    marginTop: verticalScale(15),
    alignItems: 'center',
  },
  checBoxView: {
    width: 25,
    height: 25,
    borderWidth: 3,
    borderRadius: 5,
    marginRight: verticalScale(6),
    alignItems: 'center',
    justifyContent: 'center',
  },
  privacyText: {
    color: Color.txt,
    fontWeight: '600',
    width: '95%',
  },
  devider: {
    borderWidth: 1,
    width: '40%',
    borderColor: Color.borderColor,
  },
  textStyle: {
    fontWeight: '700',
    color: Color.txt,
    fontSize: verticalScale(12),
  },
  orContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    alignSelf: 'center',
    marginTop: verticalScale(25),
  },
  accountTxt: {
    marginTop: verticalScale(25),
    fontSize: verticalScale(12),
    fontWeight: '700',
    color: Color.secondary,
    alignSelf: 'center',
  },
  signInButton: {
    // height: scale(60),
    alignItems: 'center',
    justifyContent: 'center',
  },
});

export default LoginScreen;
