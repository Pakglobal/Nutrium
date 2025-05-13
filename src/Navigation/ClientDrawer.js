import React, {useState} from 'react';
import {
  Image,
  Text,
  View,
  StyleSheet,
  TouchableOpacity,
  Alert,
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
import {
  guestLoginData,
  loginData,
  setGuestToken,
  setToken,
} from '../redux/user';
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
import {Font} from '../assets/styles/Fonts';
import CustomLoader from '../Components/CustomLoader';

const ClientDrawerContent = props => {
  const {navigation} = props;
  const dispatch = useDispatch();

  const [asyncLoading, setAsyncLoading] = useState(false);
  const [activeScreen, setActiveScreen] = useState('');

  const userInfo = useSelector(state => state.user?.userInfo);
  const guestInfo = useSelector(state => state.user?.guestUserData);

  const token = userInfo?.token || guestInfo?.token;
  const id =
    userInfo?.user?._id || userInfo?.userData?._id || guestInfo?.userData?._id;
  const user = userInfo?.user || userInfo?.userData || guestInfo?.userData;
  const userName =
    userInfo?.user?.fullName ||
    userInfo?.userData?.fullName ||
    guestInfo?.userData?.fullName;
  const userImage =
    userInfo?.user?.image ||
    userInfo?.userData?.image ||
    guestInfo?.userData?.image;

  const profileInfo = useSelector(state => state?.user?.profileInfo);
  const profileName = profileInfo?.fullName;
  const profileImage = profileInfo?.image
    ? {uri: profileInfo?.image}
    : profileInfo?.gender === 'Female'
    ? require('../assets/Images/woman.png')
    : require('../assets/Images/man.png');

  const updateProfileImage = useSelector(state => state?.client?.imageInfo);

  let userImgSource;
  if (updateProfileImage && typeof updateProfileImage === 'string') {
    userImgSource = {uri: updateProfileImage};
  } else if (userImage && typeof userImage === 'string') {
    userImgSource = {uri: userImage};
  } else {
    userImgSource =
      user?.gender === 'Female'
        ? require('../assets/Images/woman.png')
        : require('../assets/Images/man.png');
  }

  const handleNavigation = (screenName, params = {}) => {
    setActiveScreen(screenName);

    setTimeout(() => {
      navigation.navigate(screenName, params);
      setTimeout(() => {
        props.navigation.closeDrawer();
        setActiveScreen('');
      }, 300);
    }, 100);
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
          try {
            if (guestInfo) {
              dispatch(setGuestToken());
              dispatch(guestLoginData());
            } else {
              dispatch(loginData());
              dispatch(setImage(''));
              dispatch(setToken());
            }

            props.navigation.closeDrawer();
          } catch (error) {
            console.error('Sign out error:', error);
            Alert.alert('Error', 'Something went wrong. Please try again.', [
              {text: 'OK'},
            ]);
          }
        },
      },
    ]);
  };

  const handleSyncInfo = async () => {
    if (!token || !id) {
      Alert.alert('Error', 'Missing user information. Please log in again.');
      return;
    }

    setAsyncLoading(true);
    try {
      await GetMeasurementData(token, id);
      await GetPhysicalActivityDetails(token, id);
      await GetPhysicalActivities();
      await GetQuickAccess(token, id);
      await GetRecommendationApiData(token, id);
      await GetFoodAvoidApiData(token, id);
      await GetGoalsApiData(token, id);
    } catch (error) {
      console.error('Sync Error:', error);
      Alert.alert('Sync Error', 'Failed to sync data. Please try again later.');
    } finally {
      setAsyncLoading(false);
    }
  };

  const getMenuItemStyle = screenName => {
    return activeScreen === screenName
      ? [styles.drawerItem, styles.activeDrawerItem]
      : styles.drawerItem;
  };

  const getTextStyle = screenName => {
    return activeScreen === screenName
      ? [styles.drawerItemText, styles.activeDrawerItemText]
      : styles.drawerItemText;
  };

  const getIconColor = screenName => {
    return activeScreen === screenName ? Color.primaryColor : Color.textColor;
  };

  const IconSizeStyle = scale(22);

  const IconBg = {
    height: scale(25),
    width: scale(25),
    alignItems: 'center',
    justifyContent: 'center',
  };

  const IconPadding = {
    paddingVertical: verticalScale(5),
    paddingHorizontal: scale(7),
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
          onPress={() => handleNavigation('mainProfile', {data: user})}>
          <Image source={userImgSource} style={styles.avatar} />
          <Text style={styles.drawerItemText}>{userName}</Text>
        </TouchableOpacity>

        <TouchableOpacity onPress={() => handleNavigation('settings')}>
          <Ionicons
            style={IconPadding}
            name="settings-sharp"
            size={26}
            color={Color.black}
          />
        </TouchableOpacity>
      </View>

      <View style={{marginTop: verticalScale(8)}}>
        <TouchableOpacity
          style={getMenuItemStyle('foodDiary')}
          onPress={() => handleNavigation('foodDiary')}>
          <View style={IconBg}>
            <Octicons
              name="note"
              size={IconSizeStyle}
              color={getIconColor('foodDiary')}
            />
          </View>
          <Text style={getTextStyle('foodDiary')}>Food diary</Text>
        </TouchableOpacity>

        <TouchableOpacity
          style={getMenuItemStyle('waterIntake')}
          onPress={() => handleNavigation('waterIntake')}>
          <View style={IconBg}>
            <Ionicons
              name="water-sharp"
              size={IconSizeStyle}
              color={getIconColor('waterIntake')}
            />
          </View>
          <Text style={getTextStyle('waterIntake')}>Water intake</Text>
        </TouchableOpacity>

        <TouchableOpacity
          style={getMenuItemStyle('physicalActivity')}
          onPress={() => handleNavigation('physicalActivity')}>
          <View style={IconBg}>
            <FontAwesome5
              name="running"
              size={IconSizeStyle}
              color={getIconColor('physicalActivity')}
            />
          </View>
          <Text style={getTextStyle('physicalActivity')}>
            Physical activity
          </Text>
        </TouchableOpacity>

        <TouchableOpacity
          style={getMenuItemStyle('measurements')}
          onPress={() => handleNavigation('measurements')}>
          <View style={IconBg}>
            <MaterialCommunityIcons
              name="calendar-text"
              size={IconSizeStyle}
              color={getIconColor('measurements')}
            />
          </View>
          <Text style={getTextStyle('measurements')}>Measurements</Text>
        </TouchableOpacity>

        <TouchableOpacity
          style={getMenuItemStyle('shoppingLists')}
          onPress={() => handleNavigation('shoppingLists')}>
          <View style={IconBg}>
            <MaterialIcons
              name="shopping-cart"
              size={IconSizeStyle}
              color={getIconColor('shoppingLists')}
            />
          </View>
          <Text style={getTextStyle('shoppingLists')}>Shopping lists</Text>
        </TouchableOpacity>
      </View>
      {userInfo ? (
        <View>
          <View style={styles.sectionHeader}>
            <Text style={styles.sectionTitle}>Practitioner</Text>
          </View>

          <TouchableOpacity
            style={getMenuItemStyle('practitioner')}
            onPress={() =>
              handleNavigation('practitioner', {data: profileInfo})
            }>
            <Image source={profileImage} style={styles.avatar} />
            <Text style={getTextStyle('practitioner')}>{profileName}</Text>
          </TouchableOpacity>

          <TouchableOpacity
            style={getMenuItemStyle('messages')}
            onPress={() => handleNavigation('messages', {data: user})}>
            <View style={IconBg}>
              <MaterialCommunityIcons
                name="email"
                size={IconSizeStyle}
                color={getIconColor('messages')}
              />
            </View>
            <Text style={getTextStyle('messages')}>Messages</Text>
          </TouchableOpacity>
        </View>
      ) : null}

      <View style={styles.sectionHeader}>
        <Text style={styles.sectionTitle}>Other</Text>
      </View>

      <TouchableOpacity style={styles.drawerItem} onPress={handleSyncInfo}>
        <View style={IconBg}>
          <Octicons name="sync" size={IconSizeStyle} color={Color.textColor} />
        </View>
        <Text style={styles.drawerItemText}>Sync all info</Text>
        {asyncLoading && (
          <View style={{position: 'absolute', right: 0}}>
            <CustomLoader size={'small'} />
          </View>
        )}
      </TouchableOpacity>

      <TouchableOpacity style={styles.drawerItem} onPress={handleSignOut}>
        <View style={IconBg}>
          <MaterialIcons
            name="logout"
            color={Color.textColor}
            size={IconSizeStyle}
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
  settingsButton: {
    padding: scale(5),
  },
  drawerItem: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingVertical: verticalScale(8),
    paddingHorizontal: scale(10),
  },
  activeDrawerItem: {
    backgroundColor: Color.primaryLight,
    borderRadius: scale(8),
  },
  drawerItemText: {
    marginLeft: scale(15),
    fontSize: scale(13),
    color: Color.textColor,
    fontFamily: Font.PoppinsMedium,
  },
  activeDrawerItemText: {
    color: Color.primaryColor,
  },
  sectionHeader: {
    paddingTop: verticalScale(14),
    paddingBottom: verticalScale(5),
  },
  sectionTitle: {
    fontSize: scale(18),
    color: Color.textColor,
    fontFamily: Font.PoppinsMedium,
  },
});

export default ClientDrawerContent;
