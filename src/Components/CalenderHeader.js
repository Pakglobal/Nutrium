import React from 'react';
import {View, Text, TouchableOpacity, StyleSheet} from 'react-native';
import AntDesign from 'react-native-vector-icons/AntDesign';
import {useNavigation} from '@react-navigation/native';
import {scale, verticalScale} from 'react-native-size-matters';
import {Color} from '../assets/styles/Colors';
import {Font} from '../assets/styles/Fonts';
import {IconPadding} from '../assets/styles/Icon';

const CalenderHeader = ({
  onPressLeft,
  txtFunction,
  rightColor,
  onPressRight,
  disabled,
}) => {
  return (
    <View style={styles.headerContainer}>
      <View style={{marginHorizontal: scale(9)}}>
        <View style={styles.calenderView}>
          <TouchableOpacity style={IconPadding} onPress={onPressLeft}>
            <AntDesign
              name="left"
              color={Color.primaryColor}
              size={verticalScale(16)}
            />
          </TouchableOpacity>
          <Text style={styles.dateTxt}>{txtFunction}</Text>
          <TouchableOpacity
            style={IconPadding}
            onPress={onPressRight}
            disabled={disabled}>
            <AntDesign
              name="right"
              color={rightColor}
              size={verticalScale(16)}
            />
          </TouchableOpacity>
        </View>
      </View>
    </View>
  );
};

export default CalenderHeader;

const styles = StyleSheet.create({
  headerContainer: {
    width: '100%',
  },
  calenderView: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginTop: verticalScale(5),
  },
  dateTxt: {
    fontSize: scale(14),
    color: Color.primaryColor,
    fontFamily: Font?.PoppinsMedium,
    marginTop: verticalScale(2),
  },
});
