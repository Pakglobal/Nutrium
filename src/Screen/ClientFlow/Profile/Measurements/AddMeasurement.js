import React, { useState } from 'react';
import {
  View,
  Text,
  StyleSheet,
  TextInput,
  TouchableOpacity,
  Alert,
} from 'react-native';
import { useNavigation, useRoute } from '@react-navigation/native';
import { scale, verticalScale } from 'react-native-size-matters';
import { Color } from '../../../../assets/styles/Colors';
import BackHeader from '../../../../Components/BackHeader';
import { useSelector } from 'react-redux';
import DatePicker from 'react-native-date-picker';
import { SetMeasurementData } from '../../../../Apis/ClientApis/MeasurementApi';

const AddMeasurement = () => {
  const navigation = useNavigation();
  const route = useRoute();
  const unit = route?.params?.routeData?.unit;

  const measurementType = route?.params?.routeData?.measurementType;
  const measurementId = route?.params?.routeData?.measurementId;

  const [value, setValue] = useState('');
  const [date, setDate] = useState(new Date());
  const [showDatePicker, setShowDatePicker] = useState(false);
  const [loading, setLoading] = useState(false);
  const [errorMessage, setErrorMessage] = useState('');

  const tokenId = useSelector(state => state?.user?.token);
  const guestTokenId = useSelector(state => state?.user?.guestToken);
  const token = tokenId?.token || guestTokenId?.token;
  const id = tokenId?.id || guestTokenId?.id;

  const formattedDate = new Date(date).toISOString().split('T')[0];

  const validateInput = () => {
    if (!value || value <= 0) {
      setErrorMessage('Please enter a valid weight value');
      return false;
    }
    if (value > 5000) {
      setErrorMessage(`weight cannot exceed 5000${unit}`);
      return false;
    }
    setErrorMessage('');
    return true;
  };

  const handleSave = async () => {
    if (!validateInput()) return;

    try {
      setLoading(true);
      const payload = {
        token: token,
        id: id,
        date: formattedDate,
        value: value,
        unit: unit,
        measurementtype: measurementType,
      };

      const response = await SetMeasurementData(payload);
      if (
        response?.message === 'Measurement updated successfully' ||
        response?.success === true
      ) {
        navigation.goBack();
      } else {
        console.log(response?.message);
        setLoading(false);
      }
      setLoading(false);
    } catch (error) {
      console.log(error);
      setLoading(false);
    }
  };

  return (
    <View style={styles.container}>
      <BackHeader
        onPressBack={() => navigation.goBack()}
        titleName={`${measurementType} log`}
        onSave={true}
        onPress={() => handleSave()}
        backText={measurementType}
        loading={loading}
      />

      <View style={styles.content}>
        <Text style={styles.label}>Value ({unit})</Text>
        <View>
          <View style={styles.inputContainer}>
            <TextInput
              style={styles.input}
              placeholder={`${measurementType} value`}
              keyboardType="numeric"
              value={value}
              onChangeText={e => {
                setValue(e);
                setErrorMessage('');
              }}
              placeholderTextColor={Color.black}
            />
            <Text style={{ marginLeft: 5, color: Color.black }}>{unit}</Text>
          </View>
          {errorMessage ? (
            <Text style={styles.error}>{errorMessage}</Text>
          ) : null}
        </View>

        <Text style={styles.label}>Date</Text>
        <TouchableOpacity
          style={styles.picker}
          onPress={() => setShowDatePicker(true)}>
          <Text style={{ color: Color.black }}>{date.toLocaleDateString()}</Text>
        </TouchableOpacity>

        {showDatePicker && (
          <DatePicker
            modal
            open={showDatePicker}
            date={date}
            mode="date"
            maximumDate={new Date()}
            onConfirm={selectedDate => {
              setShowDatePicker(false);
              setDate(selectedDate);
            }}
            onCancel={() => {
              setShowDatePicker(false);
            }}
          />
        )}
      </View>
    </View>
  );
};

export default AddMeasurement;

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: Color.white,
  },
  content: {
    marginHorizontal: scale(16),
    marginTop: verticalScale(10),
  },
  label: {
    fontSize: scale(14),
    color: Color.gray,
    marginTop: verticalScale(15),
    marginBottom: verticalScale(5),
    fontWeight: '500',
  },
  inputContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    borderWidth: 1,
    borderColor: '#ccc',
    paddingHorizontal: scale(10),
    borderRadius: scale(20),
  },
  input: {
    flex: 1,
    paddingVertical: verticalScale(5),
    color: Color.black,
  },
  picker: {
    borderWidth: 1,
    borderColor: '#ccc',
    padding: scale(10),
    borderRadius: scale(20),
  },
  error: {
    color: 'red',
    fontSize: scale(12),
    marginTop: verticalScale(5),
    marginLeft: scale(5),
  },
});