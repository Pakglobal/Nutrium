import {
  StyleSheet,
  Text,
  View,
  Animated,
  TouchableOpacity,
  Easing,
} from 'react-native';
import React, {useEffect, useState, useRef, useCallback, useMemo} from 'react';
import {scale, verticalScale} from 'react-native-size-matters';
import {Color} from '../assets/styles/Colors';
import {useFocusEffect, useNavigation} from '@react-navigation/native';
import {useDispatch, useSelector} from 'react-redux';
import {
  GetWaterIntakeDetails,
  GetWaterintakeLimitData,
  SetWaterIntakeDetails,
} from '../Apis/ClientApis/WaterIntakeApi';
import Feather from 'react-native-vector-icons/Feather';
import Drop from '../assets/Images/drop.svg';
import Bottle from '../assets/Images/bottle.svg';
import Glass from '../assets/Images/glass.svg';
import {Font} from '../assets/styles/Fonts';
import {shadowStyle} from '../assets/styles/Shadow';
import AsyncStorage from '@react-native-async-storage/async-storage';
import {getWaterIntake} from '../redux/client';
import CustomShadow from './CustomShadow';
import CustomHomeButtonNavigation from './CustomHomeButtonNavigation';

const debounce = (func, wait) => {
  let timeout;
  return (...args) => {
    clearTimeout(timeout);
    timeout = setTimeout(() => func(...args), wait);
  };
};

const HydratedStay = ({route}) => {
  const navigation = useNavigation();
  const dispatch = useDispatch();

  const waterData = useSelector(state => state?.client?.waterData);
  const intake = useSelector(state => state?.client?.waterIntake);

  const [sevenL, setSevenL] = useState(0);
  const [seventeenL, setSeventeenL] = useState(0);
  const [waterIntake, setWaterIntake] = useState([]);
  const [currentProgress, setCurrentProgress] = useState(0);
  const [limit, setLimit] = useState('');
  const [hasLoaded, setHasLoaded] = useState(false);
  const [localIntake, setLocalIntake] = useState(intake || 0);
  const [error, setError] = useState(null);
  const latestUpdateRef = useRef(null);
  const pendingUpdatesRef = useRef(0);

  const tokenId = useSelector(state => state?.user?.token);
  const guestTokenId = useSelector(state => state?.user?.guestToken);
  const token = tokenId?.token || guestTokenId?.token;
  const id = tokenId?.id || guestTokenId?.id;

  const totalGoal = waterIntake?.waterIntakeData?.waterIntakeLimit || 2;
  const widthAnimation = useRef(new Animated.Value(0)).current;
  const prevUserIdRef = useRef(null);

  const getStorageKey = useCallback(key => `${key}_${id}`, [id]);

  const resetLocalWaterData = useCallback(async () => {
    await AsyncStorage.multiSet([
      [getStorageKey('sevenL'), '0'],
      [getStorageKey('seventeenL'), '0'],
      [getStorageKey('lastHydrationDate'), new Date().toDateString()],
    ]);
    setSevenL(0);
    setSeventeenL(0);
    setCurrentProgress(0);
    setLocalIntake(0);
    widthAnimation.setValue(0);
  }, [getStorageKey, widthAnimation]);

  const fetchWaterIntake = useCallback(async () => {
    if (!token || !id) return;
    try {
      const response = await GetWaterIntakeDetails(token, id);
      setWaterIntake(response);
      setError(null);
      return response;
    } catch (error) {
      console.error('Error fetching water intake:', error);
      setError('Failed to fetch water intake data. Please try again.');
      return null;
    } finally {
      setHasLoaded(true);
    }
  }, [token, id]);

  const getData = useCallback(async () => {
    if (!token || !id) return;
    try {
      const data = await GetWaterIntakeDetails(token, id);
      const allRecords = data?.waterIntakeData?.waterIntakeRecords || [];
      const today = new Date().toISOString().split('T')[0];

      const todayRecord = allRecords.find(
        record => record?.date?.split('T')[0] === today,
      );

      const total =
        todayRecord?.waterIntakeAmount?.reduce((sum, item) => {
          const ml = parseFloat(item.amount.replace('ml', '')) || 0;
          return sum + ml;
        }, 0) || 0;

      if (
        !latestUpdateRef.current ||
        (todayRecord?.date &&
          new Date(todayRecord.date) >= new Date(latestUpdateRef.current))
      ) {
        setLocalIntake(total);
        dispatch(getWaterIntake(total));
        latestUpdateRef.current = todayRecord?.date || new Date().toISOString();
      }
      setError(null);
      return data;
    } catch (error) {
      console.error('Error fetching water data:', error);
      setError('Failed to fetch water data. Please try again.');
      return null;
    }
  }, [token, id, dispatch]);

  const handleAddWater = useCallback(
    async amount => {
      if (!token || !id) return;

      const mlAmount = amount * 1000;
      const currentDate = new Date();
      const time = `${currentDate
        .getHours()
        .toString()
        .padStart(2, '0')}:${currentDate
        .getMinutes()
        .toString()
        .padStart(2, '0')}`;

      const newIntake = (localIntake || 0) + mlAmount;
      setLocalIntake(prevIntake => prevIntake + mlAmount);
      dispatch(getWaterIntake(newIntake));

      if (amount === 0.2) {
        setSevenL(prev => prev + amount);
      } else if (amount === 0.3) {
        setSeventeenL(prev => prev + amount);
      }

      pendingUpdatesRef.current += 1;

      const payload = {
        waterIntakeId: waterIntake?.waterIntakeData?._id || '',
        clientId: waterIntake?.waterIntakeData?.clientId || id,
        token,
        date: currentDate,
        amount: mlAmount,
        time,
      };

      try {
        await SetWaterIntakeDetails(payload);

        if (pendingUpdatesRef.current === 1) {
          const updatedData = await GetWaterIntakeDetails(token, id);
          setWaterIntake(updatedData);
        }

        latestUpdateRef.current = currentDate.toISOString();
        setError(null);
      } catch (error) {
        console.error('Water update error:', error);
        setError('Failed to update water intake. Please try again.');

        setLocalIntake(prevIntake => prevIntake - mlAmount);
        dispatch(getWaterIntake(localIntake || 0));

        if (amount === 0.2) {
          setSevenL(prev => prev - amount);
        } else if (amount === 0.3) {
          setSeventeenL(prev => prev - amount);
        }
      } finally {
        pendingUpdatesRef.current -= 1;
      }
    },
    [token, id, dispatch, localIntake, waterIntake],
  );

  const debouncedHandleAddWater = useMemo(
    () => debounce(handleAddWater, 500),
    [handleAddWater],
  );

  const getWaterLimit = useCallback(async () => {
    try {
      const data = await GetWaterintakeLimitData(token, id);
      setLimit(data?.waterIntakeLimit?.waterIntakeLimit || '2 L');
    } catch (error) {
      console.error('Error fetching water limit:', error);
      setLimit('2 L');
    }
  }, [token, id]);

  useFocusEffect(
    useCallback(() => {
      if (token && id && pendingUpdatesRef.current === 0) getData();
    }, [token, id, getData]),
  );

  useEffect(() => {
    const initializeData = async () => {
      const lastHydrationDate = await AsyncStorage.getItem(
        getStorageKey('lastHydrationDate'),
      );
      const today = new Date().toDateString();
      if (lastHydrationDate !== today) {
        await resetLocalWaterData();
      }

      if (token && id) {
        const data = await fetchWaterIntake();
        if (data) await getData();

        if (id && prevUserIdRef.current && prevUserIdRef.current !== id) {
          await resetLocalWaterData();
        }
        prevUserIdRef.current = id;
      }
      await getWaterLimit();
    };

    initializeData();
  }, [
    token,
    id,
    fetchWaterIntake,
    getData,
    getWaterLimit,
    resetLocalWaterData,
  ]);

  useEffect(() => {
    if (intake === 0) {
      setLocalIntake(0);
      setCurrentProgress(0);
      widthAnimation.setValue(0);
    } else if (intake !== undefined) {
      setLocalIntake(intake);
    }
  }, [intake]);

  useEffect(() => {
    const total = (waterData?.waterIntakes || []).reduce(
      (sum, entry) => sum + (entry?.amount || 0) / 1000,
      0,
    );
    setCurrentProgress(total + sevenL + seventeenL);
  }, [waterData, sevenL, seventeenL]);

  useEffect(() => {
    if (!hasLoaded || totalGoal === 0 || !localIntake) return;
    const progress = localIntake / (totalGoal * 1000);
    const progressPercentage = Math.min(progress * 100, 100);

    Animated.timing(widthAnimation, {
      toValue: isNaN(progressPercentage) ? 0 : progressPercentage,
      duration: 300,
      easing: Easing.out(Easing.ease),
      useNativeDriver: false,
    }).start();
  }, [localIntake, totalGoal, hasLoaded, widthAnimation]);

  useEffect(() => {
    return () => {
      debouncedHandleAddWater.cancel && debouncedHandleAddWater.cancel();
    };
  }, [debouncedHandleAddWater]);

  const plusData = {
    clientId: waterIntake?.waterIntakeData?.clientId || id,
    token,
    date: new Date(),
    press: 'plus',
  };

  return (
    <View style={{marginVertical: verticalScale(18)}}>
      <CustomShadow radius={3}>
        <View style={shadowStyle}>
          <View style={styles.waterContainer}>
            {error && <Text style={styles.errorText}>{error}</Text>}
            <View>
              <Text style={styles.mainTitle}>Are you staying hydrated?</Text>
              <Text style={styles.subTitle}>
                Keep going to reach your daily goal!
              </Text>
            </View>

            <View>
              <View style={styles.showIntake}>
                <Text style={styles.intakeTxt}>Current intake</Text>
                <Text style={styles.intakeTxt}>
                  {localIntake >= 1000
                    ? `${(localIntake / 1000).toFixed(1)} L`
                    : `${localIntake} ml`}
                  / {limit || '2 L'}
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

            <View style={styles.hydrationButtons}>
              {[
                {
                  label: '200mL',
                  Icon: Glass,
                  onPress: () => debouncedHandleAddWater(0.2),
                },
                {
                  label: '300mL',
                  Icon: Bottle,
                  onPress: () => debouncedHandleAddWater(0.3),
                },
                {
                  label: 'Custom',
                  Icon: Drop,
                  onPress: () =>
                    navigation.navigate('waterIntakeLog', {plusData}),
                },
              ].map(({label, Icon, onPress}, idx) => (
                <View style={{width: '30%'}} key={label + idx}>
                  <CustomShadow color={Color.lightgray}>
                    <View>
                      <TouchableOpacity
                        style={[styles.waterCardView]}
                        onPress={onPress}>
                        <Icon
                          height={verticalScale(40)}
                          width={scale(45)}
                          style={styles.waterIcon}
                        />
                        <View style={styles.plusIcon}>
                          <Feather
                            name="plus"
                            color={Color.primaryColor}
                            size={verticalScale(15)}
                          />
                        </View>
                      </TouchableOpacity>
                    </View>
                  </CustomShadow>
                  <Text style={styles.waterTxt}>{label}</Text>
                </View>
              ))}
            </View>

            <CustomHomeButtonNavigation
              text={'See All Water Logs'}
              onPress={() => navigation.navigate('waterIntake')}
            />
          </View>
        </View>
      </CustomShadow>
    </View>
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
    fontSize: scale(14),
    fontFamily: Font?.Poppins,
    marginTop: verticalScale(2),
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
    fontSize: scale(14),
    color: Color.txt,
  },
  mainTitle: {
    fontSize: scale(16),
    color: Color.textColor,
    fontFamily: Font?.PoppinsMedium,
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
    marginStart: scale(5),
  },
  subTitle: {
    fontSize: scale(14),
    color: Color.subText,
    fontFamily: Font?.Poppins,
  },
  hydrateContainer: {
    height: verticalScale(10),
    width: '100%',
    backgroundColor: Color.lightgray,
    alignSelf: 'center',
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
    zIndex: 1,
  },
  hydrationButtons: {
    marginTop: verticalScale(15),
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
    fontSize: scale(12),
    color: Color.txt,
    marginRight: scale(10),
  },
  waterCardView: {
    borderRadius: scale(5),
    height: verticalScale(70),
    backgroundColor: Color?.white,
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
    marginTop: verticalScale(5),
    textAlign: 'center',
    fontFamily: Font?.Poppins,
    fontSize: scale(14),
  },
  waterText: {
    fontSize: scale(12),
    color: Color.primaryColor,
    fontFamily: Font?.Poppins,
    marginTop: verticalScale(2),
    marginLeft: scale(5),
  },
  errorText: {
    color: Color.red,
    fontSize: scale(12),
    fontFamily: Font?.Poppins,
    textAlign: 'center',
    marginBottom: verticalScale(10),
  },
});
