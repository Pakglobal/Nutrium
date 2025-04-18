import {StyleSheet, Text, View} from 'react-native';
import React from 'react';
import MessageComponent from '../../../Components/useMessaging';
import {useNavigation} from '@react-navigation/native';

const MessageClient = ({route}) => {
  const navigation = useNavigation();
  const clientData = route?.params?.response;

  const userId = clientData[0]?.userId;
  const otherUserId = clientData[0]?._id;

  const userName = clientData[0]?.fullName;
  const userImage = clientData[0]?.image;
  const userGender = clientData[0]?.gender;

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

export default MessageClient;

const styles = StyleSheet.create({});
