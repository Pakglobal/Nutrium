import React, {useEffect, useState} from 'react';
import {
  Image,
  Text,
  View,
  StyleSheet,
  TouchableOpacity,
  Alert,
  ActivityIndicator,
} from 'react-native';
import {useDispatch, useSelector} from 'react-redux';
import MaterialCommunityIcons from 'react-native-vector-icons/MaterialCommunityIcons';
import Logo from '../assets/Images/logoGreen.svg';
import {scale, verticalScale} from 'react-native-size-matters';
import {Color} from '../assets/styles/Colors';
import FontAwesome5 from 'react-native-vector-icons/FontAwesome5';
import MaterialIcons from 'react-native-vector-icons/MaterialIcons';
import Octicons from 'react-native-vector-icons/Octicons';
import Ionicons from 'react-native-vector-icons/Ionicons';
import {loginData} from '../redux/user';
import {setImage} from '../redux/client';
import {GetMeasurementData} from '../Apis/ClientApis/MeasurementApi';
import {
  GetPhysicalActivities,
  GetPhysicalActivityDetails,
  GetQuickAccess,
} from '../Apis/ClientApis/PhysicalActivityApi';
import {
  GetFoodAvoidApiData,
  GetGoalsApiData,
  GetRecommendationApiData,
} from '../Apis/ClientApis/RecommendationApi';
import {GetUserApi} from '../Apis/ClientApis/ProfileApi';
import IconStyle, {IconBg, IconPadding} from '../assets/styles/Icon';
import { Font } from '../assets/styles/Fonts';

const ClientDrawerContent = props => {
  const {navigation} = props;
  const dispatch = useDispatch();

  const [asyncLoading, setAsyncLoading] = useState(false);
  const [loading, setLoading] = useState(false);
  const [userData, setUserData] = useState([]);

  const userInfo = useSelector(state => state.user?.userInfo);
  const user = userInfo?.user || userInfo?.userData;
  const userName = userInfo?.user?.fullName || userInfo?.userData?.fullName;
  const userImage = userInfo?.user?.image || userInfo?.userData?.image;

  const token = userInfo?.token;
  const id = userInfo?.user?._id || userInfo?.userData?._id;
  const practitionerName = userData?.fullName;
  const practitionerImage = userData?.image
    ? {uri: userData?.image}
    : userData?.gender === 'Female'
    ? require('../assets/Images/woman.png')
    : require('../assets/Images/man.png');

  const GetUserApiData = async () => {
    try {
      setLoading(true);
      const response = await GetUserApi(token);
      setUserData(response?.data);

      setLoading(false);
    } catch (error) {
      setLoading(false);
    }
  };

  useEffect(() => {
    GetUserApiData();
  }, []);

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
              routes: [{name: 'loginScreen'}],
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

  const handleSyncInfo = async () => {
    setAsyncLoading(true);

    try {
      await GetMeasurementData(token, id),
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

  return (
    <View style={styles.drawerContainer}>
      <View style={styles.logoContainer}>
        <Logo />
        <TouchableOpacity onPress={() => props.navigation.closeDrawer()}>
          <Ionicons
            style={IconPadding}
            name="close"
            size={26}
            color={Color.black}
          />
        </TouchableOpacity>
      </View>

      <View style={styles.drawerHeader}>
        <TouchableOpacity
          style={{flexDirection: 'row', alignItems: 'center'}}
          onPress={() => {
            props.navigation.closeDrawer();
            navigation.navigate('mainProfile', {data: user});
          }}>
          <Image source={{uri: userImage}} style={styles.avatar} />
          <Text style={styles.userName}>{userName}</Text>
        </TouchableOpacity>
        <TouchableOpacity
          onPress={() => {
            props.navigation.closeDrawer();
            navigation.navigate('settings');
          }}>
          <Ionicons
            style={IconPadding}
            name="settings-sharp"
            size={26}
            color={Color.black}
          />
        </TouchableOpacity>
      </View>

      <View>
        <TouchableOpacity
          style={styles.drawerItem}
          onPress={() => {
            props.navigation.closeDrawer();
            navigation.navigate('foodDiary');
          }}>
          <View style={IconBg}>
            <Octicons
              name="note"
              size={IconStyle.drawerIconSize}
              color={IconStyle.drawerIconColor}
            />
          </View>
          <Text style={styles.drawerItemText}>Food diary</Text>
        </TouchableOpacity>

        <TouchableOpacity
          style={styles.drawerItem}
          onPress={() => {
            props.navigation.closeDrawer();
            navigation.navigate('waterIntake');
          }}>
          <View style={IconBg}>
            <Ionicons
              name="water-sharp"
              size={IconStyle.drawerIconSize}
              color={IconStyle.drawerIconColor}
            />
          </View>
          <Text style={styles.drawerItemText}>Water intake</Text>
        </TouchableOpacity>

        <TouchableOpacity
          style={styles.drawerItem}
          onPress={() => {
            props.navigation.closeDrawer();
            navigation.navigate('physicalActivity');
          }}>
          <View style={IconBg}>
            <FontAwesome5
              name="running"
              size={IconStyle.drawerIconSize}
              color={IconStyle.drawerIconColor}
            />
          </View>
          <Text style={styles.drawerItemText}>Physical activity</Text>
        </TouchableOpacity>

        <TouchableOpacity
          style={styles.drawerItem}
          onPress={() => {
            props.navigation.closeDrawer();
            navigation.navigate('measurements');
          }}>
          <View style={IconBg}>
            <MaterialCommunityIcons
              name="calendar-text"
              size={IconStyle.drawerIconSize}
              color={IconStyle.drawerIconColor}
            />
          </View>
          <Text style={styles.drawerItemText}>Measurements</Text>
        </TouchableOpacity>

        <TouchableOpacity
          style={styles.drawerItem}
          onPress={() => {
            props.navigation.closeDrawer();
            navigation.navigate('shoppingLists');
          }}>
          <View style={IconBg}>
            <MaterialIcons
              name="shopping-cart"
              size={IconStyle.drawerIconSize}
              color={IconStyle.drawerIconColor}
            />
          </View>
          <Text style={styles.drawerItemText}>Shopping lists</Text>
        </TouchableOpacity>
      </View>

      <View style={styles.sectionHeader}>
        <Text style={styles.sectionTitle}>Practitioner</Text>
      </View>

      <TouchableOpacity
        style={styles.drawerItem}
        onPress={() => {
          props.navigation.closeDrawer();
          navigation.navigate('practitioner', {data: userData});
        }}>
        <Image source={practitionerImage} style={styles.avatar} />
        <Text style={styles.drawerItemText}>{practitionerName}</Text>
      </TouchableOpacity>

      <TouchableOpacity
        style={styles.drawerItem}
        onPress={() => {
          props.navigation.closeDrawer();
          navigation.navigate('messages', {data: user});
        }}>
        <View style={IconBg}>
          <MaterialCommunityIcons
            name="email"
            size={IconStyle.drawerIconSize}
            color={IconStyle.drawerIconColor}
          />
        </View>
        <Text style={styles.drawerItemText}>Messages</Text>
      </TouchableOpacity>

      <View style={styles.sectionHeader}>
        <Text style={styles.sectionTitle}>Other</Text>
      </View>

      <TouchableOpacity style={styles.drawerItem} onPress={handleSyncInfo}>
        <View style={IconBg}>
          <Ionicons
            name="sync"
            size={IconStyle.drawerIconSize}
            color={IconStyle.drawerIconColor}
          />
        </View>
        <Text style={styles.drawerItemText}>Sync all info</Text>
        {asyncLoading && (
          <View style={{position: 'absolute', right: 0}}>
            <ActivityIndicator />
          </View>
        )}
      </TouchableOpacity>

      <TouchableOpacity style={styles.drawerItem} onPress={handleSignOut}>
        <View style={IconBg}>
          <MaterialIcons
            name="logout"
            color={IconStyle.drawerIconColor}
            size={IconStyle.drawerIconSize}
          />
        </View>
        <Text style={styles.drawerItemText}>Sign out</Text>
      </TouchableOpacity>
    </View>
  );
};

const styles = StyleSheet.create({
  drawerContainer: {
    flex: 1,
    backgroundColor: Color.white,
    paddingVertical: verticalScale(15),
    paddingHorizontal: scale(16),
  },
  logoContainer: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  drawerHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingTop: verticalScale(20),
    paddingBottom: verticalScale(10),
  },
  avatar: {
    width: scale(37),
    height: scale(37),
    borderRadius: scale(20),
  },
  userName: {
    fontSize: scale(16),
    fontWeight: '500',
    color: Color.textColor,
    fontFamily: Font.Poppins,
    marginLeft: scale(8),
  },
  settingsButton: {
    padding: scale(5),
  },
  drawerItem: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingVertical: verticalScale(10),
    paddingHorizontal: scale(10),
  },
  drawerItemText: {
    marginLeft: 15,
    fontSize: scale(16),
    color: Color.textColor,
    fontWeight: '500',
    fontFamily: Font.Poppins,
  },
  sectionHeader: {
    paddingTop: verticalScale(14),
    paddingBottom: verticalScale(5),
  },
  sectionTitle: {
    fontSize: scale(20),
    fontWeight: '500',
    color: Color.textColor,
    fontFamily: Font.Poppins,
  },
});

export default ClientDrawerContent;
