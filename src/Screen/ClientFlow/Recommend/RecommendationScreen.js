import React, {useEffect, useRef, useState, useCallback} from 'react';
import {
  SafeAreaView,
  Text,
  View,
  RefreshControl,
  FlatList,
  Pressable,
  Dimensions,
  ScrollView,
  StyleSheet,
} from 'react-native';
import Animated, {
  useSharedValue,
  useAnimatedStyle,
  withSpring,
  withTiming,
} from 'react-native-reanimated';
import RBSheet from 'react-native-raw-bottom-sheet';
import {useSelector} from 'react-redux';
import moment from 'moment';
import {Color} from '../../../assets/styles/Colors';
import {Font} from '../../../assets/styles/Fonts';
import {scale, verticalScale} from 'react-native-size-matters';
import Header from '../../../Components/Header';
import {
  GetFoodAvoidApiData,
  GetGoalsApiData,
  GetRecommendationApiData,
} from '../../../Apis/ClientApis/RecommendationApi';
import CustomLoader from '../../../Components/CustomLoader';
import CustomShadow from '../../../Components/CustomShadow';

const {height} = Dimensions.get('window');

const RecommendationScreen = () => {
  const tokenId = useSelector(state => state?.user?.token);
  const guestTokenId = useSelector(state => state?.user?.guestToken);
  const token = tokenId?.token || guestTokenId?.token;
  const id = tokenId?.id || guestTokenId?.id;

  const bottomSheetRef = useRef(null);

  const [sections, setSections] = useState([]);
  const [goals, setGoals] = useState([]);
  const [loading, setLoading] = useState(false);
  const [refreshing, setRefreshing] = useState(false);

  const cardOpacity = useSharedValue(0);
  const cardTranslateY = useSharedValue(50);

  const animatedCardStyle = useAnimatedStyle(() => ({
    opacity: cardOpacity.value,
    transform: [{translateY: cardTranslateY.value}],
  }));

  useEffect(() => {
    cardOpacity.value = withTiming(1, {duration: 800});
    cardTranslateY.value = withSpring(0, {damping: 15, stiffness: 100});
  }, []);

  const handleOpenBottomSheet = () => {
    bottomSheetRef.current?.open();
  };

  const fetchData = async () => {
    setLoading(true);
    try {
      const [resFood, resReco, resGoals] = await Promise.all([
        GetFoodAvoidApiData(token, id),
        GetRecommendationApiData(token, id),
        GetGoalsApiData(token, id),
      ]);

      const foodData = resFood?.data?.foodAvoids || [];
      const recommendationData = resReco?.data?.recommendation || '';
      const goalsData = resGoals?.allGoals?.[0]?.goals || [];

      setGoals(goalsData);

      const sectionList = [
        {
          id: '1',
          title: 'Foods to Avoid',
          subTitle: 'Avoid these foods to improve your health',
          type: 'food',
          data: foodData,
        },
        {
          id: '2',
          title: 'Recommendations',
          subTitle: 'Personalized advice from your professional',
          type: 'recommendation',
          data: recommendationData,
        },
        {
          id: '3',
          title: 'Your Goals',
          subTitle: 'Goals set with your professional',
          type: 'goal',
          data: goalsData,
        },
      ];

      setSections(sectionList);
    } catch (error) {
      console.error(error);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchData();
  }, []);

  const onRefresh = useCallback(() => {
    setRefreshing(true);
    fetchData().finally(() => setRefreshing(false));
  }, []);

  const renderGoalItem = (goal, index) => (
    <View key={index} style={styles.goalContainer}>
      {goal?.measurements?.map((measurement, idx) => (
        <View key={idx} style={styles.measurementContainer}>
          <Text style={styles.measurementTitle}>
            {measurement?.measurementtype}
          </Text>
          {measurement?.entries?.map((entry, eIdx) => (
            <View key={eIdx} style={styles.entryContainer}>
              <Text style={styles.entryText}>
                {entry?.value} {entry?.unit}
              </Text>
              <View style={styles.deadlineBadge}>
                <Text style={styles.deadlineText}>
                  {moment(entry?.deadline, 'DD-MM-YYYY').format('MMM D')}
                </Text>
              </View>
            </View>
          ))}
        </View>
      ))}
    </View>
  );

  const renderItem = ({item}) => {
    return (
      <View>
        <CustomShadow>
          <Pressable
            onPress={item.type === 'goal' ? handleOpenBottomSheet : undefined}>
            <Animated.View style={[styles.card, animatedCardStyle]}>
              <View style={styles.cardGradient}>
                <Text style={styles.sectionTitle}>{item.title}</Text>
                <Text style={styles.sectionSubtitle}>{item.subTitle}</Text>

                {item.type === 'food' && item.data.length > 0 ? (
                  item.data.map((food, idx) => (
                    <Text key={idx} style={styles.listItemText}>
                      • {food}
                    </Text>
                  ))
                ) : item.type === 'recommendation' && item.data ? (
                  <Text style={styles.listItemText}>{item.data}</Text>
                ) : item.type === 'goal' && item.data.length > 0 ? (
                  item.data.map((goal, idx) => renderGoalItem(goal, idx))
                ) : (
                  <Text style={styles.noDataText}>No data available</Text>
                )}
              </View>
            </Animated.View>
          </Pressable>
        </CustomShadow>
      </View>
    );
  };

  return (
    <SafeAreaView style={styles.safeArea}>
      <Header logoHeader={true} />
      {loading ? (
        <CustomLoader style={{marginTop: verticalScale(25)}} />
      ) : (
        <FlatList
          data={sections}
          keyExtractor={item => item.id}
          renderItem={renderItem}
          showsVerticalScrollIndicator={false}
          contentContainerStyle={{
            marginTop: verticalScale(10),
            paddingBottom: verticalScale(100),
          }}
          refreshControl={
            <RefreshControl refreshing={refreshing} onRefresh={onRefresh} />
          }
        />
      )}

      <RBSheet
        ref={bottomSheetRef}
        closeOnPressMask={true}
        closeOnPressBack={true}
        height={450}
        customStyles={{
          wrapper: styles.sheetWrapper,
          draggableIcon: styles.draggableIcon,
          container: styles.sheetContainer,
        }}>
        <View style={styles.sheetContent}>
          <View style={styles.bottomHeaderContainer}>
            <Text style={styles.headerText}>All Goals</Text>
            <Text style={styles.headerText}>
              Goals agreed with your professional
            </Text>
          </View>
          <ScrollView showsVerticalScrollIndicator={false}>
            {goals.length > 0 ? (
              goals.map((goal, idx) => renderGoalItem(goal, idx))
            ) : (
              <Text style={styles.noDataText}>No goals available</Text>
            )}
          </ScrollView>
        </View>
      </RBSheet>
    </SafeAreaView>
  );
};

export default RecommendationScreen;

const styles = StyleSheet.create({
  safeArea: {
    flex: 1,
    backgroundColor: Color.white,
  },
  gradientBackground: {
    flex: 1,
  },
  card: {
    paddingHorizontal: scale(8),
    marginVertical: verticalScale(5),
    borderRadius: scale(20),
  },
  cardGradient: {
    borderRadius: scale(8),
    padding: scale(15),
    backgroundColor: Color.white,
  },
  sectionTitle: {
    fontSize: scale(18),
    color: Color.primaryColor,
    fontFamily: Font.PoppinsMedium,
  },
  sectionSubtitle: {
    fontSize: scale(13),
    fontFamily: Font.Poppins,
    marginBottom: verticalScale(10),
    color: Color.txt,
  },
  listItem: {
    flexDirection: 'row',
    alignItems: 'center',
    marginVertical: verticalScale(2),
  },
  listItemText: {
    fontSize: scale(14),
    color: Color.textColor,
    fontFamily: Font.Poppins,
  },
  noDataText: {
    fontSize: scale(14),
    color: Color.textColor,
    textAlign: 'center',
    fontFamily: Font.Poppins,
    marginVertical: verticalScale(10),
  },
  entryContainer: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingVertical: verticalScale(5),
  },
  entryText: {
    fontSize: scale(14),
    color: '#374151',
    fontFamily: Font.Poppins,
  },
  deadlineBadge: {
    backgroundColor: '#E5E7EB',
    borderRadius: scale(8),
    paddingHorizontal: scale(8),
    paddingVertical: verticalScale(4),
  },
  deadlineText: {
    fontSize: scale(12),
    color: '#374151',
    fontFamily: Font.PoppinsMedium,
  },
  measurementContainer: {
    paddingVertical: verticalScale(10),
    borderBottomWidth: 1,
    borderBottomColor: '#E5E7EB',
  },
  measurementTitle: {
    fontSize: scale(16),
    fontFamily: Font.PoppinsMedium,
    color: '#1F2937',
    marginBottom: verticalScale(5),
  },
  goalContainer: {
    paddingVertical: verticalScale(5),
  },
  flatListContent: {
    paddingHorizontal: scale(10),
    paddingVertical: verticalScale(5),
  },
  sheetWrapper: {
    backgroundColor: 'rgba(0,0,0,0.5)',
  },
  draggableIcon: {
    backgroundColor: '#D1D5DB',
    width: scale(40),
    height: verticalScale(4),
  },
  sheetContainer: {
    borderTopLeftRadius: scale(20),
    borderTopRightRadius: scale(20),
  },
  sheetContent: {
    flex: 1,
  },
  sheetTitle: {
    fontSize: scale(20),
    fontFamily: Font.PoppinsMedium,
    color: '#1F2937',
    textAlign: 'center',
  },
  sheetSubtitle: {
    fontSize: scale(14),
    color: '#6B7280',
    textAlign: 'center',
    marginBottom: verticalScale(10),
    fontFamily: Font.Poppins,
  },
  sheetListContainer: {
    flex: 1,
  },
  bottomHeaderContainer: {
    backgroundColor: Color.primaryColor,
    paddingVertical: verticalScale(8),
    paddingHorizontal: scale(16),
    borderTopLeftRadius: scale(20),
    borderTopRightRadius: scale(20),
  },
  headerText: {
    color: Color.white,
    fontSize: scale(16),
    fontFamily: Font.PoppinsMedium,
  },
});
