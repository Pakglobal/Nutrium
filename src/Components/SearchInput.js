import React from 'react';
import {View, TextInput, Pressable, StyleSheet} from 'react-native';
import {scale, verticalScale} from 'react-native-size-matters';
import AntDesign from 'react-native-vector-icons/AntDesign';
import Color from '../assets/colors/Colors';

const SearchInput = ({placeholder, value, onChangeText, onPressIcon}) => {
  return (
    <View style={styles.searchContainer}>
      <TextInput
        placeholder={placeholder}
        placeholderTextColor={Color.gray}
        value={value}
        onChangeText={onChangeText}
        style={styles.inputView}
      />
      <Pressable style={{marginEnd: scale(10)}} onPress={onPressIcon}>
        <AntDesign
          name="closecircle"
          size={verticalScale(28)}
          color={Color.primary}
        />
      </Pressable>
    </View>
  );
};

export default SearchInput;

const styles = StyleSheet.create({
  searchContainer: {
    flexDirection: 'row',
    height: verticalScale(40),
    width: '100%',
    borderRadius: 50,
    backgroundColor: Color.headerBG,
    marginVertical: verticalScale(20),
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  inputView: {
    marginStart: scale(10),
    fontSize: verticalScale(13),
    fontWeight: '600',
    color: Color.txt,
  },
});
