import React, {useCallback, useEffect, useRef, useState} from 'react';
import {
  View,
  StyleSheet,
  Dimensions,
  Animated,
  Text,
  FlatList,
  ScrollView,
  TouchableOpacity,
} from 'react-native';
import {SwiperFlatList, Pagination} from 'react-native-swiper-flatlist';
import ChallengeCardBanner from '../../../Components/ChallengeCardBanner';
import {moderateScale, scale, verticalScale} from 'react-native-size-matters';
import {Font} from '../../../assets/styles/Fonts';
import ChallengeCard from './ChallengeCard';
import {useNavigation} from '@react-navigation/native';
import FontAwesome5 from 'react-native-vector-icons/FontAwesome5';
import {Color} from '../../../assets/styles/Colors';

const {width} = Dimensions.get('window');
const CARD_WIDTH = width * 0.92;
const SPACING = (width - CARD_WIDTH) / 2;
const CARD_HEIGHT = 150;

const CustomPagination = ({paginationIndex, data}) => {
  return (
    <View style={styles.pagination}>
      {data.map((_, index) => {
        const isActive = index === paginationIndex;
        return (
          <View
            key={index}
            style={[
              styles.dot,
              isActive ? styles.activeDot : styles.inactiveDot,
            ]}
          />
        );
      })}
    </View>
  );
};

const AllChallenges = ({challenges, onJoin}) => {
  const swiperRef = useRef(null);
  const navigation = useNavigation();

  const cardioChallenges = challenges.filter(
    challenge => challenge.type.unitLabel === 'Cardio',
  );

  const nutritionChallenges = challenges.filter(
    challenge => challenge.type.unitLabel === 'Nutrition',
  );

  const topChallenges = challenges.slice(0, 4);
  const remainingChallenges = challenges.slice(4);

  useEffect(() => {
    if (swiperRef.current && topChallenges.length > 0) {
      swiperRef.current.scrollToIndex({index: 0, animated: false});
    }
  }, [topChallenges]);

  const handleNavigateCardio = () => {
    navigation.navigate('CardioNutritionDetails', {
      challenges: cardioChallenges,
      headerName: 'Cardio Challenges',
      onJoin,
    });
  };

  const handleNavigateNutrition = () => {
    navigation.navigate('CardioNutritionDetails', {
      challenges: nutritionChallenges,
      headerName: 'Nutrition Challenges',
      onJoin,
    });
  };

  const renderSwiperItem = useCallback(
    ({item}) => (
      <View style={{width: CARD_WIDTH, marginHorizontal: SPACING / 2}}>
        <ChallengeCardBanner challenge={item} onJoin={onJoin} btnType="Join" />
      </View>
    ),
    [onJoin],
  );

  return (
    <View style={styles.container}>
      <ScrollView showsVerticalScrollIndicator={false}>
        <View
          style={[styles.containerText, {marginVertical: verticalScale(10)}]}>
          <Text style={[styles.text]}>All Challenges</Text>
        </View>
        {topChallenges.length > 0 && (
          <SwiperFlatList
            data={topChallenges}
            renderItem={renderSwiperItem}
            keyExtractor={item => item._id}
            showPagination
            PaginationComponent={props => (
              <CustomPagination {...props} data={topChallenges} />
            )}
            snapToAlignment="center"
            snapToInterval={CARD_WIDTH + SPACING}
            decelerationRate="fast"
            disableIntervalMomentum
            showsHorizontalScrollIndicator={false}
            ref={swiperRef}
            initialScrollIndex={0}
            getItemLayout={(data, index) => ({
              length: CARD_WIDTH + SPACING,
              offset: (CARD_WIDTH + SPACING) * index,
              index,
            })}
          />
        )}

        <View style={styles.categoriesContainer}>
          <TouchableOpacity
            style={styles.categoryCard}
            onPress={handleNavigateCardio}
            activeOpacity={0.7}>
            <View style={styles.iconWrapper}>
              <FontAwesome5
                name="running"
                size={20}
                color={Color?.primaryColor}
              />
            </View>
            <Text style={styles.categoryTitle}>Cardio</Text>
            <Text style={styles.categoryCount}>
              {cardioChallenges.length} challenges
            </Text>
          </TouchableOpacity>

          <TouchableOpacity
            style={styles.categoryCard}
            onPress={handleNavigateNutrition}
            activeOpacity={0.7}>
            <View style={styles.iconWrapper}>
              <Text style={styles.iconText}>🥗</Text>
            </View>
            <Text style={styles.categoryTitle}>Nutrition</Text>
            <Text style={styles.categoryCount}>
              {nutritionChallenges.length} challenges
            </Text>
          </TouchableOpacity>
        </View>

        {remainingChallenges.length > 0 && (
          <View>
            <View style={[styles.containerText]}>
              <Text style={styles.text}>Popular Challenges</Text>
            </View>
            <FlatList
              data={remainingChallenges}
              keyExtractor={(item, index) =>
                item?._id?.toString() || index.toString()
              }
              renderItem={({item}) => (
                <ChallengeCard
                  challenge={item}
                  onJoin={onJoin}
                  btnType="Join"
                />
              )}
              style={{marginBottom: verticalScale(5)}}
            />
          </View>
        )}
      </ScrollView>
    </View>
  );
};

export default AllChallenges;

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: Color.white,
  },
  containerText: {
    backgroundColor: Color.white,
    paddingHorizontal: scale(5),
    marginVertical: verticalScale(15),
  },
  text: {
    fontSize: moderateScale(17),
    color: Color?.textColor,
    fontFamily: Font?.PoppinsMedium,
    marginBottom: verticalScale(-5),
  },
  swiperWrapper: {
    height: verticalScale(CARD_HEIGHT + 40),
    justifyContent: 'center',
    alignItems: 'center',
  },
  swiperItem: {
    width: width,
    height: CARD_HEIGHT,
    justifyContent: 'center',
    alignItems: 'center',
  },
  swiperContainer: {
    paddingVertical: 0,
    alignItems: 'center',
  },
  pagination: {
    flexDirection: 'row',
    justifyContent: 'center',
    alignItems: 'center',
    marginVertical: verticalScale(10),
    height: verticalScale(10),
  },
  dot: {
    height: scale(8),
    width: scale(8),
    borderRadius: moderateScale(3),
    marginHorizontal: scale(3),
  },
  activeDot: {
    width: scale(20),
    backgroundColor: Color.primaryColor,
  },
  inactiveDot: {
    width: scale(7),
    backgroundColor: Color.lightgray,
  },
  categoriesContainer: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    paddingHorizontal: scale(3),
    marginTop: verticalScale(10),
  },
  categoryCard: {
    backgroundColor: '#AEF5B4',
    borderRadius: moderateScale(12),
    paddingVertical: verticalScale(12),
    alignItems: 'center',
    width: '48%',
  },
  iconWrapper: {
    width: scale(40),
    height: scale(40),
    borderRadius: moderateScale(20),
    backgroundColor: '#CEF9D1',
    alignItems: 'center',
    justifyContent: 'center',
  },
  iconText: {
    fontSize: moderateScale(19),
  },
  categoryTitle: {
    fontSize: moderateScale(15),
    fontWeight: '600',
    color: '#424542',
    fontFamily: Font?.Poppins,
    marginTop: verticalScale(3),
  },
  categoryCount: {
    fontSize: moderateScale(11),
    color: '#727472',
    marginTop: verticalScale(1),
    fontFamily: Font?.Poppins,
  },
  flatListContent: {
    paddingHorizontal: scale(9),
  },
});
