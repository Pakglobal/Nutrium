import {
  SafeAreaView,
  ScrollView,
  StyleSheet,
  Text,
  TextInput,
  TouchableOpacity,
  View,
  Alert,
  Keyboard,
  Platform,
  Button,
} from 'react-native';
import React, { useState, useEffect } from 'react';
import { Color } from '../../../assets/styles/Colors';
import { scale, verticalScale } from 'react-native-size-matters';
import { LeftIcon } from '../../../assets/styles/Icon';
import { useNavigation } from '@react-navigation/native';
import LoginHeader from '../../../assets/Images/SelectCountry.svg';
import DateTimePicker from '@react-native-community/datetimepicker';
import GuestFlowHeader from '../../../Components/GuestFlowHeader';
import MaterialIcons from 'react-native-vector-icons/MaterialIcons';
import MaterialCommunityIcons from 'react-native-vector-icons/MaterialCommunityIcons';
import FontAwesome6 from 'react-native-vector-icons/FontAwesome6';
import { Font } from '../../../assets/styles/Fonts';
import { Progress } from '../../../assets/styles/Progress';
import { shadowStyle, ShadowValues } from '../../../assets/styles/Shadow';
import useKeyboardHandler from '../../../Components/useKeyboardHandler';
import useAndroidBack from '../../../Navigation/useAndroidBack';
import CustomShadow from '../../../Components/CustomShadow';
import DateTimePickerModal from "react-native-modal-datetime-picker";
import CustomDatePicker from '../../../Components/CustomeDateTimePicker';
import CustomeDropDown from '../../../Components/CustomeDropDown';

const SelectCountry = ({ route }) => {
  const navigation = useNavigation();
  const [date, setDate] = useState(new Date());
  const [showDatePicker, setShowDatePicker] = useState(false);
  const [country, setCountry] = useState('');
  const [showCountryDropdown, setShowCountryDropdown] = useState(false);
  const [number, setNumber] = useState('');
  const [dateOfBirth, setDateOfBirth] = useState('');


  const [hasNumberError, setHasNumberError] = useState(false);

  const selectGender = route?.params;
  const countryData = { country, number, dateOfBirth, ...selectGender };

  useKeyboardHandler();
  useAndroidBack();

  const countryCodes = {
    India: '+91',
    Australia: '+61',
    China: '+86',
    Japan: '+81',
    'United States': '+1',
    Canada: '+1',
  };

  const countries = [
    'India',
    'Australia',
    'China',
    'Japan',
    'United States',
    'Canada',
  ];

  const validateNumberInput = (input) => {
    const numericRegex = /^[0-9]*$/;
    return numericRegex.test(input);
  };

  const handleNumberChange = (input) => {
    if (input === '' || validateNumberInput(input)) {
      setNumber(input);
      setHasNumberError(false);
    } else {
      setHasNumberError(true);
    }
  };

  const onDateChange = (event, selectedDate) => {
    const currentDate = selectedDate || date;
    setShowDatePicker(false);
    setDate(currentDate);

    const day = currentDate.getDate().toString().padStart(2, '0');
    const month = (currentDate.getMonth() + 1).toString().padStart(2, '0');
    const year = currentDate.getFullYear();

    const formattedDate = `${day}/${month}/${year}`;
    setDateOfBirth(formattedDate);
  };

  const handleNavigation = () => {
    Keyboard.dismiss();

    if (!country || !number || !dateOfBirth) {
      let message = '';
      if (!country && !number && !dateOfBirth) {
        message =
          'Please select your country, enter your number, and select your date of birth to continue';
      } else if (!country && !number) {
        message =
          'Please select your country and enter your number to continue';
      } else if (!country && !dateOfBirth) {
        message = 'Please select your country and date of birth to continue';
      } else if (!number && !dateOfBirth) {
        message =
          'Please enter your number and select your date of birth to continue';
      } else if (!country) {
        message = 'Please select your country to continue';
      } else if (!number) {
        message = 'Please enter your number to continue';
      } else {
        message = 'Please select your date of birth to continue';
      }

      Alert.alert('Selection Required', message, [
        { text: 'OK', style: 'cancel' },
      ]);
      return;
    }

    if (!validateNumberInput(number)) {
      setHasNumberError(true);
      Alert.alert(
        'Invalid Number',
        'Please enter numbers only',
        [{ text: 'OK', style: 'cancel' }],
      );
      return;
    }

    if (number.length !== 10) {
      Alert.alert(
        'Invalid Number',
        'Please enter a valid 10-digit mobile number to continue',
        [{ text: 'OK', style: 'cancel' }],
      );
      return;
    }

    navigation.navigate('GuestLogin', countryData);
  };
  const [isDatePickerVisible, setDatePickerVisibility] = useState(false);
  const [selectedDate, setSelectedDate] = useState(null);

  // const showDatePicker = () => {
  //   setDatePickerVisibility(true);
  // };

  const hideDatePicker = () => {
    setDatePickerVisibility(false);
  };

  const handleConfirm = (date) => {
    setSelectedDate(date.toLocaleString());
    hideDatePicker();
  };


  return (
    <SafeAreaView style={styles.container}>
      <GuestFlowHeader progress={Progress.selectCountry} />
      <LeftIcon onGoBack={() => navigation.goBack()} />

      <ScrollView
        showsVerticalScrollIndicator={false}
        contentContainerStyle={{ paddingBottom: '47.5%' }}
        keyboardShouldPersistTaps="handled">
        <LoginHeader
          style={{ alignSelf: 'center', marginTop: verticalScale(50) }}
        />

        <View
          style={{ marginHorizontal: scale(16), marginTop: verticalScale(20), }}>
          <CustomShadow style={shadowStyle}>
            <TouchableOpacity
              activeOpacity={1}
              style={styles.inputContainer}
              onPress={() => {
                Keyboard.dismiss();
                setShowCountryDropdown(!showCountryDropdown);
              }}>
              <Text
                style={[
                  styles.titleText,
                  !country && { color: Color.textColor },
                ]}>
                {country || 'Select country'}
              </Text>
              {showCountryDropdown ? (
                <MaterialIcons
                  name="keyboard-arrow-up"
                  size={20}
                  color={Color.primaryColor}
                />
              ) : (
                <MaterialIcons
                  name="keyboard-arrow-down"
                  size={20}
                  color={Color.primaryColor}
                />
              )}
            </TouchableOpacity>
          </CustomShadow>

          {showCountryDropdown && (
            <View style={styles.dropdown}>
              {countries.map(item => (
                <CustomeDropDown

                  keyitem={item}
                  dropdownStyle={[
                    styles.dropdownItem,
                    country === item && { backgroundColor: Color.primaryColor },
                  ]}
                  singleSelected={true}
                  onPress={() => {
                    setCountry(item);
                    setShowCountryDropdown(false);
                  }}
                  textStyle={[
                    styles.titleText,
                    {
                      color: country === item ? Color.white : Color.textColor,
                    },
                  ]}
                  item={item}
                />
              ))}
            </View>
          )}



          <CustomShadow color={hasNumberError ? 'rgba(255,0,0,0.3)' : Color.primaryColor}>
            <View style={styles.inputContainer}>
              {country && (
                <Text style={[styles.titleText, styles.countryCode]}>
                  {countryCodes[country]}
                </Text>
              )}
              <TextInput
                value={number}
                placeholder="Number"
                onChangeText={handleNumberChange}
                keyboardType="numeric"
                placeholderTextColor={Color.textColor}
                maxLength={10}
                style={[styles.titleText, { flex: 1 }]}
              />
            </View>
          </CustomShadow>

          {/* <CustomShadow>
            <TouchableOpacity
              activeOpacity={1}
              style={styles.inputContainer}
              onPress={() => {
                Keyboard.dismiss();
                setShowDatePicker(true);
              }}>
              <Text
                style={[
                  styles.titleText,
                  !dateOfBirth && { color: Color.textColor },
                ]}>
                {dateOfBirth || 'Date of Birth'}
              </Text>
              <MaterialCommunityIcons
                name="calendar"
                size={20}
                color={Color.primaryColor}
              />
            </TouchableOpacity>
          </CustomShadow>

          {showDatePicker && (
            <DateTimePicker
              value={date}
              mode="date"
              display="default"
              onChange={onDateChange}
              maximumDate={new Date()}
            />
          )} */}

          <CustomDatePicker
            label="Date of Birth"
            value={selectedDate}
            onChange={setSelectedDate}
            placeholder="Select your date of birth"
          />
        </View>

        {/* <Button title="Show Date Picker" onPress={showDatePicker} /> */}
        <Text>{selectedDate}</Text>
        <DateTimePickerModal
          isVisible={isDatePickerVisible}
          mode="datetime"
          onConfirm={handleConfirm}
          onCancel={hideDatePicker}
          pickerStyleIOS={{
            backgroundColor: "white",
          }}
          customHeaderIOS={() => <Text style={{ textAlign: "center", fontSize: 18 }}>Pick Date</Text>}
        />

        <View style={styles.buttonContainer}>
          <TouchableOpacity style={styles.button} onPress={handleNavigation}>
            <FontAwesome6 name="arrow-right" size={22} color={Color.white} />
          </TouchableOpacity>
        </View>
      </ScrollView>
    </SafeAreaView>
  );
};

export default SelectCountry;

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: Color.white,
  },
  titleText: {
    fontWeight: '500',
    letterSpacing: 1,
    fontFamily: Font.PoppinsMedium,
    color: Color.textColor,
  },
  inputContainer: {
    borderRadius: 8,
    paddingHorizontal: scale(10),
    borderColor: Color.primaryColor,
    height: verticalScale(38),
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    backgroundColor: Color.white,
    marginVertical: verticalScale(6)
  },
  dropdown: {
    borderRadius: scale(4),
    borderWidth: 1,
    borderColor: Color.borderColor,
    margin: scale(2),
    backgroundColor: Color.white,
    zIndex: 10,
    marginBottom: verticalScale(10),
  },
  dropdownItem: {
    paddingVertical: scale(8),
    paddingHorizontal: scale(12),
  },
  buttonContainer: {
    justifyContent: 'center',
    alignSelf: 'flex-end',
    margin: scale(12),
    padding: scale(4),
    position: 'absolute',
    bottom: scale(0),
    right: scale(0),
  },
  button: {
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: Color.primaryColor,
    borderRadius: scale(25),
    height: scale(32),
    width: scale(32),
  },
  numberContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    height: verticalScale(38),
  },
  countryCode: {
    marginRight: scale(5),
    color: Color.primaryColor,
    fontWeight: '600',
  },
});
