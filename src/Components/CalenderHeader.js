import React from 'react';
import {View, Text, TouchableOpacity, StyleSheet} from 'react-native';
import AntDesign from 'react-native-vector-icons/AntDesign';
import {useNavigation} from '@react-navigation/native';
import {scale, verticalScale} from 'react-native-size-matters';
import {Color} from '../assets/styles/Colors';

const CalenderHeader = ({
  onPressLeft,
  txtFunction,
  rightColor,
  onPressRight,
  disabled,
}) => {
  const navigation = useNavigation();
  return (
    <View style={styles.headerContainer}>
      <View style={{marginHorizontal: scale(8)}}>
        <View style={styles.calenderView}>
          <AntDesign
            name="left"
            color={Color.primaryColor}
            size={verticalScale(16)}
            onPress={onPressLeft}
          />
          <Text style={styles.dateTxt}>{txtFunction}</Text>
          <AntDesign
            name="right"
            color={rightColor}
            size={verticalScale(16)}
            onPress={onPressRight}
            disabled={disabled}
          />
        </View>
      </View>
    </View>
  );
};

export default CalenderHeader;

const styles = StyleSheet.create({
  headerContainer: {
    width: '100%',
    backgroundColor: Color.common,
  },
  calenderView: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginVertical: verticalScale(10),
  },
  dateTxt: {
    fontSize: verticalScale(12),
    color: Color.black,
    fontWeight: '600',
  },
});
