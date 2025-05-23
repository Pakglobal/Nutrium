import {StyleSheet, Text, View} from 'react-native';
import React from 'react';
import MessageComponent from '../../../Components/useMessaging';
import {useNavigation} from '@react-navigation/native';

const MessageClient = ({route}) => {
  const navigation = useNavigation();
  const clientData = route?.params?.response[0];
  const userId = clientData?.userId;
  const otherUserId = clientData?._id;
  const userName = clientData?.fullName;
  const userImage = clientData?.image;

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
