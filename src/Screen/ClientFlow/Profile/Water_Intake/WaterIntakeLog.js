import React, {useEffect, useState} from 'react';
import {
  View,
  Text,
  TextInput,
  TouchableOpacity,
  ScrollView,
  StyleSheet,
  ActivityIndicator,
  SafeAreaView,
} from 'react-native';
import HydratedView from '../../../../Components/HydratedView';
import {scale, verticalScale} from 'react-native-size-matters';
import BackHeader from '../../../../Components/BackHeader';
import {useNavigation} from '@react-navigation/native';
import DatePicker from 'react-native-date-picker';
import {
  SetWaterIntakeDetails,
  UpdateWaterIntake,
} from '../../../../Apis/ClientApis/WaterIntakeApi';
import Color from '../../../../assets/colors/Colors';
import Toast from 'react-native-simple-toast';
import Bottle from '../../../../assets/Images/bottel.svg';

const WaterIntakeLog = ({route}) => {
  const navigation = useNavigation();
  const routeData = route?.params?.intake;
  const plusData = route?.params?.plusData;
  const plus = plusData?.press === 'plus';
  const clientId = plusData?.clientId;
  const token = plusData?.token || routeData?.token;

  const initialDate = () => {
    try {
      if (plus && plusData?.date) {
        return new Date(plusData.date);
      } else if (routeData?.date) {
        return new Date(routeData.date);
      }
      return new Date();
    } catch (error) {
      console.error('Error initializing date:', error);
      return new Date();
    }
  };

  const [date, setDate] = useState(initialDate());
  const [dateOpen, setDateOpen] = useState(false);
  const [timeOpen, setTimeOpen] = useState(false);
  const [errorMessage, setErrorMessage] = useState('');
  const [loading, setLoading] = useState(false);

  const amount = routeData?.amount
    ? parseInt(routeData?.amount?.replace(/\D/g, ''))
    : 0;
  const [num, setNum] = useState(amount || 0);

  const setAmount = valuee => {
    setNum(prevNum => Number(prevNum) + Number(valuee));
  };

  const parseTimeStringToDate = timeString => {
    try {
      if (!timeString) return new Date();

      const [hours, minutes, seconds = '0'] = timeString.split(':').map(Number);

      if (
        isNaN(hours) ||
        hours < 0 ||
        hours > 23 ||
        isNaN(minutes) ||
        minutes < 0 ||
        minutes > 59 ||
        isNaN(seconds) ||
        seconds < 0 ||
        seconds > 59
      ) {
        console.warn('Invalid time components:', hours, minutes, seconds);
        return new Date();
      }

      const newDate = new Date();
      newDate.setHours(hours, minutes, seconds);
      return newDate;
    } catch (error) {
      console.error('Error parsing time:', error, timeString);
      return new Date();
    }
  };

  const backendTime = plus
    ? new Date().toTimeString().split(' ')[0]
    : routeData?.time;
  const [time, setTime] = useState(parseTimeStringToDate(backendTime));

  const showToast = message => {
    Toast.show(message, Toast.LONG, Toast.BOTTOM);
  };

  const formattedTime = `${String(time.getHours()).padStart(2, '0')}:${String(
    time.getMinutes(),
  ).padStart(2, '0')}`;

  const validateInput = () => {
    if (!num || num <= 0) {
      setErrorMessage('Please enter a valid water intake amount');
      return false;
    }
    if (num > 5000) {
      setErrorMessage('Water intake cannot exceed 5000mL');
      return false;
    }
    setErrorMessage('');
    return true;
  };

  const handleUpdateWaterIntake = async () => {
    if (!validateInput()) return;
    setLoading(true);
    try {
      const payload = {
        waterIntakeId: routeData?.waterIntakeId,
        waterRecordId: routeData?.waterRecordId,
        waterIntakeAmountId: routeData?.waterIntakeAmountId,
        amount: num,
        time: formattedTime,
        token: token,
        date: date,
      };
      const response = await UpdateWaterIntake(payload);
      if (
        response?.message === 'Water intake record updated successfully.' ||
        response?.success === true
      ) {
        navigation.goBack();
      } else {
        showToast(response?.message || 'Error updating water intake');
      }
      setLoading(false)
    } catch (error) {
      console.error(error);
      showToast('An error occurred');
      setLoading(false);
    }
  };

  const handleAddWaterIntake = async () => {
    if (!validateInput()) return;
    setLoading(true);
    try {
      const payload = {
        clientId: clientId,
        amount: num,
        time: formattedTime,
        token: token,
        date: date,
      };
      const response = await SetWaterIntakeDetails(payload);
      if (
        response?.message === 'Water intake recorded successfully.' ||
        response?.success === true
      ) {
        navigation.goBack();
      } else {
        showToast(response?.message || 'Error adding water intake');
      }
      setLoading(false)
    } catch (error) {
      console.error(error);
      showToast('An error occurred');
      setLoading(false);
    }
  };

  const handleSave = () => {
    plus ? handleAddWaterIntake() : handleUpdateWaterIntake();
  };

  return (
    <SafeAreaView style={styles.container}>
      <BackHeader
        onPressBack={() => navigation.goBack()}
        titleName="Water intake log"
        onSave={true}
        onPress={() => handleSave()}
        loading={loading}
      />

      <ScrollView style={styles.scrollView}>
        <Text style={styles.label}>How much water did you drink?</Text>
        <View>
          <View style={styles.inputContainer}>
            <TextInput
              style={styles.input}
              placeholder=""
              keyboardType="numeric"
              value={num.toString()}
              onChangeText={e => {
                setNum(Number(e) || 0);
                setErrorMessage('');
              }}
              placeholderTextColor={Color.black}
            />
            <Text style={styles.unit}>mL</Text>
          </View>
          {errorMessage ? (
            <Text style={styles.errorText}>{errorMessage}</Text>
          ) : null}
        </View>

        <Text style={styles.quickLogTitle}>Quick log</Text>
        <View style={styles.hydrationButtons}>
          <HydratedView
            img={require('../../../../assets/Images/glass.png')}
            valueText="200mL"
            onPress={() => setAmount(200)}
          />
          <HydratedView
            img={require('../../../../assets/Images/glass.png')}
            valueText="300mL"
            onPress={() => setAmount(300)}
          />
          <HydratedView
            img={require('../../../../assets/Images/glass.png')}
            valueText="500mL"
            onPress={() => setAmount(500)}
          />
        </View>

        <Text style={styles.label}>Date</Text>
        <TouchableOpacity
          style={styles.pickerButton}
          onPress={() => setDateOpen(true)}>
          <Text style={{color: Color.black}}>{date.toLocaleDateString()}</Text>
        </TouchableOpacity>

        <DatePicker
          modal
          mode="date"
          open={dateOpen}
          date={date}
          onConfirm={date => {
            setDateOpen(false);
            setDate(date);
          }}
          onCancel={() => {
            setDateOpen(false);
          }}
        />

        <Text style={styles.label}>Hour</Text>
        <TouchableOpacity
          style={styles.pickerButton}
          onPress={() => setTimeOpen(true)}>
          <Text style={{color: Color.black}}>
            {time
              ?.toLocaleTimeString('en-US', {
                hour: 'numeric',
                minute: '2-digit',
                hour12: true,
              })
              ?.replace(/\s+/g, ' ')
              ?.trim()}
          </Text>
        </TouchableOpacity>

        <DatePicker
          modal
          mode="time"
          open={timeOpen}
          date={time}
          onConfirm={time => {
            setTimeOpen(false);
            setTime(time);
          }}
          onCancel={() => {
            setTimeOpen(false);
          }}
        />
      </ScrollView>
    </SafeAreaView>
  );
};

export default WaterIntakeLog;

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#F8FBFF',
  },
  scrollView: {
    paddingHorizontal: scale(16),
  },
  label: {
    fontSize: scale(14),
    color: 'gray',
    marginTop: verticalScale(20),
    marginBottom: verticalScale(5),
  },
  inputContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    borderWidth: 1,
    borderColor: '#ccc',
    paddingHorizontal: verticalScale(10),
    borderRadius: scale(20),
  },
  unit: {
    marginLeft: scale(5),
    color: '#555',
  },
  input: {
    flex: 1,
    paddingVertical: verticalScale(5),
    color: Color.black,
  },
  quickLogTitle: {
    fontSize: scale(15),
    fontWeight: 'bold',
    marginTop: verticalScale(15),
  },
  hydrationButtons: {
    marginVertical: scale(12),
    flexDirection: 'row',
    justifyContent: 'space-between',
  },
  pickerButton: {
    borderWidth: 1,
    borderColor: '#ccc',
    padding: scale(10),
    borderRadius: scale(20),
  },
  errorText: {
    color: 'red',
    fontSize: scale(12),
    marginTop: verticalScale(5),
    marginLeft: scale(5),
  },
});
