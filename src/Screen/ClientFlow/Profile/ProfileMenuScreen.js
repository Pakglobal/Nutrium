import React, {useCallback, useEffect, useState} from 'react';
import {
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
  setGuestToken,
  setToken,
} from '../../../redux/user';
import {GetUserApi} from '../../../Apis/ClientApis/ProfileApi';
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

  const demoClient = useSelector(state => state?.user?.guestToken?.demoClient);
  const guestData = useSelector(state => state.user?.guestUserData?.userData);

  const handleLogout = async () => {
    dispatch(guestLoginData());
    dispatch(setGuestToken());
    // navigation.navigate('loginChoice')
  };

  return (
    <SafeAreaView style={styles.container}>
      <Header logoHeader={true} />
      {demoClient ? (
        <View>
          <Text style={styles.headerText}>{guestData?.fullName}</Text>
          <Text style={styles.headerText}>{guestData?.email}</Text>
          <Button title="sign out" onPress={handleLogout} />
        </View>
      ) : (
        <></>
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
