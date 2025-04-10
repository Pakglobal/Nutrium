import {
  Alert,
  FlatList,
  Modal,
  SafeAreaView,
  ScrollView,
  StyleSheet,
  Text,
  TextInput,
  TouchableOpacity,
  View,
} from 'react-native';
import React, { useState } from 'react';
import FontAwesome6 from 'react-native-vector-icons/FontAwesome6';
import FontAwesome5 from 'react-native-vector-icons/FontAwesome5';
import Color, { Font, ShadowValues } from '../../../assets/colors/Colors';
import { scale, verticalScale } from 'react-native-size-matters';
import IconStyle, {
  IconPadding,
  LeftIcon,
  RightIcon,
} from '../../../assets/styles/Icon';
import { useNavigation } from '@react-navigation/native';
import LoginHeader from '../../../assets/Images/GuestLogin.svg';
import { Shadow } from 'react-native-shadow-2';
import DateTimePicker from '@react-native-community/datetimepicker';
import GuestFlowHeader from '../../../Components/GuestFlowHeader';
import MaterialIcons from 'react-native-vector-icons/MaterialIcons';
import MaterialCommunityIcons from 'react-native-vector-icons/MaterialCommunityIcons';
import { useDispatch, useSelector } from 'react-redux';
import Ionicons from 'react-native-vector-icons/Ionicons';
import { GuestLOGin } from '../../../Apis/Login/AuthApis';

const GuestLogin = ({ route }) => {
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

  const tokenId = useSelector(state => state?.user?.token);
  const token = tokenId?.token;

  const data = route?.params
  const fullName = firstName + " " + lastName




  const handlePassword = () => {
    setPasswordVisible(!passwordVisible);
  };



  const guestLogin = async () => {
    //  navigation.navigate('GuestLogin')

    if (firstName == '' || lastName == '' || email == '' || password == '') {
      Alert.alert('Please Enter All Deatils')
    }

    const body = {
      firstName: firstName,
      lastName: lastName,
      email: email,
      password: password,
      gender: data?.Gender,
      country: data?.country,
      phoneNumber: data?.number,
      dateOfBirth: data?.dateOfBirth,
      deviceToken: token,
      isDemoClient: true
    }

    try {
      const response = await GuestLOGin(body);

      console.log('response', response)
      if (response?.message == 'Login successful') {
        navigation.navigate('BottomNavigation')
      } else if (response?.message) {
        Alert.alert(response?.message)
      }

    } catch {

    }
  }

  return (
    <SafeAreaView style={{ flex: 1, backgroundColor: Color.white }}>
      <GuestFlowHeader progress={'100%'} />

      <LeftIcon />
      <ScrollView showsVerticalScrollIndicator={false}>
        <LoginHeader style={{ alignSelf: 'center' }} />

        <View
          style={{
            marginHorizontal: scale(16),
            marginVertical: verticalScale(20),
          }}>
          <View style={styles.inputContainer}>
            <Shadow
              distance={ShadowValues.distance}
              startColor={
                firstNameError ? 'rgba(255,0,0,0.3)' : 'rgba(33, 151, 43,0.5)'
              }
              style={{ width: '100%', borderRadius: scale(5) }}>
              <TextInput
                value={firstName}
                placeholder="First Name"
                onChangeText={f => setFirstName(f)}
                placeholderTextColor={Color.textColor}
                style={styles.input}
              />
            </Shadow>
          </View>

          <View style={styles.inputContainer}>
            <Shadow
              distance={ShadowValues.distance}
              startColor={
                lastNameError ? 'rgba(255,0,0,0.3)' : 'rgba(33, 151, 43,0.5)'
              }
              style={{ width: '100%', borderRadius: scale(5) }}>
              <TextInput
                value={lastName}
                placeholder="Last Name"
                onChangeText={l => setLastName(l)}
                placeholderTextColor={Color.textColor}
                style={styles.input}
              />
            </Shadow>
          </View>

          <View style={styles.inputContainer}>
            <Shadow
              distance={ShadowValues.distance}
              startColor={
                emailError ? 'rgba(255,0,0,0.3)' : 'rgba(33, 151, 43,0.5)'
              }
              style={{ width: '100%', borderRadius: scale(5) }}>
              <TextInput
                value={email}
                placeholder="Email"
                onChangeText={e => setEmail(e)}
                placeholderTextColor={Color.textColor}
                style={styles.input}
              />
            </Shadow>
          </View>

          <View style={styles.inputContainer}>
            <Shadow
              distance={ShadowValues.distance}
              startColor={
                passwordError ? 'rgba(255,0,0,0.3)' : 'rgba(33, 151, 43,0.5)'
              }
              style={{ width: '100%', borderRadius: scale(5) }}>
              <TextInput
                value={password}
                placeholder="Password"
                onChangeText={p => setPassword(p)}
                placeholderTextColor={Color.textColor}
                style={[styles.input, { paddingRight: scale(35) }]}
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
        </View>
      </ScrollView>
      <RightIcon onPress={guestLogin} />
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
