import {FlatList, StyleSheet, Text, View} from 'react-native';
import React from 'react';
import ChallengeCard from './ChallengeCard';
import {Color} from '../../../assets/styles/Colors';
import Header from '../../../Components/Header';
import {scale, verticalScale} from 'react-native-size-matters';

const CardioNutritionDetailsScreen = ({route}) => {
  const cardioNutrition = route.params.challenges;
  const onJoin = route.params.onJoin;
  const headerName = route.params.headerName;

  return (
    <View style={{flex: 1, backgroundColor: Color.white}}>
      <Header screenheader={true} screenName={headerName} />
      <FlatList
        showsVerticalScrollIndicator={false}
        data={cardioNutrition}
        keyExtractor={(item, index) =>
          item?._id?.toString() || index.toString()
        }
        renderItem={({item}) => (
          <ChallengeCard challenge={item} onJoin={onJoin} btnType={'Join'} />
        )}
        contentContainerStyle={{paddingVertical: verticalScale(6)}}
        style={{paddingHorizontal: scale(8)}}
      />
    </View>
  );
};

export default CardioNutritionDetailsScreen;

const styles = StyleSheet.create({});
