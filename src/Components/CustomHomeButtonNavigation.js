import {StyleSheet, Text, TouchableOpacity, View} from 'react-native';
import React from 'react';
import {scale, verticalScale} from 'react-native-size-matters';
import {Font} from '../assets/styles/Fonts';
import {Color} from '../assets/styles/Colors';
import {shadowStyle, ShadowValues} from '../assets/styles/Shadow';
import {Shadow} from 'react-native-shadow-2';
import Entypo from 'react-native-vector-icons/Entypo';
import CustomShadow from './CustomShadow';

const CustomHomeButtonNavigation = ({text, onPress}) => {
  return (
    <View style={{marginTop: scale(10)}}>
      <CustomShadow
        style={[shadowStyle, {borderRadius: scale(6)}]}
        color={Color.blackShadow}>
        <View
          style={{
            borderRadius: scale(6),
            backgroundColor: Color?.white,
          }}>
          <TouchableOpacity activeOpacity={0.7} onPress={onPress}>
            <View
              style={{
                flexDirection: 'row',
                padding: scale(6),
                justifyContent: 'space-between',
                alignItems: 'center',
              }}>
              <Text
                style={{
                  fontSize: scale(12),
                  color: Color.primaryColor,
                  fontWeight: '500',
                  fontFamily: Font?.Poppins,
                  marginTop: verticalScale(2),
                  marginLeft: scale(5),
                }}>
                {text}
              </Text>
              <Entypo
                name="chevron-right"
                size={24}
                color={Color.primaryColor}
              />
            </View>
          </TouchableOpacity>
        </View>
      </CustomShadow>
    </View>
  );
};

export default CustomHomeButtonNavigation;

const styles = StyleSheet.create({});
