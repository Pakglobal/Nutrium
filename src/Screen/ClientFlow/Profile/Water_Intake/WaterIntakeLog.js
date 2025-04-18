import React, { useState } from 'react';
import {
  View,
  Text,
  TextInput,
  TouchableOpacity,
  ScrollView,
  StyleSheet,
  SafeAreaView,
  ActivityIndicator,
} from 'react-native';
import { scale, verticalScale } from 'react-native-size-matters';
import { useNavigation } from '@react-navigation/native';
import DatePicker from 'react-native-date-picker';
import {
  GetWaterIntakeDetails,
  SetWaterIntakeDetails,
  UpdateWaterIntake,
} from '../../../../Apis/ClientApis/WaterIntakeApi';
import { Color } from '../../../../assets/styles/Colors';
import Toast from 'react-native-simple-toast';
import Glass from '../../../../assets/Images/glass.svg';
import MaterialCommunityIcons from 'react-native-vector-icons/MaterialCommunityIcons';
import Feather from 'react-native-vector-icons/Feather';
import Header from '../../../../Components/Header';
import { Shadow } from 'react-native-shadow-2';
import { Font } from '../../../../assets/styles/Fonts';
import { ShadowValues } from '../../../../assets/styles/Shadow';
import CustomShadow from '../../../../Components/CustomShadow';

const WaterIntakeLog = ({ route }) => {
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
    try {
      setLoading(true);
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
        showToast(response?.message);
        setLoading(false);
      }
      setLoading(false);
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
        showToast(response?.message);
        setLoading(false);
      }
      setLoading(false);
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
      <Header
        screenheader={true}
        screenName={'Water Intake Log'}
        handleSave={() => handleSave()}
      />

      <ScrollView style={styles.scrollView}>
        <Text style={styles.label}>How much Water Did You Drink ?</Text>
        <View style={{ marginVertical: verticalScale(10) }}>
          <CustomShadow color={Color.lightgray}>
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
          </CustomShadow>
          {errorMessage ? (
            <Text style={styles.errorText}>{errorMessage}</Text>
          ) : null}
        </View>

        <View style={styles.hydrationButtons}>
          <View style={{ width: '30%' }}>
            <CustomShadow color={Color.lightgray}>
              <TouchableOpacity onPress={() => setAmount(200)}>
                <View style={styles.waterCardView}>
                  <View style={{ marginTop: verticalScale(20) }}>
                    <Glass height={verticalScale(30)} width={scale(45)} />
                  </View>
                  <Text style={styles.waterTxt}>{'200mL'}</Text>
                </View>
                <View style={styles.plusIcon}>
                  <Feather
                    name="plus"
                    color={Color?.primaryColor}
                    size={verticalScale(15)}
                  />
                </View>
              </TouchableOpacity>
            </CustomShadow>
          </View>

          <View style={{ width: '30%' }}>
            <CustomShadow color={Color.lightgray}>
              <TouchableOpacity onPress={() => setAmount(300)}>
                <View style={styles.waterCardView}>
                  <View style={{ marginTop: verticalScale(20) }}>
                    <Glass height={verticalScale(30)} width={scale(45)} />
                  </View>
                  <Text style={styles.waterTxt}>{'300mL'}</Text>
                </View>
                <View style={styles.plusIcon}>
                  <Feather
                    name="plus"
                    color={Color?.primaryColor}
                    size={verticalScale(15)}
                  />
                </View>
              </TouchableOpacity>
            </CustomShadow>
          </View>

          <View style={{ width: '30%' }}>
            <CustomShadow color={Color.lightgray}>
              <TouchableOpacity onPress={() => setAmount(500)}>
                <View style={styles.waterCardView}>
                  <View style={{ marginTop: verticalScale(20) }}>
                    <Glass height={verticalScale(30)} width={scale(45)} />
                  </View>
                  <Text style={styles.waterTxt}>{'500mL'}</Text>
                </View>
                <View style={styles.plusIcon}>
                  <Feather
                    name="plus"
                    color={Color?.primaryColor}
                    size={verticalScale(15)}
                  />
                </View>
              </TouchableOpacity>
            </CustomShadow>
          </View>
        </View>

        <Text style={styles.label}>Date</Text>

        <CustomShadow color={Color.lightgray}>
          <TouchableOpacity activeOpacity={0.6} style={{}} onPress={() => setDateOpen(true)}>
            <View style={styles.pickerButton}>
              <Text
                style={{
                  color: Color.textColor,
                  fontWeight: '500',
                  fontSize: scale(13),
                }}>
                {date.toLocaleDateString()}
              </Text>
              <MaterialCommunityIcons
                name="calendar-month"
                color={Color?.primaryColor}
                size={20}
              />
            </View>
          </TouchableOpacity>
        </CustomShadow>

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

        <CustomShadow color={Color.lightgray}>
          <TouchableOpacity activeOpacity={0.6} style={{}} onPress={() => setTimeOpen(true)}>
            <View style={styles.pickerButton}>
              <Text
                style={{
                  color: Color.textColor,
                  fontWeight: '500',
                  fontSize: scale(13),
                }}>
                {time
                  ?.toLocaleTimeString('en-US', {
                    hour: 'numeric',
                    minute: '2-digit',
                    hour12: true,
                  })
                  ?.replace(/\s+/g, ' ')
                  ?.trim()}
              </Text>
              <MaterialCommunityIcons
                name="clock-time-four-outline"
                color={Color?.primaryColor}
                size={20}
              />
            </View>
          </TouchableOpacity>
        </CustomShadow>

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
    backgroundColor: Color?.white,
  },
  scrollView: {
    paddingHorizontal: scale(16),
  },
  label: {
    fontSize: scale(14),
    color: Color?.textColor,
    marginTop: verticalScale(20),
    fontWeight: '500',
    fontFamily: Font?.PoppinsMedium,
    marginHorizontal: scale(5)
  },
  inputContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: verticalScale(10),
    borderRadius: scale(10),
    width: '98%',
    alignSelf: 'center',
    backgroundColor: Color.white,
  },
  unit: {
    marginLeft: scale(5),
    color: '#555',
    fontFamily: Font.PoppinsMedium,
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
    marginTop: scale(20),
    flexDirection: 'row',
    justifyContent: 'space-between',
    paddingHorizontal: scale(5),
  },
  pickerButton: {
    padding: scale(10),
    borderRadius: scale(8),
    flexDirection: 'row',
    justifyContent: 'space-between',
    backgroundColor: Color?.white,
    margin: scale(5),
  },
  errorText: {
    color: 'red',
    fontSize: scale(12),
    marginTop: verticalScale(5),
    marginLeft: scale(5),
  },
  waterCardView: {
    borderRadius: scale(8),
    height: scale(70),
    backgroundColor: Color?.white,
  },
  waterTxt: {
    color: Color.textColor,
    fontWeight: '400',
    marginEnd: scale(5),
    fontSize: scale(10),
    alignSelf: 'flex-end',
    fontFamily: Font.Poppins,
  },
  plusIcon: {
    position: 'absolute',
    right: 0,
    top: 0,
    backgroundColor: Color.primaryLight,
    borderTopRightRadius: scale(8),
    padding: scale(3),
    borderBottomLeftRadius: scale(8),
  },
});
