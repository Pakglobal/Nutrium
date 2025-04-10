import {
  ImageBackground,
  StyleSheet,
  Text,
  TouchableOpacity,
  View,
} from 'react-native';
import React from 'react';
import {scale, verticalScale} from 'react-native-size-matters';
import Entypo from 'react-native-vector-icons/Entypo';
import {Color} from '../assets/styles/Colors';
import {useNavigation} from '@react-navigation/native';
import {Shadow} from 'react-native-shadow-2';
import Food from '../assets/Images/Food.svg';
import { Font } from '../assets/styles/Fonts';
import { ShadowValues } from '../assets/styles/Shadow';

const MealsLikeInHome = () => {
  const navigation = useNavigation();
  const handleGoFoodDiary = () => {
    navigation.navigate('foodDiary');
  };

  return (
    <View style={{padding: scale(10)}}>
      <Text style={styles.title}>What were your meals like?</Text>
      <View style={styles.cardContainer}>
        <Food width={'100%'} height={verticalScale(170)} />
        <Text style={styles.discription}>
          Log more meals and get the {'\n'}bigger picture of your days.
        </Text>
      </View>

      <View style={{marginTop: scale(8)}}>
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
              <Entypo
                name="chevron-right"
                size={24}
                color={Color.primaryColor}
              />
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
    backgroundColor: Color?.white,
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
    padding: scale(6),
    alignItems: 'center',
  },
});
