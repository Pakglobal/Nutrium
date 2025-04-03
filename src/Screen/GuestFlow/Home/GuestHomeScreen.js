import {StyleSheet, Text, View} from 'react-native';
import React from 'react';
import MealsLikeInHome from '../../../Components/MealsLikeInHome';
import BottomNavigation from '../../../Navigation/BottomNavigation';
import Color from '../../../assets/colors/Colors';

const GuestHomeScreen = () => {
  return (
    <View style={{flex: 1, backgroundColor: Color.white}}>
      <Text>GuestHomeScreen</Text>
      {/* <MealsLikeInHome /> */}
      <View style={{}}>
      <BottomNavigation />
      </View>
    </View>
  );
};

export default GuestHomeScreen;

const styles = StyleSheet.create({});
