import {StyleSheet, Text, TouchableOpacity, View} from 'react-native';
import React from 'react';
import HeaderImage from '../../assets/Images/loginChoiceHeader.svg';
import NutriumLogo from '../../assets/Images/logoGreen.svg';
import Color, {Font} from '../../assets/colors/Colors';
import {scale, verticalScale} from 'react-native-size-matters';
import {useNavigation} from '@react-navigation/native';
import {useDispatch} from 'react-redux';
import {setGuestMode} from '../../redux/user';

const LoginChoiceScreen = () => {
  const navigation = useNavigation();
  const dispatch = useDispatch();

  return (
    <View style={{flex: 1, backgroundColor: Color.white}}>
      <View style={{width: '100%', height: '50%'}}>
        <HeaderImage
          width="100%"
          height="100%"
          preserveAspectRatio="xMidYMax slice"
        />
      </View>

      <View style={{height: '30%'}}>
        <View
          style={{
            height: '20%',
            width: '50%',
            alignSelf: 'center',
            marginVertical: verticalScale(20),
          }}>
          <NutriumLogo height={'100%'} width={'100%'} />
        </View>

        <View>
          <Text style={styles.text}>
            Nutrium provides personalized{'\n'}meal plans and diet tracking for
            {'\n'}a healthier lifestyle.
          </Text>
        </View>
      </View>

      <View
        style={{
          height: '20%',
          justifyContent: 'center',
          bottom: 10
        }}>
        <TouchableOpacity
          onPress={() => navigation.navigate('loginScreen')}
          style={[styles.button, {backgroundColor: Color.primaryColor}]}>
          <Text style={[styles.buttonText, {color: Color.white}]}>Login</Text>
        </TouchableOpacity>

        <TouchableOpacity
          onPress={() => {
            dispatch(setGuestMode(true));
            navigation.navigate('SelectGender')}}
          style={[
            styles.button,
            {backgroundColor: Color.white, borderWidth: 2},
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
    marginHorizontal: scale(16),
    marginVertical: verticalScale(5),
    borderRadius: scale(8),
    height: verticalScale(42),
    alignItems: 'center',
    justifyContent: 'center',
  },
});
