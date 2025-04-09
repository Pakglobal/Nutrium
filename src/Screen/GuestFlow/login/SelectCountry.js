import {
  FlatList,
  Modal,
  SafeAreaView,
  ScrollView,
  StyleSheet,
  Text,
  TextInput,
  TouchableOpacity,
  View,
  Alert,
} from 'react-native';
import React, {useState} from 'react';
import FontAwesome6 from 'react-native-vector-icons/FontAwesome6';
import FontAwesome5 from 'react-native-vector-icons/FontAwesome5';
import Color, {Font, ShadowValues} from '../../../assets/colors/Colors';
import {scale, verticalScale} from 'react-native-size-matters';
import IconStyle, {
  IconPadding,
  LeftIcon,
  RightIcon,
} from '../../../assets/styles/Icon';
import {useNavigation} from '@react-navigation/native';
import LoginHeader from '../../../assets/Images/SelectCountry.svg';
import {Shadow} from 'react-native-shadow-2';
import DateTimePicker from '@react-native-community/datetimepicker';
import GuestFlowHeader from '../../../Components/GuestFlowHeader';
import MaterialIcons from 'react-native-vector-icons/MaterialIcons';
import MaterialCommunityIcons from 'react-native-vector-icons/MaterialCommunityIcons';

const SelectCountry = () => {
  const navigation = useNavigation();
  const [showCountryModal, setShowCountryModal] = useState(false);
  const [date, setDate] = useState(new Date());
  const [showDatePicker, setShowDatePicker] = useState(false);
  const [country, setCountry] = useState('');
  const [number, setNumber] = useState('');
  const [dateOfBirth, setDateOfBirth] = useState('');
  const [showCountryDropdown, setShowCountryDropdown] = useState(false);

  const countries = [
    'India',
    'Australia',
    'China',
    'Japan',
    'United States',
    'Canada',
  ];

  const onDateChange = (event, selectedDate) => {
    const currentDate = selectedDate || date;
    setShowDatePicker(false);
    setDate(currentDate);
    setDateOfBirth(currentDate.toLocaleDateString('en-US')); 
  };

  const handleNavigation = () => {
    if (!country || !number || !dateOfBirth) {
      let message = '';
      if (!country && !number && !dateOfBirth) {
        message = 'Please select your country, enter your number, and select your date of birth to continue';
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

      Alert.alert(
        'Selection Required',
        message,
        [{text: 'OK', style: 'cancel'}]
      );
      return;
    }
    navigation.navigate('GuestLogin');
  };

  return (
    <SafeAreaView style={{flex: 1, backgroundColor: Color.white}}>
      <GuestFlowHeader progress={'80%'} />

      <LeftIcon />
      <ScrollView showsVerticalScrollIndicator={false}>
        <LoginHeader style={{alignSelf: 'center'}} />

        <View
          style={{marginHorizontal: scale(16), marginTop: verticalScale(20)}}>
          <TouchableOpacity
            style={[
              styles.inputContainer,
              {
                flexDirection: 'row',
                alignItems: 'center',
                justifyContent: 'space-between',
              },
            ]}
            onPress={() => setShowCountryDropdown(!showCountryDropdown)}>
            <Text
              style={[styles.titleText, !country && {color: Color.textColor}]}>
              {country || 'select country'}
            </Text>
            {showCountryDropdown ? (
              <MaterialIcons name="keyboard-arrow-up" size={20} color={Color.primaryColor} />
            ) : (
              <MaterialIcons
                name="keyboard-arrow-down"
                size={20}
                color={Color.primaryColor}
              />
            )}
          </TouchableOpacity>

          {showCountryDropdown && (
            <View style={styles.dropdown}>
              {countries.map(item => (
                <TouchableOpacity
                  key={item}
                  style={[
                    styles.dropdownItem,
                    country === item && {backgroundColor: Color.primaryColor},
                  ]}
                  onPress={() => {
                    setCountry(item);
                    setShowCountryDropdown(false);
                  }}>
                  <Text style={{color: country === item ?  Color.white : Color.textColor}}>
                    {item}
                  </Text>
                </TouchableOpacity>
              ))}
            </View>
          )}

          <View style={styles.inputContainer}>
            <TextInput
              style={[styles.titleText, {}]}
              placeholder="Number"
              value={number}
              onChangeText={setNumber}
              keyboardType="numeric"
              placeholderTextColor={Color.textColor}
            />
          </View>

          <TouchableOpacity
            style={[
              styles.inputContainer,
              {
                flexDirection: 'row',
                alignItems: 'center',
                justifyContent: 'space-between',
              },
            ]}
            onPress={() => setShowDatePicker(true)}>
            <Text
              style={[styles.titleText, !dateOfBirth && {color: Color.textColor}]}>
              {dateOfBirth || 'Date of Birth'}
            </Text>
            <MaterialCommunityIcons name="calendar" size={20} color={Color.primaryColor} />
          </TouchableOpacity>

          {showDatePicker && (
            <DateTimePicker
              value={date}
              mode="date"
              display="default"
              onChange={onDateChange}
            />
          )}
        </View>
      </ScrollView>

      <RightIcon onPress={handleNavigation} />
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
    fontSize: scale(14),
    color: Color.textColor,
    letterSpacing: 1,
    fontFamily: Font.Poppins,
  },
  inputContainer: {
    borderRadius: 8,
    marginBottom: verticalScale(10),
    paddingHorizontal: scale(10),
    borderWidth: 1,
    borderColor: Color.primaryColor,
    height: verticalScale(38),
    justifyContent: 'center',
  },
  dropdown: {
    borderRadius: scale(4),
    borderWidth: 1,
    borderColor: Color.borderColor,
    marginBottom: verticalScale(10),
  },
  dropdownItem: {
    padding: scale(12),
  },
});