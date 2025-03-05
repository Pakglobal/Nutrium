import {
  ImageBackground,
  ScrollView,
  StyleSheet,
  Text,
  View,
} from 'react-native';
import React from 'react';
import {scale, verticalScale} from 'react-native-size-matters';
import Color from '../assets/colors/Colors';
import {useStepTracking} from './StepTrackingService';

const PhysicalActivity = () => {
  const {steps, calories, workouts, currentDay, isTracking} = useStepTracking();

  return (
    <View style={{marginTop: verticalScale(10), marginHorizontal: scale(16)}}>
      <View style={styles.cardContainer}>
        <ImageBackground
          style={styles.bgImage}
          source={require('../assets/Images/dumble.png')}
          resizeMode="cover"
          imageStyle={{borderRadius: 20}}
        />
        <View
          style={[
            styles.cardOverlay,
            {backgroundColor: 'rgba(137, 70, 146, 0.6)'},
          ]}>
          <View style={{marginLeft: scale(10), marginTop: verticalScale(58)}}>
            <Text style={styles.description}>Workouts this week</Text>
            <View
              style={{
                flexDirection: 'row',
                alignItems: 'center',
                marginTop: verticalScale(10),
              }}>
              <Text style={styles.zero}>
                {workouts.reduce((sum, count) => sum + count, 0)}
              </Text>
              <ScrollView
                horizontal
                showsHorizontalScrollIndicator={false}
                style={{marginRight: scale(5)}}>
                {['Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat'].map(
                  (day, index) => (
                    <View
                      key={day}
                      style={[
                        styles.dayContainer,
                        currentDay === index && {
                          backgroundColor: 'rgba(215, 193, 215, 0.8)',
                        },
                      ]}>
                      <View
                        style={[
                          styles.day,
                          workouts[index] > 0 && {
                            backgroundColor: 'rgba(137, 70, 146, 0.8)',
                          },
                        ]}
                      />
                      <Text style={styles.dayText}>{day}</Text>
                    </View>
                  ),
                )}
              </ScrollView>
            </View>
          </View>
        </View>
      </View>

      <View
        style={[
          styles.cardContainer,
          {
            flexDirection: 'row',
            alignItems: 'center',
            justifyContent: 'space-between',
            marginVertical: verticalScale(10),
            height: verticalScale(80),
          },
        ]}>
        <View style={styles.imageWrapper}>
          <ImageBackground
            style={styles.bgImage}
            source={require('../assets/Images/fire.png')}
            resizeMode="cover"
            imageStyle={{borderRadius: 20}}
          />
          <View
            style={[
              styles.cardOverlay,
              {backgroundColor: 'rgba(212, 151, 9, 0.6)'},
            ]}>
            <View style={{marginTop: verticalScale(20), marginLeft: scale(10)}}>
              <Text style={styles.description}>calories</Text>
              <Text style={styles.zero}>{calories}</Text>
            </View>
          </View>
        </View>

        <View style={styles.imageWrapper}>
          <ImageBackground
            style={styles.bgImage}
            source={require('../assets/Images/shoes.png')}
            resizeMode="cover"
            imageStyle={{borderRadius: 20}}
          />
          <View
            style={[
              styles.cardOverlay,
              {backgroundColor: 'rgba(47, 180, 247, 0.6)'},
            ]}>
            <View style={{marginLeft: scale(10), marginTop: verticalScale(20)}}>
              <Text style={styles.description}>steps</Text>
              <Text style={styles.zero}>{steps}</Text>
            </View>
          </View>
        </View>
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
  title: {
    fontSize: verticalScale(14),
    fontWeight: '500',
    color: Color.txt,
    marginHorizontal: scale(16),
  },
  cardContainer: {
    borderRadius: scale(20),
    height: verticalScale(150),
  },
  cardOverlay: {
    height: '100%',
    width: '100%',
    borderRadius: scale(20),
    position: 'absolute',
    justifyContent: 'center',
  },
  description: {
    color: Color.primary,
    fontSize: verticalScale(13),
    fontWeight: '500',
  },
  txtIcon: {
    flexDirection: 'row',
    alignItems: 'center',
    marginTop: verticalScale(10),
  },
  txt: {
    fontSize: verticalScale(12),
    fontWeight: '600',
    color: Color.primary,
    marginTop: scale(8),
  },
  bgImage: {
    height: '100%',
    width: '100%',
  },
  dayContainer: {
    borderRadius: scale(8),
  },
  day: {
    borderRadius: scale(20),
    backgroundColor: '#E0E0E0',
    marginHorizontal: scale(7),
    marginVertical: verticalScale(8),
    paddingVertical: verticalScale(10),
    paddingHorizontal: scale(10),
  },
  dayText: {
    fontSize: scale(11),
    color: Color.black,
    fontWeight: '300',
    textAlign: 'center',
  },
  imageWrapper: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
    marginHorizontal: scale(3),
  },
  zero: {
    color: Color.primary,
    fontSize: scale(32),
    fontWeight: '600',
    marginRight: scale(10),
  },
});
