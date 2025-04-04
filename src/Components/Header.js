import React from 'react';
import {
  View,
  TouchableOpacity,
  LogBox,
  Text,
  StyleSheet,
  SafeAreaView,
  Pressable,
  Image,
} from 'react-native';
import {scale, verticalScale} from 'react-native-size-matters';
import Entypo from 'react-native-vector-icons/Entypo';
import MaterialCommunityIcons from 'react-native-vector-icons/MaterialCommunityIcons';
import Color, {Font, ShadowValues} from '../assets/colors/Colors';
import {useNavigation} from '@react-navigation/native';
import Logo from '../assets/Images/logoWhite.svg';
import Plus from '../assets/Icon/headerPlus.svg';
import AntDesign from 'react-native-vector-icons/AntDesign';

import {Shadow} from 'react-native-shadow-2';
import { IconPadding } from '../assets/styles/Icon';

const Header = ({
  screenName,
  logoHeader,
  screenheader,
  handlePlus,
  handleMenu
}) => {
  const navigation = useNavigation();
  return (
    <SafeAreaView style={styles.header}>
      {logoHeader && (
        <>
          <Shadow
            distance={ShadowValues.distance}
            startColor={ShadowValues.blackShadow}
            style={{width: '100%'}}>
            <View
              style={{
                flexDirection: 'row',
                justifyContent: 'space-between',
                alignItems: 'center',
                padding: scale(10),
                paddingVertical: verticalScale(15),
                borderBottomLeftRadius: scale(12),
                borderBottomRightRadius: scale(12),
                marginHorizontal: scale(8),
              }}>
              <Logo />
              <TouchableOpacity onPress={handleMenu} style={{}}>
              <MaterialCommunityIcons style={IconPadding} name="menu" color={Color.white} size={24} />
              </TouchableOpacity>
            </View>
          </Shadow>
        </>
      )}
      {screenheader && (
        <>
          <Shadow
            distance={ShadowValues.distance}
            startColor={ShadowValues.blackShadow}
            style={{width: '100%'}}>
            <View
              style={{
                flexDirection: 'row',
                justifyContent: 'space-between',
                alignItems: 'center',
                paddingVertical: verticalScale(8),
                borderBottomLeftRadius: scale(12),
                borderBottomRightRadius: scale(12),
                marginHorizontal: scale(8),
              }}>
              <View style={{flexDirection: 'row', alignItems: 'center'}}>
                <TouchableOpacity
                  onPress={() => navigation.goBack()}
                  style={{padding: scale(10), backgroundColor: 'red'}}>
<AntDesign name="arrowleft" size={24} color={Color.white} />
                </TouchableOpacity>
                <Text style={styles.screenName}>{screenName}</Text>
              </View>
              <TouchableOpacity
                onPress={handlePlus}
                style={{padding: scale(8)}}>
                <Plus />
              </TouchableOpacity>
            </View>
          </Shadow>
        </>
      )}
    </SafeAreaView>
  );
};

export default Header;
const styles = StyleSheet.create({
  header: {
    backgroundColor: Color?.primaryColor,
    borderBottomLeftRadius: scale(12),
    borderBottomRightRadius: scale(12),
    shadowColor: Color?.black,
    shadowOpacity: 0.1,
    shadowOffset: {width: 0, height: 2},
    shadowRadius: 5,
  },
  screenName: {
    fontSize: scale(18),
    fontWeight: '500',
    fontFamily: Font.Sofia,
    color: Color.white,
  },
});
