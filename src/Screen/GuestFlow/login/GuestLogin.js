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
import IconStyle, {
  IconPadding,
  LeftIcon,
  RightIcon,
} from '../../../assets/styles/Icon';
import {useNavigation} from '@react-navigation/native';
import LoginHeader from '../../../assets/Images/GuestLogin.svg';
import {Shadow} from 'react-native-shadow-2';
import DateTimePicker from '@react-native-community/datetimepicker';
import GuestFlowHeader from '../../../Components/GuestFlowHeader';
import MaterialIcons from 'react-native-vector-icons/MaterialIcons';
import MaterialCommunityIcons from 'react-native-vector-icons/MaterialCommunityIcons';
import {useDispatch, useSelector} from 'react-redux';
import Ionicons from 'react-native-vector-icons/Ionicons';
import {guestLoginData, setIsGuest} from '../../../redux/user';
import {Font} from '../../../assets/styles/Fonts';
import {ShadowValues} from '../../../assets/styles/Shadow';
import {Progress} from '../../../assets/styles/Progress';
import {GuestLOGin} from '../../../Apis/Login/AuthApis';
import useKeyboardHandler from '../../../Components/useKeyboardHandler';
import useAndroidBack from '../../../Navigation/useAndroidBack';

const GuestLogin = ({route}) => {
  const dispatch = useDispatch();
  const navigation = useNavigation();

  const [loading, setLoading] = useState(false);
  const [isAgree, setIsAgree] = useState(false);
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
  const [login, setLogin] = useState([]);
  const [keyboardVisible, setKeyboardVisible] = useState(false);

  useKeyboardHandler();

  useAndroidBack();

  const token = useSelector(state => state?.user?.fcmToken);

  const data = route?.params

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

  // useEffect(() => {
  //   const keyboardDidShowListener = Keyboard.addListener(
  //     'keyboardDidShow',
  //     () => {
  //       setKeyboardVisible(true);
  //     },
  //   );
  //   const keyboardDidHideListener = Keyboard.addListener(
  //     'keyboardDidHide',
  //     () => {
  //       setKeyboardVisible(false);
  //     },
  //   );

  //   return () => {
  //     keyboardDidShowListener.remove();
  //     keyboardDidHideListener.remove();
  //   };
  // }, []);


  const handlePassword = () => {
    setPasswordVisible(!passwordVisible);
  };

  const handleGuestLogin = async () => {
    const emailRegex = /^\w+([\.+]?\w+)*@\w+([\.-]?\w+)*(\.\w\w+)+$/;

    let emailError = '';
    let passwordError = '';
    let firstNameError = '';
    let lastNameError = '';

    if (!email) {
      emailError = 'Email is required';
    }
    if (!password) {
      passwordError = 'Password is required';
    }
    if (!firstName) {
      firstNameError = 'Name is required';
    }
    if (!lastName) {
      lastNameError = 'Name is required';
    }

    if (email && !emailRegex.test(email)) {
      emailError = 'Enter a valid email';
    }
    if (password && password.length < 8) {
      passwordError = 'Password must be at least 8 characters';
    }
    if (firstName && firstName.length < 3) {
      firstNameError = 'First name must be at least 3 characters';
    }
    if (lastName && lastName.length < 3) {
      lastNameError = 'First name must be at least 3 characters';
    }

    setEmailError(emailError);
    setPasswordError(passwordError);
    setFirstNameError(firstNameError);
    setLastNameError(lastNameError);

    if (emailError || passwordError || firstNameError || lastNameError) {
      Alert.alert('Error', 'Please solve the error');
      return;
    }

    const body = {
      firstName: firstName,
      lastName: lastName,
      email: email,
      password: password,
      goal: data?.goal,
      profession: data?.profession,
      gender: data?.Gender,
      country: data?.country,
      phoneNumber: data?.number,
      dateOfBirth: data?.dateOfBirth,
      deviceToken: token,
      isDemoClient: true,
    };
    try {
      const response = await GuestLOGin(body);
      if (response?.data?.message == 'Signup successful') {
        navigation.navigate('BottomNavigation')
        // dispatch(guestLoginData(guestData));
      } else if (response?.message) {
        Alert.alert(response?.message);
      }
    } catch {}
  };

  useEffect(() => {
    const keyboardDidShowListener = Keyboard.addListener(
      'keyboardDidShow',
      () => {
        setKeyboardVisible(true);
      },
    );
    const keyboardDidHideListener = Keyboard.addListener(
      'keyboardDidHide',
      () => {
        setKeyboardVisible(false);
      },
    );

    return () => {
      keyboardDidShowListener.remove();
      keyboardDidHideListener.remove();
    };
  }, []);

  return (
    <SafeAreaView style={styles.container}>
      <GuestFlowHeader progress={Progress.guestLogin} />
      <LeftIcon onGoBack={() => navigation.goBack()} />

      <ScrollView
        showsVerticalScrollIndicator={false}
        style={{}}
        contentContainerStyle={{paddingBottom: '31%'}}
        keyboardShouldPersistTaps="handled">
        <LoginHeader
          style={{alignSelf: 'center', marginTop: verticalScale(50)}}
        />

        <View
          style={{
            marginHorizontal: scale(16),
            marginVertical: verticalScale(20),
          }}>
          <Shadow
            distance={ShadowValues.blackShadowDistance}
            startColor={
              firstNameError ? 'rgba(255,0,0,0.3)' : Color.primaryColor
            }
            style={{
              width: '100%',
              borderRadius: scale(5),
              marginBottom: verticalScale(10),
              paddingHorizontal: scale(5),
            }}>
            <TextInput
              value={firstName}
              placeholder="First Name"
              onChangeText={validateFirstName}
              placeholderTextColor={Color.textColor}
              style={styles.titleText}
            />
          </Shadow>

          <Shadow
            distance={ShadowValues.blackShadowDistance}
            startColor={
              lastNameError ? 'rgba(255,0,0,0.3)' : Color.primaryColor
            }
            style={{
              width: '100%',
              borderRadius: scale(5),
              marginBottom: verticalScale(10),
              paddingHorizontal: scale(5),
            }}>
            <TextInput
              value={lastName}
              placeholder="Last Name"
              onChangeText={validateLastName}
              placeholderTextColor={Color.textColor}
              style={styles.titleText}
            />
          </Shadow>

          <Shadow
            distance={ShadowValues.blackShadowDistance}
            startColor={emailError ? 'rgba(255,0,0,0.3)' : Color.primaryColor}
            style={{
              width: '100%',
              borderRadius: scale(5),
              marginBottom: verticalScale(10),
              paddingHorizontal: scale(5),
            }}>
            <TextInput
              value={email}
              placeholder="Email"
              onChangeText={validateEmail}
              placeholderTextColor={Color.textColor}
              style={styles.titleText}
            />
          </Shadow>

          <Shadow
            distance={ShadowValues.blackShadowDistance}
            startColor={
              passwordError ? 'rgba(255,0,0,0.3)' : Color.primaryColor
            }
            style={{
              width: '100%',
              borderRadius: scale(5),
              marginBottom: verticalScale(10),
              paddingHorizontal: scale(5),
            }}>
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
          </Shadow>
        </View>

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
    fontWeight: '500',
    letterSpacing: 1,
    fontFamily: Font.PoppinsMedium,
    color: Color.textColor,
  },
});
