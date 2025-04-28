import {
  SafeAreaView,
  ScrollView,
  StyleSheet,
  Text,
  TextInput,
  TouchableOpacity,
  View,
  Keyboard,
  Dimensions,
} from 'react-native';
import React, { useState, useEffect } from 'react';
import { Color } from '../../../assets/styles/Colors';
import { scale, verticalScale } from 'react-native-size-matters';
import { LeftIcon } from '../../../assets/styles/Icon';
import { useNavigation } from '@react-navigation/native';
import LoginHeader from '../../../assets/Images/SelectCountry.svg';
import DateTimePicker from '@react-native-community/datetimepicker';
import GuestFlowHeader from '../../../Components/GuestFlowHeader';
import MaterialCommunityIcons from 'react-native-vector-icons/MaterialCommunityIcons';
import FontAwesome6 from 'react-native-vector-icons/FontAwesome6';
import { Font } from '../../../assets/styles/Fonts';
import { Progress } from '../../../assets/styles/Progress';
import useKeyboardHandler from '../../../Components/useKeyboardHandler';
import useAndroidBack from '../../../Navigation/useAndroidBack';
import CustomShadow from '../../../Components/CustomShadow';
import CustomeDropDown from '../../../Components/CustomeDropDown';
import CustomAlertBox from '../../../Components/CustomAlertBox';

const SelectCountry = ({ route }) => {
  const { height, width } = Dimensions.get('screen');
  const navigation = useNavigation();
  const [date, setDate] = useState(new Date());
  const [country, setCountry] = useState('');
  const [number, setNumber] = useState('');
  const [dateOfBirth, setDateOfBirth] = useState('');
  const [hasNumberError, setHasNumberError] = useState(false);
  const [alertVisible, setAlertVisible] = useState(false);
  const [alertType, setAlertType] = useState('error');
  const [alertMsg, setAlertMsg] = useState('');
  const [showDatePicker, setShowDatePicker] = useState(false);

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

  const validateNumberInput = input => /^[0-9]*$/.test(input);

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
        message = 'Please select your country and enter your number to continue';
      } else if (!country && !dateOfBirth) {
        message = 'Please select your country and date of birth to continue';
      } else if (!number && !dateOfBirth) {
        message = 'Please enter your number and select your date of birth to continue';
      } else if (!country) {
        message = 'Please select your country to continue';
      } else if (!number) {
        message = 'Please enter your number to continue';
      } else {
        message = 'Please select your date of birth to continue';
      }

      setAlertMsg(message);
      setAlertType('warning');
      setAlertVisible(true);
      return;
    }

    if (!validateNumberInput(number)) {
      setHasNumberError(true);
      setAlertMsg('Please enter numbers only');
      setAlertType('warning');
      setAlertVisible(true);
      return;
    }

    if (number.length !== 10) {
      setAlertMsg('Please enter a valid 10-digit mobile number to continue');
      setAlertType('warning');
      setAlertVisible(true);
      return;
    }

    navigation.navigate('GuestLogin', countryData);
  };

  return (
    <SafeAreaView style={styles.container}>
      <CustomAlertBox
        visible={alertVisible}
        type={alertType}
        message={alertMsg}
        closeAlert={() => setAlertVisible(false)}
        onClose={() => setAlertVisible(false)}
      />
      <GuestFlowHeader progress={Progress.selectCountry} />
      <LeftIcon onGoBack={() => navigation.goBack()} />

      <ScrollView
        showsVerticalScrollIndicator={false}
        contentContainerStyle={{ paddingBottom: height > 800 ? '47.5%' : '37%', }}
        keyboardShouldPersistTaps="handled">
        <LoginHeader
          style={{ alignSelf: 'center', marginTop: verticalScale(50) }}
        />

        <View
          style={{ marginHorizontal: scale(16) }}>
          <CustomeDropDown
            items={countries}
            inputStyle={{ width: '100%', marginVertical: scale(6) }}
            selectedItem={country || 'Select country'}
            onSelect={(item) => setCountry(item)}
            textStyle={!country ? { color: Color.textColor } : {}}
          />
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

          <CustomShadow>
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
          )}
        </View>



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
    paddingVertical: scale(5)
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


