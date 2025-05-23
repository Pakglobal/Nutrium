import React, {useState} from 'react';
import {
  View,
  Text,
  TextInput,
  TouchableOpacity,
  StyleSheet,
} from 'react-native';
import {useNavigation} from '@react-navigation/native';
import AsyncStorage from '@react-native-async-storage/async-storage';
import {scale, verticalScale} from 'react-native-size-matters';
import {Color} from '../../../../assets/styles/Colors';
import {Font} from '../../../../assets/styles/Fonts';

const WaterIntakeReminder = () => {
  const navigation = useNavigation();
  const [interval, setInterval] = useState('2'); // Default to 2 hours
  const [startTime, setStartTime] = useState('08:00');
  const [endTime, setEndTime] = useState('22:00');

  const saveReminderSettings = async () => {
    try {
      const settings = {interval: parseInt(interval), startTime, endTime};
      await AsyncStorage.setItem(
        'waterReminderSettings',
        JSON.stringify(settings),
      );
      navigation.goBack();
    } catch (error) {
      console.error('Error saving reminder settings:', error);
    }
  };

  return (
    <View style={styles.container}>
      <Text style={styles.label}>Reminder Interval (hours)</Text>
      <TextInput
        style={styles.input}
        value={interval}
        onChangeText={setInterval}
        keyboardType="numeric"
        placeholder="e.g., 2"
      />
      <Text style={styles.label}>Start Time (24-hour format)</Text>
      <TextInput
        style={styles.input}
        value={startTime}
        onChangeText={setStartTime}
        placeholder="e.g., 08:00"
      />
      <Text style={styles.label}>End Time (24-hour format)</Text>
      <TextInput
        style={styles.input}
        value={endTime}
        onChangeText={setEndTime}
        placeholder="e.g., 22:00"
      />
      <TouchableOpacity
        style={styles.saveButton}
        onPress={saveReminderSettings}>
        <Text style={styles.saveButtonText}>Save Reminder</Text>
      </TouchableOpacity>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    padding: scale(16),
    backgroundColor: '#fff',
  },
  label: {
    fontSize: scale(16),
    fontFamily: Font.Poppins,
    color: Color.textColor,
    marginBottom: verticalScale(8),
  },
  input: {
    borderWidth: 1,
    borderColor: Color.lightgray,
    borderRadius: scale(8),
    padding: scale(10),
    marginBottom: verticalScale(16),
    fontSize: scale(14),
    fontFamily: Font.Poppins,
  },
  saveButton: {
    backgroundColor: Color.primaryColor,
    padding: scale(12),
    borderRadius: scale(8),
    alignItems: 'center',
  },
  saveButtonText: {
    color: '#fff',
    fontSize: scale(16),
    fontFamily: Font.Poppins,
  },
});

export default WaterIntakeReminder;
