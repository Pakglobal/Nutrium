import {
  SafeAreaView,
  StyleSheet,
  Text,
  TouchableOpacity,
  View,
} from 'react-native';
import React, {useState} from 'react';
import {scale, verticalScale} from 'react-native-size-matters';
import Color from '../../../assets/colors/Colors';
import NutriumLogo from '../../../assets/Icon/logo.svg';
import MessageScreen from '../Message/MessageScreen';
import ClientScreen from '../Clients/ClientScreen';
import AppointmentScreen from '../Appointments/AppointmentScreen';
import Ionicons from 'react-native-vector-icons/Ionicons';
import {useNavigation} from '@react-navigation/native';
import {useDispatch, useSelector} from 'react-redux';

const AdminHomeScreen = ({selectedScreen, onSelectScreen}) => {
  const dispatch = useDispatch();
  const navigation = useNavigation();

  const [selectedTab, setSelectedTab] = useState(0);

  const getToken = useSelector(state => state?.user?.userInfo);
  const token = getToken?.token;

  const options = [
    {id: 0, label: 'MESSAGES'},
    {id: 1, label: 'CLIENTS'},
    {id: 2, label: 'APPOINTMENTS'},
  ];

  const handleSelectedOption = label => {
    if (!token) {
      console.error('Token is missing');
      return;
    }

    onSelectScreen(label);
    navigation.navigate(label, {label});
  };

  const handleDrawerNavigation = () => {
    navigation.openDrawer();
  };

  return (
    <SafeAreaView style={styles.container}>
      <View style={styles.headerContainer}>
        <View style={styles.header}>
          <TouchableOpacity
            style={{marginTop: scale(10)}}
            onPress={handleDrawerNavigation}>
            <Ionicons name="menu" size={scale(24)} color={Color.primary} />
          </TouchableOpacity>
          <View style={styles.logoContainer}>
            <NutriumLogo height={scale(60)} width={scale(60)} />
          </View>
          <View style={styles.optionContainer}>
            {options.map(item => (
              <TouchableOpacity
                key={item.id}
                onPress={() => handleSelectedOption(item.label)}>
                <Text
                  style={[
                    styles.text,
                    {
                      borderBottomColor:
                        item.label === selectedScreen
                          ? Color.primary
                          : Color.black,
                      borderBottomWidth: item.label === selectedScreen ? 2 : 0,
                    },
                  ]}>
                  {item.label}
                </Text>
              </TouchableOpacity>
            ))}
          </View>
        </View>
      </View>

      <View style={styles.bodyContainer}>
        <View style={{marginTop: scale(10), marginHorizontal: scale(8)}}>
          {selectedScreen === 'MESSAGES' && (
            <MessageScreen
              selected={selectedTab}
              setSelected={setSelectedTab}
            />
          )}
          {selectedScreen === 'CLIENTS' && <ClientScreen />}
          {selectedScreen === 'APPOINTMENTS' && (
            <AppointmentScreen
              selected={selectedTab}
              setSelected={setSelectedTab}
            />
          )}
        </View>
      </View>
    </SafeAreaView>
  );
};

export default AdminHomeScreen;

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: Color.primary,
  },
  headerContainer: {
    backgroundColor: Color.primaryGreen,
    height: verticalScale(170),
  },
  header: {
    marginHorizontal: scale(8),
  },
  optionContainer: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginTop: verticalScale(20),
    alignItems: 'center',
  },
  logoContainer: {
    marginTop: verticalScale(25),
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: Color.primary,
    alignSelf: 'center',
    borderRadius: scale(50),
  },
  bodyContainer: {
    backgroundColor: '#f5f5f5',
    flex: 1,
  },
  text: {
    color: Color.primary,
    height: scale(25),
    letterSpacing: 1.5,
  },
});
