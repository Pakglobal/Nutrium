import {
  StyleSheet,
  Text,
  View,
  Animated,
  SafeAreaView,
  TouchableOpacity,
} from 'react-native';
import React, {useEffect, useState, useRef} from 'react';
import {scale, verticalScale} from 'react-native-size-matters';
import Color from '../assets/colors/Colors';
import {useNavigation} from '@react-navigation/native';
import HydratedView from './HydratedView';
import {useSelector} from 'react-redux';
import {
  GetWaterIntakeDetails,
  SetWaterIntakeDetails,
} from '../Apis/ClientApis/WaterIntakeApi';
import OnOffFunctionality from './OnOffFunctionality';
import AntDesign from 'react-native-vector-icons/AntDesign';
import Drop from '../assets/Images/drop.svg';
import Bottle from '../assets/Images/bottel.svg';
import Glass from '../assets/Images/glass.svg';

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
      <View style={styles.topContainer}>
        <OnOffFunctionality
          title={'Are you staying hydrated?'}
          hydrate={true}
        />

        <Text style={styles.subTitle}>Keep going to reach you daily goal!</Text>

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
          <Text style={styles.hydrationText}>
            {`${bothL.toFixed(1)}L / ${totalGoal}L`}
          </Text>
        </View>
      </View>

      <View style={styles.bottomContainer}>
        <View style={styles.hydrationButtons}>
          <TouchableOpacity
            style={styles.waterCardView}
            onPress={() => handleAddWater(0.2)}>
            <Glass height={verticalScale(30)} width={scale(45)} />
            <View style={{flexDirection: 'column', alignItems: 'flex-end'}}>
              <AntDesign
                name="pluscircleo"
                color="#83bcff"
                size={verticalScale(15)}
                style={{marginEnd: scale(10)}}
              />
              <Text style={styles.waterTxt}>{'200mL'}</Text>
            </View>
          </TouchableOpacity>

          <TouchableOpacity
            style={styles.waterCardView}
            onPress={() => handleAddWater(0.5)}>
            <Bottle height={verticalScale(30)} width={scale(45)} />
            <View style={{flexDirection: 'column', alignItems: 'flex-end'}}>
              <AntDesign
                name="pluscircleo"
                color="#83bcff"
                size={verticalScale(15)}
                style={{marginEnd: scale(10)}}
              />
              <Text style={styles.waterTxt}>{'500mL'}</Text>
            </View>
          </TouchableOpacity>

          <TouchableOpacity
            style={styles.waterCardView}
            onPress={() =>
              navigation.navigate('waterIntakeLog', {plusData: plusData})
            }>
            <Drop height={verticalScale(30)} width={scale(45)} />
            <View style={{flexDirection: 'column', alignItems: 'flex-end'}}>
              <AntDesign
                name="pluscircleo"
                color="#83bcff"
                size={verticalScale(15)}
                style={{marginEnd: scale(10)}}
              />
              <Text style={styles.waterTxt}>{'Custom'}</Text>
            </View>
          </TouchableOpacity>
        </View>
      </View>
    </SafeAreaView>
  );
};

export default HydratedStay;

const styles = StyleSheet.create({
  loadingContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: '#ecf4ff',
    padding: verticalScale(20),
  },
  topContainer: {
    marginTop: verticalScale(20),
    backgroundColor: '#ecf4ff',
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
    marginHorizontal: scale(16),
  },
  buttonContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: scale(10),
    paddingVertical: verticalScale(5),
    marginHorizontal: scale(16),
    borderRadius: scale(20),
    backgroundColor: Color.primary,
    elevation: 1,
  },
  buttonText: {
    color: Color.primaryGreen,
    fontWeight: '600',
    marginStart: scale(5),
  },
  subTitle: {
    fontSize: verticalScale(11),
    fontWeight: '500',
    color: Color.gray,
    marginHorizontal: scale(16),
    marginTop: verticalScale(10),
  },
  hydrateContainer: {
    height: verticalScale(30),
    width: scale(330),
    backgroundColor: Color.primary,
    alignSelf: 'center',
    marginTop: verticalScale(10),
    borderRadius: scale(15),
    justifyContent: 'center',
    alignItems: 'center',
    borderColor: '#83bcff',
    borderWidth: 1,
    overflow: 'hidden',
  },
  hydrateView: {
    backgroundColor: '#83bcff',
    borderRadius: scale(15),
    borderColor: '#83bcff',
    borderWidth: 1,
    height: '100%',
    left: 0,
  },
  hydrationText: {
    color: Color.txt,
    fontWeight: '700',
    zIndex: 1,
  },
  bottomContainer: {
    backgroundColor: '#d3e5ff',
    paddingVertical: verticalScale(10),
  },
  hydrationButtons: {
    marginVertical: scale(12),
    marginHorizontal: scale(16),
    flexDirection: 'row',
    alignItems: 'center',
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
    marginHorizontal: scale(5),
    borderRadius: 10,
    height: verticalScale(65),
    width: '30%',
    backgroundColor: '#f3f6fe',
    shadowColor: '#000',
    shadowOffset: {
      width: 0,
      height: 1,
    },
    shadowOpacity: 0.1,
    shadowRadius: 2,
    elevation: 1,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
  },
  waterImg: {
    height: verticalScale(40),
    width: scale(30),
    resizeMode: 'stretch',
    marginStart: scale(8),
  },
  waterTxt: {
    color: Color.gray,
    fontWeight: '600',
    marginTop: verticalScale(20),
    marginEnd: scale(5),
  },
});
