import {
  ImageBackground,
  StyleSheet,
  Text,
  TouchableOpacity,
  View,
} from 'react-native';
import React from 'react';
import {scale, verticalScale} from 'react-native-size-matters';
import {Color} from '../assets/styles/Colors';
import {useNavigation} from '@react-navigation/native';
import {Shadow} from 'react-native-shadow-2';
import Food from '../assets/Images/Food.svg';
import {Font} from '../assets/styles/Fonts';
import {ShadowValues} from '../assets/styles/Shadow';
import CustomHomeButtonNavigation from './CustomHomeButtonNavigation';

const MealsLikeInHome = () => {
  const navigation = useNavigation();

  return (
    <View style={{padding: scale(10)}}>
      <Text style={styles.title}>What were your meals like?</Text>
      <View style={styles.cardContainer}>
        <Food width={'100%'} height={verticalScale(170)} />
        <Text style={styles.discription}>
          Log more meals and get the {'\n'}bigger picture of your days.
        </Text>
      </View>

      <CustomHomeButtonNavigation
        text={'Go to Food Diary'}
        onPress={() => navigation.navigate('foodDiary')}
      />
    </View>
  );
};

export default MealsLikeInHome;

const styles = StyleSheet.create({
  cardContainer: {
    borderRadius: scale(20),
    alignSelf: 'center',
    width: '100%',
    backgroundColor: Color?.white,
    borderRadius: scale(10),
  },
  card: {
    height: '100%',
    width: '100%',
    borderRadius: scale(20),
    paddingLeft: scale(20),
  },
  discription: {
    fontSize: scale(14),
    color: Color.white,
    fontWeight: '500',
    position: 'absolute',
    bottom: scale(20),
    left: scale(10),
    fontFamily: Font?.Poppins,
  },
  txt: {
    fontSize: scale(12),
    fontWeight: '500',
    color: Color.primaryColor,
    fontFamily: Font?.Poppins,
    marginTop: verticalScale(2),
    marginLeft: scale(5),
  },
  title: {
    fontSize: verticalScale(14),
    fontWeight: '500',
    color: Color.textColor,
    fontFamily: Font?.Poppins,
  },
  DiaryBtn: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
});
