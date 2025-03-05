import React, {useCallback, useEffect, useState} from 'react';
import {View, Text, StyleSheet, TouchableOpacity} from 'react-native';
import {useFocusEffect, useNavigation} from '@react-navigation/native';
import {scale, verticalScale} from 'react-native-size-matters';
import AntDesign from 'react-native-vector-icons/AntDesign';
import Ionicons from 'react-native-vector-icons/Ionicons';
import CalenderHeader from '../../../../Components/CalenderHeader';
import Color from '../../../../assets/colors/Colors';
import BackHeader from '../../../../Components/BackHeader';
import {FetchFoodDiary} from '../../../../Apis/ClientApis/FoodDiary';
import {useSelector} from 'react-redux';

const FoodDiary = () => {
  const navigation = useNavigation();
  const [dayOffset, setDayOffset] = useState(0);

  const getToken = useSelector(state => state?.user?.userInfo);
  const token = getToken?.token;
  const id = getToken?.userData?._id || getToken?.user?._id;

  const getDateString = () => {
    if (dayOffset === 0) return 'Today';
    else if (dayOffset === -1) return 'Yesterday';
    const date = new Date();
    date.setDate(date.getDate() + dayOffset);
    const formattedDate = date.toLocaleDateString('en-US', {
      month: 'short',
      day: 'numeric',
      year: 'numeric',
    });
    return formattedDate;
  };

  const GetFoodDiaryData = async () => {
    try {
      const response = await FetchFoodDiary(token, id);
      console.log(response?.foodDiary?.foodDiaryData);
    } catch (error) {
      console.error('Error fetching food diary', error);
    }
  };

  useFocusEffect(
    useCallback(() => {
      GetFoodDiaryData();
    }, []),
  );

  return (
    <View style={{flex: 1, backgroundColor: Color.primary}}>
      <BackHeader
        titleName={'Food diary'}
        onPressBack={() => navigation.goBack()}
        onPress={() => navigation.navigate('addMeal')}
      />
      <CalenderHeader
        onPressLeft={() => setDayOffset(dayOffset - 1)}
        onPressRight={() => setDayOffset(dayOffset + 1)}
        rightColor={dayOffset === 0 ? Color.txt : Color.primaryGreen}
        disabled={dayOffset === 0}
        txtFunction={getDateString()}
      />

      <View style={{marginHorizontal: scale(16), marginTop: verticalScale(15)}}>
        <View style={styles.cardContainer}>
          <View style={{flexDirection: 'row', alignItems: 'center'}}>
            <View style={styles.cardContent}>
              <Ionicons
                name="swap-horizontal"
                color={Color.primary}
                size={scale(18)}
              />
            </View>
            <View style={{marginHorizontal: scale(16)}}>
              <Text style={styles.title}>Brunch</Text>
              <View style={styles.icon}>
                <AntDesign
                  name="clockcircleo"
                  color={Color.black}
                  size={scale(16)}
                />
                <Text style={styles.time}>Time</Text>
              </View>
            </View>
          </View>
          <TouchableOpacity>
            <AntDesign name="right" color={Color.black} size={scale(16)} />
          </TouchableOpacity>
        </View>
      </View>
      {/* card view */}
      {/* <View style={styles.cardContainer}>
        <MaterialCommunityIcons
          name="plus-circle"
          size={verticalScale(30)}
          color={Color.gray}
          style={{marginStart: scale(15)}}
        />
        <View style={styles.txtIcnView}>
          <Text style={styles.cardTitle}>Breakfast</Text>
          <View style={{flexDirection: 'row', marginTop: verticalScale(5)}}>
            <AntDesign
              name="clockcircleo"
              color={Color.gray}
              size={verticalScale(15)}
            />
            <Text style={styles.timeTxt}>3:49 PM</Text>
          </View>
        </View>
        <AntDesign
          name="right"
          size={verticalScale(20)}
          color={Color.gray}
          style={{marginStart: scale(15)}}
        />
      </View> */}
    </View>
  );
};

export default FoodDiary;

const styles = StyleSheet.create({
  cardContainer: {
    paddingVertical: verticalScale(12),
    backgroundColor: Color.common,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingHorizontal: scale(20),
    borderRadius: scale(20),
  },
  cardContent: {
    backgroundColor: Color.gray,
    alignItems: 'center',
    justifyContent: 'center',
    height: scale(30),
    width: scale(30),
    borderRadius: scale(40),
  },
  icon: {
    flexDirection: 'row',
    alignItems: 'center',
    marginTop: verticalScale(4),
    backgroundColor: Color.primary,
    padding: scale(4),
    borderRadius: scale(10),
  },
  title: {
    color: Color.black,
    fontSize: scale(16),
    fontWeight: '500',
  },
  time: {marginLeft: scale(8), color: Color.black},
});
