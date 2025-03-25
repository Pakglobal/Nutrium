import {
  SafeAreaView,
  StyleSheet,
  Text,
  TouchableOpacity,
  View,
} from 'react-native';
import React, {useCallback, useState} from 'react';
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
  const navigation = useNavigation();
  const [selectedTab, setSelectedTab] = useState(0);

  const token = useSelector(state => state?.user?.userInfo?.token);

  const options = [
    {id: 0, label: 'MESSAGES'},
    {id: 1, label: 'CLIENTS'},
    {id: 2, label: 'APPOINTMENTS'},
  ];

  const handleSelectedOption = useCallback(
    label => {
      if (!token) {
        console.error('Token is missing');
        return;
      }

      setSelectedTab(0);
      onSelectScreen(label);

      requestAnimationFrame(() => {
        navigation.navigate(label, {label});
      });
    },
    [token, navigation, onSelectScreen],
  );

  const handleDrawerNavigation = useCallback(() => {
    navigation.openDrawer();
  }, [navigation]);

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
            <NutriumLogo height={scale(45)} width={scale(45)} />
          </View>

          <View style={styles.optionContainer}>
            {options.map(item => (
              <TouchableOpacity
                key={item?.id}
                onPress={() => handleSelectedOption(item?.label)}>
                <Text
                  style={[
                    styles.text,
                    {
                      borderBottomColor:
                        item?.label === selectedScreen
                          ? Color.primary
                          : 'transparent',
                      borderBottomWidth: item?.label === selectedScreen ? 2 : 0,
                    },
                  ]}>
                  {item?.label}
                </Text>
              </TouchableOpacity>
            ))}
          </View>
        </View>
      </View>

      <View style={styles.bodyContainer}>
        <View style={{marginTop: scale(10), marginHorizontal: scale(16)}}>
          {selectedScreen === 'MESSAGES' && <MessageScreen />}
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

export default React.memo(AdminHomeScreen);

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: Color.primary,
  },
  headerContainer: {
    backgroundColor: Color.primaryGreen,
  },
  header: {
    marginHorizontal: scale(16),
  },
  optionContainer: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginVertical: verticalScale(15),
  },
  logoContainer: {
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: Color.primary,
    alignSelf: 'center',
    borderRadius: scale(50),
    marginVertical: verticalScale(20),
  },
  bodyContainer: {
    backgroundColor: '#f5f5f5',
    flex: 1,
  },
  text: {
    color: Color.primary,
    height: scale(25),
    letterSpacing: 1,
    fontSize: scale(13),
  },
});
