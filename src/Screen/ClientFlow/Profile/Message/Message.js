import {StyleSheet, Text, View} from 'react-native';
import React from 'react';
import MessageComponent from '../../../../Components/useMessaging';
import {useSelector} from 'react-redux';
import {useNavigation} from '@react-navigation/native';
 
const Message = ({route}) => {
  const navigation = useNavigation();
  const getId = useSelector(state => state?.user?.token);
  const userId = getId?.id;
  const otherUserId = route?.params?.data?._id;
  const userName = route?.params?.data?.fullName;
  const userImage = route?.params?.data?.image;
  const profileInfo = useSelector(state => state?.user?.profileInfo);
  const profileName = profileInfo?._id;
 
 
  return (
    <MessageComponent
      userId={userId}
      otherUserId={profileName}
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