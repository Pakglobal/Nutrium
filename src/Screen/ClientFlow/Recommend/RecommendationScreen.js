import React, {useCallback, useEffect, useRef, useState} from 'react';
import {
  FlatList,
  StyleSheet,
  Text,
  View,
  SafeAreaView,
  Pressable,
  RefreshControl,
} from 'react-native';
import {scale, verticalScale} from 'react-native-size-matters';
import Header from '../../../Components/Header';
import {Color} from '../../../assets/styles/Colors';
import {
  GetFoodAvoidApiData,
  GetGoalsApiData,
  GetRecommendationApiData,
} from '../../../Apis/ClientApis/RecommendationApi';
import {useSelector} from 'react-redux';
import moment from 'moment';
import RBSheet from 'react-native-raw-bottom-sheet';
import {ScrollView} from 'react-native-virtualized-view';
import CustomLoader from '../../../Components/CustomLoader';

const RecommendationScreen = () => {
  const tokenId = useSelector(state => state?.user?.token);
  const guestTokenId = useSelector(state => state?.user?.guestToken);
  const token = tokenId?.token || guestTokenId?.token;
  const id = tokenId?.id || guestTokenId?.id;
  const bottomSheetRef = useRef(null);

  const [recommendations, setRecommendations] = useState([]);
  const [foodsAvoid, setFoodsAvoid] = useState([]);
  const [goals, setGoals] = useState([]);
  const [refreshing, setRefreshing] = useState(false);
  const [loading, setLoading] = useState(false);

  const handleOpenBottomSheet = () => {
    bottomSheetRef.current?.open();
  };

  const FetchRecommendationData = async () => {
    setLoading(true);
    try {
      const response = await GetRecommendationApiData(token, id);
      if (
        response?.success === true ||
        response?.message === 'Data retrieved successfully'
      ) {
        setRecommendations(response?.data);
        setLoading(false);
      }
    } catch (error) {
      console.error('Error fetching recommendation data', error);
      setLoading(false);
    }
  };

  const FetchFoodAvoidData = async () => {
    setLoading(true);
    try {
      const response = await GetFoodAvoidApiData(token, id);
      if (
        response?.success === true ||
        response?.message === 'Data retrieved successfully'
      ) {
        setFoodsAvoid(response?.data);
        setLoading(false);
      }
    } catch (error) {
      console.error('Error fetching food avoid data', error);
      setLoading(false);
    }
  };

  const FetchGoalsData = async () => {
    setLoading(true);
    try {
      const response = await GetGoalsApiData(token, id);
      if (
        response?.success === true ||
        response?.message === 'Goals retrieved successfully'
      ) {
        setGoals(response?.allGoals);
        setLoading(false);
      }
    } catch (error) {
      console.error('Error fetching goals data', error);
      setLoading(false);
    }
  };

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
          backgroundColor: Color.white,
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

  useEffect(() => {
    FetchRecommendationData();
    FetchFoodAvoidData();
    FetchGoalsData();
  }, []);

  const onRefresh = useCallback(() => {
    setRefreshing(true);
    Promise.all([
      FetchFoodAvoidData(),
      FetchRecommendationData(),
      FetchGoalsData(),
    ])
      .then(() => {
        setRefreshing(false);
      })
      .catch(() => {
        setRefreshing(false);
      });
  }, []);

  return (
    <SafeAreaView style={{flex: 1, backgroundColor: Color.white}}>
      <Header logoHeader={true} />

      <View>
        {loading ? (
          <CustomLoader />
        ) : (
          <ScrollView
            showsVerticalScrollIndicator={false}
            refreshControl={
              <RefreshControl refreshing={refreshing} onRefresh={onRefresh} />
            }>
            <View style={styles.container}>
              <Text style={styles.title}>Foods to avoid</Text>
              <Text style={styles.subTitle}>
                Avoid these foods in your diet to improve your health
              </Text>
              <View>
                {foodsAvoid && foodsAvoid?.foodAvoids?.length > 0 ? (
                  foodsAvoid.foodAvoids.map((item, index) => (
                    <Text key={index} style={{color: Color.black}}>
                      {item}
                    </Text>
                  ))
                ) : (
                  <View style={{marginVertical: verticalScale(10)}}>
                    <Text style={{color: Color.gray}}>
                      There are no records of food to avoid
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
              <View>
                {recommendations && recommendations?.recommendation ? (
                  <Text style={{color: Color.black}}>
                    {recommendations.recommendation}
                  </Text>
                ) : (
                  <View style={{marginVertical: verticalScale(10)}}>
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
              <View>
                {goals && goals?.length > 0 ? (
                  <FlatList
                    showsVerticalScrollIndicator={false}
                    data={goals[0]?.goals}
                    keyExtractor={(item, index) =>
                      item?._id || index.toString()
                    }
                    renderItem={renderGoalItem}
                    contentContainerStyle={{
                      paddingHorizontal: scale(10),
                      paddingVertical: verticalScale(5),
                    }}
                  />
                ) : (
                  <View style={{marginVertical: verticalScale(10)}}>
                    <Text style={{color: Color.gray}}>
                      There are no records of goals
                    </Text>
                  </View>
                )}
              </View>
            </Pressable>
          </ScrollView>
        )}
      </View>

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
              Goals agreed with your professional
            </Text>
          </View>
          <View style={{marginHorizontal: scale(16), flex: 1}}>
            {goals && goals?.length > 0 ? (
              <FlatList
                data={goals[0]?.goals}
                keyExtractor={(item, index) => item?._id || index.toString()}
                renderItem={renderGoalItem}
                showsVerticalScrollIndicator={false}
              />
            ) : (
              <View style={{marginVertical: verticalScale(10)}}>
                <Text style={{color: Color.gray, textAlign: 'center'}}>
                  There are no records of goals
                </Text>
              </View>
            )}
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
    backgroundColor: Color.primaryColor,
    paddingVertical: verticalScale(15),
    justifyContent: 'center',
  },
  headerText: {
    color: Color.white,
    marginHorizontal: scale(16),
    fontWeight: '500',
  },
});
