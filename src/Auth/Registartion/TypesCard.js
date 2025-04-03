import React from 'react';
import {View, Text, TouchableOpacity, StyleSheet} from 'react-native';
import {scale, verticalScale} from 'react-native-size-matters';
import Color from '../../assets/colors/Colors';

const TypesCard = ({item, selectedOption, onSelect}) => {
  const handleSelect = () => {
    if (selectedOption === item.title) {
      onSelect(null);
    } else {
      onSelect(item.title);
    }
  };
  return (
    <TouchableOpacity
      onPress={handleSelect}
      style={[
        styles.cardContainer,
        {
          borderColor:
            selectedOption === item.title ? Color.secondary : Color.borderColor,
          backgroundColor:
            selectedOption === item.title
              ? 'rgba(232, 150, 106,0.1)'
              : Color.primary,
        },
      ]}>
      <View
        style={[
          styles.buttonContainer,
          {
            borderColor:
              selectedOption === item.title ? Color.secondary : Color.gray,
          },
        ]}>
        {selectedOption === item.title && <View style={styles.dots} />}
      </View>
      <Text style={styles.title}>{item.title}</Text>
    </TouchableOpacity>
  );
};

export default TypesCard;
const styles = StyleSheet.create({
  cardContainer: {
    flexDirection: 'row',
    width: '100%',
    height: verticalScale(65),
    borderWidth: 2,
    alignItems: 'center',
    borderRadius: 25,
    marginVertical: verticalScale(10),
  },
  buttonContainer: {
    height: verticalScale(20),
    width: verticalScale(20),
    borderRadius: 20,
    borderWidth: 2,
    alignItems: 'center',
    justifyContent: 'center',
    marginHorizontal: scale(10),
  },
  dots: {
    height: verticalScale(10),
    width: verticalScale(10),
    borderRadius: 20,
    backgroundColor: Color.secondary,
  },
  title: {
    width: '75%',
    marginHorizontal: scale(15),
    fontSize: verticalScale(13),
    fontWeight: '600',
    color: Color.txt,
  },
});
