import React, {useCallback, useEffect, useState} from 'react';
import {
  View,
  Text,
  Image,
  StyleSheet,
  TouchableOpacity,
  ActivityIndicator,
} from 'react-native';
import {FlatList} from 'react-native-gesture-handler';
import Ionicons from 'react-native-vector-icons/Ionicons';
import {Color} from '../assets/styles/Colors';
import {scale, verticalScale} from 'react-native-size-matters';
import {useFocusEffect, useNavigation} from '@react-navigation/native';
import {useDispatch, useSelector} from 'react-redux';
import {loginData} from '../redux/user';
import {GoogleSignin} from '@react-native-google-signin/google-signin';

const SideBar = ({onSelectScreen}) => {
  const navigation = useNavigation();
  const dispatch = useDispatch();

  const [asyncLoading, setAsyncLoading] = useState(false);

  const getUserInfo = useSelector(state => state?.user?.profileInfo);
  const imageUrl = getUserInfo?.image
    ? {uri: getUserInfo?.image}
    : getUserInfo?.gender === 'Female'
    ? require('../assets/Images/woman.png')
    : require('../assets/Images/man.png');

  const handleLogOut = async () => {
    dispatch(loginData());
  };

  const handleSettingNavigate = () => {
    navigation.navigate('Settings');
  };

  const handelRefresh = async () => {
    setAsyncLoading(true);

    try {
      await new Promise(resolve => setTimeout(resolve, 2000));
      setAsyncLoading(false);
    } catch (error) {
      console.error('Error syncing info:', error);
      setAsyncLoading(false);
    }
    navigation.goBack();
  };

  const listArrayItem = [
    {icon: 'mail-outline', label: 'MESSAGES', name: 'Messages'},
    {icon: 'people-outline', label: 'CLIENTS', name: 'Clients'},
    {
      icon: 'calendar-outline',
      label: 'APPOINTMENTS',
      name: 'Appointments',
    },
  ];

  const bottomListItems = [
    {icon: 'settings-outline', name: 'Settings', action: handleSettingNavigate},
    {icon: 'people-outline', name: 'Sync all info', action: handelRefresh},
    {icon: 'log-out-outline', name: 'Sign out', action: handleLogOut},
  ];

  const renderItem = ({item}) => (
    <TouchableOpacity
      onPress={() => {
        if (item?.action) {
          item?.action();
        } else {
          onSelectScreen(item?.label);
          navigation.navigate(item?.label, {label: item?.label});
        }
      }}
      style={styles.item}>
      <Ionicons name={item?.icon} color={Color.gray} size={scale(22)} />
      <Text style={styles.title}>{item?.name}</Text>
      {item?.name === 'Sync all info' && asyncLoading && (
        <View style={{alignItems: 'flex-end', flex: 1}}>
          <ActivityIndicator />
        </View>
      )}
    </TouchableOpacity>
  );

  return (
    <View style={{flex: 1}}>
      <View
        style={{
          backgroundColor: Color.primaryColor,
          paddingVertical: verticalScale(20),
        }}>
        <View style={{marginHorizontal: scale(8)}}>
          <Image
            source={imageUrl}
            style={{
              width: 70,
              height: 70,
              borderRadius: 50,
              marginTop: verticalScale(20),
              marginBottom: verticalScale(10),
            }}
          />
          <Text style={styles.text}>{getUserInfo?.fullName}</Text>
          <Text style={styles.text}>{getUserInfo?.email}</Text>
        </View>
      </View>

      <View style={{marginVertical: verticalScale(8)}}>
        <Text
          style={{
            marginHorizontal: scale(8),
            marginVertical: verticalScale(8),
            color: Color.black,
          }}>
          Recent
        </Text>
        <FlatList data={listArrayItem} renderItem={renderItem} />
      </View>

      <View style={{marginVertical: verticalScale(8)}}>
        <Text
          style={{
            marginHorizontal: scale(8),
            marginVertical: verticalScale(8),
            color: Color.black,
          }}>
          Settings and support
        </Text>
        <FlatList data={bottomListItems} renderItem={renderItem} />
      </View>
    </View>
  );
};

export default SideBar;

const styles = StyleSheet.create({
  item: {
    paddingVertical: verticalScale(8),
    marginHorizontal: scale(10),
    flexDirection: 'row',
    justifyContent: 'flex-start',
    alignItems: 'center',
  },
  title: {
    fontSize: scale(14),
    marginLeft: scale(20),
    fontWeight: '600',
    color: Color.gray,
  },
  text: {
    color: Color.white,
    fontSize: scale(14),
  },
});
