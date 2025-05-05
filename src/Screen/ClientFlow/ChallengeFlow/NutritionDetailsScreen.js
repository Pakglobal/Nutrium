import { FlatList, StyleSheet, Text, View } from 'react-native'
import React from 'react'
import Header from '../../../Components/Header';
import ChallengeCard from './ChallengeCard';
import { Color } from '../../../assets/styles/Colors';

const NutritionDetailsScreen = ({route}) => {
  const nutritionChallenges = route.params.challenges;
  const onJoin = route.params.onJoin;

  return (
    <View style={{flex: 1, backgroundColor: Color.white}}>
      <Header
        screenheader={true}
        rightHeaderButton={false}
        screenName={'Nutrition challenges'}
      />
      <FlatList
        data={nutritionChallenges}
        keyExtractor={(item, index) =>
          item?._id?.toString() || index.toString()
        }
        renderItem={({item}) => (
          <ChallengeCard challenge={item} onJoin={onJoin} />
        )}
      />
    </View>
  )
}

export default NutritionDetailsScreen

const styles = StyleSheet.create({})