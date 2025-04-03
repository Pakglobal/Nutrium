import React, {useEffect, useState, useCallback} from 'react';
import {
  View,
  Text,
  StyleSheet,
  TouchableOpacity,
  SafeAreaView,
  Switch,
  ActivityIndicator,
} from 'react-native';
import {scale, verticalScale} from 'react-native-size-matters';
import Color from '../../../assets/colors/Colors';
import Ionicons from 'react-native-vector-icons/Ionicons';
import {
  useNavigation,
  useFocusEffect,
  DrawerActions,
} from '@react-navigation/native';
import AsyncStorage from '@react-native-async-storage/async-storage';

const SettingScreen = () => {
  const navigation = useNavigation();
  const [isEnabled, setIsEnabled] = useState(null);

  useFocusEffect(
    useCallback(() => {
      navigation.dispatch(DrawerActions.closeDrawer());
    }, [navigation]),
  );

  useEffect(() => {
    const loadSwitchState = async () => {
      try {
        const storedValue = await AsyncStorage.getItem('notifications');
        if (storedValue !== null) {
          setIsEnabled(JSON.parse(storedValue));
        } else {
          setIsEnabled(false);
        }
      } catch (error) {
        console.error('Error loading notifications:', error);
        setIsEnabled(false);
      }
    };
    loadSwitchState();
  }, []);

  const toggleSwitch = async () => {
    if (isEnabled !== null) {
      const newValue = !isEnabled;
      setIsEnabled(newValue);
      await AsyncStorage.setItem('notifications', JSON.stringify(newValue));
    }
  };

  return (
    <SafeAreaView style={styles.container}>
      <View style={styles.header}>
        <View style={styles.leftSection}>
          <TouchableOpacity onPress={() => navigation.goBack()}>
            <Ionicons
              name="arrow-back"
              color={Color.white}
              size={scale(22)}
            />
          </TouchableOpacity>
          <Text style={styles.headerText}>Settings</Text>
        </View>
      </View>

      <View style={{marginHorizontal: scale(16)}}>
        <Text
          style={{
            color: Color.primaryGreen,
            marginVertical: scale(8),
            fontWeight: 'bold',
          }}>
          Notifications
        </Text>
        <View
          style={{
            flexDirection: 'row',
            justifyContent: 'space-between',
            marginTop: verticalScale(10),
            alignItems: 'center',
          }}>
          <View>
            <Text
              style={{
                fontSize: scale(16),
                fontWeight: '500',
                color: Color.black,
              }}>
              Notifications
            </Text>
            {isEnabled ? (
              <Text style={{color: Color.gray}}>
                You want to receive notifications
              </Text>
            ) : (
              <Text style={{color: Color.gray}}>
                Don't want to receive notifications
              </Text>
            )}
          </View>

          {isEnabled === null ? (
            <View
              style={{
                flex: 1,
                justifyContent: 'center',
                alignItems: 'center',
              }}>
              <ActivityIndicator size="small" color={Color.primaryGreen} />
            </View>
          ) : (
            <Switch
              trackColor={{
                false: '#e0e0e0',
                true: '#A0D8C5',
              }}
              thumbColor={isEnabled ? Color.primaryGreen : '#ffffff'}
              onValueChange={toggleSwitch}
              value={isEnabled}
            />
          )}
        </View>
      </View>
      <View
        style={{
          borderBottomWidth: 1,
          borderBottomColor: Color.gray,
          marginTop: verticalScale(15),
          opacity: 0.5,
        }}></View>
    </SafeAreaView>
  );
};

export default SettingScreen;

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: Color.white,
  },
  header: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingHorizontal: scale(8),
    height: scale(50),
    backgroundColor: Color.primaryGreen,
  },
  leftSection: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  headerText: {
    marginLeft: scale(10),
    fontSize: scale(16),
    fontWeight: 'bold',
    color: Color.white,
  },
  inputContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    position: 'absolute',
    bottom: scale(0),
    left: scale(0),
    right: scale(0),
    backgroundColor: '#f5f5f5',
    borderRadius: scale(10),
    paddingHorizontal: scale(15),
    height: scale(45),
  },
  input: {
    flex: 1,
    marginLeft: scale(10),
    fontSize: scale(14),
    color: '#000',
  },
});
