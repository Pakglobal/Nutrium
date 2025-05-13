import {
  Alert,
  FlatList,
  Keyboard,
  Modal,
  SafeAreaView,
  ScrollView,
  StyleSheet,
  Text,
  TextInput,
  TouchableOpacity,
  View,
} from 'react-native';
import React, {useEffect, useState} from 'react';
import FontAwesome6 from 'react-native-vector-icons/FontAwesome6';
import FontAwesome5 from 'react-native-vector-icons/FontAwesome5';
import {Color} from '../../../assets/styles/Colors';
import {scale, verticalScale} from 'react-native-size-matters';
import {LeftIcon} from '../../../assets/styles/Icon';
import {useNavigation} from '@react-navigation/native';
import LoginHeader from '../../../assets/Images/GuestLogin.svg';
import {useDispatch, useSelector} from 'react-redux';
import Ionicons from 'react-native-vector-icons/Ionicons';
import {guestLoginData, setGuestToken} from '../../../redux/user';
import {Font} from '../../../assets/styles/Fonts';
import {HandleGuestLOGIN} from '../../../Apis/Login/AuthApis';
import useAndroidBack from '../../../Navigation/useAndroidBack';
import CustomShadow from '../../../Components/CustomShadow';
import CustomLoader from '../../../Components/CustomLoader';
import CustomAlertBox from '../../../Components/CustomAlertBox';
import GuestFlowHeader from '../../../Components/GuestFlowHeader';

const GuestLogin = ({route}) => {
  const dispatch = useDispatch();
  const navigation = useNavigation();

  const [loading, setLoading] = useState(false);
  const [firstName, setFirstName] = useState('');
  const [lastName, setLastName] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [firstNameError, setFirstNameError] = useState('');
  const [lastNameError, setLastNameError] = useState('');
  const [emailError, setEmailError] = useState('');
  const [passwordError, setPasswordError] = useState('');
  const [passwordVisible, setPasswordVisible] = useState(false);
  const [alertVisible, setAlertVisible] = useState(false);
  const [alertMsg, setAlertMsg] = useState('');
  const [alertType, setAlertType] = useState('error');

  useAndroidBack();

  const token = useSelector(state => state?.user?.fcmToken);
  const data = route?.params;

  const showAlert = (message, type = 'error') => {
    setAlertMsg(message);
    setAlertType(type);
    setAlertVisible(true);
  };

  const validateFirstName = value => {
    setFirstName(value);
    if (!value) {
      setFirstNameError('First name is required');
    } else if (value.length < 3) {
      setFirstNameError('First name must be at least 3 characters');
    } else {
      setFirstNameError('');
    }
  };

  const validateLastName = value => {
    setLastName(value);
    if (!value) {
      setLastNameError('Last name is required');
    } else if (value.length < 3) {
      setLastNameError('Last name must be at least 3 characters');
    } else {
      setLastNameError('');
    }
  };

  const validateEmail = value => {
    setEmail(value);
    const emailRegex = /^\w+([\.+]?\w+)*@\w+([\.-]?\w+)*(\.\w{2,})+$/;
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

  const handlePassword = () => {
    setPasswordVisible(!passwordVisible);
  };

  const handleGuestLogin = async () => {
    const emailRegex = /^\w+([\.+]?\w+)*@\w+([\.-]?\w+)*(\.\w{2,})+$/;
    let message = '';

    if (!firstName || firstName.length < 3) {
      message += firstName
        ? 'First name must be at least 3 characters.\n'
        : 'First name is required.\n';
    }

    if (!lastName || lastName.length < 3) {
      message += lastName
        ? 'Last name must be at least 3 characters.\n'
        : 'Last name is required.\n';
    }

    if (!email || !emailRegex.test(email)) {
      message += email ? 'Enter a valid email.\n' : 'Email is required.\n';
    }

    if (!password || password.length < 8) {
      message += password
        ? 'Password must be at least 8 characters.\n'
        : 'Password is required.\n';
    }

    if (message) {
      showAlert(message.trim(), 'error');
      return;
    }

    setFirstNameError('');
    setLastNameError('');
    setEmailError('');
    setPasswordError('');

    try {
      setLoading(true);

      const body = {
        firstName,
        lastName,
        email,
        password,
        goal: data?.goal,
        profession: data?.profession,
        gender: data?.Gender,
        country: data?.country,
        phoneNumber: data?.number,
        dateOfBirth: data?.dateOfBirth,
        deviceToken: token,
        isDemoClient: true,
      };

      const response = await HandleGuestLOGIN(body);

      const storeTokenId = {
        token: response?.data?.token,
        id: response?.data?.userData?._id,
        demoClient: response?.data?.userData?.isDemoClient,
      };

      if (response?.data?.message === 'Signup successful') {
        dispatch(setGuestToken(storeTokenId));
        dispatch(guestLoginData(response?.data));
        setLoading(false);
        showAlert('Signup successful', 'success');
      } else if (response?.data?.message === 'Signin successful') {
        setLoading(false);
        showAlert('User already exists', 'error');
      } else {
        setLoading(false);
        showAlert(response?.message || 'Something went wrong', 'error');
      }
    } catch (err) {
      setLoading(false);
      showAlert('Network error, please try again.', 'error');
    }
  };

  return (
    <SafeAreaView style={{flex: 1, backgroundColor: Color.white}}>
      <CustomAlertBox
        visible={alertVisible}
        type={alertType}
        message={alertMsg}
        closeAlert={() => setAlertVisible(false)}
        onClose={() => setAlertVisible(false)}
      />
      <GuestFlowHeader currentStep={'guestLogin'} />

      <LeftIcon onGoBack={() => navigation.goBack()} />
      <ScrollView
        showsVerticalScrollIndicator={false}
        contentContainerStyle={{flexGrow: 1, paddingBottom: '25%'}}
        keyboardShouldPersistTaps="handled">
        <LoginHeader
          style={{alignSelf: 'center', marginTop: verticalScale(50)}}
        />
        {loading ? (
          <CustomLoader />
        ) : (
          <View
            style={{
              marginHorizontal: scale(16),
              marginVertical: verticalScale(20),
            }}>
            <CustomShadow
              color={firstNameError ? 'rgba(255,0,0,0.3)' : undefined}>
              <View style={styles.shadowView}>
                <TextInput
                  value={firstName}
                  placeholder="First Name"
                  onChangeText={validateFirstName}
                  placeholderTextColor={Color.textColor}
                  style={styles.titleText}
                />
              </View>
            </CustomShadow>

            <CustomShadow
              color={lastNameError ? 'rgba(255,0,0,0.3)' : undefined}>
              <View style={styles.shadowView}>
                <TextInput
                  value={lastName}
                  placeholder="Last Name"
                  onChangeText={validateLastName}
                  placeholderTextColor={Color.textColor}
                  style={styles.titleText}
                />
              </View>
            </CustomShadow>

            <CustomShadow color={emailError ? 'rgba(255,0,0,0.3)' : undefined}>
              <View style={styles.shadowView}>
                <TextInput
                  value={email}
                  placeholder="Email"
                  onChangeText={validateEmail}
                  placeholderTextColor={Color.textColor}
                  style={styles.titleText}
                />
              </View>
            </CustomShadow>

            <CustomShadow
              color={passwordError ? 'rgba(255,0,0,0.3)' : undefined}>
              <View style={styles.shadowView}>
                <TextInput
                  value={password}
                  placeholder="Password"
                  onChangeText={validatePassword}
                  placeholderTextColor={Color.textColor}
                  style={styles.titleText}
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
              </View>
            </CustomShadow>
          </View>
        )}
        <View style={styles.buttonContainer}>
          <TouchableOpacity style={styles.button} onPress={handleGuestLogin}>
            <FontAwesome6 name="arrow-right" size={22} color={Color.white} />
          </TouchableOpacity>
        </View>
      </ScrollView>
    </SafeAreaView>
  );
};

export default GuestLogin;

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
    marginTop: verticalScale(10),
  },
  input: {
    height: verticalScale(38),
    justifyContent: 'center',
    alignItems: 'center',
    marginTop: scale(4),
    borderRadius: scale(5),
    paddingHorizontal: scale(8),
    fontSize: scale(14),
    fontFamily: Font.PoppinsMedium,
    letterSpacing: 1,
    color: Color.textColor,
  },
  eyeIconContainer: {
    position: 'absolute',
    right: scale(8),
    top: scale(10),
  },
  buttonContainer: {
    justifyContent: 'center',
    alignSelf: 'flex-end',
    margin: scale(12),
    padding: scale(4),
    position: 'absolute',
    bottom: scale(0),
    right: scale(0),
  },
  button: {
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: Color.primaryColor,
    borderRadius: scale(25),
    height: scale(32),
    width: scale(32),
  },
  titleText: {
    letterSpacing: 1,
    fontFamily: Font.PoppinsMedium,
    color: Color.textColor,
  },
  shadowView: {
    backgroundColor: Color.white,
    borderRadius: scale(8),
    marginVertical: verticalScale(6),
    paddingHorizontal: scale(5),
  },
});
