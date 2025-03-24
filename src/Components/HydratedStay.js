import {
  StyleSheet,
  Text,
  View,
  Animated,
  SafeAreaView,
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

const HydratedStay = () => {
  const navigation = useNavigation();

  const [sevenL, setSevenL] = useState(0);
  const [seventeenL, setSevenTeenL] = useState(0);
  const [waterIntake, setWaterIntake] = useState([]);
  const [loading, setLoading] = useState(true);

  const getToken = useSelector(state => state?.user?.userInfo);
  const token = getToken?.token;
  const id = getToken?.userData?._id || getToken?.user?._id;

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
      const currentTime = currentDate.toLocaleTimeString('en-US', {
        hour: '2-digit',
        minute: '2-digit',
        hour12: true,
      });

      const payload = {
        // waterIntakeId: waterIntake?.waterIntakeData?._id,
        clientId: waterIntake?.waterIntakeData?.clientId,
        token: token,
        date: currentDate,
        amount: amount * 1000,
        time: currentTime,
      };

      await SetWaterIntakeDetails(payload);
      const updatedData = await GetWaterIntakeDetails(token, id);

      setWaterIntake(updatedData);
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
          <HydratedView
            onPress={() => handleAddWater(0.2)}
            img={require('../assets/Images/glass.png')}
            valueText={'200mL'}
          />
          <HydratedView
            onPress={() => handleAddWater(0.5)}
            img={require('../assets/Images/bottel.png')}
            valueText={'500mL'}
          />
          <HydratedView
            onPress={() =>
              navigation.navigate('waterIntakeLog', {plusData: plusData})
            }
            img={require('../assets/Images/drop.png')}
            valueText={'Custom'}
          />
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
});
