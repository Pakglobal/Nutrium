import React, {useCallback, useRef} from 'react';
import {
  FlatList,
  StyleSheet,
  View,
  Dimensions,
  ScrollView,
  TouchableOpacity,
} from 'react-native';
import ChallengeCard from './ChallengeCard';
import {SwiperFlatList} from 'react-native-swiper-flatlist';
import ChallengeCardBanner from '../../../Components/ChallengeCardBanner';
import {Text} from 'react-native';
import {Color} from '../../../assets/styles/Colors';
import {Font} from '../../../assets/styles/Fonts';
import {moderateScale, scale, verticalScale} from 'react-native-size-matters';
import {useNavigation} from '@react-navigation/native';

const {width} = Dimensions.get('window');
const CARD_WIDTH = width * 0.92;
const SPACING = (width - CARD_WIDTH) / 2;

const JoinChallenges = ({challenges, onJoin}) => {
  const privateChallenges = challenges.filter(c => c.privacy === 'private');
  const publicChallenges = challenges.filter(c => c.privacy !== 'private');
  const topChallenges = privateChallenges.slice(0, 4);
  const swiperRef = useRef(null);
  const navigation = useNavigation();

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

  const renderSwiperItem = useCallback(
    ({item}) => (
      <View style={{width: CARD_WIDTH, marginHorizontal: SPACING / 2}}>
        <ChallengeCardBanner challenge={item} onJoin={onJoin} btnType="View" />
      </View>
    ),
    [onJoin],
  );

  console.log('topChallenges.length', topChallenges.length);

  return (
    <View style={styles.container}>
      <ScrollView showsVerticalScrollIndicator={false}>
        <View style={styles.containerText}>
          <Text style={styles.text}>Join Challenges</Text>
          {topChallenges.length > 4 ? (
            <TouchableOpacity
              onPress={() =>
                navigation.navigate('AllPrivateChallenge', {
                  challenges: challenges,
                  onJoin: onJoin,
                })
              }>
              <Text
                style={[
                  styles.text,
                  {fontSize: moderateScale(14), color: Color.primaryColor},
                ]}>
                View all
              </Text>
            </TouchableOpacity>
          ) : null}
        </View>

        {topChallenges.length === 0 && publicChallenges.length === 0 ? (
          <Text style={styles.noChallengesText}>
            No challenges available at the moment.
          </Text>
        ) : (
          <View>
            {topChallenges.length === 0 ? (
              <Text style={styles.noChallengesText}>
                No private challenges available.
              </Text>
            ) : (
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

            {publicChallenges.length === 0 ? (
              <Text style={styles.noChallengesText}>
                No public challenges available.
              </Text>
            ) : (
              <FlatList
                data={publicChallenges}
                keyExtractor={(item, index) =>
                  item?._id?.toString() || index.toString()
                }
                renderItem={({item}) => (
                  <ChallengeCard
                    challenge={item}
                    onJoin={onJoin}
                    btnType="View"
                  />
                )}
                showsVerticalScrollIndicator={false}
                style={{marginBottom: verticalScale(10)}}
              />
            )}
          </View>
        )}
      </ScrollView>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: Color.white,
  },
  containerText: {
    backgroundColor: Color.white,
    paddingHorizontal: scale(5),
    marginVertical: verticalScale(15),
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  text: {
    fontSize: moderateScale(17),
    color: Color?.textColor,
    fontFamily: Font?.PoppinsMedium,
    marginBottom: verticalScale(-5),
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
  noChallengesText: {
    fontSize: moderateScale(16),
    color: Color.textColor,
    fontFamily: Font.Poppins,
    textAlign: 'center',
    marginVertical: verticalScale(20),
  },
});

export default JoinChallenges;
