import {StyleSheet, Text, View} from 'react-native';
import React from 'react';
import {scale, verticalScale} from 'react-native-size-matters';
import {Color} from '../assets/styles/Colors';
import {useStepTracking} from './StepTrackingService';
import {useNavigation} from '@react-navigation/native';
import {Font} from '../assets/styles/Fonts';
import {shadowStyle} from '../assets/styles/Shadow';
import CustomHomeButtonNavigation from './CustomHomeButtonNavigation';
import CustomShadow from './CustomShadow';

const PhysicalActivity = ({style, header, subHeader, bottomButton}) => {
  const navigation = useNavigation();
  const {steps, calories, workouts, isTracking, currentDay, logLast7DaysSteps} =
    useStepTracking();
  console.log(steps, 'steps');

  const daysOfWeek = ['Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat', 'Sun'];
  const todayIndex = currentDay;
  const displayDays = daysOfWeek.map((day, index) => ({
    day,
    index,
    isFuture: index > todayIndex,
    isCurrent: index === todayIndex,
    steps:
      index === todayIndex
        ? steps
        : index < todayIndex
        ? workouts[index] || 0
        : null,
  }));

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
    <View style={{marginVertical: verticalScale(18)}}>
      <CustomShadow radius={3}>
        <View style={shadowStyle}>
          <View style={[styles.workoutContainer, style]}>
            <View style={shadowStyle}>
              {header && (
                <Text style={styles.description}>Your physical activity</Text>
              )}
              {subHeader && (
                <Text
                  style={[
                    styles.description,
                    {
                      fontSize: scale(14),
                      marginTop: verticalScale(5),
                      color: '#344C5C',
                    },
                  ]}>
                  Workouts this week
                </Text>
              )}

              <View
                style={{
                  flexDirection: 'row',
                  justifyContent: 'space-between',
                  width: '100%',
                }}>
                {displayDays.map(({day, index, isFuture, isCurrent, steps}) => (
                  <View
                    key={day}
                    style={{
                      alignSelf: 'center',
                      justifyContent: 'center',
                      alignItems: 'center',
                    }}>
                    <View
                      style={[
                        styles.day,
                        {
                          backgroundColor:
                            currentDay === index
                              ? Color.primaryColor
                              : Color.primaryLight,
                        },
                      ]}>
                      <Text
                        style={{
                          color: Color.white,
                          textAlign: 'center',
                          fontSize: scale(12),
                          fontWeight: '500',
                          fontFamily: Font.PoppinsMedium,
                          marginTop: verticalScale(2),
                        }}
                        numberOfLines={1}
                        adjustsFontSizeToFit={true}>
                        {isFuture ? '' : formatNumber(steps || 0)}
                      </Text>
                    </View>
                    <Text style={styles.dayText}>{day}</Text>
                  </View>
                ))}
              </View>
            </View>

            <View
              style={[
                {
                  flexDirection: 'row',
                  alignItems: 'center',
                  justifyContent: 'space-between',
                  marginTop: verticalScale(10),
                  marginBottom: verticalScale(5),
                  width: '100%',
                },
              ]}>
              <View style={{width: '45%'}}>
                <CustomShadow color={Color.lightgray}>
                  <View style={styles.imageWrapper}>
                    <Text
                      style={[
                        styles.description,
                        {textAlign: 'center', fontSize: scale(16)},
                      ]}>
                      Calories
                    </Text>
                    <Text style={styles.zero} numberOfLines={1}>
                      {calories}
                    </Text>
                  </View>
                </CustomShadow>
              </View>

              <View style={{width: '45%'}}>
                <CustomShadow color={Color.lightgray}>
                  <View style={styles.imageWrapper}>
                    <Text
                      style={[
                        styles.description,
                        {textAlign: 'center', fontSize: scale(16)},
                      ]}>
                      Steps
                    </Text>
                    <Text style={styles.zero}>{formatNumber(steps)}</Text>
                  </View>
                </CustomShadow>
              </View>
            </View>

            {bottomButton && (
              <CustomHomeButtonNavigation
                text={'See All Physical Activity Stats'}
                onPress={() => navigation.navigate('physicalActivity')}
              />
            )}
          </View>
        </View>
      </CustomShadow>
    </View>
  );
};

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
    fontSize: scale(14),
    fontWeight: '500',
    color: Color.txt,
    marginHorizontal: scale(16),
  },
  cardOverlay: {
    width: '100%',
    borderRadius: scale(10),
  },
  description: {
    color: Color.textColor,
    fontWeight: '500',
    fontFamily: Font?.PoppinsMedium,
    fontSize: scale(16),
    marginTop: verticalScale(2),
  },
  txtIcon: {
    flexDirection: 'row',
    alignItems: 'center',
    marginTop: verticalScale(10),
  },
  txt: {
    fontSize: scale(12),
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
    marginTop: verticalScale(8),
    marginBottom: verticalScale(5),
    height: scale(30),
    width: scale(30),
    shadowColor: Color?.black,
    alignItems: 'center',
    justifyContent: 'center',
  },
  dayText: {
    fontSize: scale(12),
    color: Color.primaryColor,
    fontWeight: '500',
    textAlign: 'center',
    fontFamily: Font?.PoppinsMedium,
  },
  imageWrapper: {
    borderRadius: scale(6),
    paddingTop: verticalScale(8),
    paddingBottom: verticalScale(2),
    backgroundColor: Color.white,
    borderWidth: 1,
    borderColor: Color.primaryColor,
  },
  zero: {
    color: Color.textColor,
    fontSize: scale(24),
    fontWeight: '500',
    paddingHorizontal: scale(10),
    fontFamily: Font?.Poppins,
    textAlign: 'center',
  },
  waterText: {
    fontSize: scale(12),
    color: Color.primaryColor,
    fontWeight: '500',
    fontFamily: Font?.Poppins,
    marginTop: verticalScale(2),
    marginLeft: scale(5),
  },
});

export default PhysicalActivity;
