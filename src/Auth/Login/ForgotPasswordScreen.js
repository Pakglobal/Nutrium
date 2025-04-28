
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
import React, {  useState } from 'react';
import { useNavigation } from '@react-navigation/native';
import { scale, verticalScale } from 'react-native-size-matters';
import { Color } from '../../assets/styles/Colors';
import { Font } from '../../assets/styles/Fonts';
import { LeftIcon } from '../../assets/styles/Icon';
import Header from '../../assets/Images/forgotPassword.svg';
import CustomShadow from '../../Components/CustomShadow';
import { ForgotPasswordApi } from '../../Apis/Login/AuthApis';
import CustomAlertBox from '../../Components/CustomAlertBox';

const ForgotPasswordScreen = ({ route }) => {
  const navigation = useNavigation();
  const [email, setEmail] = useState('');
  const [loading, setLoading] = useState(false);


  const [alertVisible, setAlertVisible] = useState(false);
  const [alertType, setAlertType] = useState('success');
  const [alertMessageText, setAlertMessageText] = useState('');

  const handleSubmit = async () => {
    Keyboard.dismiss();

    if (!email) {
      setAlertType('warning');
      setAlertMessageText('Email is required.');
      setAlertVisible(true);
      return;
    }

    if (!email.includes('@')) {
      setAlertType('warning');
      setAlertMessageText('Please enter a valid email address.');
      setAlertVisible(true);
      return;
    }

    const body = { email };

    try {
      setLoading(true);

      const response = await ForgotPasswordApi(body);

      const successMsg = 'Password reset email sent.';

      if (response?.message?.includes(successMsg)) {
        setAlertType('success');
        setAlertMessageText(successMsg);
        setAlertVisible(true);
      } else {
        setAlertType('error');
        setAlertMessageText(response?.message || 'Failed to send reset email.');
        setAlertVisible(true);
      }
    } catch (error) {
      setAlertType('error');
      setAlertMessageText('Something went wrong. Please try again later.');
      setAlertVisible(true);
    } finally {
      setLoading(false);
    }
  };

  const alertMessage = () => alertMessageText;

  return (
    <SafeAreaView style={styles.container}>
      <CustomAlertBox
        visible={alertVisible}
        type={alertType}
        message={alertMessage()}
        closeAlert={() => setAlertVisible(false)}
        onClose={() => {
          setAlertVisible(false);
          if (alertType === 'success') {
            const encodedEmail = encodeURIComponent(email);
            Linking.openURL(
              `https://nutrium-front-end-ci66-git-feature-val-rahulbodaras-projects.vercel.app/accounts/clientPassword/resetPassword?email=${encodedEmail}`
            );
            navigation.navigate('loginScreen');
          }
        }}
      />

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