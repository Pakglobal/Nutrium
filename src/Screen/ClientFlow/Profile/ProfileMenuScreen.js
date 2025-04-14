
import React, {useCallback, useEffect, useState} from 'react';
import {
  ActivityIndicator,
  Alert,
  Button,
  Image,
  SafeAreaView,
  ScrollView,
  StyleSheet,
  Text,
  TouchableOpacity,
  View,
} from 'react-native';
import {scale, verticalScale} from 'react-native-size-matters';
import AntDesign from 'react-native-vector-icons/AntDesign';
import Ionicons from 'react-native-vector-icons/Ionicons';
import {useFocusEffect, useNavigation} from '@react-navigation/native';
import Header from '../../../Components/Header';
import {Color} from '../../../assets/styles/Colors';
import {useDispatch, useSelector} from 'react-redux';
import {
  guestLoginData,
  loginData,
  setGuestMode,
  setIsGuest,
} from '../../../redux/user';
import {GetUserApi} from '../../../Apis/ClientApis/ProfileApi';
import Toast from 'react-native-simple-toast';
import {setImage} from '../../../redux/client';
import {GetMeasurementData} from '../../../Apis/ClientApis/MeasurementApi';
import {
  GetPhysicalActivities,
  GetPhysicalActivityDetails,
  GetQuickAccess,
} from '../../../Apis/ClientApis/PhysicalActivityApi';
import {
  GetFoodAvoidApiData,
  GetGoalsApiData,
  GetRecommendationApiData,
} from '../../../Apis/ClientApis/RecommendationApi';
import {connectSocket} from '../../../Components/SocketService';

const ProfileMenuScreen = () => {
  const navigation = useNavigation();
  const dispatch = useDispatch();

  const getToken = useSelector(state => state?.user?.userInfo);
  const token = getToken?.token;
  const profileData = getToken?.user || getToken?.userData;
  const id = getToken?.user?._id || getToken?.userData?._id;

  const isGuest = useSelector(state => state.user?.guestMode);
  const guestData = useSelector(state => state.user?.guestUserData);

  const updateProfileImage = useSelector(state => state?.client?.imageInfo);
  const profileImage = getToken?.user?.image || getToken?.userData?.image;

  const [loading, setLoading] = useState(false);
  const [asyncLoading, setAsyncLoading] = useState(false);
  const [userData, setUserData] = useState([]);

  const userImage = userData?.image
    ? {uri: userData?.image}
    : userData?.gender === 'Female'
    ? require('../../../assets/Images/woman.png')
    : require('../../../assets/Images/man.png');

  const showToast = message => {
    Toast.show(message, Toast.LONG, Toast.BOTTOM);
  };

  const handleSignOut = async () => {
    Alert.alert('Sign Out', 'Are you sure you want to sign out?', [
      {
        text: 'Cancel',
        style: 'cancel',
      },
      {
        text: 'Sign Out',
        style: 'destructive',
        onPress: async () => {
          const success = await dispatch(loginData());
          dispatch(setImage(''));

          if (success) {
            navigation.reset({
              index: 0,
              routes: [{name: 'loginChoice'}],
            });
          } else {
            Alert.alert('Error', 'Failed to sign out. Please try again.', [
              {text: 'OK'},
            ]);
          }
        },
      },
    ]);
  };

  useFocusEffect(
    useCallback(() => {
      const fetchSocket = async () => {
        await connectSocket();
      };
      fetchSocket();
    }, []),
  );

  const handleSyncInfo = async () => {
    setAsyncLoading(true);

    try {
      await GetMeasurementData(token, id),
        await GetPhysicalActivityDetails(token, id);
      await GetMeasurementData(token, id);
      await GetPhysicalActivityDetails(token, id);
      await GetPhysicalActivities();
      await GetQuickAccess(token, id);
      await GetRecommendationApiData(token, id);
      await GetFoodAvoidApiData(token, id);
      await GetGoalsApiData(token, id);
      setAsyncLoading(false);
    } catch (error) {
      console.error('Sync Error:', error);
      setAsyncLoading(false);
    }

    setAsyncLoading(false);
  };

  const menuItems = [
    {
      id: 'profile',
      icon: 'person-outline',
      label: profileData?.fullName,
      type: 'profile',
      route: 'mainProfile',
    },
    {
      id: 'food',
      icon: 'document-text-outline',
      label: 'Food diary',
      type: 'menu',
      route: 'foodDiary',
    },
    {
      id: 'water',
      icon: 'water-outline',
      label: 'Water intake',
      type: 'menu',
      route: 'waterIntake',
    },
    {
      id: 'activity',
      icon: 'walk-outline',
      label: 'Physical activity',
      type: 'menu',
      route: 'physicalActivity',
    },
    {
      id: 'measurements',
      icon: 'clipboard-outline',
      label: 'Measurements',
      type: 'menu',
      route: 'measurements',
    },
    {
      id: 'shopping',
      icon: 'cart-outline',
      label: 'Shopping lists',
      type: 'menu',
      route: 'shoppingLists',
    },
    {
      id: 'practitioner-header',
      label: 'Practitioner',
      type: 'header',
    },
    {
      id: 'practitioner',
      icon: 'medical-outline',
      label: userData?.fullName,
      type: 'profile',
      route: 'practitioner',
    },
    {
      id: 'messages',
      icon: 'mail-outline',
      label: 'Messages',
      type: 'menu',
      onPress: () => navigation.navigate('messages', {data: userData}),
    },
    {
      id: 'other-header',
      label: 'Other',
      type: 'header',
    },
    {
      id: 'sync',
      icon: 'sync-outline',
      label: 'Sync all info',
      type: 'menu',
      onPress: () => handleSyncInfo(),
    },
    {
      id: 'signout',
      icon: 'log-out-outline',
      label: 'Sign out',
      type: 'menu',
      onPress: () => handleSignOut(),
    },
  ];

  const renderMenuItem = item => {
    if (item.type === 'header') {
      return (
        <View key={item?.id} style={styles.headerContainer}>
          <Text style={styles.headerText}>{item?.label}</Text>
        </View>
      );
    }

    if (item?.type === 'profile') {
      if (item?.id === 'profile') {
        let profileImgSource;
        if (updateProfileImage && typeof updateProfileImage === 'string') {
          profileImgSource = {uri: updateProfileImage};
        } else if (profileImage && typeof profileImage === 'string') {
          profileImgSource = {uri: profileImage};
        } else {
          profileImgSource =
            profileData?.gender === 'Female'
              ? require('../../../assets/Images/woman.png')
              : require('../../../assets/Images/man.png');
        }
        return (
          <View key={item?.id} style={styles.profileTopContainer}>
            <TouchableOpacity
              style={styles.profileInfo}
              onPress={() =>
                navigation.navigate(item?.route, {data: profileData})
              }>
              <Image source={profileImgSource} style={styles.profileImage} />
              <Text style={styles.profileName}>{item?.label}</Text>
            </TouchableOpacity>
            <TouchableOpacity
              style={styles.settingsButton}
              onPress={() => navigation.navigate('settings')}>
              <Ionicons name="settings-outline" size={22} color="#666" />
            </TouchableOpacity>
          </View>
        );
      } else {
        return (
          <TouchableOpacity
            key={item?.id}
            style={styles.profileContainer}
            onPress={() => navigation.navigate(item?.route, {data: userData})}>
            <Image source={userImage} style={styles.profileImage} />
            <Text style={styles.profileName}>{item?.label}</Text>
          </TouchableOpacity>
        );
      }
    } else if (item?.id === 'sync') {
      return (
        <View key={item?.id}>
          <TouchableOpacity
            onPress={() => item?.onPress()}
            style={{
              flexDirection: 'row',
              justifyContent: 'space-between',
              alignItems: 'center',
              paddingVertical: verticalScale(8),
            }}>
            <View style={{flexDirection: 'row', alignItems: 'center'}}>
              <Ionicons name={item?.icon} size={22} color="#666" />
              <Text style={styles.menuText}>{item?.label}</Text>
            </View>

            {asyncLoading && (
              <View style={{alignSelf: 'flex-end'}}>
                <ActivityIndicator />
              </View>
            )}
          </TouchableOpacity>
        </View>
      );
    }

    return (
      <TouchableOpacity
        key={item?.id}
        style={styles.menuItem}
        onPress={() =>
          item?.onPress ? item?.onPress() : navigation.navigate(item?.route)
        }>
        <View style={styles.iconContainer}>
          <Ionicons name={item?.icon} size={22} color="#666" />
        </View>
        <Text style={styles.menuText}>{item?.label}</Text>
      </TouchableOpacity>
    );
  };

  useEffect(() => {
    if (isGuest === true) {
      return;
    } else {
      GetUserApiData();
    }
  }, []);

  const GetUserApiData = async () => {
    try {
      setLoading(true);
      const response = await GetUserApi(token);
      if (response?.message === 'User retrieved successfully') {
        setUserData(response?.data);
      } else {
        showToast(response?.message);
        setLoading(false);
      }
      setLoading(false);
    } catch (error) {
      showToast(error);
      setLoading(false);
    }
  };

  const handleLogout = async () => {
    dispatch(setGuestMode());
    // dispatch(setIsGuest());
    dispatch(guestLoginData());
  };

  return (
    <SafeAreaView style={styles.container}>
      <Header logoHeader={true} />
      {isGuest === true ? (
        <View>
          <View style={{marginHorizontal: scale(16)}}>
            <Text style={{color: Color.black}}>{guestData?.name}</Text>
            <Text style={{color: Color.black}}>{guestData?.email}</Text>

            <TouchableOpacity
              onPress={handleLogout}
              style={styles.signOutButton}>
              <View style={{flexDirection: 'row', alignItems: 'center'}}>
                <Text style={styles.signOutText}>Log out</Text>
                <AntDesign
                  name="arrowright"
                  color={'#FFFFFF'}
                  size={16}
                  style={{marginLeft: scale(8)}}
                />
              </View>
            </TouchableOpacity>
          </View>
        </View>
      ) : (
        <View>
          {loading ? (
            <View
              style={{
                // flex: 1,
                justifyContent: 'center',
                alignItems: 'center',
              }}>
              <ActivityIndicator size="large" color={Color.primaryColor} />
            </View>
          ) : (
            <View style={styles.scrollView}>
              {menuItems.map(item => renderMenuItem(item))}
            </View>
          )}
        </View>
      )}
    </SafeAreaView>
  );
};

export default ProfileMenuScreen;

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#fff',
  },
  scrollView: {
    // flex: 1,
    paddingHorizontal: scale(16),
  },
  profileTopContainer: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingVertical: verticalScale(8),
    marginTop: verticalScale(8),
  },
  profileInfo: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  profileContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingVertical: verticalScale(8),
  },
  profileImage: {
    width: scale(35),
    height: scale(35),
    borderRadius: scale(20),
    backgroundColor: Color.white,
  },
  profileName: {
    marginLeft: scale(12),
    fontSize: scale(15),
    fontWeight: '500',
    color: Color.black,
  },
  settingsButton: {
    padding: scale(8),
  },
  headerContainer: {
    marginVertical: verticalScale(8),
  },
  headerText: {
    fontSize: scale(16),
    fontWeight: '600',
    color: Color.black,
  },
  menuItem: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingVertical: verticalScale(8),
  },
  iconContainer: {
    width: scale(24),
    height: scale(24),
    alignItems: 'center',
    justifyContent: 'center',
  },
  menuText: {
    marginLeft: scale(16),
    fontSize: scale(14),
    color: Color.black,
  },
  signOutButton: {
    flexDirection: 'row',
    height: verticalScale(38),
    borderRadius: scale(24),
    justifyContent: 'center',
    alignItems: 'center',
    marginTop: verticalScale(38),
    backgroundColor: Color.secondary,
  },
  signOutText: {
    fontSize: scale(15),
    fontWeight: '600',
    color: Color.white,
  },
});