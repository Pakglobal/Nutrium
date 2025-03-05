import React from 'react';
import {
  View,
  TouchableOpacity,
  LogBox,
  Text,
  StyleSheet,
  SafeAreaView,
} from 'react-native';
import {scale, verticalScale} from 'react-native-size-matters';
import MaterialCommunityIcons from 'react-native-vector-icons/MaterialCommunityIcons';
import NutriumLogo from '../assets/Icon/NutriumLogo.svg';
import Color from '../assets/colors/Colors';

const Header = ({headerText, showIcon}) => {
  return (
    <SafeAreaView style={{backgroundColor:Color.common}}>
      <View
        style={{
          alignItems: 'flex-end',
          flexDirection: 'row',
          justifyContent: 'space-between',
          marginVertical: verticalScale(12),
        }}>
        <NutriumLogo height={scale(25)} width={scale(150)} />
        {showIcon === true ? (
          <TouchableOpacity style={{marginHorizontal: scale(16)}}>
            <MaterialCommunityIcons
              name="email-outline"
              color={Color.gray}
              size={scale(22)}
            />
          </TouchableOpacity>
        ) : null}
      </View>
      {headerText ? <Text style={styles.titleTxt}>{headerText}</Text> : null}
    </SafeAreaView>
  );
};

export default Header;
const styles = StyleSheet.create({
  titleTxt: {
    fontSize: scale(19),
    color: Color.black,
    fontWeight: '600',
    marginTop: verticalScale(25),
    marginBottom: verticalScale(10),
    marginHorizontal: scale(16),
  },
});
