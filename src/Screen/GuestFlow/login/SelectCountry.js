// import {
//   FlatList,
//   Modal,
//   SafeAreaView,
//   ScrollView,
//   StyleSheet,
//   Text,
//   TextInput,
//   TouchableOpacity,
//   View,
//   Alert,
//   KeyboardAvoidingView,
//   Platform,
// } from 'react-native';
// import React, {useState} from 'react';
// import Color, {Font, ShadowValues} from '../../../assets/colors/Colors';
// import {scale, verticalScale} from 'react-native-size-matters';
// import {
//   LeftIcon,
//   RightIcon,
// } from '../../../assets/styles/Icon';
// import {useNavigation} from '@react-navigation/native';
// import LoginHeader from '../../../assets/Images/SelectCountry.svg';
// import DateTimePicker from '@react-native-community/datetimepicker';
// import GuestFlowHeader from '../../../Components/GuestFlowHeader';
// import MaterialIcons from 'react-native-vector-icons/MaterialIcons';
// import MaterialCommunityIcons from 'react-native-vector-icons/MaterialCommunityIcons';

// const SelectCountry = () => {
//   const navigation = useNavigation();
//   const [date, setDate] = useState(new Date());
//   const [showDatePicker, setShowDatePicker] = useState(false);
//   const [country, setCountry] = useState('');
//   const [number, setNumber] = useState('');
//   const [dateOfBirth, setDateOfBirth] = useState('');
//   const [showCountryDropdown, setShowCountryDropdown] = useState(false);

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

//   return (
//     <SafeAreaView style={{flex: 1, backgroundColor: Color.white}}>
//         <KeyboardAvoidingView
//     style={{flex: 1}}
//     behavior={Platform.OS === 'ios' ? 'padding' : undefined}>
//       <GuestFlowHeader progress={'80%'} />

//       <LeftIcon onGoBack={() => navigation.goBack()} />
//       <ScrollView showsVerticalScrollIndicator={false} style={{flex: 1}}>
//         <LoginHeader style={{alignSelf: 'center'}} />

//         <View
//           style={{marginHorizontal: scale(16), marginTop: verticalScale(20)}}>
//           <TouchableOpacity
//             style={styles.inputContainer}
//             onPress={() => setShowCountryDropdown(!showCountryDropdown)}>
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
//             onPress={() => setShowDatePicker(true)}>
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
//       </ScrollView>

//       <TouchableOpacity
//       style={styles.floatingButton}
//       onPress={handleNavigation}>
//       <View style={styles.button} />
//     </TouchableOpacity>
//     </KeyboardAvoidingView>
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
//     fontFamily: Font.Poppins,
//     color: Color.textColor,
//   },
//   inputContainer: {
//     borderRadius: 8,
//     marginVertical: verticalScale(5),
//     paddingHorizontal: scale(10),
//     borderWidth: 1,
//     borderColor: Color.primaryColor,
//     height: verticalScale(38),
//     justifyContent: 'center',
//     flexDirection: 'row',
//     alignItems: 'center',
//     justifyContent: 'space-between',
//   },
//   dropdown: {
//     borderRadius: scale(4),
//     borderWidth: 1,
//     borderColor: Color.borderColor,
//     margin: scale(2),
//   },
//   dropdownItem: {
//     padding: scale(12),
//   },
//   button: {
//     justifyContent: 'center',
//     alignItems: 'center',
//     backgroundColor: Color.primaryColor,
//     borderRadius: scale(25),
//     height: scale(32),
//     width: scale(32),
//   },
//   buttonContainer: {
//     justifyContent: 'center',
//     alignItems: 'center',
//     margin: scale(12),
//     padding: scale(4),
//     alignSelf: 'flex-end',
//   },
//   floatingButton: {
//     position: 'absolute',
//     bottom: scale(16),
//     right: scale(16),
//     zIndex: 10,
//   },
  
// });




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
// import Color, {Font} from '../../../assets/colors/Colors';
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

// const SelectCountry = () => {
//   const navigation = useNavigation();
//   const [date, setDate] = useState(new Date());
//   const [showDatePicker, setShowDatePicker] = useState(false);
//   const [country, setCountry] = useState('');
//   const [number, setNumber] = useState('');
//   const [dateOfBirth, setDateOfBirth] = useState('');
//   const [showCountryDropdown, setShowCountryDropdown] = useState(false);
//   const [keyboardVisible, setKeyboardVisible] = useState(false);

//   // Add keyboard listeners
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

//   // Hide dropdown when keyboard appears
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
//         style={{flex: 1}}
//         contentContainerStyle={{paddingBottom: 80}}
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
//       </ScrollView>
      
//       {/* Only show the floating button when keyboard is not visible */}
//       {!keyboardVisible && (
//         <TouchableOpacity
//           style={styles.floatingButton}
//           onPress={handleNavigation}>
//           <View style={styles.button}>
//             <MaterialIcons name="arrow-forward" size={20} color={Color.white} />
//           </View>
//         </TouchableOpacity>
//       )}
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
//     fontFamily: Font.Poppins,
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
//   button: {
//     justifyContent: 'center',
//     alignItems: 'center',
//     backgroundColor: Color.primaryColor,
//     borderRadius: scale(25),
//     height: scale(50),
//     width: scale(50),
//   },
//   floatingButton: {
//     position: 'absolute',
//     bottom: scale(16),
//     right: scale(16),
//     elevation: 5,
//     shadowColor: '#000',
//     shadowOffset: { width: 0, height: 2 },
//     shadowOpacity: 0.3,
//     shadowRadius: 3,
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
  Platform,
} from 'react-native';
import React, {useState, useEffect} from 'react';
import Color, {Font} from '../../../assets/colors/Colors';
import {scale, verticalScale} from 'react-native-size-matters';
import {
  LeftIcon,
} from '../../../assets/styles/Icon';
import {useNavigation} from '@react-navigation/native';
import LoginHeader from '../../../assets/Images/SelectCountry.svg';
import DateTimePicker from '@react-native-community/datetimepicker';
import GuestFlowHeader from '../../../Components/GuestFlowHeader';
import MaterialIcons from 'react-native-vector-icons/MaterialIcons';
import MaterialCommunityIcons from 'react-native-vector-icons/MaterialCommunityIcons';

const SelectCountry = () => {
  const navigation = useNavigation();
  const [date, setDate] = useState(new Date());
  const [showDatePicker, setShowDatePicker] = useState(false);
  const [country, setCountry] = useState('');
  const [number, setNumber] = useState('');
  const [dateOfBirth, setDateOfBirth] = useState('');
  const [showCountryDropdown, setShowCountryDropdown] = useState(false);
  const [keyboardVisible, setKeyboardVisible] = useState(false);

  // Add keyboard listeners
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
    navigation.navigate('GuestLogin');
  };

  // Hide dropdown when keyboard appears
  useEffect(() => {
    if (keyboardVisible) {
      setShowCountryDropdown(false);
    }
  }, [keyboardVisible]);

  return (
    <SafeAreaView style={styles.container}>
      <GuestFlowHeader progress={'80%'} />
      <LeftIcon onGoBack={() => navigation.goBack()} />
      
      <ScrollView 
        showsVerticalScrollIndicator={false} 
        style={{flex: 1}}
        contentContainerStyle={{paddingBottom: scale(80)}}
        keyboardShouldPersistTaps="handled">
        <LoginHeader style={{alignSelf: 'center'}} />

        <View style={{marginHorizontal: scale(16), marginTop: verticalScale(20)}}>
          <TouchableOpacity
            style={styles.inputContainer}
            onPress={() => {
              Keyboard.dismiss();
              setShowCountryDropdown(!showCountryDropdown);
            }}>
            <Text
              style={[styles.titleText, !country && {color: Color.textColor}]}>
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
                  <Text
                    style={[
                      styles.titleText,
                      {
                        color: country === item ? Color.white : Color.textColor,
                      },
                    ]}>
                    {item}
                  </Text>
                </TouchableOpacity>
              ))}
            </View>
          )}

          <TextInput
            value={number}
            placeholder="Number"
            onChangeText={setNumber}
            keyboardType="numeric"
            placeholderTextColor={Color.textColor}
            maxLength={10}
            style={[styles.inputContainer, styles.titleText]}
          />

          <TouchableOpacity
            style={styles.inputContainer}
            onPress={() => {
              Keyboard.dismiss();
              setShowDatePicker(true);
            }}>
            <Text
              style={[
                styles.titleText,
                !dateOfBirth && {color: Color.textColor},
              ]}>
              {dateOfBirth || 'Date of Birth'}
            </Text>
            <MaterialCommunityIcons
              name="calendar"
              size={20}
              color={Color.primaryColor}
            />
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
        
        {/* Button placed inside ScrollView at the end of content */}
        <View style={styles.buttonContainer}>
          <TouchableOpacity
            style={styles.button}
            onPress={handleNavigation}>
            <MaterialIcons name="arrow-forward" size={20} color={Color.white} />
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
    fontFamily: Font.Poppins,
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
    alignItems: 'flex-end',
    marginTop: verticalScale(20),
    marginRight: scale(16),
    marginBottom: verticalScale(20),
  },
  button: {
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: Color.primaryColor,
    borderRadius: scale(25),
    height: scale(50),
    width: scale(50),
    elevation: 5,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.3,
    shadowRadius: 3,
  },
});