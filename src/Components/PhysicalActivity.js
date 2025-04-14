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
import {Color} from '../assets/styles/Colors';
import {useStepTracking} from './StepTrackingService';
import Entypo from 'react-native-vector-icons/Entypo';
import {useNavigation} from '@react-navigation/native';
import {Shadow} from 'react-native-shadow-2';
import { Font } from '../assets/styles/Fonts';
import { ShadowValues } from '../assets/styles/Shadow';

const PhysicalActivity = ({style,header,subHeader,
  bottomButton,noData
}) => {
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
      height: noData ? verticalScale(70):verticalScale(110),
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
    },
    dayText: {
      fontSize: scale(11),
      color: Color.primaryColor,
      fontWeight: '500',
      textAlign: 'center',
      fontFamily: Font?.Poppins,
    },
    imageWrapper: {
      flex: 1,
      alignItems: 'center',
      justifyContent: 'center',
      borderWidth: scale(1),
      borderColor: Color?.primaryColor,
      borderRadius: scale(5),
      marginTop: verticalScale(10),
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

  return (
    <View style={[styles.workoutContainer, style]}>
      <View style={styles.cardContainer}>
        <View
          style={[
            styles.cardOverlay,
          ]}>
          <View style={{}}>
            {
              header && 
            <Text style={[styles.description, {fontSize: scale(16)}]}>
              Your physical activity
            </Text>
            }
            {
              subHeader &&
              <Text
              style={[
                styles.description,
                {fontSize: scale(14), marginTop: scale(7), color: '#344C5C'},
              ]}>
              Workouts this week
            </Text>
            }
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
                          {formatNumber(100)}
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
        
          {
            flexDirection: 'row',
            alignItems: 'center',
            justifyContent: 'space-between',
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
              <Text style={styles.zero} numberOfLines={1}>
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

      {
        bottomButton &&
      <View style={{marginTop:scale(10)}}>
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
                  padding: scale(6),
                  justifyContent: 'space-between',
                  alignItems: 'center',
                }}>
                <Text style={styles.waterText}>
                  See All Physical Activity Stats
                </Text>
                <Entypo
                  name="chevron-right"
                  size={24}
                  color={Color.primaryColor}
                />
              </View>
            </Pressable>
          </View>
        </Shadow>
      </View>
      }

    </View>
  );
};

export default PhysicalActivity;


