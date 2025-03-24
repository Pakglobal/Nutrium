import {StyleSheet, Text, View} from 'react-native';
import React from 'react';
import MessageComponent from '../../../../Components/useMessaging';
import {useSelector} from 'react-redux';
import {useNavigation} from '@react-navigation/native';

const Message = ({route}) => {
  const navigation = useNavigation();
  const getId = useSelector(state => state?.user?.userInfo);
  const userId = getId?.userData?._id || getId?.user?._id;

  const otherUserId = route?.params?.data?._id;
  const userName = route?.params?.data?.fullName;
  const userImage = route?.params?.data?.image;

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
