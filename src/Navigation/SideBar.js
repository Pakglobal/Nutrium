import React, {useCallback, useEffect, useState} from 'react';
import {
  View,
  Text,
  Image,
  StyleSheet,
  TouchableOpacity,
  Alert,
} from 'react-native';
import {FlatList} from 'react-native-gesture-handler';
import Ionicons from 'react-native-vector-icons/Ionicons';
import {Color} from '../assets/styles/Colors';
import {scale, verticalScale} from 'react-native-size-matters';
import {useFocusEffect, useNavigation} from '@react-navigation/native';
import {useDispatch, useSelector} from 'react-redux';
import {loginData, setToken} from '../redux/user';
import CustomLoader from '../Components/CustomLoader';
import {GetUserApi} from '../Apis/ClientApis/ProfileApi';
import {GetAppointmentData} from '../Apis/AdminScreenApi/AppointmentApi';
import {Font} from '../assets/styles/Fonts';

const SideBar = ({onSelectScreen}) => {
  const navigation = useNavigation();
  const dispatch = useDispatch();

  const [asyncLoading, setAsyncLoading] = useState(false);
  const [profileInfo, setProfileInfo] = useState([]);

  const userInfo = useSelector(state => state.user?.userInfo);
  const token = userInfo?.token;
  const id = userInfo?.userData?._id;

  const imageUrl = profileInfo?.image
    ? {uri: profileInfo?.image}
    : profileInfo?.gender === 'Female'
    ? require('../assets/Images/woman.png')
    : require('../assets/Images/man.png');

  const GetUserApiData = async () => {
    try {
      const response = await GetUserApi(token);
      setProfileInfo(response?.data);
    } catch (error) {
      console.error('Error fetching user data', error);
    }
  };

  useEffect(() => {
    GetUserApiData();
  }, []);

  const handleLogOut = async () => {
    dispatch(loginData());
    dispatch(setToken());
  };

  const handleSettingNavigate = () => {
    navigation.navigate('Settings');
  };

  const handleSyncInfo = async () => {
    if (!token || !id) {
      Alert.alert('Error', 'Missing user information. Please log in again.');
      return;
    }
    setAsyncLoading(true);
    try {
      await GetAppointmentData(token);
    } catch (error) {
      console.error('Sync Error:', error);
      Alert.alert('Sync Error', 'Failed to sync data. Please try again later.');
    } finally {
      setAsyncLoading(false);
    }
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
    {icon: 'people-outline', name: 'Sync all info', action: handleSyncInfo},
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
        <View style={{position: 'absolute', right: 0}}>
          <CustomLoader size={'small'} />
        </View>
      )}
    </TouchableOpacity>
  );

  return (
    <View style={{flex: 1, backgroundColor: Color.white}}>
      <View
        style={{
          backgroundColor: Color.primaryColor,
          paddingVertical: verticalScale(20),
        }}>
        <View style={{paddingHorizontal: scale(8)}}>
          <Image
            source={imageUrl}
            style={{
              width: scale(70),
              height: scale(70),
              borderRadius: scale(50),
              marginVertical: verticalScale(20),
            }}
          />
          <Text style={styles.text}>{profileInfo?.fullName}</Text>
          <Text style={styles.text}>{profileInfo?.email}</Text>
        </View>
      </View>

      {/* <View style={{marginVertical: verticalScale(8)}}>
        <Text
          style={{
            marginHorizontal: scale(8),
            marginVertical: verticalScale(8),
            color: Color.black,
          }}>
          Recent
        </Text>
        <FlatList data={listArrayItem} renderItem={renderItem} />
      </View> */}

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
    color: Color.gray,
  },
  text: {
    color: Color.white,
    fontSize: scale(13),
    fontFamily: Font.Poppins,
  },
});
