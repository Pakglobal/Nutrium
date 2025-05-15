import React, { useCallback, useEffect, useState } from 'react';
import {
  View,
  Text,
  StyleSheet,
  TouchableOpacity,
  FlatList,
  Pressable,
  RefreshControl,
  ActivityIndicator,
} from 'react-native';
import {
  useFocusEffect,
  useNavigation,
  useRoute,
} from '@react-navigation/native';
import { scale, verticalScale } from 'react-native-size-matters';
import AntDesign from 'react-native-vector-icons/AntDesign';
import Ionicons from 'react-native-vector-icons/Ionicons';
import CalenderHeader from '../../../../Components/CalenderHeader';
import { Color } from '../../../../assets/styles/Colors';
import BackHeader from '../../../../Components/BackHeader';
import { FetchFoodDiary } from '../../../../Apis/ClientApis/FoodDiaryApi';
import { useDispatch, useSelector } from 'react-redux';
import { addData } from '../../../../redux/client';
import Header from '../../../../Components/Header';
import CustomLoader from '../../../../Components/CustomLoader';
import CustomShadow from '../../../../Components/CustomShadow';
import { Font } from '../../../../assets/styles/Fonts';

const FoodDiary = () => {
  const navigation = useNavigation();
  const dispatch = useDispatch();

  const [dayOffset, setDayOffset] = useState(0);
  const [diaryData, setDiaryData] = useState([]);
  const [loading, setLoading] = useState(false);

  const tokenId = useSelector(state => state?.user?.token);
  const guestTokenId = useSelector(state => state?.user?.guestToken);
  const token = tokenId?.token || guestTokenId?.token;
  const id = tokenId?.id || guestTokenId?.id;

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
    setLoading(true);
    try {
      const response = await FetchFoodDiary(token, id);

      if (response?.foodDiary) {
        setDiaryData(response?.foodDiary?.foodDiaryData || []);
      }
      setLoading(false);
    } catch (error) {
      console.error('Error fetching food diary', error);
      setLoading(false);
    }
  };

  useFocusEffect(
    useCallback(() => {
      GetFoodDiaryData();
    }, []),
  );

  const handleFoodData = (type, time, id, foodId, foodIndex, name) => {
    const addMeal = {
      type: type,
      time: time,
      id: id,
      foodId: foodId,
      foodIndex: foodIndex,
      name: name,
    };
    dispatch(addData(addMeal));

    navigation.navigate('logMeal');
  };

  const renderDiaryDataItem = ({ item: diary }) => {
    return (
      <CustomShadow>
        <Pressable
          onPress={() =>
            handleFoodData(
              diary?.mealType,
              diary?.time,
              diary?._id,
              diary?.meal[0]?.foodId,
              diary?.meal[0]?.foodIndex,
              diary?.meal[0]?.displayName,
            )
          }>
          <View style={styles.cardContainer}>
            <View style={{ flexDirection: 'row', alignItems: 'center' }}>
              <View style={styles.cardContent}>
                <Ionicons
                  name="swap-horizontal"
                  color={Color.primaryColor}
                  size={scale(16)}
                />
              </View>

              <View style={{ marginHorizontal: scale(11) }}>
                <Text style={styles.title}>{diary?.mealType}</Text>
                <View style={styles.icon}>
                  <AntDesign
                    name="clockcircleo"
                    color={Color.black}
                    size={scale(14)}
                  />
                  <Text style={styles.time}>{diary?.time}</Text>
                </View>
              </View>
            </View>
            <TouchableOpacity>
              <AntDesign name="right" color={Color.black} size={scale(16)} />
            </TouchableOpacity>
          </View>
        </Pressable>
      </CustomShadow>
    );
  };

  const renderDiaryItem = ({ item }) => (
    <FlatList
      data={item?.mealSchedule || []}
      keyExtractor={(_, i) => `meal-schedule-${i}`}
      renderItem={renderDiaryDataItem}
      showsVerticalScrollIndicator={false}
    />
  );

  return (
    <View style={styles.container}>
      <Header screenheader={true} screenName={'Food Diary'} plus={true} />
      <CalenderHeader
        onPressLeft={() => setDayOffset(dayOffset - 1)}
        onPressRight={() => setDayOffset(dayOffset + 1)}
        rightColor={dayOffset === 0 ? Color.txt : Color.primaryColor}
        disabled={dayOffset === 0}
        txtFunction={getDateString()}
      />
      {loading ? (
        <ActivityIndicator style={{ alignSelf: "center", justifyContent: "center" }} color={Color?.primaryColor} size={'large'} />
      ) : diaryData && diaryData?.length > 0 ? (
        <FlatList
          data={diaryData}
          keyExtractor={(item, index) => item?._id || `diary-item-${index}`}
          renderItem={renderDiaryItem}
          contentContainerStyle={styles.listContainer}
        />
      ) : (
        <View style={styles.emptyContainer}>
          <Text style={styles.emptyText}>There are no records of diary</Text>
        </View>
      )}
    </View>
  );
};

export default FoodDiary;

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: Color.white,
  },
  listContainer: {
    paddingHorizontal: scale(10),
    paddingVertical: verticalScale(5),
  },
  emptyContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
  emptyText: {
    color: Color.gray,
    fontFamily:Font?.Poppins
  },
  cardContainer: {
    paddingVertical: verticalScale(8),
    backgroundColor: Color.white,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingHorizontal: scale(20),
    borderRadius: scale(10),
    marginVertical: verticalScale(5),
  },
  cardContent: {
    backgroundColor: Color.lightGreen,
    alignItems: 'center',
    justifyContent: 'center',
    height: scale(28),
    width: scale(28),
    borderRadius: scale(40),
  },
  icon: {
    flexDirection: 'row',
    alignItems: 'center',
    marginTop: verticalScale(4),
    backgroundColor: Color.white,
    padding: scale(4),
    borderRadius: scale(5),
  },
  title: {
    color: Color.black,
    fontSize: scale(14),
    fontFamily: Font?.Poppins,
  },
  time: {
    marginLeft: scale(5),
    color: Color.black,
    fontSize: scale(11),
    fontFamily: Font?.Poppins
  },
});



