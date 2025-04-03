import {
  StyleSheet,
  Text,
  View,
  Animated,
  SafeAreaView,
  TouchableOpacity,
  Pressable,
} from 'react-native';
import React, {useEffect, useState, useRef} from 'react';
import {scale, verticalScale} from 'react-native-size-matters';
import Color, {Font, ShadowValues} from '../assets/colors/Colors';
import {useNavigation} from '@react-navigation/native';
import HydratedView from './HydratedView';
import {useSelector} from 'react-redux';
import {
  GetWaterIntakeDetails,
  SetWaterIntakeDetails,
} from '../Apis/ClientApis/WaterIntakeApi';
import OnOffFunctionality from './OnOffFunctionality';
import AntDesign from 'react-native-vector-icons/AntDesign';
import Feather from 'react-native-vector-icons/Feather';
import Drop from '../assets/Images/drop.svg';
import Bottle from '../assets/Images/bottel.svg';
import Glass from '../assets/Images/glass.svg';
import {Shadow} from 'react-native-shadow-2';
import RightBack from '../assets/Icon/rightBack.svg';

const HydratedStay = () => {
  const navigation = useNavigation();

  const [sevenL, setSevenL] = useState(0);
  const [seventeenL, setSevenTeenL] = useState(0);
  const [waterIntake, setWaterIntake] = useState([]);
  const [loading, setLoading] = useState(true);

  const tokenId = useSelector(state => state?.user?.token);
  const token = tokenId?.token;
  const id = tokenId?.id;

  const totalGoal = waterIntake?.waterIntakeData?.waterIntakeLimit || 2;

  const bothL = sevenL + seventeenL;

  const widthAnimation = useRef(new Animated.Value(0)).current;

  useEffect(() => {
    const loadWaterIntakeData = async () => {
      try {
        setLoading(true);

        const response = await GetWaterIntakeDetails(token, id);
        setWaterIntake(response);

        const todayEntries = response?.waterIntakeData?.waterIntakes || [];
        const todayTotal = todayEntries.reduce((total, entry) => {
          return total + entry?.amount / 1000;
        }, 0);

        const numSmallBottles = Math.floor(todayTotal / 0.2);
        const remainingLiters = todayTotal - numSmallBottles * 0.2;
        const numLargeBottles = Math.floor(remainingLiters / 0.5);

        setSevenL(numSmallBottles * 0.2);
        setSevenTeenL(numLargeBottles * 0.5);
        setLoading(false);
      } catch (error) {
        console.error('Error loading water intake data:', error);
        setLoading(false);
      }
    };

    loadWaterIntakeData();
  }, [token, id]);

  useEffect(() => {
    Animated.timing(widthAnimation, {
      toValue: Math.min((bothL / totalGoal) * 100, 100),
      duration: 1000,
      useNativeDriver: false,
    }).start();
  }, [bothL, totalGoal]);

  const handleAddWater = async amount => {
    try {
      setLoading(true);

      if (amount === 0.2) {
        setSevenL(prev => prev + amount);
      } else if (amount === 0.5) {
        setSevenTeenL(prev => prev + amount);
      }

      const currentDate = new Date();

      const hours = currentDate.getHours();
      const minutes = currentDate.getMinutes();
      const currentTime = `${hours.toString().padStart(2, '0')}:${minutes
        .toString()
        .padStart(2, '0')}`;

      const payload = {
        waterIntakeId: waterIntake?.waterIntakeData?._id,
        clientId: waterIntake?.waterIntakeData?.clientId,
        token: token,
        date: currentDate,
        amount: amount * 1000,
        time: currentTime,
      };

      const res = await SetWaterIntakeDetails(payload);

      const updatedData = await GetWaterIntakeDetails(token, id);

      setWaterIntake(updatedData);
      setLoading(false);
    } catch (error) {
      console.error('Error adding water intake:', error);

      if (amount === 0.2) {
        setSevenL(prev => prev);
      } else if (amount === 0.5) {
        setSevenTeenL(prev => prev);
      }
      setLoading(false);
    }
  };

  const plusData = {
    clientId: waterIntake?.waterIntakeData?.clientId,
    token: token,
    date: new Date(),
    press: 'plus',
  };

  return (
    <SafeAreaView>
      <View style={styles.waterContainer}>
        <View style={styles.topContainer}>
          <View>
            <Text style={styles.mainTitle}>Are you staying hydrated?</Text>
            <Text style={styles.subTitle}>
              Keep going to reach you daily goal!
            </Text>
          </View>
          <View>
            <View style={styles.showIntake}>
              <Text style={styles.intakeTxt}>Current intake</Text>
              <Text style={styles.intakeTxt}>
                {`${bothL.toFixed(1)}L / ${totalGoal}L`}
              </Text>
            </View>
            <View style={styles.hydrateContainer}>
              <Animated.View
                style={[
                  styles.hydrateView,
                  {
                    width: widthAnimation.interpolate({
                      inputRange: [0, 100],
                      outputRange: ['0%', '100%'],
                    }),
                    position: 'absolute',
                  },
                ]}
              />
            </View>
          </View>
        </View>

        <View style={styles.bottomContainer}>
          {/* <View style={styles.hydrationButtons}> */}
          <View style={styles.hydrationButtons}>
            <View style={{width: '30%'}}>
              <TouchableOpacity
                style={styles.waterCardView}
                onPress={() => handleAddWater(0.2)}>
                <Glass
                  height={verticalScale(40)}
                  width={scale(45)}
                  style={styles.waterIcon}
                />
                <View style={styles.plusIcon}>
                  <Feather
                    name="plus"
                    color={Color?.primaryColor}
                    size={verticalScale(15)}
                  />
                </View>
              </TouchableOpacity>
              <Text style={styles.waterTxt}>{'200mL'}</Text>
            </View>

            <View style={{width: '30%'}}>
              <TouchableOpacity
                style={styles.waterCardView}
                onPress={() => handleAddWater(0.5)}>
                <Bottle
                  height={verticalScale(40)}
                  width={scale(45)}
                  style={styles.waterIcon}
                />
                <View style={styles.plusIcon}>
                  <Feather
                    name="plus"
                    color={Color?.primaryColor}
                    size={verticalScale(15)}
                  />
                </View>
              </TouchableOpacity>
              <Text style={styles.waterTxt}>{'500mL'}</Text>
            </View>

            <View style={{width: '30%'}}>
              <TouchableOpacity
                style={styles.waterCardView}
                onPress={() =>
                  navigation.navigate('waterIntakeLog', {plusData: plusData})
                }>
                <Drop
                  height={verticalScale(40)}
                  width={scale(45)}
                  style={styles.waterIcon}
                />
                <View style={styles.plusIcon}>
                  <Feather
                    name="plus"
                    color={Color?.primaryColor}
                    size={verticalScale(15)}
                  />
                </View>
              </TouchableOpacity>
              <Text style={styles.waterTxt}>{'Custom'}</Text>
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
              <Pressable onPress={() => navigation.navigate('waterIntake')}>
                <View
                  style={{
                    flexDirection: 'row',
                    padding: scale(7),
                    justifyContent: 'space-between',
                    alignItems: 'center',
                  }}>
                  <Text style={styles.waterText}>See all water logs</Text>
                  <RightBack />
                </View>
              </Pressable>
            </View>
          </Shadow>
        </View>
      </View>
    </SafeAreaView>
  );
};

export default HydratedStay;

const styles = StyleSheet.create({
  waterContainer: {
    padding: scale(10),
  },
  plusIcon: {
    backgroundColor: '#68A16C4D',
    position: 'absolute',
    right: scale(5),
    top: scale(5),
    borderRadius: scale(3),
  },
  waterIcon: {
    alignSelf: 'center',
  },
  intakeTxt: {
    color: Color?.primaryColor,
    fontWeight: '500',
    fontSize: scale(14),
    fontFamily: Font?.Poppins,
  },
  showIntake: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginTop: scale(5),
  },
  header: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  title: {
    fontSize: verticalScale(14),
    fontWeight: '500',
    color: Color.txt,
  },
  mainTitle: {
    fontSize: scale(16),
    fontWeight: '500',
    color: Color.textColor,
    fontFamily: Font?.Poppins,
  },
  buttonContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: scale(10),
    paddingVertical: verticalScale(5),
    borderRadius: scale(20),
    elevation: 1,
  },
  buttonText: {
    color: Color.primaryColor,
    fontWeight: '600',
    marginStart: scale(5),
  },
  subTitle: {
    fontSize: scale(14),
    fontWeight: '400',
    color: Color.subText,
    marginTop: verticalScale(10),
    fontFamily: Font?.Poppins,
  },
  hydrateContainer: {
    height: verticalScale(10),
    width: '100%',
    backgroundColor: Color.lightgray,
    alignSelf: 'center',
    marginTop: verticalScale(10),
    borderRadius: scale(15),
    justifyContent: 'center',
    alignItems: 'center',
    overflow: 'hidden',
  },
  hydrateView: {
    backgroundColor: Color?.primaryColor,
    borderRadius: scale(15),
    height: '100%',
    left: 0,
  },
  hydrationText: {
    color: Color.txt,
    fontWeight: '700',
    zIndex: 1,
  },
  bottomContainer: {
    // backgroundColor: '#d3e5ff',
    // paddingVertical: verticalScale(10),
  },
  hydrationButtons: {
    marginVertical: scale(12),
    flexDirection: 'row',
    justifyContent: 'space-between',
  },
  logButton: {
    flexDirection: 'row',
    alignItems: 'center',
    marginStart: scale(15),
    marginVertical: verticalScale(10),
  },
  logText: {
    fontSize: verticalScale(12),
    color: Color.txt,
    fontWeight: '500',
    marginRight: scale(10),
  },
  waterCardView: {
    borderRadius: scale(5),
    height: verticalScale(70),
    // width: '30%',
    backgroundColor: Color?.primary,
    justifyContent: 'center',
    borderWidth: scale(1),
    borderColor: Color?.primaryColor,
  },
  waterImg: {
    height: verticalScale(40),
    width: scale(30),
    resizeMode: 'stretch',
    marginStart: scale(8),
  },
  waterTxt: {
    color: Color.primaryColor,
    fontWeight: '400',
    marginTop: verticalScale(5),
    textAlign: 'center',
    fontFamily: Font?.Sofia,
    fontSize: scale(14),
  },
  waterText: {
    fontSize: scale(12),
    color: Color.primaryColor,
    fontWeight: '500',
    fontFamily: Font?.Poppins,
  },
});
