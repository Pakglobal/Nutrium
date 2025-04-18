// import {
//   StyleSheet,
//   Text,
//   View,
//   Animated,
//   SafeAreaView,
//   TouchableOpacity,
//   Pressable,
//   Easing,
// } from 'react-native';

// import { useFocusEffect, useNavigation } from '@react-navigation/native';

// import React, { useEffect, useState, useRef, useCallback } from 'react';
// import { scale, verticalScale } from 'react-native-size-matters';
// import { Color } from '../assets/styles/Colors';

// import { useDispatch, useSelector } from 'react-redux';
// import {
//   GetWaterIntakeDetails,
//   SetWaterIntakeDetails,
// } from '../Apis/ClientApis/WaterIntakeApi';
// import OnOffFunctionality from './OnOffFunctionality';
// import Entypo from 'react-native-vector-icons/Entypo';
// import Feather from 'react-native-vector-icons/Feather';
// import Drop from '../assets/Images/drop.svg';
// import Bottle from '../assets/Images/bottel.svg';
// import Glass from '../assets/Images/glass.svg';
// import { Shadow } from 'react-native-shadow-2';
// import { Font } from '../assets/styles/Fonts';
// import { shadowStyle, ShadowValues } from '../assets/styles/Shadow';
// import AsyncStorage from '@react-native-async-storage/async-storage';

// import { getWaterIntake } from '../redux/client';

// import CustomHomeButtonNavigation from './CustomHomeButtonNavigation';
// import CustomShadow from './CustomShadow';

// const HydratedStay = ({ route }) => {
//   const navigation = useNavigation();
//   const dispatch = useDispatch();
//   const [sevenL, setSevenL] = useState(0);
//   const [seventeenL, setSevenTeenL] = useState(0);
//   const [waterIntake, setWaterIntake] = useState([]);
//   const [getwaterIntake, setGetWaterIntake] = useState([]);
//   const [currentProgress, setCurrentProgress] = useState(0);
//   const [loading, setLoading] = useState(true);
//   const [hasLoaded, setHasLoaded] = useState(false);

//   const tokenId = useSelector(state => state?.user?.token);
//   const guestTokenId = useSelector(state => state?.user?.guestToken);
//   const token = tokenId?.token || guestTokenId?.token;
//   const id = tokenId?.id || guestTokenId?.id;
//   const waterData = useSelector(state => state?.client?.waterData);
//   const intake = useSelector(state => state?.client?.waterIntake);
//   const [localIntake, setLocalIntake] = useState(intake || 0);
//   console.log('intake', intake, localIntake)
//   console.log('--', route);


//   const widthAnimation = useRef(new Animated.Value(0)).current;
//   const prevUserIdRef = useRef(null);

//   const getStorageKey = useCallback(key => `${key}_${id}`, [id]);

//   const totalGoal = waterIntake?.waterIntakeData?.waterIntakeLimit || 2;

//   const resetLocalWaterData = async () => {
//     await AsyncStorage.multiSet([
//       [getStorageKey('sevenL'), '0'],
//       [getStorageKey('seventeenL'), '0'],
//       [getStorageKey('lastHydrationDate'), new Date().toDateString()],
//     ]);
//     setSevenL(0);
//     setSevenTeenL(0);
//     setCurrentProgress(0);
//     widthAnimation.setValue(0);
//   };

//   const fetchWaterIntake = async () => {
//     if (!token || !id) return;
//     try {
//       setLoading(true);
//       const response = await GetWaterIntakeDetails(token, id);
//       setWaterIntake(response);
//     } catch (error) {
//       console.error('Error fetching water intake:', error);
//     } finally {
//       setLoading(false);
//       setHasLoaded(true);
//     }
//   };

//   const handleAddWater = (amount) => {
//     const mlAmount = amount * 1000;

//     const newIntake = (intake || 0) + mlAmount;
//     dispatch(getWaterIntake(newIntake));

//     if (amount === 0.2) {
//       setSevenL(prev => prev + amount);
//     } else if (amount === 0.3) {
//       setSevenTeenL(prev => prev + amount);
//     }

//     setLocalIntake(prev => prev + mlAmount);

//     const currentDate = new Date();
//     const time = `${currentDate.getHours().toString().padStart(2, '0')}:${currentDate.getMinutes().toString().padStart(2, '0')}`;

//     const payload = {
//       waterIntakeId: waterIntake?.waterIntakeData?._id,
//       clientId: waterIntake?.waterIntakeData?.clientId,
//       token,
//       date: currentDate,
//       amount: mlAmount,
//       time,
//     };

//     setTimeout(() => {
//       SetWaterIntakeDetails(payload)
//         .then(() => GetWaterIntakeDetails(token, id))
//         .then(updatedData => {
//           setWaterIntake(updatedData);


//           const shouldUpdateBackground = Math.random() > 0.7; 
//           if (shouldUpdateBackground) {
//             getData();
//           }
//         })
//         .catch(error => {
//           console.error('Water update error:', error);
//         });
//     }, 0);
//   };

//   const getData = async () => {
//     const data = await GetWaterIntakeDetails(token, id);
//     const allRecords = data?.waterIntakeData?.waterIntakeRecords || [];

//     const today = new Date().toISOString().split('T')[0];
//     const todayRecord = allRecords.find(record => {
//       return record?.date?.split('T')[0] === today;
//     });

//     setGetWaterIntake(todayRecord || {});
//   };

//   useFocusEffect(
//     useCallback(() => {
//       getData();
//     }, [token, id]),
//   );

//   useEffect(() => {
//     if (!getwaterIntake?.waterIntakeAmount) return;

//     const total = getwaterIntake.waterIntakeAmount.reduce((sum, item) => {
//       const ml = parseFloat(item.amount.replace('ml', '')) || 0;
//       return sum + ml;
//     }, 0);

//     setLocalIntake(total);
//   }, [getwaterIntake]);

//   useEffect(() => {
//     fetchWaterIntake();
//     if (id && prevUserIdRef.current && prevUserIdRef.current !== id) {
//       resetLocalWaterData();
//     }
//     prevUserIdRef.current = id;
//   }, [token, id]);

//   useEffect(() => {
//     const total = (waterData?.waterIntakes || []).reduce(
//       (sum, entry) => sum + (entry?.amount || 0) / 1000,
//       0,
//     );
//     setCurrentProgress(total + sevenL + seventeenL);
//   }, [waterData]);


//   useEffect(() => {
//     if (!hasLoaded || totalGoal === 0) return;

//     const progress = localIntake / (totalGoal * 1000);
//     const progressPercentage = Math.min(progress * 100, 100);

//     Animated.timing(widthAnimation, {
//       toValue: progressPercentage,
//       duration: 800,
//       easing: Easing.out(Easing.ease),
//       useNativeDriver: false,
//     }).start();
//   }, [localIntake, totalGoal, hasLoaded]);


//   const plusData = {
//     clientId: waterIntake?.waterIntakeData?.clientId,
//     token,
//     date: new Date(),
//     press: 'plus',
//   };

//   return (
//     <View style={{ marginVertical: verticalScale(18) }}>
//       <CustomShadow radius={3}>
//         <View style={shadowStyle}>
//           <View style={styles.waterContainer}>
//             <View style={styles.topContainer}>
//               <View>
//                 <Text style={styles.mainTitle}>Are you staying hydrated?</Text>
//                 <Text style={styles.subTitle}>
//                   Keep going to reach your daily goal!
//                 </Text>
//               </View>

//               <View>
//                 <View style={styles.showIntake}>
//                   <Text style={styles.intakeTxt}>Current intake</Text>

//                   <Text style={styles.intakeTxt}>
//                     {localIntake >= 1000
//                       ? `${(localIntake / 1000).toFixed(1)} L`
//                       : `${localIntake} ml`}
//                   </Text>
//                 </View>

//                 <View style={styles.hydrateContainer}>
//                   <Animated.View
//                     style={[
//                       styles.hydrateView,
//                       {
//                         width: widthAnimation.interpolate({
//                           inputRange: [0, 100],
//                           outputRange: ['0%', '100%'],
//                         }),
//                         position: 'absolute',
//                       },
//                     ]}
//                   />
//                 </View>
//               </View>
//             </View>

//             <View style={styles.bottomContainer}>
//               <View style={styles.hydrationButtons}>
//                 {[
//                   {
//                     label: '200mL',
//                     Icon: Glass,
//                     onPress: () => handleAddWater(0.2),
//                   },
//                   {
//                     label: '300mL',
//                     Icon: Bottle,
//                     onPress: () => handleAddWater(0.3),
//                   },

//                   {
//                     label: 'Custom',
//                     Icon: Drop,
//                     onPress: () =>
//                       navigation.navigate('waterIntakeLog', { plusData }),
//                   },
//                 ].map(({ label, Icon, onPress }, idx) => (
//                   <View style={{ width: '30%' }}>
//                     <CustomShadow color={Color.lightgray}>
//                       <View key={label + idx}>
//                         <TouchableOpacity
//                           style={styles.waterCardView}
//                           onPress={onPress}>
//                           <Icon
//                             height={verticalScale(40)}
//                             width={scale(45)}
//                             style={styles.waterIcon}
//                           />
//                           <View style={styles.plusIcon}>
//                             <Feather
//                               name="plus"
//                               color={Color.primaryColor}
//                               size={verticalScale(15)}
//                             />
//                           </View>
//                         </TouchableOpacity>
//                       </View>
//                     </CustomShadow>
//                     <Text style={styles.waterTxt}>{label}</Text>
//                   </View>
//                 ))}
//               </View>
//             </View>
//             <CustomHomeButtonNavigation
//               text={'See All Water Logs'}
//               onPress={() => navigation.navigate('waterIntake')}
//             />
//           </View>
//         </View>
//       </CustomShadow>
//     </View>
//   );
// };

// export default HydratedStay;

// const styles = StyleSheet.create({
//   waterContainer: {
//     padding: scale(10),
//   },
//   plusIcon: {
//     backgroundColor: Color.primaryLight,
//     position: 'absolute',
//     right: scale(5),
//     top: scale(5),
//     borderRadius: scale(3),
//   },
//   waterIcon: {
//     alignSelf: 'center',
//   },
//   intakeTxt: {
//     color: Color?.primaryColor,
//     fontWeight: '500',
//     fontSize: scale(14),
//     fontFamily: Font?.Poppins,
//     marginTop: verticalScale(2),
//   },
//   showIntake: {
//     flexDirection: 'row',
//     justifyContent: 'space-between',
//     marginTop: scale(5),
//   },
//   header: {
//     flexDirection: 'row',
//     justifyContent: 'space-between',
//     alignItems: 'center',
//   },
//   title: {
//     fontSize: scale(14),
//     fontWeight: '500',
//     color: Color.txt,
//   },
//   mainTitle: {
//     fontSize: scale(16),
//     fontWeight: '500',
//     color: Color.textColor,
//     fontFamily: Font?.PoppinsMedium,
//   },
//   buttonContainer: {
//     flexDirection: 'row',
//     alignItems: 'center',
//     paddingHorizontal: scale(10),
//     paddingVertical: verticalScale(5),
//     borderRadius: scale(20),
//   },
//   buttonText: {
//     color: Color.primaryColor,
//     fontWeight: '600',
//     marginStart: scale(5),
//   },
//   subTitle: {
//     fontSize: scale(14),
//     fontWeight: '400',
//     color: Color.subText,
//     fontFamily: Font?.Poppins,
//   },
//   hydrateContainer: {
//     height: verticalScale(10),
//     width: '100%',
//     backgroundColor: Color.lightgray,
//     alignSelf: 'center',
//     marginVertical: verticalScale(5),
//     borderRadius: scale(15),
//     justifyContent: 'center',
//     alignItems: 'center',
//     overflow: 'hidden',
//   },
//   hydrateView: {
//     backgroundColor: Color?.primaryColor,
//     borderRadius: scale(15),
//     height: '100%',
//     left: 0,
//   },
//   hydrationText: {
//     color: Color.txt,
//     fontWeight: '700',
//     zIndex: 1,
//   },
//   hydrationButtons: {
//     marginTop: verticalScale(15),
//     flexDirection: 'row',
//     justifyContent: 'space-between',
//   },
//   logButton: {
//     flexDirection: 'row',
//     alignItems: 'center',
//     marginStart: scale(15),
//     marginVertical: verticalScale(10),
//   },
//   logText: {
//     fontSize: scale(12),
//     color: Color.txt,
//     fontWeight: '500',
//     marginRight: scale(10),
//   },
//   waterCardView: {
//     borderRadius: scale(5),
//     height: verticalScale(70),
//     backgroundColor: Color?.white,
//     justifyContent: 'center',
//     borderWidth: scale(1),
//     borderColor: Color?.primaryColor,
//   },
//   waterImg: {
//     height: verticalScale(40),
//     width: scale(30),
//     resizeMode: 'stretch',
//     marginStart: scale(8),
//   },
//   waterTxt: {
//     color: Color.primaryColor,
//     fontWeight: '400',
//     marginTop: verticalScale(5),
//     textAlign: 'center',
//     fontFamily: Font?.Poppins,
//     fontSize: scale(14),
//   },
//   waterText: {
//     fontSize: scale(12),
//     color: Color.primaryColor,
//     fontWeight: '500',
//     fontFamily: Font?.Poppins,
//     marginTop: verticalScale(2),
//     marginLeft: scale(5),
//   },
// });


import {
  StyleSheet,
  Text,
  View,
  Animated,
  TouchableOpacity,
  Easing,
} from 'react-native';
import React, { useEffect, useState, useRef, useCallback, useMemo } from 'react';
import { scale, verticalScale } from 'react-native-size-matters';
import { Color } from '../assets/styles/Colors';
import { useFocusEffect, useNavigation } from '@react-navigation/native';
import HydratedView from './HydratedView';
import { useDispatch, useSelector } from 'react-redux';
import {
  GetWaterIntakeDetails,
  SetWaterIntakeDetails,
} from '../Apis/ClientApis/WaterIntakeApi';
import Feather from 'react-native-vector-icons/Feather';
import Drop from '../assets/Images/drop.svg';
import Bottle from '../assets/Images/bottel.svg';
import Glass from '../assets/Images/glass.svg';
import { Shadow } from 'react-native-shadow-2';
import { Font } from '../assets/styles/Fonts';
import { shadowStyle, ShadowValues } from '../assets/styles/Shadow';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { addWaterData, getWaterIntake } from '../redux/client';
import CustomShadow from './CustomShadow';
import CustomHomeButtonNavigation from './CustomHomeButtonNavigation';

const HydratedStay = ({ route }) => {
  const navigation = useNavigation();
  const dispatch = useDispatch();
  const [sevenL, setSevenL] = useState(0);
  const [seventeenL, setSevenTeenL] = useState(0);
  const [waterIntake, setWaterIntake] = useState([]);
  const [getwaterIntake, setGetWaterIntake] = useState([]);
  const [currentProgress, setCurrentProgress] = useState(0);
  const [loading, setLoading] = useState(true);
  const [hasLoaded, setHasLoaded] = useState(false);

  const tokenId = useSelector(state => state?.user?.token);
  const guestTokenId = useSelector(state => state?.user?.guestToken);
  const token = tokenId?.token || guestTokenId?.token;
  const id = tokenId?.id || guestTokenId?.id;
  const waterData = useSelector(state => state?.client?.waterData);
  const intake = useSelector(state => state?.client?.waterIntake);
  const [localIntake, setLocalIntake] = useState(intake || 0);

  const widthAnimation = useRef(new Animated.Value(0)).current;
  const prevUserIdRef = useRef(null);

  const getStorageKey = useCallback(key => `${key}_${id}`, [id]);

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

  const fetchWaterIntake = async () => {
    if (!token || !id) return;
    try {
      setLoading(true);
      const response = await GetWaterIntakeDetails(token, id);
      setWaterIntake(response);
      return response;
    } catch (error) {
      console.error('Error fetching water intake:', error);
      return null;
    } finally {
      setLoading(false);
      setHasLoaded(true);
    }
  };

  const handleAddWater = (amount) => {
    const mlAmount = amount * 1000;

    // Get the current value from redux to ensure we're working with up-to-date data
    const currentIntake = intake || 0;
    const newIntake = currentIntake + mlAmount;

    // Update Redux state
    dispatch(getWaterIntake(newIntake));

    // Update local state
    if (amount === 0.2) {
      setSevenL(prev => prev + amount);
    } else if (amount === 0.3) {
      setSevenTeenL(prev => prev + amount);
    }

    // Update local intake
    setLocalIntake(prev => prev + mlAmount);

    const currentDate = new Date();
    const time = `${currentDate.getHours().toString().padStart(2, '0')}:${currentDate.getMinutes().toString().padStart(2, '0')}`;

    const payload = {
      waterIntakeId: waterIntake?.waterIntakeData?._id,
      clientId: waterIntake?.waterIntakeData?.clientId,
      token,
      date: currentDate,
      amount: mlAmount,
      time,
    };

    // Send the update to the server and refresh data
    setTimeout(() => {
      SetWaterIntakeDetails(payload)
        .then(() => {
          // Refresh all water data after adding water
          return GetWaterIntakeDetails(token, id);
        })
        .then(updatedData => {
          setWaterIntake(updatedData);
          // Always update data after adding water
          getData();
        })
        .catch(error => {
          console.error('Water update error:', error);
        });
    }, 0);
  };

  const getData = async () => {
    try {
      const data = await GetWaterIntakeDetails(token, id);
      const allRecords = data?.waterIntakeData?.waterIntakeRecords || [];

      const today = new Date().toISOString().split('T')[0];
      const todayRecord = allRecords.find(record => {
        return record?.date?.split('T')[0] === today;
      });

      setGetWaterIntake(todayRecord || {});

      // Calculate total from server data
      const total = todayRecord?.waterIntakeAmount
        ? todayRecord.waterIntakeAmount.reduce((sum, item) => {
          const ml = parseFloat(item.amount.replace('ml', '')) || 0;
          return sum + ml;
        }, 0)
        : 0;

      // Update local intake based on server data
      setLocalIntake(total);

      // Update Redux store with the latest value
      dispatch(getWaterIntake(total));

      return data;
    } catch (error) {
      console.error('Error fetching water data:', error);
      return null;
    }
  };

  useFocusEffect(
    useCallback(() => {
      if (token && id) {
        getData();
      }
    }, [token, id])
  );

  useEffect(() => {
    if (token && id) {
      fetchWaterIntake().then(() => {
        getData();
      });

      if (id && prevUserIdRef.current && prevUserIdRef.current !== id) {
        resetLocalWaterData();
      }
      prevUserIdRef.current = id;
    }
  }, [token, id]);


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

  // Update progress bar animation
  useEffect(() => {
    if (!hasLoaded || totalGoal === 0) return;

    const progress = localIntake / (totalGoal * 1000);
    const progressPercentage = Math.min(progress * 100, 100);

    Animated.timing(widthAnimation, {
      toValue: progressPercentage,
      duration: 800,
      easing: Easing.out(Easing.ease),
      useNativeDriver: false,
    }).start();
  }, [localIntake, totalGoal, hasLoaded]);

  const plusData = {
    clientId: waterIntake?.waterIntakeData?.clientId,
    token,
    date: new Date(),
    press: 'plus',
  };

  return (
    <View style={{ marginVertical: verticalScale(18) }}>
      <CustomShadow radius={3}>
        <View style={shadowStyle}>
          <View style={styles.waterContainer}>
            <View style={styles.topContainer}>
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
                  {
                    label: '200mL',
                    Icon: Glass,
                    onPress: () => handleAddWater(0.2),
                  },
                  {
                    label: '300mL',
                    Icon: Bottle,
                    onPress: () => handleAddWater(0.3),
                  },
                  {
                    label: 'Custom',
                    Icon: Drop,
                    onPress: () =>
                      navigation.navigate('waterIntakeLog', { plusData }),
                  },
                ].map(({ label, Icon, onPress }, idx) => (
                  <View style={{ width: '30%' }} key={label + idx}>
                    <CustomShadow color={Color.lightgray}>
                      <View>
                        <TouchableOpacity
                          style={styles.waterCardView}
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
    fontWeight: '500',
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
    fontWeight: '500',
    color: Color.txt,
  },
  mainTitle: {
    fontSize: scale(16),
    fontWeight: '500',
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
    fontWeight: '600',
    marginStart: scale(5),
  },
  subTitle: {
    fontSize: scale(14),
    fontWeight: '400',
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
    fontWeight: '700',
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
    fontWeight: '500',
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



