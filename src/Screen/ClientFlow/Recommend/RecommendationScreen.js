import React, {useEffect, useState} from 'react';
import {
  ActivityIndicator,
  FlatList,
  ScrollView,
  StyleSheet,
  Text,
  View,
  SafeAreaView
} from 'react-native';
import {scale, verticalScale} from 'react-native-size-matters';
import Header from '../../../Components/Header';
import Color from '../../../assets/colors/Colors';
import {
  GetFoodAvoidApiData,
  GetRecommendationApiData,
} from '../../../Apis/ClientApis/RecommendationApi';
import {useSelector} from 'react-redux';

const RecommendationScreen = () => {
  const getToken = useSelector(state => state?.user?.userInfo);
  const token = getToken?.token;
  const id = getToken?.userData?._id || getToken?.user?._id;

  const [recommendations, setRecommendetions] = useState([]);
  const [foodsAvoid, setFoodsAvoid] = useState([]);
  const [loading, setLoading] = useState(false);

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

  useEffect(() => {
    FetchFoodAvoidData();
    FetchRecommendationData();
  }, []);

  const recommendationData = recommendations?.recommendation;
  const foodAvoidData = foodsAvoid?.foodAvoids;

  if (loading) {
    return (
      <View
        style={{
          flex: 1,
          justifyContent: 'center',
          alignItems: 'center',
        }}>
        <ActivityIndicator size="large" color={Color.primaryGreen} />
      </View>
    );
  }

  return (
    <SafeAreaView style={{flex: 1, backgroundColor: Color.primary}}>
      <Header showIcon={true} headerText="Recommendations" />
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
                <Text>There are no records of food avoid</Text>
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
                <Text>There are no records of recommendation</Text>
              </View>
            )}
          </View>
        </View>
      </ScrollView>
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
  },
  data: {
    marginVertical: verticalScale(10),
    color: Color.black,
  },
});
