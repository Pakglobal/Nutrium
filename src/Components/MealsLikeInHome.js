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
import Color from '../assets/colors/Colors';
import {useNavigation} from '@react-navigation/native';

const MealsLikeInHome = () => {
  const navigation = useNavigation();
  const handleGoFoodDiary = () => {
    navigation.navigate('foodDiary');
  };

  return (
    <View>
      <TouchableOpacity
        style={styles.cardContainer}
        activeOpacity={0.6}
        onPress={handleGoFoodDiary}>
        <ImageBackground
          style={{height: '100%', width: '100%'}}
          source={require('../assets/Images/foodmealcard.jpg')}
          resizeMode="stretch"
          imageStyle={{borderRadius: scale(20)}}>
          <View style={styles.card}>
            <Text style={styles.discription}>
              Log more meals and get the {'\n'}bigger picture of your days.
            </Text>
            <View style={styles.txtIcon}>
              <Text style={styles.txt}>Go to Food Diary{'  '}</Text>
              <AntDesign
                name="arrowright"
                size={verticalScale(18)}
                color={Color.txt}
              />
            </View>
          </View>
        </ImageBackground>
      </TouchableOpacity>
    </View>
  );
};

export default MealsLikeInHome;

const styles = StyleSheet.create({
  cardContainer: {
    borderRadius: scale(20),
    alignSelf: 'center',
    marginHorizontal: scale(5),
    height: verticalScale(130),
    width: '90%'
  },
  card: {
    height: '100%',
    width: '100%',
    borderRadius: scale(20),
    backgroundColor: 'rgba(250,250,250,0.7)',
    paddingLeft: scale(20),
  },
  discription: {
    fontSize: scale(13),
    color: Color.txt,
    marginTop: verticalScale(20),
  },
  txtIcon: {
    flexDirection: 'row',
    alignItems: 'center',
    marginTop: verticalScale(40),
  },
  txt: {
    fontSize: scale(13),
    fontWeight: '600',
    color: Color.txt,
  },
});
