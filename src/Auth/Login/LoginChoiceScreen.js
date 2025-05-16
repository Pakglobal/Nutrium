import {
  SafeAreaView,
  StyleSheet,
  Text,
  TouchableOpacity,
  View,
} from 'react-native';
import React from 'react';
import HeaderImage from '../../assets/Images/loginChoiceHeader.svg';
import NutriumLogo from '../../assets/Images/logoGreen.svg';
import {Color} from '../../assets/styles/Colors';
import {scale, verticalScale} from 'react-native-size-matters';
import {useNavigation} from '@react-navigation/native';
import {useDispatch} from 'react-redux';
import {Font} from '../../assets/styles/Fonts';

const LoginChoiceScreen = () => {
  const navigation = useNavigation();

  return (
    <SafeAreaView style={{flex: 1, backgroundColor: Color.white}}>
      <HeaderImage
        width="100%"
        height="56%"
        preserveAspectRatio="xMidYMax slice"
      />

      <View
        style={{
          height: verticalScale(31),
          width: scale(155),
          alignSelf: 'center',
          marginTop: verticalScale(24),
          marginBottom: verticalScale(24),
        }}>
        <NutriumLogo height={'100%'} width={'100%'} />
      </View>

      <View style={{paddingHorizontal: scale(16)}}>
        <Text style={styles.text}>
          Nutrium provides personalized meal plans and diet tracking for a
          healthier lifestyle.
        </Text>
      </View>

      <View style={styles.fixedButtonContainer}>
        <TouchableOpacity
          onPress={() => navigation.navigate('loginScreen')}
          style={[styles.button, {backgroundColor: Color.primaryColor}]}>
          <Text style={[styles.buttonText, {color: Color.white}]}>Login</Text>
        </TouchableOpacity>

        <TouchableOpacity
          onPress={() => {
            // dispatch(setGuestMode(true))
            navigation.navigate('GuestFlow');
          }}
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
          <Text
            style={[
              styles.buttonText,
              {color: Color.primaryColor, marginHorizontal: scale(8)},
            ]}>
            Continue As Guest
          </Text>
        </TouchableOpacity>
      </View>
    </SafeAreaView>
  );
};

export default LoginChoiceScreen;

const styles = StyleSheet.create({
  text: {
    fontSize: scale(14),
    letterSpacing: 1,
    color: Color.textColor,
    fontFamily: Font.Poppins,
    textAlign: 'center',
    lineHeight: scale(22),
  },
  button: {
    borderColor: Color.primaryColor,
    borderRadius: scale(8),
    height: verticalScale(35),
    alignItems: 'center',
    justifyContent: 'center',
  },
  buttonText: {
    fontSize: scale(14),
    fontFamily: Font.PoppinsMedium,
    textAlign: 'center',
    letterSpacing: 1,
    marginTop: verticalScale(2),
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
