import {StyleSheet, Text, TouchableOpacity, View} from 'react-native';
import React from 'react';
import AntDesign from 'react-native-vector-icons/AntDesign';
import {scale, verticalScale} from 'react-native-size-matters';
import {Color} from '../assets/styles/Colors';

const SighnUpHeader = ({onPressBack}) => {
  return (
    <View>
      <TouchableOpacity
        onPress={onPressBack}
        style={{marginStart: scale(15), marginBottom: verticalScale(30)}}>
        <AntDesign
          name="arrowleft"
          color={Color.txt}
          size={verticalScale(22)}
        />
      </TouchableOpacity>

      <Text style={styles.titleTxt}>Sign Up</Text>
    </View>
  );
};

export default SighnUpHeader;

const styles = StyleSheet.create({
  titleTxt: {
    fontSize: scale(18),
    color: Color.black,
    fontWeight: '600',
    marginStart: scale(15),
  },
});
