import React from 'react';
import {FlatList, StyleSheet, View, Dimensions, ScrollView} from 'react-native';
import ChallengeCard from './ChallengeCard';
import {SwiperFlatList} from 'react-native-swiper-flatlist';
import ChallengeCardBanner from '../../../Components/ChallengeCardBanner';
import {Text} from 'react-native';

const {width} = Dimensions.get('window');
const CARD_WIDTH = width * 0.92;
const SPACING = (width - CARD_WIDTH) / 2;

const JoinChallenges = ({challenges, onJoin}) => {
  const privateChallenges = challenges.filter(c => c.privacy === 'private');
  const publicChallenges = challenges.filter(c => c.privacy !== 'private');

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

  return (
    <View style={{flex: 1}}>
      <ScrollView showsVerticalScrollIndicator={false}>
        <View style={styles.containerText}>
          <Text style={styles.text}>Join Challenges</Text>
        </View>

        {/* Swiper for Private Challenges */}
        {privateChallenges.length > 0 && (
          <SwiperFlatList
            data={privateChallenges}
            renderItem={({item}) => (
              <View style={{width: CARD_WIDTH, marginHorizontal: SPACING / 2}}>
                {/* <ChallengeCardBanner challenge={item} onJoin={onJoin} /> */}
                <ChallengeCardBanner
                  challenge={item}
                  onJoin={onJoin}
                  btnType="View"
                />
              </View>
            )}
            keyExtractor={item => item._id}
            showPagination
            PaginationComponent={props => (
              <CustomPagination {...props} data={privateChallenges} />
            )}
            snapToAlignment="center"
          />
        )}

        {/* List for Public Challenges */}
        <FlatList
          data={publicChallenges}
          keyExtractor={(item, index) =>
            item?._id?.toString() || index.toString()
          }
          renderItem={({item}) => (
            <ChallengeCard challenge={item} onJoin={onJoin} btnType="View" />
          )}
          showsVerticalScrollIndicator={false}
        />
      </ScrollView>
    </View>
  );
};

const styles = StyleSheet.create({
  containerText: {
    backgroundColor: 'white',
    padding: 15,
  },
  text: {
    fontSize: 18,
    fontWeight: '600',
    color: '#222',
  },
  pagination: {
    flexDirection: 'row',
    justifyContent: 'center',
    marginTop: 12,
  },
  dot: {
    height: 8,
    borderRadius: 4,
    marginHorizontal: 4,
  },
  activeDot: {
    width: 20,
    backgroundColor: '#21972B',
  },
  inactiveDot: {
    width: 8,
    backgroundColor: '#C4C4C4',
  },
});

export default JoinChallenges;
