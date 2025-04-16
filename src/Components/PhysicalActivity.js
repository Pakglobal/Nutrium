import {
  ImageBackground,
  Pressable,
  ScrollView,
  StyleSheet,
  Text,
  TouchableOpacity,
  View,
} from 'react-native';
import React from 'react';
import {scale, verticalScale} from 'react-native-size-matters';
import {Color} from '../assets/styles/Colors';
import {useStepTracking} from './StepTrackingService';
import Entypo from 'react-native-vector-icons/Entypo';
import {useNavigation} from '@react-navigation/native';
import {Shadow} from 'react-native-shadow-2';
import {Font} from '../assets/styles/Fonts';
import {shadowStyle, ShadowValues} from '../assets/styles/Shadow';
import CustomHomeButtonNavigation from './CustomHomeButtonNavigation';

const PhysicalActivity = ({style, header, subHeader, bottomButton}) => {
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
      <View style={shadowStyle}>
        {header && (
          <Text style={styles.description}>Your physical activity</Text>
        )}
        {subHeader && (
          <Text
            style={[
              styles.description,
              {fontSize: scale(14), marginTop: scale(7), color: '#344C5C'},
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
          {['Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat', 'Sun'].map(
            (day, index) => (
              <View
                key={day}
                style={{
                  alignSelf: 'center',
                  justifyContent: 'center',
                  alignItems: 'center',
                }}>
                <View style={styles.day}>
                  {currentDay === index && (
                    <Text
                      style={{
                        color: Color.white,
                        textAlign: 'center',
                        fontSize: scale(11),
                        fontWeight: '500',
                        fontFamily: Font.PoppinsMedium,
                        marginTop: verticalScale(2),
                      }}
                      numberOfLines={1}
                      adjustsFontSizeToFit={true}>
                      {formatNumber(steps)}
                    </Text>
                  )}
                </View>
                <Text style={styles.dayText}>{day}</Text>
              </View>
            ),
          )}
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
            gap: scale(25),
          },
        ]}>
        <View style={styles.imageWrapper}>
          <Text style={[styles.description, {textAlign: 'center'}]}>
            calories
          </Text>
          <Text style={styles.zero} numberOfLines={1}>
            {calories}
          </Text>
        </View>

        <View style={styles.imageWrapper}>
          <Text style={[styles.description, {textAlign: 'center'}]}>steps</Text>
          <Text style={styles.zero}>{steps}</Text>
        </View>
      </View>

      {bottomButton && (
        <CustomHomeButtonNavigation
          text={'See All Physical Activity Stats'}
          onPress={() => navigation.navigate('physicalActivity')}
        />
      )}
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
    fontSize: verticalScale(14),
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
    fontFamily: Font?.Poppins,
    fontSize: scale(16),
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
    height: scale(30),
    width: scale(30),
    shadowColor: Color?.black,
    alignItems: 'center',
    justifyContent: 'center',
  },
  dayText: {
    fontSize: scale(11),
    color: Color.primaryColor,
    fontWeight: '500',
    textAlign: 'center',
    fontFamily: Font?.PoppinsMedium,
  },
  imageWrapper: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
    borderWidth: scale(1.6),
    borderColor: Color?.primaryColor,
    borderRadius: scale(6),
    paddingVertical: verticalScale(8),
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
