import {scale} from 'react-native-size-matters';
import Color from '../colors/Colors';
import {Keyboard, StyleSheet, TouchableOpacity, View} from 'react-native';
import FontAwesome6 from 'react-native-vector-icons/FontAwesome6';
import {useNavigation} from '@react-navigation/native';
import AntDesign from 'react-native-vector-icons/AntDesign';
import { useEffect, useState } from 'react';

const IconStyle = {
  drawerIconSize: scale(22),
  drawerIconColor: Color.textColor,
  headerIconSize: scale(26),
};
export default IconStyle;

export const IconPadding = {
  padding: scale(5),
  // backgroundColor: 'red'
};

export const IconBg = {
  height: scale(25),
  width: scale(25),
  alignItems: 'center',
  justifyContent: 'center',
  // backgroundColor: 'red'
};

export const LeftIcon = ({onGoBack}) => {
  return (
    <TouchableOpacity
      style={[styles.buttonContainer, {alignSelf: 'flex-start'}]}
      onPress={onGoBack}>
      <View style={styles.button}>
        <FontAwesome6 name="arrow-left" size={22} color={Color.white} />
      </View>
    </TouchableOpacity>
  );
};

export const RightIcon = ({onPress}) => {
  return (
    <TouchableOpacity
      style={[
        styles.buttonContainer,
        {
          alignSelf: 'flex-end',
          // position: 'absolute',
          bottom: scale(0),
          right: scale(0),
          zIndex: -10000
        },
      ]}
      onPress={onPress}>
      <View style={styles.button}>
        <FontAwesome6 name="arrow-right" size={22} color={Color.white} />
      </View>
    </TouchableOpacity>
  );
};

const styles = StyleSheet.create({
  button: {
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: Color.primaryColor,
    borderRadius: scale(25),
    height: scale(32),
    width: scale(32),
  },
  buttonContainer: {
    justifyContent: 'center',
    alignItems: 'center',
    margin: scale(12),
    padding: scale(4),
  },
});