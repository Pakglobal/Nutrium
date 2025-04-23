import {StyleSheet, Text, View} from 'react-native';
import React from 'react';
import {ShadowValues} from '../assets/styles/Shadow';
import {Color} from '../assets/styles/Colors';
import DropShadow from 'react-native-drop-shadow';
import {scale} from 'react-native-size-matters';

const CustomShadow = ({style, children, color, radius}) => {
  return (
    // <Shadow distance={6} startColor={color || Color.primaryLight} style={[style, {width: '100%', borderRadius: scale(10)}]}>
    //   {children}
    // </Shadow>
    <DropShadow
      style={{
        shadowColor: color || Color.primaryColor,
        shadowOffset: {
          width: 0,
          height: 0,
        },
        shadowOpacity: 1,
        shadowRadius: radius || 2,
      }}>
      {children}
    </DropShadow>
  );
};

export default CustomShadow;

const styles = StyleSheet.create({});
