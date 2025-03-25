import React, {useState} from 'react';
import {View, Text, TouchableOpacity, Image, StyleSheet} from 'react-native';
import {useNavigation} from '@react-navigation/native';
import {scale, verticalScale} from 'react-native-size-matters';
import AntDesign from 'react-native-vector-icons/AntDesign';
import Ionicons from 'react-native-vector-icons/Ionicons';
import Color from '../../../assets/colors/Colors';

const Practitioner = ({route}) => {
  const data = route?.params?.data;
  const image = data?.image
    ? {uri: data?.image}
    : data?.gender === 'Female'
    ? require('../../../assets/Images/woman.png')
    : require('../../../assets/Images/man.png');

  const navigation = useNavigation();

  const information = [
    {
      id: 0,
      icon: 'call',
      label: 'Residence',
      value: data?.country || '--',
    },
    {
      id: 1,
      icon: 'location',
      label: 'Phone number',
      value: data?.phoneNumber || '--',
    },
    {id: 2, icon: 'mail', label: 'E-mail', value: data?.email || '--'},
  ];

  return (
    <View style={{flex: 1, backgroundColor: Color.primary}}>
      <View
        style={{backgroundColor: Color.headerBG, height: verticalScale(150)}}>
        <View style={{marginHorizontal: scale(16)}}>
          <TouchableOpacity
            onPress={() => navigation.goBack()}
            style={{marginTop: verticalScale(20)}}>
            <AntDesign
              name="arrowleft"
              size={verticalScale(20)}
              color={Color.black}
            />
          </TouchableOpacity>
          <View style={styles.imgIconView}>
            <Image source={image} style={styles.img} />
            <Text style={styles.profileName}>{data?.fullName}</Text>
          </View>
        </View>
      </View>

      <View style={{marginTop: verticalScale(40)}}>
        {information?.map(item => (
          <View style={styles.container} key={item?.id}>
            <View style={styles.iconContainer}>
              <Ionicons
                name={item?.icon}
                size={scale(20)}
                color={Color.primaryGreen}
              />
            </View>
            <View style={{marginLeft: scale(20)}}>
              <Text style={styles.label}>{item?.label}</Text>
              <Text style={styles.value}>{item?.value}</Text>
            </View>
          </View>
        ))}
      </View>
    </View>
  );
};

export default Practitioner;

const styles = StyleSheet.create({
  imgIconView: {
    flexDirection: 'row',
    marginTop: verticalScale(50),
    marginLeft: scale(15),
  },
  img: {
    height: verticalScale(70),
    width: verticalScale(70),
    borderRadius: scale(100),
  },
  icnWhiteView: {
    height: verticalScale(35),
    width: verticalScale(35),
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: Color.primary,
    borderRadius: 55,
    marginTop: verticalScale(50),
    marginStart: scale(-35),
  },
  icnPrimaryView: {
    height: verticalScale(25),
    width: verticalScale(25),
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: Color.secondary,
    borderRadius: 50,
  },
  profileName: {
    fontSize: verticalScale(18),
    fontWeight: '700',
    color: Color.txt,
    marginLeft: scale(20),
    marginTop: verticalScale(20),
  },
  value: {
    fontSize: scale(13),
    fontWeight: '700',
    color: Color.black,
  },
  label: {
    color: Color.gray,
    fontWeight: '600',
    fontSize: scale(12),
  },
  container: {
    flexDirection: 'row',
    alignItems: 'center',
    marginVertical: verticalScale(10),
    marginLeft: scale(20),
  },
  iconContainer: {
    height: scale(35),
    width: scale(35),
    borderRadius: scale(50),
    backgroundColor: Color.lightGreen,
    alignItems: 'center',
    justifyContent: 'center',
  },
});
