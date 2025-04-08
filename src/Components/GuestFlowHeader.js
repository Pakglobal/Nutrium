import {StyleSheet, Text, View} from 'react-native';
import React from 'react';
import Color from '../assets/colors/Colors';

const GuestFlowHeader = ({progress}) => {
  return (
    <View style={{height: '1%', width: '100%'}}>
      <View style={{width: '100%', height:'100%', backgroundColor: Color.primaryLight}}>
      <View style={{width: progress,  backgroundColor: Color.primaryColor}}>
        <Text>{}</Text>
      </View>
      </View>
    </View>
  );
};

export default GuestFlowHeader;

const styles = StyleSheet.create({});
