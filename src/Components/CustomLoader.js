import {ActivityIndicator, StyleSheet, Text, View} from 'react-native';
import React from 'react';
import {Color} from '../assets/styles/Colors';

const CustomLoader = ({style, color, size}) => {
  return (
    <View>
      <ActivityIndicator
        size={size || 'large'}
        color={color || Color.primaryColor}
        style={{
          flex: 1,
          alignItems: 'center',
          justifyContent: 'center',
          ...style,
        }}
      />
    </View>
  );
};

export default CustomLoader;

const styles = StyleSheet.create({});
