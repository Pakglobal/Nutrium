import {StyleSheet, Text, View} from 'react-native';
import React from 'react';
import moment from 'moment';
import BackHeader from '../../../../Components/BackHeader';
import {useNavigation} from '@react-navigation/native';

const MyList = () => {
  const navigation = useNavigation();
  const formatDate = dateString => moment(dateString).format('M/D/YY');

  return (
    <View>
      <BackHeader
        titleName={`My list [${formatDate(new Date())}]`}
        onPressBack={() => navigation.goBack()}
        onPress={() => navigation.navigate('newShoppingLists')}
        backText={'Shopping lists'}
      />
    </View>
  );
};

export default MyList;

const styles = StyleSheet.create({});
