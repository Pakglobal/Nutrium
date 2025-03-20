import React, {useEffect, useRef, useState} from 'react';
import {
  ActivityIndicator,
  FlatList,
  StyleSheet,
  Text,
  View,
  SafeAreaView,
  TouchableOpacity,
  Pressable,
} from 'react-native';
import {scale, verticalScale} from 'react-native-size-matters';
import Header from '../../../Components/Header';
import Color from '../../../assets/colors/Colors';
import {
  GetFoodAvoidApiData,
  GetGoalsApiData,
  GetRecommendationApiData,
} from '../../../Apis/ClientApis/RecommendationApi';
import {useSelector} from 'react-redux';
import moment from 'moment';
import RBSheet from 'react-native-raw-bottom-sheet';
import {ScrollView} from 'react-native-virtualized-view';

const RecommendationScreen = () => {
  const getToken = useSelector(state => state?.user?.userInfo);
  const token = getToken?.token;
  const id = getToken?.userData?._id || getToken?.user?._id;
  const bottomSheetRef = useRef(null);

  const [recommendations, setRecommendetions] = useState([]);
  const [foodsAvoid, setFoodsAvoid] = useState([]);
  const [goals, setGoals] = useState([]);
  const [loading, setLoading] = useState(false);

  const handleOpenBottomSheet = () => {
    bottomSheetRef.current?.open();
  };

  const FetchRecommendationData = async () => {
    try {
      setLoading(true);
      const response = await GetRecommendationApiData(token, id);
      if (response) {
        setRecommendetions(response?.data);
        setLoading(false);
      }
    } catch (error) {
      console.error('Error fetching recommendation data', error);
    } finally {
      setLoading(false);
    }
  };

  const FetchFoodAvoidData = async () => {
    try {
      setLoading(true);
      const response = await GetFoodAvoidApiData(token, id);
      if (response) {
        setFoodsAvoid(response?.data);
        setLoading(false);
      }
    } catch (error) {
      console.error('Error fetching food avoid data', error);
    } finally {
      setLoading(false);
    }
  };

  const FetchGoalsData = async () => {
    try {
      setLoading(true);
      const response = await GetGoalsApiData(token, id);
      if (response) {
        setGoals(response?.allGoals);
        setLoading(false);
      }
    } catch (error) {
      console.error('Error fetching food avoid data', error);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    FetchFoodAvoidData();
    FetchRecommendationData();
    FetchGoalsData();
  }, []);

  const recommendationData = recommendations?.recommendation;
  const foodAvoidData = foodsAvoid?.foodAvoids;
  const goalData = goals[0]?.goals;

  // if (loading) {
  //   return (
  // <View
  //   style={{
  //     flex: 1,
  //     justifyContent: 'center',
  //     alignItems: 'center',
  //   }}>
  //   <ActivityIndicator size="large" color={Color.primaryGreen} />
  // </View>
  //   );
  // }

  const renderEntryItem = ({item: entry, index}) => (
    <View
      key={index}
      style={{
        flexDirection: 'row',
        justifyContent: 'space-between',
        alignItems: 'center',
      }}>
      <Text
        style={{
          fontSize: scale(14),
          color: Color.black,
        }}>
        {entry?.value} {entry?.unit}
      </Text>

      <Text
        style={{
          fontSize: scale(14),
          color: Color.black,
          backgroundColor: Color.primary,
          paddingHorizontal: scale(5),
          borderRadius: scale(4),
        }}>
        {moment(entry?.deadline, 'DD-MM-YYYY').format('MMM D')}
      </Text>
    </View>
  );

  const renderMeasurementItem = ({item: measurement, index}) => (
    <View
      key={index}
      style={{
        paddingVertical: verticalScale(5),
      }}>
      <Text
        style={{
          fontSize: scale(14),
          fontWeight: '500',
          color: Color.black,
          marginBottom: verticalScale(4),
        }}>
        {measurement?.measurementtype || 'Unknown'}
      </Text>

      {measurement?.entries?.length > 0 ? (
        <FlatList
          data={measurement.entries}
          keyExtractor={(entry, i) => i.toString()}
          renderItem={renderEntryItem}
          showsVerticalScrollIndicator={false}
        />
      ) : (
        <Text style={{fontSize: scale(14), color: Color.gray}}>
          No entries available
        </Text>
      )}
    </View>
  );

  const renderGoalItem = ({item, index}) => (
    <View
      key={index}
      style={{
        borderBottomWidth: 1,
        borderBottomColor: '#DDD',
      }}>
      <FlatList
        data={item?.measurements || []}
        keyExtractor={(measurement, i) => i.toString()}
        renderItem={renderMeasurementItem}
        showsVerticalScrollIndicator={false}
      />
    </View>
  );

  return (
    <SafeAreaView style={{flex: 1, backgroundColor: Color.primary}}>
      <Header showIcon={true} headerText="Recommendations" />
      {loading ? (
        <View
          style={{
            flex: 1,
            justifyContent: 'center',
            alignItems: 'center',
          }}>
          <ActivityIndicator size="large" color={Color.primaryGreen} />
        </View>
      ) : (
        <ScrollView showsVerticalScrollIndicator={false}>
          <View style={styles.container}>
            <Text style={styles.title}>Foods to avoid</Text>
            <Text style={styles.subTitle}>
              Avoid these foods in your diet to improve your health
            </Text>
            <View style={{marginVertical: verticalScale(10)}}>
              {foodAvoidData && foodAvoidData?.length > 0 ? (
                foodAvoidData?.map(item => (
                  <Text style={{color: Color.black}}>{item}</Text>
                ))
              ) : (
                <View>
                  <Text style={{color: Color.gray}}>
                    There are no records of food avoid
                  </Text>
                </View>
              )}
            </View>
          </View>

          <View style={styles.container}>
            <Text style={styles.title}>Other recommendations</Text>
            <Text style={styles.subTitle}>
              See more recommendations from your professional
            </Text>
            <View style={{marginVertical: verticalScale(10)}}>
              {recommendationData && recommendationData?.length > 0 ? (
                <Text style={{color: Color.black}}>{recommendationData}</Text>
              ) : (
                <View>
                  <Text style={{color: Color.gray}}>
                    There are no records of recommendation
                  </Text>
                </View>
              )}
            </View>
          </View>

          <Pressable
            style={styles.container}
            onPress={() => handleOpenBottomSheet()}>
            <Text style={styles.title}>Next goals</Text>
            <Text style={styles.subTitle}>
              Goals agreed with your professional
            </Text>
            <View style={{}}>
              {goalData && goalData?.length > 0 ? (
                <FlatList
                  showsVerticalScrollIndicator={false}
                  data={goalData}
                  keyExtractor={(item, index) => item?._id || index.toString()}
                  renderItem={renderGoalItem}
                  contentContainerStyle={{
                    paddingHorizontal: scale(10),
                    paddingVertical: verticalScale(5),
                  }}
                />
              ) : (
                <View>
                  <Text style={{color: Color.gray}}>
                    There are no records of goals
                  </Text>
                </View>
              )}
            </View>
          </Pressable>
        </ScrollView>
      )}

      <RBSheet
        ref={bottomSheetRef}
        closeOnPressMask={true}
        closeOnPressBack={true}
        height={380}
        customStyles={{
          wrapper: styles.wrapper,
          draggableIcon: styles.draggableIcon,
        }}>
        <View style={styles.bottomContainer}>
          <View style={styles.headerContainer}>
            <Text style={styles.headerText}>All goals</Text>
            <Text style={styles.headerText}>
              Goals agreed with your proffesional
            </Text>
          </View>
          <View style={{marginHorizontal: scale(16), flex: 1}}>
            <FlatList
              data={goalData}
              keyExtractor={(item, index) => item?._id || index.toString()}
              renderItem={renderGoalItem}
              showsVerticalScrollIndicator={false}
            />
          </View>
        </View>
      </RBSheet>
    </SafeAreaView>
  );
};

export default RecommendationScreen;

const styles = StyleSheet.create({
  container: {
    backgroundColor: Color.common,
    marginTop: verticalScale(10),
    marginHorizontal: scale(16),
    paddingHorizontal: scale(15),
    paddingVertical: verticalScale(8),
    borderRadius: scale(20),
  },
  title: {
    fontSize: scale(15),
    color: Color.black,
    fontWeight: '500',
    marginVertical: verticalScale(5),
  },
  subTitle: {
    fontSize: scale(13),
    color: Color.black,
  },
  data: {
    marginVertical: verticalScale(10),
    color: Color.black,
  },
  wrapper: {
    backgroundColor: 'rgba(0,0,0,0.5)',
  },
  draggableIcon: {
    backgroundColor: 'transparent',
  },
  bottomContainer: {
    backgroundColor: Color.common,
    flex: 1,
  },
  headerContainer: {
    backgroundColor: Color.primaryGreen,
    paddingVertical: verticalScale(15),
    justifyContent: 'center',
  },
  headerText: {
    color: Color.primary,
    marginHorizontal: scale(16),
    fontWeight: '500',
  },
});
