import {StyleSheet, Text, View, TouchableOpacity, Image} from 'react-native';
import React from 'react';
import {scale, verticalScale} from 'react-native-size-matters';
import AntDesign from 'react-native-vector-icons/AntDesign';
import {Color} from '../assets/styles/Colors';

const HydratedView = ({onPress, img, valueText}) => {
  return (
    <TouchableOpacity style={styles.waterCardView} onPress={onPress}>
      <Image source={img} style={styles.waterImg} />
      <View style={{flexDirection: 'column', alignItems: 'flex-end'}}>
        <AntDesign
          name="pluscircleo"
          color="#83bcff"
          size={verticalScale(15)}
          style={{marginEnd: scale(10)}}
        />
        <Text style={styles.waterTxt}>{valueText}</Text>
      </View>
    </TouchableOpacity>
  );
};

export default HydratedView;

const styles = StyleSheet.create({
  waterCardView: {
    marginHorizontal: scale(5),
    borderRadius: 10,
    height: verticalScale(65),
    width: '30%',
    backgroundColor: '#f3f6fe',
    shadowColor: '#000',
    shadowOffset: {
      width: 0,
      height: 1,
    },
    shadowOpacity: 0.1,
    shadowRadius: 2,
    elevation: 1,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
  },
  waterImg: {
    height: verticalScale(40),
    width: scale(30),
    resizeMode: 'stretch',
    marginStart: scale(8),
  },
  waterTxt: {
    color: Color.gray,
    fontWeight: '600',
    marginTop: verticalScale(20),
    marginEnd: scale(5),
  },
});
