import {StyleSheet, Text, View} from 'react-native';
import React from 'react';
import {Color} from '../assets/styles/Colors';
import { verticalScale } from 'react-native-size-matters';

const GuestFlowHeader = ({progress}) => {
  return (
    <View style={{width: '100%'}}>
      <View style={{width: '100%', height: verticalScale(10), backgroundColor: Color.primaryLight}}>
      <View style={{width: progress,  backgroundColor: Color.primaryColor}}>
        <Text>{}</Text>
      </View>
      </View>
    </View>
  );
};

export default GuestFlowHeader;

const styles = StyleSheet.create({});
