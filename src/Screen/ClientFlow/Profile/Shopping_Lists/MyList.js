import {StyleSheet, Text, View} from 'react-native';
import React from 'react';
import moment from 'moment';
import {useNavigation} from '@react-navigation/native';
import Header from '../../../../Components/Header';

const MyList = () => {
  const navigation = useNavigation();
  const formatDate = dateString => moment(dateString).format('M/D/YY');

  return (
    <View>
      <Header
        screenheader={true}
        plus={true}
        screenName={'Shopping lists'}
        handlePlus={() => navigation.navigate('newShoppingLists')}
      />
      <Text>{`My list [${formatDate(new Date())}]`}</Text>
    </View>
  );
};

export default MyList;

const styles = StyleSheet.create({});
