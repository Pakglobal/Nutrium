import {FlatList, StyleSheet, Text, View} from 'react-native';
import React from 'react';
import ChallengeCard from './ChallengeCard';
import Header from '../../../Components/Header';
import { Color } from '../../../assets/styles/Colors';

const CardioDetailsScreen = ({route}) => {
  const cardioChallenges = route.params.challenges;
  const onJoin = route.params.onJoin;

  return (
   <View style={{flex: 1, backgroundColor: Color.white}}>
      <Header
        screenheader={true}
        rightHeaderButton={false}
        screenName={'Cardio challenges'}
      />
      <FlatList
        data={cardioChallenges}
        keyExtractor={(item, index) =>
          item?._id?.toString() || index.toString()
        }
        renderItem={({item}) => (
          <ChallengeCard challenge={item} onJoin={onJoin} />
        )}
      />
    </View>
  );
};

export default CardioDetailsScreen;

const styles = StyleSheet.create({});
