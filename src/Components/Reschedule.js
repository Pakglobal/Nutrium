import React, { useState } from 'react';
import {
  View,
  Text,
  TouchableOpacity,
  TextInput,
  StyleSheet,
  DatePickerAndroid,
  TimePickerAndroid,
} from 'react-native';
import { useNavigation } from '@react-navigation/native';
import Feather from 'react-native-vector-icons/Feather';
import Color from '../assets/colors/Colors';

const Reschedule = () => {
  const navigation = useNavigation();
  const [newDate, setNewDate] = useState('');
  const [newTime, setNewTime] = useState('');

  const openDatePicker = async () => {
    try {
      const { action, year, month, day } = await DatePickerAndroid.open({
        date: new Date(),
      });
      if (action !== DatePickerAndroid.dismissedAction) {
        setNewDate(`${day}/${month + 1}/${year}`);
      }
    } catch (error) {
      console.warn('Cannot open date picker', error);
    }
  };

  const openTimePicker = async () => {
    try {
      const { action, hour, minute } = await TimePickerAndroid.open({
        is24Hour: false,
      });
      if (action !== TimePickerAndroid.dismissedAction) {
        setNewTime(`${hour}:${minute < 10 ? '0' : ''}${minute}`);
      }
    } catch (error) {
      console.warn('Cannot open time picker', error);
    }
  };

  const handleReschedule = () => {
    if (newDate && newTime) {
      console.log(`Appointment rescheduled to ${newDate} at ${newTime}`);
      navigation.goBack();
    }
  };

  return (
    <View style={styles.container}>
      <TouchableOpacity onPress={() => navigation.goBack()} style={styles.backButton}>
        <Feather name="arrow-left" size={24} color={Color.txt} />
      </TouchableOpacity>
      <Text style={styles.title}>Reschedule Appointment</Text>
      <TouchableOpacity style={styles.input} onPress={openDatePicker}>
        <Text>{newDate || 'Select New Date'}</Text>
      </TouchableOpacity>
      <TouchableOpacity style={styles.input} onPress={openTimePicker}>
        <Text>{newTime || 'Select New Time'}</Text>
      </TouchableOpacity>
      <TouchableOpacity style={styles.confirmButton} onPress={handleReschedule}>
        <Text style={styles.confirmText}>Confirm Reschedule</Text>
      </TouchableOpacity>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    padding: 20,
    backgroundColor: '#F8F9FA',
  },
  backButton: {
    marginBottom: 20,
  },
  title: {
    fontSize: 20,
    fontWeight: 'bold',
    marginBottom: 20,
    color: Color.txt,
  },
  input: {
    backgroundColor: '#FFF',
    padding: 15,
    borderRadius: 10,
    marginBottom: 15,
    elevation: 2,
  },
  confirmButton: {
    backgroundColor: Color.primary,
    padding: 15,
    borderRadius: 10,
    alignItems: 'center',
  },
  confirmText: {
    color: '#FFF',
    fontSize: 16,
    fontWeight: 'bold',
  },
});

export default Reschedule;