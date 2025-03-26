// import React, {useState} from 'react';
// import {
//   ActivityIndicator,
//   Alert,
//   SafeAreaView,
//   ScrollView,
//   StyleSheet,
//   Text,
//   TextInput,
//   ToastAndroid,
//   TouchableOpacity,
//   View,
//   Image,
//   Modal,
//   FlatList,
// } from 'react-native';
// import {scale, verticalScale} from 'react-native-size-matters';
// import AntDesign from 'react-native-vector-icons/AntDesign';
// import NutriumLogo from '../../assets/Icon/NutriumLogo.svg';
// import Color from '../../assets/colors/Colors';
// import Toast from 'react-native-simple-toast';
// import Ionicons from 'react-native-vector-icons/Ionicons';
// import {useNavigation} from '@react-navigation/native';

// const InformationScreen = () => {
//   const navigation = useNavigation();
//   const [loading, setLoading] = useState(false);
//   const [isAgree, setIsAgree] = useState(false);
//   const [name, setName] = useState('');
//   const [email, setEmail] = useState('');
//   const [password, setPassword] = useState('');
//   const [emailError, setEmailError] = useState('');
//   const [passwordError, setPasswordError] = useState('');
//   const [nameError, setNameError] = useState('');
//   const [passwordVisible, setPasswordVisible] = useState(false);

//   const options = [
//     {label: 'Male', value: 'male'},
//     {label: 'Female', value: 'female'},
//     {label: 'Other', value: 'other'},
//   ];

//   const handleSelect = value => {
//     console.log('Selected Value:', value);
//   };

//   const handleLogin = () => {
//     navigation.navigate('information');
//   };

//   return (
//     <SafeAreaView style={styles.container}>
//       <ScrollView
//         style={styles.scrollView}
//         showsVerticalScrollIndicator={false}>
//         <View style={styles.logoContainer}>
//           <NutriumLogo
//             style={styles.logo}
//             width={scale(280)}
//             height={verticalScale(50)}
//           />
//         </View>

//         <View>
//           <Text
//             style={{
//               color: Color.black,
//               textAlign: 'center',
//               fontSize: scale(15),
//               marginVertical: verticalScale(10),
//             }}>
//             Hi, {'userName'}! We need some information so we can improve your
//             experience
//           </Text>
//         </View>

//         <Text style={styles.inputLabel}>Gender</Text>

//         <Text style={styles.inputLabel}>Country</Text>

//         <Text style={styles.inputLabel}>Mobile No</Text>

//         <Text style={styles.inputLabel}>Profession</Text>

//         <Text style={styles.inputLabel}>
//           What are you looking for in Nutrium
//         </Text>

//         <Text style={styles.inputLabel}>Date of Birth</Text>

//         <Text style={styles.inputLabel}>Worksplace</Text>

//         <Text style={styles.inputLabel}>Expertise</Text>
//         <TouchableOpacity
//           disabled={!isAgree}
//           onPress={handleLogin}
//           style={[
//             styles.signInButton,
//             {backgroundColor: isAgree ? Color.secondary : '#E0E0E0'},
//           ]}>
//           {loading ? (
//             <ActivityIndicator size="small" color={Color.primary} />
//           ) : (
//             <View style={{flexDirection: 'row', alignItems: 'center'}}>
//               <Text
//                 style={[
//                   styles.signInText,
//                   {color: isAgree ? '#FFFFFF' : '#9E9E9E'},
//                 ]}>
//                 Sign In
//               </Text>
//               <AntDesign
//                 name="arrowright"
//                 color={isAgree ? '#FFFFFF' : '#9E9E9E'}
//                 size={16}
//                 style={{marginLeft: scale(8)}}
//               />
//             </View>
//           )}
//         </TouchableOpacity>
//       </ScrollView>
//     </SafeAreaView>
//   );
// };

// export default InformationScreen;

// const styles = StyleSheet.create({
//   dropdownButton: {
//     borderWidth: 1,
//     borderColor: '#ccc',
//     padding: 10,
//     borderRadius: 5,
//     width: '80%',
//     backgroundColor: '#fff',
//     alignItems: 'center',
//   },
//   selectedText: {
//     fontSize: 16,
//     color: '#333',
//   },
//   overlay: {
//     flex: 1,
//     backgroundColor: 'rgba(0,0,0,0.5)',
//     justifyContent: 'center',
//     alignItems: 'center',
//   },
//   dropdownContainer: {
//     backgroundColor: '#fff',
//     width: '80%',
//     maxHeight: 250,
//     borderRadius: 10,
//     paddingVertical: 10,
//   },
//   dropdownItem: {
//     padding: 15,
//     borderBottomWidth: 1,
//     borderBottomColor: '#ccc',
//   },
//   itemText: {
//     fontSize: 16,
//     color: '#333',
//   },
//   container: {
//     flex: 1,
//     backgroundColor: Color.primary,
//   },
//   scrollView: {
//     paddingHorizontal: scale(16),
//   },
//   logoContainer: {
//     alignItems: 'center',
//     justifyContent: 'center',
//     marginVertical: verticalScale(48),
//   },
//   inputLabel: {
//     fontSize: scale(14),
//     color: Color.black,
//     marginTop: verticalScale(15),
//   },
//   inputContainer: {
//     position: 'relative',
//     width: '100%',
//   },
//   input: {
//     height: verticalScale(35),
//     borderWidth: 1,
//     borderColor: '#E0E0E0',
//     borderRadius: scale(12),
//     paddingHorizontal: scale(16),
//     fontSize: scale(14),
//     color: Color.gray,
//     width: '100%',
//   },
//   eyeIconContainer: {
//     position: 'absolute',
//     right: scale(16),
//     top: scale(8),
//   },
//   errorMessage: {
//     color: '#F44336',
//     fontSize: scale(13),
//     marginTop: verticalScale(4),
//   },
//   forgotText: {
//     color: '#757575',
//     fontSize: scale(13),
//     fontWeight: '600',
//     marginTop: verticalScale(22),
//   },
//   termsContainer: {
//     flexDirection: 'row',
//     alignItems: 'center',
//     marginTop: verticalScale(22),
//   },
//   checkbox: {
//     width: scale(22),
//     height: scale(22),
//     borderWidth: 2,
//     borderRadius: scale(4),
//     marginRight: scale(11),
//     alignItems: 'center',
//     justifyContent: 'center',
//   },
//   checkedBox: {
//     alignItems: 'center',
//     justifyContent: 'center',
//   },
//   termsText: {
//     flex: 1,
//     color: Color.black,
//     fontSize: scale(13),
//     lineHeight: verticalScale(18),
//   },
//   highlightedText: {
//     color: Color.secondary,
//   },
//   signInButton: {
//     flexDirection: 'row',
//     height: verticalScale(38),
//     borderRadius: scale(24),
//     justifyContent: 'center',
//     alignItems: 'center',
//     marginTop: verticalScale(38),
//   },
//   signInText: {
//     fontSize: scale(15),
//     fontWeight: '600',
//   },
//   noAccountText: {
//     color: Color.secondary,
//     fontSize: scale(13),
//     fontWeight: '600',
//     textAlign: 'center',
//     marginTop: verticalScale(22),
//   },
//   orContainer: {
//     flexDirection: 'row',
//     alignItems: 'center',
//     marginVertical: verticalScale(22),
//   },
//   divider: {
//     flex: 1,
//     height: 1,
//     backgroundColor: '#E0E0E0',
//   },
//   orText: {
//     color: '#757575',
//     paddingHorizontal: scale(15),
//     fontWeight: '600',
//   },
//   googleButton: {
//     flexDirection: 'row',
//     height: verticalScale(38),
//     borderRadius: scale(24),
//     borderWidth: 1,
//     borderColor: '#E0E0E0',
//     justifyContent: 'center',
//     alignItems: 'center',
//     marginBottom: verticalScale(48),
//   },
//   googleIcon: {
//     width: scale(22),
//     height: scale(22),
//     marginRight: 8,
//   },
//   googleText: {
//     color: '#757575',
//     fontSize: scale(14),
//     fontWeight: '600',
//   },
// });

import React, {useState} from 'react';
import {
  ActivityIndicator,
  SafeAreaView,
  ScrollView,
  StyleSheet,
  Text,
  TextInput,
  TouchableOpacity,
  View,
  Modal,
  FlatList,
  Platform,
} from 'react-native';
import {scale, verticalScale} from 'react-native-size-matters';
import LinearGradient from 'react-native-linear-gradient';
import AntDesign from 'react-native-vector-icons/AntDesign';
import Ionicons from 'react-native-vector-icons/Ionicons';
import NutriumLogo from '../../assets/Icon/NutriumLogo.svg';
import Color from '../../assets/colors/Colors';
import {useNavigation} from '@react-navigation/native';
import DatePicker from 'react-native-date-picker';

const InformationScreen = () => {
  const navigation = useNavigation();
  const [loading, setLoading] = useState(false);
  const [isFormValid, setIsFormValid] = useState(false);

  const [genderDropdownVisible, setGenderDropdownVisible] = useState(false);
  const [countryDropdownVisible, setCountryDropdownVisible] = useState(false);
  const [professionDropdownVisible, setProfessionDropdownVisible] =
    useState(false);
  const [expertiseDropdownVisible, setExpertiseDropdownVisible] =
    useState(false);

  const [selectedGender, setSelectedGender] = useState('');
  const [selectedCountry, setSelectedCountry] = useState('');
  const [selectedProfession, setSelectedProfession] = useState('');
  const [selectedExpertise, setSelectedExpertise] = useState([]);

  const [mobileNo, setMobileNo] = useState('');
  const [lookingFor, setLookingFor] = useState('');
  const [workspace, setWorkspace] = useState('');
  const [dateOfBirth, setDateOfBirth] = useState(new Date());
  const [datePickerOpen, setDatePickerOpen] = useState(false);

  const genderOptions = [
    {label: 'Male', value: 'male'},
    {label: 'Female', value: 'female'},
    {label: 'Other', value: 'other'},
  ];

  const countryOptions = [
    {label: 'United States', value: 'us'},
    {label: 'Canada', value: 'canada'},
    {label: 'United Kingdom', value: 'uk'},
    {label: 'Australia', value: 'australia'},
  ];

  const professionOptions = [
    {label: 'Student', value: 'student'},
    {label: 'Professional', value: 'professional'},
    {label: 'Freelancer', value: 'freelancer'},
    {label: 'Entrepreneur', value: 'entrepreneur'},
  ];

  const expertiseOptions = [
    {label: 'Nutrition', value: 'nutrition'},
    {label: 'Fitness', value: 'fitness'},
    {label: 'Weight Loss', value: 'weight_loss'},
    {label: 'Muscle Gain', value: 'muscle_gain'},
    {label: 'Sports Performance', value: 'sports_performance'},
  ];

  const handleLogin = () => {
    if (
      selectedGender &&
      selectedCountry &&
      selectedProfession &&
      mobileNo &&
      lookingFor &&
      workspace &&
      selectedExpertise.length > 0
    ) {
      setIsAgree(true);
      navigation.navigate('NextScreen');
    } else {
      alert('Please fill all fields');
    }
  };

  const validateForm = () => {
    const isValid =
      selectedGender &&
      selectedCountry &&
      selectedProfession &&
      mobileNo &&
      lookingFor &&
      workspace &&
      selectedExpertise.length > 0;
    setIsFormValid(isValid);
  };

  const CustomDropdown = ({
    label,
    options,
    visible,
    setVisible,
    selectedValue,
    setSelectedValue,
    multiple = false,
  }) => {
    const toggleOption = value => {
      if (multiple) {
        setSelectedValue(prev =>
          prev.includes(value)
            ? prev.filter(item => item !== value)
            : [...prev, value],
        );
      } else {
        setSelectedValue(value);
        setVisible(false);
      }
      validateForm();
    };

    return (
      <>
        <TouchableOpacity
          style={styles.dropdownContainer}
          onPress={() => setVisible(true)}>
          <Text style={styles.dropdownLabel}>{label}</Text>
          <View style={styles.dropdownSelector}>
            <Text style={styles.dropdownText}>
              {multiple
                ? selectedValue.length > 0
                  ? selectedValue
                      .map(sel => options.find(o => o.value === sel)?.label)
                      .join(', ')
                  : `Select ${label}`
                : selectedValue
                ? options.find(o => o.value === selectedValue)?.label
                : `Select ${label}`}
            </Text>
            <Ionicons name="chevron-down" size={20} color={Color.gray} />
          </View>
        </TouchableOpacity>

        <Modal
          transparent={true}
          visible={visible}
          animationType="slide"
          onRequestClose={() => setVisible(false)}>
          <View style={styles.modalOverlay}>
            <LinearGradient
              colors={['#FFFFFF', '#F0F0F0']}
              style={styles.modalContainer}>
              <View style={styles.modalHeader}>
                <Text style={styles.modalTitle}>{label}</Text>
                <TouchableOpacity onPress={() => setVisible(false)}>
                  <Ionicons name="close" size={24} color={Color.black} />
                </TouchableOpacity>
              </View>
              <FlatList
                data={options}
                keyExtractor={item => item.value}
                renderItem={({item}) => (
                  <TouchableOpacity
                    style={styles.dropdownItem}
                    onPress={() => toggleOption(item.value)}>
                    <Text style={styles.dropdownItemText}>{item.label}</Text>
                    {multiple && selectedValue.includes(item.value) && (
                      <Ionicons
                        name="checkmark"
                        size={20}
                        color={Color.secondary}
                      />
                    )}
                  </TouchableOpacity>
                )}
              />
              {multiple && (
                <TouchableOpacity
                  style={styles.doneButton}
                  onPress={() => setVisible(false)}>
                  <Text style={styles.doneButtonText}>Confirm</Text>
                </TouchableOpacity>
              )}
            </LinearGradient>

        
          </View>
        </Modal>
      </>
    );
  };

  // Custom input component
  const CustomInput = ({
    label,
    value,
    onChangeText,
    placeholder,
    keyboardType = 'default',
  }) => (
    <View style={styles.inputContainer}>
      <Text style={styles.inputLabel}>{label}</Text>
      <View style={styles.inputWrapper}>
        <TextInput
          style={styles.input}
          value={value}
          onChangeText={text => {
            onChangeText(text);
            validateForm();
          }}
          placeholder={placeholder}
          placeholderTextColor={Color.gray}
          keyboardType={keyboardType}
        />
      </View>
    </View>
  );

  return (
    <LinearGradient colors={['#FFFFFF', '#F0F0F0']} style={styles.container}>
      <SafeAreaView style={{flex: 1}}>
        <ScrollView
          style={styles.scrollView}
          showsVerticalScrollIndicator={false}>
          <View style={styles.headerContainer}>
            <NutriumLogo width={scale(200)} height={verticalScale(40)} />
            <Text style={styles.welcomeText}>Complete Your Profile</Text>
            <Text style={styles.subtitleText}>
              Help us personalize your Nutrium experience
            </Text>
          </View>

          <View style={styles.formContainer}>
            <CustomDropdown
              label="Gender"
              options={genderOptions}
              visible={genderDropdownVisible}
              setVisible={setGenderDropdownVisible}
              selectedValue={selectedGender}
              setSelectedValue={setSelectedGender}
            />

            <CustomDropdown
              label="Country"
              options={countryOptions}
              visible={countryDropdownVisible}
              setVisible={setCountryDropdownVisible}
              selectedValue={selectedCountry}
              setSelectedValue={setSelectedCountry}
            />

            <CustomInput
              label="Mobile Number"
              value={mobileNo}
              onChangeText={setMobileNo}
              placeholder="Enter your mobile number"
              keyboardType="phone-pad"
            />

            <CustomDropdown
              label="Profession"
              options={professionOptions}
              visible={professionDropdownVisible}
              setVisible={setProfessionDropdownVisible}
              selectedValue={selectedProfession}
              setSelectedValue={setSelectedProfession}
            />

            <CustomInput
              label="Your Goals"
              value={lookingFor}
              onChangeText={setLookingFor}
              placeholder="What are you looking to achieve?"
            />

            <TouchableOpacity
              style={styles.datePickerContainer}
              onPress={() => setDatePickerOpen(true)}>
              <Text style={styles.inputLabel}>Date of Birth</Text>
              <View style={styles.inputWrapper}>
                <Text style={styles.dateText}>
                  {dateOfBirth.toLocaleDateString()}
                </Text>
                <Ionicons name="calendar" size={20} color={Color.secondary} />
              </View>
            </TouchableOpacity>
            <DatePicker
              modal
              mode="date"
              open={datePickerOpen}
              date={dateOfBirth}
              onConfirm={date => {
                setDatePickerOpen(false);
                setDateOfBirth(date);
                validateForm();
              }}
              onCancel={() => setDatePickerOpen(false)}
            />

            <CustomInput
              label="Workspace"
              value={workspace}
              onChangeText={setWorkspace}
              placeholder="Enter your workspace"
            />

            <CustomDropdown
              label="Expertise"
              options={expertiseOptions}
              visible={expertiseDropdownVisible}
              setVisible={setExpertiseDropdownVisible}
              selectedValue={selectedExpertise}
              setSelectedValue={setSelectedExpertise}
              multiple={true}
            />

            <TouchableOpacity
              disabled={!isFormValid}
              onPress={handleLogin}
              style={styles.continueButton}>
              {loading ? (
                <ActivityIndicator size="small" color={Color.white} />
              ) : (
                <View style={styles.buttonContent}>
                  <Text style={styles.continueButtonText}>Continue</Text>
                  <AntDesign name="arrowright" color={Color.white} size={20} />
                </View>
              )}
            </TouchableOpacity>
          </View>
        </ScrollView>
      </SafeAreaView>
    </LinearGradient>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: Color.white,
  },
  scrollView: {
    flex: 1,
  },
  headerContainer: {
    alignItems: 'center',
    paddingVertical: verticalScale(20),
    paddingHorizontal: scale(20),
  },
  welcomeText: {
    fontSize: scale(22),
    fontWeight: 'bold',
    color: Color.black,
    marginTop: verticalScale(15),
  },
  subtitleText: {
    fontSize: scale(14),
    color: Color.gray,
    textAlign: 'center',
    marginTop: verticalScale(10),
  },
  formContainer: {
    paddingHorizontal: scale(20),
    paddingBottom: verticalScale(30),
  },
  dropdownContainer: {
    marginBottom: verticalScale(15),
  },
  dropdownLabel: {
    fontSize: scale(14),
    color: Color.black,
    marginBottom: verticalScale(5),
    fontWeight: '600',
  },
  dropdownSelector: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    borderWidth: 1,
    borderColor: '#E0E0E0',
    borderRadius: scale(10),
    paddingHorizontal: scale(15),
    paddingVertical: verticalScale(12),
  },
  dropdownText: {
    fontSize: scale(14),
    color: Color.black,
    flex: 1,
  },
  modalOverlay: {
    flex: 1,
    justifyContent: 'flex-end',
    backgroundColor: 'rgba(0,0,0,0.5)',
  },
  modalContainer: {
    borderTopLeftRadius: scale(20),
    borderTopRightRadius: scale(20),
    maxHeight: '80%',
  },
  modalHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    padding: scale(15),
    borderBottomWidth: 1,
    borderBottomColor: '#E0E0E0',
  },
  modalTitle: {
    fontSize: scale(18),
    fontWeight: 'bold',
    color: Color.black,
  },
  dropdownItem: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingVertical: verticalScale(15),
    paddingHorizontal: scale(15),
    borderBottomWidth: 1,
    borderBottomColor: '#E0E0E0',
  },
  dropdownItemText: {
    fontSize: scale(14),
    color: Color.black,
  },
  doneButton: {
    backgroundColor: Color.secondary,
    paddingVertical: verticalScale(15),
    alignItems: 'center',
  },
  doneButtonText: {
    color: Color.white,
    fontSize: scale(16),
    fontWeight: 'bold',
  },
  inputContainer: {
    marginBottom: verticalScale(15),
  },
  inputLabel: {
    fontSize: scale(14),
    color: Color.black,
    marginBottom: verticalScale(5),
    fontWeight: '600',
  },
  inputWrapper: {
    flexDirection: 'row',
    alignItems: 'center',
    borderWidth: 1,
    borderColor: '#E0E0E0',
    borderRadius: scale(10),
    paddingHorizontal: scale(15),
  },
  input: {
    flex: 1,
    fontSize: scale(14),
    color: Color.black,
    height: verticalScale(50),
  },
  datePickerContainer: {
    marginBottom: verticalScale(15),
  },
  dateText: {
    fontSize: scale(14),
    color: Color.black,
    flex: 1,
  },
  continueButton: {
    backgroundColor: Color.secondary,
    borderRadius: scale(10),
    paddingVertical: verticalScale(15),
    alignItems: 'center',
    marginTop: verticalScale(20),
  },
  buttonContent: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
  },
  continueButtonText: {
    color: Color.white,
    fontSize: scale(16),
    fontWeight: 'bold',
    marginRight: scale(10),
  },
});

export default InformationScreen;
