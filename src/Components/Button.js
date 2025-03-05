import React from 'react';
import {Text, TouchableOpacity} from 'react-native';
import {scale, verticalScale} from 'react-native-size-matters';
import AntDesign from 'react-native-vector-icons/AntDesign';

const CustomButton = ({
  onPress,
  disabled,
  backgroundColor,
  txtColor,
  iconColor,
  marginTop,
  text,
}) => {
  return (
    <TouchableOpacity
      onPress={onPress}
      disabled={disabled}
      style={{
        backgroundColor: backgroundColor,
        width: '100%',
        height: verticalScale(35),
        alignItems: 'center',
        justifyContent: 'center',
        flexDirection: 'row',
        borderRadius: 30,
        marginTop: marginTop,
      }}>
      <Text
        style={{
          color: txtColor,
          fontSize: verticalScale(14),
          fontWeight: '700',
        }}>
        {text}
      </Text>
      <AntDesign
        name="arrowright"
        color={iconColor}
        size={verticalScale(15)}
        style={{marginStart: scale(10)}}
      />
    </TouchableOpacity>
  );
};

export default CustomButton;
