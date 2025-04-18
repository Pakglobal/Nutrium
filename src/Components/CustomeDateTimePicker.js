import React, { useState } from 'react';
import { View, Text, TouchableOpacity, StyleSheet } from 'react-native';
import DatePicker from 'react-native-date-picker';
import Modal from 'react-native-modal';

const CustomDatePicker = ({ label, value, onChange, placeholder = 'Select Date' }) => {
  const [isDatePickerVisible, setDatePickerVisible] = useState(false);

  const formatDate = (date) => {
    if (!date) return placeholder;
    return date.toLocaleDateString('en-US', {
      year: 'numeric',
      month: 'long',
      day: 'numeric',
    });
  };

  const handleConfirm = (date) => {
    setDatePickerVisible(false);
    onChange(date);
  };

  return (
    <View style={styles.container}>
      {label && <Text style={styles.label}>{label}</Text>}
      <TouchableOpacity
        style={styles.inputContainer}
        onPress={() => setDatePickerVisible(true)}
      >
        <Text style={[styles.inputText, !value && styles.placeholderText]}>
          {formatDate(value)}
        </Text>
      </TouchableOpacity>

      <Modal
        isVisible={isDatePickerVisible}
        onBackdropPress={() => setDatePickerVisible(false)}
        style={styles.modal}
      >
        <View style={styles.modalContent}>
          <DatePicker
            date={value || new Date()}
            onDateChange={handleConfirm}
            mode="date"
            androidVariant="nativeAndroid"
            textColor="#1E272E"
            fadeToColor="#FFFFFF"
            style={styles.datePicker}
          />
          <TouchableOpacity
            style={styles.closeButton}
            onPress={() => setDatePickerVisible(false)}
          >
            <Text style={styles.closeButtonText}>Close</Text>
          </TouchableOpacity>
        </View>
      </Modal>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    marginVertical: 8,
  },
  label: {
    fontSize: 16,
    fontFamily: 'Roboto-Medium', // Custom font
    color: '#2C3E50', // Dark blue-gray
    marginBottom: 8,
  },
  inputContainer: {
    backgroundColor: '#F5F6FA', // Light gray background
    borderRadius: 12,
    padding: 16,
    borderWidth: 1,
    borderColor: '#E0E4EA', // Light border
  },
  inputText: {
    fontSize: 16,
    fontFamily: 'Roboto-Regular', // Custom font
    color: '#2C3E50', // Dark text
  },
  placeholderText: {
    color: '#7F8C8D', // Gray placeholder
  },
  modal: {
    justifyContent: 'flex-end',
    margin: 0,
  },
  modalContent: {
    backgroundColor: '#FFFFFF',
    borderTopLeftRadius: 20,
    borderTopRightRadius: 20,
    padding: 20,
    alignItems: 'center',
  },
  datePicker: {
    width: '100%',
  },
  closeButton: {
    marginTop: 16,
    backgroundColor: '#3498DB', // Blue button
    borderRadius: 8,
    paddingVertical: 12,
    paddingHorizontal: 24,
  },
  closeButtonText: {
    fontSize: 16,
    fontFamily: 'Roboto-Medium',
    color: '#FFFFFF',
    textAlign: 'center',
  },
});

export default CustomDatePicker;