import {
  StyleSheet,
  Text,
  View,
  Animated,
  SafeAreaView,
  TouchableOpacity,
  Pressable,
} from 'react-native';
import React, { useEffect, useState, useRef, useCallback } from 'react';
import { scale, verticalScale } from 'react-native-size-matters';
import { Color } from '../assets/styles/Colors';
import { useFocusEffect, useNavigation } from '@react-navigation/native';
import HydratedView from './HydratedView';
import { useDispatch, useSelector } from 'react-redux';
import {
  GetWaterIntakeDetails,
  SetWaterIntakeDetails,
} from '../Apis/ClientApis/WaterIntakeApi';
import OnOffFunctionality from './OnOffFunctionality';
import Entypo from 'react-native-vector-icons/Entypo';
import Feather from 'react-native-vector-icons/Feather';
import Drop from '../assets/Images/drop.svg';
import Bottle from '../assets/Images/bottel.svg';
import Glass from '../assets/Images/glass.svg';
import { Shadow } from 'react-native-shadow-2';
import { Font } from '../assets/styles/Fonts';
import { ShadowValues } from '../assets/styles/Shadow';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { addWaterData, getWaterIntake } from '../redux/client';

const HydratedStay = () => {
  const navigation = useNavigation();
  const dispatch = useDispatch();

  const tokenId = useSelector((state) => state?.user?.token);
  const waterData = useSelector((state) => state?.client?.waterData);
  const intake = useSelector((state) => state?.client?.waterIntake);
  console.log('intake', intake)



  const token = tokenId?.token;
  const id = tokenId?.id;

  const [sevenL, setSevenL] = useState(0);
  const [seventeenL, setSevenTeenL] = useState(0);
  const [waterIntake, setWaterIntake] = useState([]);
  const [currentProgress, setCurrentProgress] = useState(0);
  const [loading, setLoading] = useState(true);
  const [hasLoaded, setHasLoaded] = useState(false);

  const widthAnimation = useRef(new Animated.Value(0)).current;
  const prevUserIdRef = useRef(null);

  const getStorageKey = useCallback((key) => `${key}_${id}`, [id]);

  const totalGoal = waterIntake?.waterIntakeData?.waterIntakeLimit || 2;



  const resetLocalWaterData = async () => {
    await AsyncStorage.multiSet([
      [getStorageKey('sevenL'), '0'],
      [getStorageKey('seventeenL'), '0'],
      [getStorageKey('lastHydrationDate'), new Date().toDateString()],
    ]);
    setSevenL(0);
    setSevenTeenL(0);
    setCurrentProgress(0);
    widthAnimation.setValue(0);
  };

  const loadLocalWaterData = async () => {
    const today = new Date().toDateString();
    const lastDate = await AsyncStorage.getItem(getStorageKey('lastHydrationDate'));

    if (lastDate !== today) {
      await resetLocalWaterData();
    } else {
      const [savedSevenL, savedSeventeenL] = await Promise.all([
        AsyncStorage.getItem(getStorageKey('sevenL')),
        AsyncStorage.getItem(getStorageKey('seventeenL')),
      ]);
      setSevenL(parseFloat(savedSevenL) || 0);
      setSevenTeenL(parseFloat(savedSeventeenL) || 0);
    }
  };


  const fetchWaterIntake = async () => {
    if (!token || !id) return;
    try {
      setLoading(true);
      const response = await GetWaterIntakeDetails(token, id);
      setWaterIntake(response);
    } catch (error) {
      console.error('Error fetching water intake:', error);
    } finally {
      setLoading(false);
      setHasLoaded(true);
    }
  };

  const handleAddWater = async (amount) => {
    try {
      setLoading(true);

      let updatedTotal = intake || 0;
      updatedTotal += amount * 1000;
      if (amount === 0.2) {
        setSevenL((prev) => {
          const updated = prev + amount;
          AsyncStorage.setItem(getStorageKey('sevenL'), updated.toString());
          return updated;
        });
      } else if (amount === 0.5) {
        setSevenTeenL((prev) => {
          const updated = prev + amount;
          AsyncStorage.setItem(getStorageKey('seventeenL'), updated.toString());
          return updated;
        });
      }


      dispatch(getWaterIntake(updatedTotal));

      const currentDate = new Date();
      const time = `${currentDate.getHours().toString().padStart(2, '0')}:${currentDate.getMinutes().toString().padStart(2, '0')}`;

      const payload = {
        waterIntakeId: waterIntake?.waterIntakeData?._id,
        clientId: waterIntake?.waterIntakeData?.clientId,
        token,
        date: currentDate,
        amount: amount * 1000,
        time,
      };

      await SetWaterIntakeDetails(payload);

      const updatedData = await GetWaterIntakeDetails(token, id);
      setWaterIntake(updatedData);
    } catch (error) {
      console.error('Add water error:', error);
    } finally {
      setLoading(false);
    }
  };

  const getData = async () => {

    const data = await GetWaterIntakeDetails(token, id)
    // console.log('data', data?.waterIntakeData?.waterIntakeRecords[1]?.waterIntakeAmount)
  }

  useFocusEffect(
    useCallback(() => {
      getData();
    }, [token, id])
  );


  const plusData = {
    clientId: waterIntake?.waterIntakeData?.clientId,
    token,
    date: new Date(),
    press: 'plus',
  };

  useEffect(() => {
    if (id && prevUserIdRef.current && prevUserIdRef.current !== id) {
      resetLocalWaterData();
    }
    prevUserIdRef.current = id;
  }, [id]);

  useEffect(() => {
    if (id) loadLocalWaterData();
  }, [id]);

  useEffect(() => {
    fetchWaterIntake();
  }, [token, id]);

  useEffect(() => {
    const total = (waterData?.waterIntakes || []).reduce(
      (sum, entry) => sum + (entry?.amount || 0) / 1000,
      0
    );
    setCurrentProgress(total + sevenL + seventeenL);
  }, [waterData, sevenL, seventeenL]);


  // useEffect(() => {
  //   if (!hasLoaded) return;

  //   const progressPercentage = Math.min((currentProgress / totalGoal) * 100, 100);
  //   Animated.timing(widthAnimation, {
  //     toValue: progressPercentage,
  //     duration: 1000,
  //     useNativeDriver: false,
  //   }).start();
  // }, [currentProgress, totalGoal, hasLoaded]);

  useEffect(() => {
    if (!hasLoaded) return;

    const progress = intake === 0 ? 0 : (currentProgress / totalGoal) * 100;
    const progressPercentage = Math.min(progress, 100);

    Animated.timing(widthAnimation, {
      toValue: progressPercentage,
      duration: 1000,
      useNativeDriver: false,
    }).start();
  }, [intake, currentProgress, totalGoal, hasLoaded]);


  return (
    <SafeAreaView>
      <View style={styles.waterContainer}>
        <View style={styles.topContainer}>
          <View>
            <Text style={styles.mainTitle}>Are you staying hydrated?</Text>
            <Text style={styles.subTitle}>Keep going to reach your daily goal!</Text>
          </View>

          <View>
            <View style={styles.showIntake}>
              <Text style={styles.intakeTxt}>Current intake</Text>
              <Text style={styles.intakeTxt}>
                {/* {`${intake.toString()?.toFixed(1)}L / ${totalGoal}L`} */}
                {intake}
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
          <View style={styles.hydrationButtons}>
            {[
              { label: '200mL', Icon: Glass, onPress: () => handleAddWater(0.2) },
              { label: '500mL', Icon: Bottle, onPress: () => handleAddWater(0.5) },
              {
                label: 'Custom',
                Icon: Drop,
                onPress: () => navigation.navigate('waterIntakeLog', { plusData }),
              },
            ].map(({ label, Icon, onPress }, idx) => (
              <View key={label + idx} style={{ width: '30%' }}>
                <TouchableOpacity style={styles.waterCardView} onPress={onPress}>
                  <Icon height={verticalScale(40)} width={scale(45)} style={styles.waterIcon} />
                  <View style={styles.plusIcon}>
                    <Feather name="plus" color={Color.primaryColor} size={verticalScale(15)} />
                  </View>
                </TouchableOpacity>
                <Text style={styles.waterTxt}>{label}</Text>
              </View>
            ))}
          </View>
        </View>

        <View style={{ marginTop: scale(10) }}>
          <Shadow
            distance={ShadowValues.blackShadowDistance}
            startColor={ShadowValues.blackShadow}
            style={{ width: '100%' }}>
            <View style={{ borderRadius: scale(5), backgroundColor: Color.white }}>
              <Pressable onPress={() => navigation.navigate('waterIntake')}>
                <View
                  style={{
                    flexDirection: 'row',
                    padding: scale(6),
                    justifyContent: 'space-between',
                    alignItems: 'center',
                  }}>
                  <Text style={styles.waterText}>See All Water Logs</Text>
                  <Entypo name="chevron-right" size={24} color={Color.primaryColor} />
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
    backgroundColor: Color.primaryLight,
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
    marginTop: verticalScale(5),
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
    marginTop: verticalScale(2),
    fontFamily: Font?.Poppins,
  },
  hydrateContainer: {
    height: verticalScale(10),
    width: '100%',
    backgroundColor: Color.lightgray,
    alignSelf: 'center',
    marginTop: verticalScale(10),
    marginVertical: verticalScale(5),
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
    backgroundColor: Color?.white,
    justifyContent: 'center',
    borderWidth: scale(1.6),
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
    fontFamily: Font?.Poppins,
    fontSize: scale(14),
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


