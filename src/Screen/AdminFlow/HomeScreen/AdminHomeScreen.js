import {
  StyleSheet,
  Text,
  TouchableOpacity,
  View,
  Dimensions,
  Platform,
  SafeAreaView,
} from 'react-native';
import React, {useCallback, useState} from 'react';
import {scale, verticalScale} from 'react-native-size-matters';
import {Color} from '../../../assets/styles/Colors';
import NutriumLogo from '../../../assets/Icon/logo.svg';
import MessageScreen from '../Message/MessageScreen';
import ClientScreen from '../Clients/ClientScreen';
import AppointmentScreen from '../Appointments/AppointmentScreen';
import Ionicons from 'react-native-vector-icons/Ionicons';
import {useFocusEffect, useNavigation} from '@react-navigation/native';
import {TabView, SceneMap, TabBar} from 'react-native-tab-view';
import {Font} from '../../../assets/styles/Fonts';
import {GetAllClientData} from '../../../Apis/AdminScreenApi/ClientApi';
import {useSelector} from 'react-redux';
import {
  SafeAreaProvider,
  useSafeAreaInsets,
} from 'react-native-safe-area-context';

const initialLayout = {width: Dimensions.get('window').width};

const AdminHomeScreen = () => {
  const navigation = useNavigation();
  const insets = useSafeAreaInsets();
  const tokenId = useSelector(state => state?.user?.token);
  const token = tokenId?.token;
  const id = tokenId?.id;

  const [clientData, setClientData] = useState([]);
  const [loading, setLoading] = useState(false);
  const [refreshing, setRefreshing] = useState(false);
  const [error, setError] = useState(null);
  const [index, setIndex] = useState(0);
  const [routes] = useState([
    {key: 'messages', title: 'Messages'},
    {key: 'clients', title: 'Clients'},
    {key: 'appointments', title: 'Appointments'},
  ]);

  const onRefresh = useCallback(() => {
    setRefreshing(true);
    setTimeout(() => setRefreshing(false), 1000);
  }, []);

  const fetchClientData = useCallback(async () => {
    if (!token) {
      setError('No authentication token available');
      return;
    }

    try {
      setLoading(true);
      setError(null);
      const response = await GetAllClientData(token);
      setClientData(response || []);
      setLoading(false);
    } catch (error) {
      console.error('Error fetching clients:', error);
      setError('Failed to load client data. Please try again.');
      setLoading(false);
    }
  }, [token]);

  const handleClientNavigate = useCallback(
    async item => {
      if (!token || !item?._id) {
        setError('Invalid token or client data');
        return;
      }
      try {
        setError(null);
        const response = await GetClientData(token, item._id);
        if (!response) {
          throw new Error('No client data found');
        }
        navigation.navigate('ClientProfile', {response: response});
      } catch (error) {
        console.error('Error navigating to client profile:', error);
        setError('Failed to load client profile. Please try again.');
      }
    },
    [token, navigation],
  );

  useFocusEffect(
    useCallback(() => {
      fetchClientData();
    }, [fetchClientData]),
  );

  const renderScene = SceneMap({
    messages: () => (
      <MessageScreen
        clientData={clientData}
        loading={loading}
        refreshing={refreshing}
        onRefresh={onRefresh}
        error={error}
        setError={setError}
      />
    ),
    clients: () => (
      <ClientScreen
        clientData={clientData}
        loading={loading}
        refreshing={refreshing}
        onRefresh={onRefresh}
        error={error}
        setError={setError}
      />
    ),
    appointments: AppointmentScreen,
  });

  const handleDrawerNavigation = useCallback(() => {
    navigation.openDrawer();
  }, [navigation]);

  const renderTabBar = props => (
    <TabBar
      {...props}
      indicatorStyle={styles.indicator}
      style={styles.tabBar}
      renderLabel={({route, focused}) => (
        <Text
          style={[
            styles.tabText,
            {
              borderBottomWidth: focused ? 2 : 0,
              borderBottomColor: focused ? Color.white : 'transparent',
            },
          ]}>
          {route.title}
        </Text>
      )}
    />
  );

  return (
    <SafeAreaProvider>
      <SafeAreaView style={[styles.container, {paddingTop: insets.top}]}>
        <View style={styles.headerContainer}>
          <TouchableOpacity
            style={styles.menuButton}
            onPress={handleDrawerNavigation}
            accessibilityLabel="Open menu"
            accessibilityRole="button">
            <Ionicons name="menu" size={scale(24)} color={Color.white} />
          </TouchableOpacity>

          <View style={styles.logoContainer}>
            <NutriumLogo height={scale(38)} width={scale(38)} />
          </View>
        </View>

        {error && <Text style={styles.errorText}>{error}</Text>}

        <TabView
          navigationState={{index, routes}}
          renderScene={renderScene}
          onIndexChange={setIndex}
          initialLayout={initialLayout}
          renderTabBar={renderTabBar}
          lazy
          style={styles.bodyContainer}
        />
      </SafeAreaView>
    </SafeAreaProvider>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: Color.white,
  },
  headerContainer: {
    backgroundColor: Color.primaryColor,
    paddingHorizontal: scale(8),
    paddingVertical: verticalScale(10),
  },
  menuButton: {
    padding: scale(5),
    alignSelf: 'flex-start',
  },
  logoContainer: {
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: Color.white,
    alignSelf: 'center',
    borderRadius: scale(50),
    padding: scale(5),
    margin: scale(20),
  },
  bodyContainer: {
    flex: 1,
    backgroundColor: Color.white,
  },
  tabBar: {
    backgroundColor: Color.primaryColor,
    height: verticalScale(48),
  },
  indicator: {
    backgroundColor: Color.white,
  },
  tabText: {
    color: Color.white,
    fontSize: scale(13),
    textAlign: 'center',
    fontFamily: Font.PoppinsMedium,
  },
  errorText: {
    textAlign: 'center',
    marginVertical: verticalScale(10),
    fontSize: scale(14),
    color: Color.red,
  },
});

export default AdminHomeScreen;
