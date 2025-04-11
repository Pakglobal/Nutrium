import {StyleSheet, Text, TouchableOpacity, View} from 'react-native';
import React from 'react';
import HeaderImage from '../../assets/Images/loginChoiceHeader.svg';
import NutriumLogo from '../../assets/Images/logoGreen.svg';
import {Color} from '../../assets/styles/Colors';
import {scale, verticalScale} from 'react-native-size-matters';
import {useNavigation} from '@react-navigation/native';
import {useDispatch} from 'react-redux';
import {setGuestMode} from '../../redux/user';
import { Font } from '../../assets/styles/Fonts';

const LoginChoiceScreen = () => {
  const navigation = useNavigation();
  const dispatch = useDispatch();

  return (
    <View style={{flex: 1, backgroundColor: Color.white}}>
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

      <View style={{paddingHorizontal: scale(22)}}>
        <Text style={styles.text}>
          Nutrium provides personalized meal plans and diet tracking for a healthier lifestyle.
        </Text>
      </View>

      <View
        style={{
          justifyContent: 'center',
          bottom: verticalScale(25),
          position: 'absolute',
          width: '100%',
          paddingHorizontal: scale(22),
        }}>
        <TouchableOpacity
          onPress={() => navigation.navigate('loginScreen')}
          style={[styles.button, {backgroundColor: Color.primaryColor}]}>
          <Text style={[styles.buttonText, {color: Color.white}]}>Login</Text>
        </TouchableOpacity>

        <TouchableOpacity
          onPress={() => {
            dispatch(setGuestMode(true));
          }}
          style={[
            styles.button,
            {backgroundColor: Color.white, borderWidth: 2, marginTop: verticalScale(8)},
          ]}>
          <Text style={[styles.buttonText, {color: Color.primaryColor}]}>
            Continue As Guest
          </Text>
        </TouchableOpacity>
      </View>
    </View>
  );
};

export default LoginChoiceScreen;

const styles = StyleSheet.create({
  text: {
    fontSize: scale(14),
    letterSpacing: 1,
    color: Color.textColor,
    fontWeight: '500',
    fontFamily: Font.Poppins,
    textAlign: 'center',
    lineHeight: scale(22)
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
    borderRadius: scale(8),
    height: verticalScale(35),
    alignItems: 'center',
    justifyContent: 'center',
  },
});
