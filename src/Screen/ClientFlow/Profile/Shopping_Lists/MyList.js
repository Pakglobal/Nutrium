import {StyleSheet, Text, View} from 'react-native';
import React from 'react';
import moment from 'moment';
import {useNavigation} from '@react-navigation/native';

const MyList = () => {
  const navigation = useNavigation();
  const formatDate = dateString => moment(dateString).format('M/D/YY');

  return <View></View>;
};

export default MyList;

const styles = StyleSheet.create({});
