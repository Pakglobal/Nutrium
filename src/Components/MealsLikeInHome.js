import {
  Image,
  StyleSheet,
  Text,
  View,
} from 'react-native';
import React from 'react';
import { scale, verticalScale } from 'react-native-size-matters';
import { Color } from '../assets/styles/Colors';
import { useNavigation } from '@react-navigation/native';
import Food from '../assets/Images/Food.svg';
import { Font } from '../assets/styles/Fonts';
import { shadowStyle } from '../assets/styles/Shadow';
import CustomHomeButtonNavigation from './CustomHomeButtonNavigation';
import CustomShadow from './CustomShadow';

const MealsLikeInHome = () => {
  const navigation = useNavigation();

  return (
    <View style={{ marginTop: verticalScale(18) }}>
      <CustomShadow radius={3}>
        <View style={shadowStyle}>
          <View style={{ padding: scale(10) }}>
            <Text style={styles.title}>What were your meals like?</Text>

            <View style={styles.imageContainer}>
              <Food width="100%" height="100%" style={styles.foodImage} />
              <Text style={styles.overlayText}>
                Log more meals and get the{'\n'}
                bigger picture of your days.
              </Text>
            </View>

            <CustomHomeButtonNavigation
              text={'Go to Food Diary'}
              onPress={() => navigation.navigate('foodDiary')}
            />
          </View>
        </View>
      </CustomShadow>
    </View>
  );
};

export default MealsLikeInHome;

const styles = StyleSheet.create({
  title: {
    fontSize: scale(14),
    fontWeight: '500',
    color: Color.textColor,
    fontFamily: Font?.PoppinsMedium,
  },
  imageContainer: {
    width: '100%',
    aspectRatio: 16 / 9,
    borderRadius: scale(10),
    overflow: 'hidden',
    position: 'relative',
  },
  foodImage: {
    width: '100%',
    height: '100%',
    borderRadius: scale(10),
  },
  overlayText: {
    fontSize: scale(14),
    color: Color.white,
    fontWeight: '500',
    fontFamily: Font?.Poppins,
    position: 'absolute',
    bottom: scale(20),
    left: scale(15),
  },
});