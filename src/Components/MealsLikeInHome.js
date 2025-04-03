import {
  ImageBackground,
  StyleSheet,
  Text,
  TouchableOpacity,
  View,
} from 'react-native';
import React from 'react';
import {scale, verticalScale} from 'react-native-size-matters';
import AntDesign from 'react-native-vector-icons/AntDesign';
import Color, {Font, ShadowValues} from '../assets/colors/Colors';
import {useNavigation} from '@react-navigation/native';
import {Shadow} from 'react-native-shadow-2';
import Food from '../assets/Images/Food.svg';
import RightBack from '../assets/Icon/rightBack.svg';

const MealsLikeInHome = () => {
  const navigation = useNavigation();
  const handleGoFoodDiary = () => {
    navigation.navigate('foodDiary');
  };

  return (
    <View style={{backgroundColor: Color?.primary, padding: scale(10)}}>
      <Text style={styles.title}>What were your meals like?</Text>
      <View style={styles.cardContainer}>
        <Food />
        <Text style={styles.discription}>
          Log more meals and get the {'\n'}bigger picture of your days.
        </Text>
      </View>

      <View style={{marginTop: scale(10)}}>
        <Shadow
          distance={ShadowValues.blackShadowDistance}
          startColor={ShadowValues.blackShadow}
          style={{width: '100%'}}>
          <View
            style={{
              borderRadius: scale(5),
              backgroundColor: Color?.white,
            }}>
            <TouchableOpacity
              style={styles.DiaryBtn}
              onPress={handleGoFoodDiary}>
              <Text style={styles.txt}>Go to Food Diary</Text>
              <RightBack />
            </TouchableOpacity>
          </View>
        </Shadow>
      </View>
    </View>
  );
};

export default MealsLikeInHome;

const styles = StyleSheet.create({
  cardContainer: {
    borderRadius: scale(20),
    alignSelf: 'center',
    width: '100%',
    backgroundColor: Color?.primary,
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
  },
  title: {
    fontSize: verticalScale(14),
    fontWeight: '500',
    color: Color.textColor,
    paddingBottom: scale(7),
    fontFamily: Font?.Poppins,
  },
  DiaryBtn: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    padding: scale(8),
    alignItems: 'center',
  },
});
