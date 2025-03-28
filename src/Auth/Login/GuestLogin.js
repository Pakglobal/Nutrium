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
} from 'react-native';
import {scale, verticalScale} from 'react-native-size-matters';
import AntDesign from 'react-native-vector-icons/AntDesign';
import NutriumLogo from '../../assets/Icon/NutriumLogo.svg';
import Color from '../../assets/colors/Colors';
import Toast from 'react-native-simple-toast';
import Ionicons from 'react-native-vector-icons/Ionicons';
import {CommonActions, useNavigation} from '@react-navigation/native';
import {useDispatch} from 'react-redux';
import {guestLoginData} from '../../redux/user';

const GuestLogin = () => {
  const navigation = useNavigation();
  const dispatch = useDispatch();

  const [loading, setLoading] = useState(false);
  const [isAgree, setIsAgree] = useState(false);
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [emailError, setEmailError] = useState('');
  const [passwordError, setPasswordError] = useState('');
  const [nameError, setNameError] = useState('');
  const [passwordVisible, setPasswordVisible] = useState(false);

  const handlePassword = () => {
    setPasswordVisible(!passwordVisible);
  };

  const validateName = value => {
    setName(value);
    if (!value) {
      setNameError('Name is required');
    } else if (value.length < 3) {
      setNameError('Name must be at least 3 characters');
    } else {
      setNameError('');
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

  const handleGuestLogin = async () => {
    const emailRegex = /^\w+([\.+]?\w+)*@\w+([\.-]?\w+)*(\.\w{2,})+$/;

    let emailError = '';
    let passwordError = '';
    let nameError = '';

    if (!email) {
      emailError = 'Email is required';
    }
    if (!password) {
      passwordError = 'Password is required';
    }
    if (!name) {
      nameError = 'Name is required';
    }

    if (email && !emailRegex.test(email)) {
      emailError = 'Enter a valid email';
    }
    if (password && password.length < 8) {
      passwordError = 'Password must be at least 8 characters';
    }
    if (name && name.length < 3) {
      nameError = 'Name must be at least 8 characters';
    }

    setEmailError(emailError);
    setPasswordError(passwordError);
    setNameError(nameError);

    if (emailError || passwordError || nameError) {
      return;
    }

    const body = {
      email: email,
      password: password,
      name: name,
    };

    dispatch(guestLoginData(body));
    navigation.navigate('information');
  };

  return (
    <SafeAreaView style={styles.container}>
      <ScrollView
        style={styles.scrollView}
        showsVerticalScrollIndicator={false}>
        <TouchableOpacity
          style={{marginTop: verticalScale(15)}}
          onPress={() => navigation.goBack()}>
          <AntDesign
            name="arrowleft"
            color={Color.black}
            size={verticalScale(18)}
          />
        </TouchableOpacity>
        <View style={styles.logoContainer}>
          <NutriumLogo
            style={styles.logo}
            width={scale(280)}
            height={verticalScale(50)}
          />
        </View>

        <Text style={styles.inputLabel}>Name</Text>
        <View style={styles.inputContainer}>
          <TextInput
            value={name}
            placeholder="Enter name"
            onChangeText={validateName}
            placeholderTextColor={Color.gray}
            style={[
              styles.input,
              {borderColor: !name ? 'black' : nameError ? 'red' : 'green'},
            ]}
          />
        </View>
        {nameError ? (
          <Text style={styles.errorMessage}>{nameError}</Text>
        ) : null}

        <Text style={styles.inputLabel}>Email</Text>
        <View style={styles.inputContainer}>
          <TextInput
            value={email}
            placeholder="Enter email"
            onChangeText={validateEmail}
            placeholderTextColor={Color.gray}
            style={[
              styles.input,
              {borderColor: !email ? 'black' : emailError ? 'red' : 'green'},
            ]}
          />
        </View>
        {emailError ? (
          <Text style={styles.errorMessage}>{emailError}</Text>
        ) : null}

        <Text style={styles.inputLabel}>Password</Text>
        <View style={styles.inputContainer}>
          <TextInput
            value={password}
            placeholder="Enter password"
            onChangeText={validatePassword}
            placeholderTextColor={Color.gray}
            style={[
              styles.input,
              {
                borderColor: !password
                  ? 'black'
                  : passwordError
                  ? 'red'
                  : 'green',
              },
            ]}
            secureTextEntry={!passwordVisible}
          />
          <TouchableOpacity
            onPress={handlePassword}
            style={styles.eyeIconContainer}>
            <Ionicons
              name={passwordVisible ? 'eye-off-outline' : 'eye-outline'}
              color="#777"
              size={24}
            />
          </TouchableOpacity>
        </View>
        {passwordError ? (
          <Text style={styles.errorMessage}>{passwordError}</Text>
        ) : null}

        <TouchableOpacity>
          <Text style={styles.forgotText}>Forgot your password?</Text>
        </TouchableOpacity>

        <View style={styles.termsContainer}>
          <TouchableOpacity
            style={[
              styles.checkbox,
              {borderColor: isAgree ? Color.secondary : Color.black},
              {backgroundColor: isAgree ? '#FFFFFF' : '#FFFFFF'},
            ]}
            onPress={() => setIsAgree(!isAgree)}>
            {isAgree && (
              <View style={styles.checkedBox}>
                <AntDesign name="check" color={Color.secondary} size={16} />
              </View>
            )}
          </TouchableOpacity>
          <Text style={styles.termsText}>
            I accept the{' '}
            <Text style={styles.highlightedText}>
              Terms and Conditions of Use
            </Text>{' '}
            and the <Text style={styles.highlightedText}>Privacy Policy</Text>{' '}
            of Nutrium.
          </Text>
        </View>

        <TouchableOpacity
          disabled={!isAgree}
          onPress={handleGuestLogin}
          style={[
            styles.signInButton,
            {backgroundColor: isAgree ? Color.secondary : '#E0E0E0'},
          ]}>
          {loading ? (
            <ActivityIndicator size="small" color={Color.primary} />
          ) : (
            <View style={{flexDirection: 'row', alignItems: 'center'}}>
              <Text
                style={[
                  styles.signInText,
                  {color: isAgree ? '#FFFFFF' : '#9E9E9E'},
                ]}>
                Next
              </Text>
              <AntDesign
                name="arrowright"
                color={isAgree ? '#FFFFFF' : '#9E9E9E'}
                size={16}
                style={{marginLeft: scale(8)}}
              />
            </View>
          )}
        </TouchableOpacity>
      </ScrollView>
    </SafeAreaView>
  );
};

export default GuestLogin;

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: Color.primary,
  },
  scrollView: {
    paddingHorizontal: scale(16),
  },
  logoContainer: {
    alignItems: 'center',
    justifyContent: 'center',
    marginVertical: verticalScale(30),
  },
  inputLabel: {
    fontSize: scale(14),
    color: Color.black,
    marginBottom: verticalScale(7),
    marginTop: verticalScale(15),
  },
  inputContainer: {
    position: 'relative',
    width: '100%',
  },
  input: {
    height: verticalScale(35),
    borderWidth: 1,
    borderColor: '#E0E0E0',
    borderRadius: scale(12),
    paddingHorizontal: scale(16),
    fontSize: scale(14),
    color: Color.gray,
    width: '100%',
  },
  eyeIconContainer: {
    position: 'absolute',
    right: scale(16),
    top: scale(8),
  },
  errorMessage: {
    color: '#F44336',
    fontSize: scale(13),
    marginTop: verticalScale(4),
  },
  forgotText: {
    color: '#757575',
    fontSize: scale(13),
    fontWeight: '600',
    marginTop: verticalScale(22),
  },
  termsContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    marginTop: verticalScale(22),
  },
  checkbox: {
    width: scale(22),
    height: scale(22),
    borderWidth: 1,
    borderRadius: scale(4),
    marginRight: scale(11),
    alignItems: 'center',
    justifyContent: 'center',
  },
  checkedBox: {
    alignItems: 'center',
    justifyContent: 'center',
  },
  termsText: {
    flex: 1,
    color: Color.black,
    fontSize: scale(13),
    lineHeight: verticalScale(18),
  },
  highlightedText: {
    color: Color.secondary,
    fontWeight: '600',
  },
  signInButton: {
    flexDirection: 'row',
    height: verticalScale(38),
    borderRadius: scale(24),
    justifyContent: 'center',
    alignItems: 'center',
    marginTop: verticalScale(38),
    marginBottom: verticalScale(20),
  },
  signInText: {
    fontSize: scale(15),
    fontWeight: '600',
  },
  noAccountText: {
    color: Color.secondary,
    fontSize: scale(13),
    fontWeight: '600',
    textAlign: 'center',
    marginTop: verticalScale(22),
  },
  orContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    marginVertical: verticalScale(22),
  },
  divider: {
    flex: 1,
    height: 1,
    backgroundColor: '#E0E0E0',
  },
  orText: {
    color: '#757575',
    paddingHorizontal: scale(15),
    fontWeight: '600',
  },
  googleButton: {
    flexDirection: 'row',
    height: verticalScale(38),
    borderRadius: scale(24),
    borderWidth: 1,
    borderColor: '#E0E0E0',
    justifyContent: 'center',
    alignItems: 'center',
    marginBottom: verticalScale(48),
  },
  googleIcon: {
    width: scale(22),
    height: scale(22),
    marginRight: 8,
  },
  googleText: {
    color: '#757575',
    fontSize: scale(14),
    fontWeight: '600',
  },
});
