import {StyleSheet, Text, View} from 'react-native';
import React from 'react';
import MessageComponent from '../../../../Components/useMessaging';
import {useSelector} from 'react-redux';
import {useNavigation} from '@react-navigation/native';

const Message = ({route}) => {
  const navigation = useNavigation();
  const getId = useSelector(state => state?.user?.token);
  const userId = getId?.id;
  const adminData = route?.params?.data;
  const userName = adminData?.name;
  const userImage = adminData?.image;
  const otherUserId = adminData?.otherUserId;

  return (
    <MessageComponent
      userId={userId}
      otherUserId={otherUserId}
      userName={userName}
      image={userImage}
      showHeader={true}
      onBackPress={() => navigation.goBack()}
      containerStyle={{backgroundColor: '#f9f9f9'}}
    />
  );
};

export default Message;

const styles = StyleSheet.create({});
