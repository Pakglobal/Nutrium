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
import { scale, verticalScale } from 'react-native-size-matters';
import Entypo from 'react-native-vector-icons/Entypo';
import MaterialCommunityIcons from 'react-native-vector-icons/MaterialCommunityIcons';
import { Color } from '../assets/styles/Colors';
import { useNavigation } from '@react-navigation/native';
import Logo from '../assets/Images/logoWhite.svg';
import AntDesign from 'react-native-vector-icons/AntDesign';
import Ionicons from 'react-native-vector-icons/Ionicons';
import FontAwesome5 from 'react-native-vector-icons/FontAwesome5';

import { Shadow } from 'react-native-shadow-2';
import IconStyle, { IconPadding } from '../assets/styles/Icon';
import { Font } from '../assets/styles/Fonts';
import { shadowStyle, ShadowValues } from '../assets/styles/Shadow';
import CustomShadow from './CustomShadow';
import CustomLoader from './CustomLoader';

const Header = ({
  screenName,
  logoHeader,
  screenheader,
  handlePlus,
  plus,
  handleSave,
  handleNotification,
  handleAward,
  rightHeaderButton = true,
  loading,
}) => {
  const navigation = useNavigation();
  return (
    <SafeAreaView style={{ backgroundColor: Color.white, zIndex: 1 }}>
      <CustomShadow radius={4} color={Color.gray}>
        <View style={styles.header}>
          {logoHeader && (
            <>
              <CustomShadow
                style={[
                  shadowStyle,
                  {
                    borderBottomLeftRadius: scale(12),
                    borderBottomRightRadius: scale(12),
                  },
                ]}>
                <View
                  style={{
                    flexDirection: 'row',
                    justifyContent: 'space-between',
                    alignItems: 'center',
                    padding: scale(10),
                    paddingVertical: verticalScale(15),
                    borderBottomLeftRadius: scale(12),
                    borderBottomRightRadius: scale(12),
                  }}>
                  <Logo style={{ marginLeft: scale(7) }} />

                  <View style={{ flexDirection: 'row', alignItems: 'center' }}>
                    <TouchableOpacity onPress={handleAward} style={{}}>
                      <FontAwesome5
                        style={IconPadding}
                        name="award"
                        color={Color.white}
                        size={24}
                      />
                    </TouchableOpacity>

                    <TouchableOpacity onPress={handleNotification} style={{}}>
                      <Ionicons
                        style={IconPadding}
                        name="notifications"
                        color={Color.white}
                        size={24}
                      />
                    </TouchableOpacity>

                    <TouchableOpacity onPress={() => navigation.openDrawer()}>
                      <MaterialCommunityIcons
                        style={IconPadding}
                        name="menu"
                        color={Color.white}
                        size={24}
                      />
                    </TouchableOpacity>
                  </View>
                </View>
              </CustomShadow>
            </>
          )}
          {screenheader && (

            <View
              style={{
                flexDirection: 'row',
                justifyContent: 'space-between',
                alignItems: 'center',
                borderBottomLeftRadius: scale(12),
                borderBottomRightRadius: scale(12),
                marginHorizontal: scale(8),
                height: verticalScale(60),
              }}>
              <View style={{ flexDirection: 'row', alignItems: 'center' }}>
                <TouchableOpacity
                  onPress={() => {
                    navigation.goBack();
                  }}
                  style={IconPadding}>
                  <AntDesign
                    name="arrowleft"
                    size={IconStyle.drawerIconSize}
                    color={Color.white}
                  />
                </TouchableOpacity>
                <Text style={styles.screenName}>{screenName}</Text>
              </View>
              {rightHeaderButton &&
                (plus ? (
                  <TouchableOpacity
                    onPress={handlePlus}
                    style={{ padding: scale(8) }}>
                    <AntDesign
                      name="pluscircle"
                      size={IconStyle.headerIconSize}
                      color={Color.white}
                    />
                  </TouchableOpacity>
                ) : loading ? (
                  <CustomLoader color={Color.white} size={'small'} />
                ) : (
                  <TouchableOpacity
                    onPress={handleSave}
                    style={{ padding: scale(8) }}>
                    <Text style={styles.saveStyle}>Save</Text>
                  </TouchableOpacity>
                ))}
            </View>
          )}
        </View>
      </CustomShadow>
    </SafeAreaView >
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
    shadowOffset: { width: 0, height: 2 },
    shadowRadius: 5,
    zIndex: 1,
  },
  screenName: {
    fontSize: scale(16),
    fontWeight: '500',
    fontFamily: Font.PoppinsMedium,
    color: Color.white,
    marginTop: verticalScale(2),
  },
  saveStyle: {
    color: Color?.white,
    fontSize: scale(16),
    fontWeight: '500',
    fontFamily: Font.Poppins,
  },
});
