import {StyleSheet, Text, View} from 'react-native';
import React from 'react';
import {ShadowValues} from '../assets/styles/Shadow';
import {Shadow} from 'react-native-shadow-2';
import {Color} from '../assets/styles/Colors';
import DropShadow from 'react-native-drop-shadow';

const CustomShadow = ({style, children, color}) => {
  return (
    <Shadow distance={4} startColor={color || Color.primaryColor} style={style}>
      {children}
    </Shadow>
  );
};

export default CustomShadow;

const styles = StyleSheet.create({});
