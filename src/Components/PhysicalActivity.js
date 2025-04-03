import {
  ImageBackground,
  Pressable,
  ScrollView,
  StyleSheet,
  Text,
  View,
} from 'react-native';
import React from 'react';
import {scale, verticalScale} from 'react-native-size-matters';
import Color, {Font, ShadowValues} from '../assets/colors/Colors';
import {useStepTracking} from './StepTrackingService';
import AntDesign from 'react-native-vector-icons/AntDesign';
import {useNavigation} from '@react-navigation/native';
import {Shadow} from 'react-native-shadow-2';
import RightBack from '../assets/Icon/rightBack.svg';

const PhysicalActivity = ({style}) => {
  const navigation = useNavigation();
  const {steps, calories, workouts, currentDay, isTracking} = useStepTracking();

  const formatNumber = num => {
    if (num >= 10000000) {
      return (num / 10000000).toFixed(1).replace(/\.0$/, '') + 'Cr';
    } else if (num >= 100000) {
      return (num / 100000).toFixed(1).replace(/\.0$/, '') + 'L';
    } else if (num >= 1000) {
      return (num / 1000).toFixed(1).replace(/\.0$/, '') + 'k';
    } else {
      return num.toString();
    }
  };

  return (
    <View style={[styles.workoutContainer, style]}>
      <View style={styles.cardContainer}>
        <View
          style={[
            styles.cardOverlay,
            // { backgroundColor: 'rgba(137, 70, 146, 0.3)' },
          ]}>
          <View style={{}}>
            <Text style={styles.description}>Your physical activity</Text>
            <Text
              style={[
                styles.description,
                {fontSize: scale(14), marginTop: scale(7), color: '#344C5C'},
              ]}>
              Workouts this week
            </Text>
            <View style={{}}>
              <View
                style={{
                  flexDirection: 'row',
                  justifyContent: 'space-between',
                  width: '100%',
                }}>
                {['Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat'].map(
                  (day, index) => (
                    <View key={day} style={[]}>
                      <View style={[styles.day]} />
                      {currentDay === index && (
                        <Text
                          style={{
                            position: 'absolute',
                            alignSelf: 'center',
                            top: scale(16),
                            color: Color.white,
                            minWidth: '50%',
                            maxWidth: '90%',
                            textAlign: 'center',
                            fontSize: scale(11),
                            fontWeight: '500',
                          }}
                          numberOfLines={1}
                          adjustsFontSizeToFit={true}>
                          {formatNumber(1500)}
                        </Text>
                      )}
                      <Text style={styles.dayText}>{day}</Text>
                    </View>
                  ),
                )}
              </View>
            </View>
          </View>
        </View>
      </View>

      <View
        style={[
          // styles.cardContainer,
          {
            flexDirection: 'row',
            alignItems: 'center',
            justifyContent: 'space-between',
            marginVertical: verticalScale(10),
            // height: verticalScale(80),
            gap: scale(25),
          },
        ]}>
        <View style={styles.imageWrapper}>
          <View style={[]}>
            <View style={{paddingVertical: verticalScale(10)}}>
              <Text
                style={[
                  styles.description,
                  {textAlign: 'center', fontSize: scale(16)},
                ]}>
                calories
              </Text>
              <Text
                style={styles.zero}
                numberOfLines={1}>
                {calories}
              </Text>
            </View>
          </View>
        </View>

        <View style={styles.imageWrapper}>
          <View style={[]}>
            <View style={{paddingVertical: verticalScale(10)}}>
              <Text
                style={[
                  styles.description,
                  {textAlign: 'center', fontSize: scale(16)},
                ]}>
                steps
              </Text>
              <Text style={styles.zero}>{steps}</Text>
            </View>
          </View>
        </View>
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
            <Pressable
              style={styles.logButton}
              onPress={() => navigation.navigate('physicalActivity')}>
              <View
                style={{
                  flexDirection: 'row',
                  padding: scale(7),
                  justifyContent: 'space-between',
                  alignItems: 'center',
                }}>
                <Text style={styles.waterText}>
                  See all physical activity stats
                </Text>
                <RightBack />
              </View>
            </Pressable>
          </View>
        </Shadow>
      </View>
    </View>
  );
};

export default PhysicalActivity;

const styles = StyleSheet.create({
  header: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginVertical: verticalScale(15),
  },
  workoutContainer: {
    padding: scale(10),
  },
  title: {
    fontSize: verticalScale(14),
    fontWeight: '500',
    color: Color.txt,
    marginHorizontal: scale(16),
  },
  cardContainer: {
    height: verticalScale(110),
  },
  cardOverlay: {
    width: '100%',
    borderRadius: scale(10),
    position: 'absolute',
    justifyContent: 'center',
  },
  description: {
    color: Color.textColor,
    fontWeight: '500',
    fontFamily: Font?.Poppins,
  },
  txtIcon: {
    flexDirection: 'row',
    alignItems: 'center',
    marginTop: verticalScale(10),
  },
  txt: {
    fontSize: verticalScale(12),
    fontWeight: '600',
    color: Color.white,
    marginTop: scale(8),
  },
  bgImage: {
    height: '100%',
    width: '100%',
  },
  dayContainer: {
    borderRadius: scale(10),
  },
  day: {
    borderRadius: scale(20),
    backgroundColor: Color?.primaryColor,
    marginVertical: verticalScale(8),
    paddingVertical: verticalScale(15),
    paddingHorizontal: scale(15),
    shadowColor: Color?.black,
    elevation: 5,
  },
  dayText: {
    fontSize: scale(11),
    color: Color.primaryColor,
    fontWeight: '500',
    textAlign: 'center',
    fontFamily: Font?.Sofia,
  },
  imageWrapper: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
    borderWidth: scale(1),
    borderColor: Color?.primaryColor,
    borderRadius: scale(5),
  },
  zero: {
    color: Color.textColor,
    fontSize: scale(24),
    fontWeight: '500',
    paddingHorizontal: scale(10),
    fontFamily: Font?.Sofia,
    textAlign: 'center'
  },
  logButton: {},
  waterText: {
    fontSize: scale(12),
    color: Color.primaryColor,
    fontWeight: '500',
    fontFamily: Font?.Poppins,
  },
});
