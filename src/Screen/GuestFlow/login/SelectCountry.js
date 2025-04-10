// import {
//   SafeAreaView,
//   ScrollView,
//   StyleSheet,
//   Text,
//   TextInput,
//   TouchableOpacity,
//   View,
//   Alert,
//   Keyboard,
//   Platform,
// } from 'react-native';
// import React, {useState, useEffect} from 'react';
// import {Color} from '../../../assets/styles/Colors';
// import {scale, verticalScale} from 'react-native-size-matters';
// import {
//   LeftIcon,
// } from '../../../assets/styles/Icon';
// import {useNavigation} from '@react-navigation/native';
// import LoginHeader from '../../../assets/Images/SelectCountry.svg';
// import DateTimePicker from '@react-native-community/datetimepicker';
// import GuestFlowHeader from '../../../Components/GuestFlowHeader';
// import MaterialIcons from 'react-native-vector-icons/MaterialIcons';
// import MaterialCommunityIcons from 'react-native-vector-icons/MaterialCommunityIcons';
// import FontAwesome6 from 'react-native-vector-icons/FontAwesome6';
// import { Font } from '../../../assets/styles/Fonts';

// const SelectCountry = () => {
//   const navigation = useNavigation();
//   const [date, setDate] = useState(new Date());
//   const [showDatePicker, setShowDatePicker] = useState(false);
//   const [country, setCountry] = useState('');
//   const [number, setNumber] = useState('');
//   const [dateOfBirth, setDateOfBirth] = useState('');
//   const [showCountryDropdown, setShowCountryDropdown] = useState(false);
//   const [keyboardVisible, setKeyboardVisible] = useState(false);

//   useEffect(() => {
//     const keyboardDidShowListener = Keyboard.addListener(
//       'keyboardDidShow',
//       () => {
//         setKeyboardVisible(true);
//       }
//     );
//     const keyboardDidHideListener = Keyboard.addListener(
//       'keyboardDidHide',
//       () => {
//         setKeyboardVisible(false);
//       }
//     );

//     return () => {
//       keyboardDidShowListener.remove();
//       keyboardDidHideListener.remove();
//     };
//   }, []);

//   const countries = [
//     'India',
//     'Australia',
//     'China',
//     'Japan',
//     'United States',
//     'Canada',
//   ];

//   const onDateChange = (event, selectedDate) => {
//     const currentDate = selectedDate || date;
//     setShowDatePicker(false);
//     setDate(currentDate);
//     setDateOfBirth(currentDate.toLocaleDateString('en-US'));
//   };

//   const handleNavigation = () => {
//     Keyboard.dismiss();
//     if (!country || !number || !dateOfBirth) {
//       let message = '';
//       if (!country && !number && !dateOfBirth) {
//         message =
//           'Please select your country, enter your number, and select your date of birth to continue';
//       } else if (!country && !number) {
//         message =
//           'Please select your country and enter your number to continue';
//       } else if (!country && !dateOfBirth) {
//         message = 'Please select your country and date of birth to continue';
//       } else if (!number && !dateOfBirth) {
//         message =
//           'Please enter your number and select your date of birth to continue';
//       } else if (!country) {
//         message = 'Please select your country to continue';
//       } else if (!number) {
//         message = 'Please enter your number to continue';
//       } else {
//         message = 'Please select your date of birth to continue';
//       }

//       Alert.alert('Selection Required', message, [
//         {text: 'OK', style: 'cancel'},
//       ]);
//       return;
//     }
//     navigation.navigate('GuestLogin');
//   };

//   useEffect(() => {
//     if (keyboardVisible) {
//       setShowCountryDropdown(false);
//     }
//   }, [keyboardVisible]);

//   return (
//     <SafeAreaView style={styles.container}>
//       <GuestFlowHeader progress={'80%'} />
//       <LeftIcon onGoBack={() => navigation.goBack()} />
      
//       <ScrollView 
//         showsVerticalScrollIndicator={false} 
//         style={{flex: 1, flexGrow: 1}}
//         keyboardShouldPersistTaps="handled">
//         <LoginHeader style={{alignSelf: 'center'}} />

//         <View style={{marginHorizontal: scale(16), marginTop: verticalScale(20)}}>
//           <TouchableOpacity
//             style={styles.inputContainer}
//             onPress={() => {
//               Keyboard.dismiss();
//               setShowCountryDropdown(!showCountryDropdown);
//             }}>
//             <Text
//               style={[styles.titleText, !country && {color: Color.textColor}]}>
//               {country || 'Select country'}
//             </Text>
//             {showCountryDropdown ? (
//               <MaterialIcons
//                 name="keyboard-arrow-up"
//                 size={20}
//                 color={Color.primaryColor}
//               />
//             ) : (
//               <MaterialIcons
//                 name="keyboard-arrow-down"
//                 size={20}
//                 color={Color.primaryColor}
//               />
//             )}
//           </TouchableOpacity>

//           {showCountryDropdown && (
//             <View style={styles.dropdown}>
//               {countries.map(item => (
//                 <TouchableOpacity
//                   key={item}
//                   style={[
//                     styles.dropdownItem,
//                     country === item && {backgroundColor: Color.primaryColor},
//                   ]}
//                   onPress={() => {
//                     setCountry(item);
//                     setShowCountryDropdown(false);
//                   }}>
//                   <Text
//                     style={[
//                       styles.titleText,
//                       {
//                         color: country === item ? Color.white : Color.textColor,
//                       },
//                     ]}>
//                     {item}
//                   </Text>
//                 </TouchableOpacity>
//               ))}
//             </View>
//           )}

//           <TextInput
//             value={number}
//             placeholder="Number"
//             onChangeText={setNumber}
//             keyboardType="numeric"
//             placeholderTextColor={Color.textColor}
//             maxLength={10}
//             style={[styles.inputContainer, styles.titleText]}
//           />

//           <TouchableOpacity
//             style={styles.inputContainer}
//             onPress={() => {
//               Keyboard.dismiss();
//               setShowDatePicker(true);
//             }}>
//             <Text
//               style={[
//                 styles.titleText,
//                 !dateOfBirth && {color: Color.textColor},
//               ]}>
//               {dateOfBirth || 'Date of Birth'}
//             </Text>
//             <MaterialCommunityIcons
//               name="calendar"
//               size={20}
//               color={Color.primaryColor}
//             />
//           </TouchableOpacity>

//           {showDatePicker && (
//             <DateTimePicker
//               value={date}
//               mode="date"
//               display="default"
//               onChange={onDateChange}
//             />
//           )}
//         </View>
        
//         <View style={styles.buttonContainer}>
//           <TouchableOpacity
//             style={styles.button}
//             onPress={handleNavigation}>
//            <FontAwesome6 name="arrow-right" size={22} color={Color.white} />
//           </TouchableOpacity>
//         </View>
//       </ScrollView>
//     </SafeAreaView>
//   );
// };

// export default SelectCountry;

// const styles = StyleSheet.create({
//   container: {
//     flex: 1,
//     backgroundColor: Color.white,
//   },
//   titleText: {
//     fontWeight: '500',
//     letterSpacing: 1,
//     fontFamily: Font.PoppinsMedium,
//     color: Color.textColor,
//   },
//   inputContainer: {
//     borderRadius: 8,
//     marginVertical: verticalScale(5),
//     paddingHorizontal: scale(10),
//     borderWidth: 1,
//     borderColor: Color.primaryColor,
//     height: verticalScale(38),
//     flexDirection: 'row',
//     alignItems: 'center',
//     justifyContent: 'space-between',
//   },
//   dropdown: {
//     borderRadius: scale(4),
//     borderWidth: 1,
//     borderColor: Color.borderColor,
//     margin: scale(2),
//     backgroundColor: Color.white,
//     zIndex: 10,
//   },
//   dropdownItem: {
//     padding: scale(12),
//   },
//   buttonContainer: {
//     justifyContent: 'center',
//     alignItems: 'flex-end',
//     margin: scale(12),
//     padding: scale(4),
//     position: 'absolute',
//     bottom: scale(0),
//     right: scale(0),
//     backgroundColor: 'red'
//   },
//   button: {
//     justifyContent: 'center',
//     alignItems: 'center',
//     backgroundColor: Color.primaryColor,
//     borderRadius: scale(25),
//     height: scale(32),
//     width: scale(32),
//   },
// });



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
  KeyboardAvoidingView,
  Platform,
} from 'react-native';
import React, {useState, useEffect} from 'react';
import {Color} from '../../../assets/styles/Colors';
import {scale, verticalScale} from 'react-native-size-matters';
import {
  LeftIcon,
} from '../../../assets/styles/Icon';
import { useNavigation } from '@react-navigation/native';
import LoginHeader from '../../../assets/Images/SelectCountry.svg';
import DateTimePicker from '@react-native-community/datetimepicker';
import GuestFlowHeader from '../../../Components/GuestFlowHeader';
import MaterialIcons from 'react-native-vector-icons/MaterialIcons';
import MaterialCommunityIcons from 'react-native-vector-icons/MaterialCommunityIcons';
import FontAwesome6 from 'react-native-vector-icons/FontAwesome6';
import { Font } from '../../../assets/styles/Fonts';

const SelectCountry = ({ route }) => {
  const navigation = useNavigation();
  const [date, setDate] = useState(new Date());
  const [showDatePicker, setShowDatePicker] = useState(false);
  const [country, setCountry] = useState('');
  const [number, setNumber] = useState('');
  const [dateOfBirth, setDateOfBirth] = useState('');
  const [showCountryDropdown, setShowCountryDropdown] = useState(false);
  const [keyboardVisible, setKeyboardVisible] = useState(false);

  useEffect(() => {
    const keyboardDidShowListener = Keyboard.addListener(
      'keyboardDidShow',
      () => {
        setKeyboardVisible(true);
      }
    );
    const keyboardDidHideListener = Keyboard.addListener(
      'keyboardDidHide',
      () => {
        setKeyboardVisible(false);
      }
    );

    return () => {
      keyboardDidShowListener.remove();
      keyboardDidHideListener.remove();
    };
  }, []);

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
        {text: 'OK', style: 'cancel'},
      ]);
      return;
    }
    navigation.navigate('GuestLogin',countryData);
  };

  useEffect(() => {
    if (keyboardVisible) {
      setShowCountryDropdown(false);
    }
  }, [keyboardVisible]);

  return (
    <SafeAreaView style={styles.container}>
      <GuestFlowHeader progress={'80%'} />
      <LeftIcon onGoBack={() => navigation.goBack()} />
      
      <KeyboardAvoidingView
        style={{ flex: 1 }}
        behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
        keyboardVerticalOffset={Platform.OS === 'ios' ? 0 : 20}>
        <ScrollView
          showsVerticalScrollIndicator={false}
          style={{ flex: 1 }}
          keyboardShouldPersistTaps="handled">
          <LoginHeader style={{ alignSelf: 'center' }} />
  
          <View style={{marginHorizontal: scale(16), marginTop: verticalScale(20)}}>
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
                    <Text style={{color: country === item ? Color.white : Color.textColor}}>
                      {item}
                    </Text>
                  </TouchableOpacity>
                ))}
              </View>
            )}
  
            <View style={styles.inputContainer}>
              <TextInput
                value={number}
                placeholder="Number"
                onChangeText={setNumber}
                keyboardType="numeric"
                placeholderTextColor={Color.textColor}
                maxLength={10}
                style={[styles.inputContainer, styles.titleText]}
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
              onPress={() => {
                Keyboard.dismiss();
                setShowDatePicker(true);
              }}>
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
      </KeyboardAvoidingView>
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
    marginVertical: verticalScale(5),
    paddingHorizontal: scale(10),
    borderWidth: 1,
    borderColor: Color.primaryColor,
    height: verticalScale(38),
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
  },
  dropdown: {
    borderRadius: scale(4),
    borderWidth: 1,
    borderColor: Color.borderColor,
    margin: scale(2),
    backgroundColor: Color.white,
    zIndex: 10,
  },
  dropdownItem: {
    padding: scale(12),
  },
  buttonContainer: {
    justifyContent: 'flex-end',
    alignItems: 'flex-end',
    margin: scale(12),
    padding: scale(4),
    position: 'absolute',
    bottom: 0,
    right: 0,
  },
  buttonContainerWithKeyboard: {
    bottom: scale(250), // Adjust this value based on your keyboard height (e.g., approximate height of keyboard)
  },
  button: {
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: Color.primaryColor,
    borderRadius: scale(25),
    height: scale(32),
    width: scale(32),
  },
});