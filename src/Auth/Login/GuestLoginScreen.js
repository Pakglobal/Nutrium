import React, {useCallback, useEffect, useRef, useState} from 'react';
import {
  SafeAreaView,
  ScrollView,
  StyleSheet,
  Text,
  TextInput,
  TouchableOpacity,
  View,
  Keyboard,
  BackHandler,
  KeyboardAvoidingView,
  Platform,
  Animated,
} from 'react-native';
import FontAwesome from 'react-native-vector-icons/FontAwesome';
import FontAwesome5 from 'react-native-vector-icons/FontAwesome5';
import FontAwesome6 from 'react-native-vector-icons/FontAwesome6';
import Feather from 'react-native-vector-icons/Feather';
import Octicons from 'react-native-vector-icons/Octicons';
import Ionicons from 'react-native-vector-icons/Ionicons';
import MaterialCommunityIcons from 'react-native-vector-icons/MaterialCommunityIcons';
import {Color} from '../../assets/styles/Colors';
import {Font} from '../../assets/styles/Fonts';
import {scale, verticalScale} from 'react-native-size-matters';
import {useFocusEffect, useNavigation} from '@react-navigation/native';
import {useDispatch, useSelector} from 'react-redux';
import {guestLoginData, setGuestToken} from '../../redux/user';
import {guestLogin} from '../../Apis/Login/AuthApis';
import GuestFlowHeader from '../../Components/GuestFlowHeader';
import CustomShadow from '../../Components/CustomShadow';
import CustomAlertBox from '../../Components/CustomAlertBox';
import CustomLoader from '../../Components/CustomLoader';
import CustomeDropDown from '../../Components/CustomeDropDown';
import DateTimePicker from '@react-native-community/datetimepicker';
import LoginHeaderGender from '../../assets/Images/SelectGender.svg';
import LoginHeaderProfession from '../../assets/Images/SelectProfession.svg';
import LoginHeaderCountry from '../../assets/Images/SelectCountry.svg';
import LoginHeaderGuest from '../../assets/Images/GuestLogin.svg';
import {Easing} from 'react-native-reanimated';

const GuestLoginScreen = () => {
  const navigation = useNavigation();
  const dispatch = useDispatch();
  const token = useSelector(state => state?.user?.fcmToken);
  const [step, setStep] = useState('selectGender');
  const [selectedGender, setSelectedGender] = useState('');
  const [profession, setProfession] = useState('');
  const [goal, setGoal] = useState('');
  const [country, setCountry] = useState('');
  const [number, setNumber] = useState('');
  const [dateOfBirth, setDateOfBirth] = useState('');
  const [hasNumberError, setHasNumberError] = useState(false);
  const [date, setDate] = useState(new Date());
  const [showDatePicker, setShowDatePicker] = useState(false);
  const [firstName, setFirstName] = useState('');
  const [lastName, setLastName] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [firstNameError, setFirstNameError] = useState('');
  const [lastNameError, setLastNameError] = useState('');
  const [emailError, setEmailError] = useState('');
  const [passwordError, setPasswordError] = useState('');
  const [passwordVisible, setPasswordVisible] = useState(false);
  const [alertVisible, setAlertVisible] = useState(false);
  const [alertType, setAlertType] = useState('error');
  const [alertMsg, setAlertMsg] = useState('');
  const [loading, setLoading] = useState(false);

  const headerImageAnim = useRef(new Animated.Value(-200)).current;
  const contentAnim = useRef(new Animated.Value(0)).current;

  useEffect(() => {
    headerImageAnim.setValue(-200);
    contentAnim.setValue(0);

    Animated.timing(headerImageAnim, {
      toValue: 0,
      duration: 800,
      easing: Easing.out(Easing.cubic),
      useNativeDriver: true,
    }).start();

    Animated.timing(contentAnim, {
      toValue: 1,
      duration: 600,
      delay: 200,
      easing: Easing.out(Easing.cubic),
      useNativeDriver: true,
    }).start();
  }, [step]);

  useFocusEffect(
    useCallback(() => {
      const onBackPress = () => {
        handleBack();
        return true;
      };

      BackHandler.addEventListener('hardwareBackPress', onBackPress);
      return () => {
        BackHandler.removeEventListener('hardwareBackPress', onBackPress);
      };
    }, [step]),
  );

  const genderOptions = [
    {id: 'Female', label: 'Female', icon: 'female'},
    {id: 'Male', label: 'Male', icon: 'male'},
  ];

  const professions = [
    {
      id: 'student',
      label: 'Student',
      icon: id => (
        <FontAwesome5
          name="user-graduate"
          size={18}
          color={profession === id ? Color.white : Color.primaryColor}
        />
      ),
    },
    {
      id: 'businessman',
      label: 'Businessman',
      icon: id => (
        <FontAwesome
          name="stethoscope"
          size={18}
          color={profession === id ? Color.white : Color.primaryColor}
        />
      ),
    },
    {
      id: 'musician',
      label: 'Musician',
      icon: id => (
        <Feather
          name="music"
          size={18}
          color={profession === id ? Color.white : Color.primaryColor}
        />
      ),
    },
    {
      id: 'lawyer',
      label: 'Lawyer',
      icon: id => (
        <Octicons
          name="law"
          size={18}
          color={profession === id ? Color.white : Color.primaryColor}
        />
      ),
    },
  ];

  const goals = [
    {id: 'weight_loss', label: 'Weight Loss'},
    {id: 'muscle_gain', label: 'Muscle Gain'},
    {id: 'maintain_weight', label: 'Maintain Weight'},
    {id: 'better_digestion', label: 'Better Digestion'},
  ];

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

  const validateFirstName = value => {
    if (!value) return 'First name is required';
    if (value.length < 3) return 'First name must be at least 3 characters';
    return '';
  };

  const validateLastName = value => {
    if (!value) return 'Last name is required';
    if (value.length < 3) return 'Last name must be at least 3 characters';
    return '';
  };

  const validateEmail = value => {
    const emailRegex = /^\w+([\.+]?\w+)*@\w+([\.-]?\w+)*(\.\w{2,})+$/;
    if (!value) return 'Email is required';
    if (!emailRegex.test(value)) return 'Enter a valid email';
    return '';
  };

  const validatePassword = value => {
    if (!value) return 'Password is required';
    if (value.length < 8) return 'Password must be at least 8 characters';
    return '';
  };

  const handleFirstNameChange = value => {
    setFirstName(value);
    setFirstNameError(validateFirstName(value));
  };

  const handleLastNameChange = value => {
    setLastName(value);
    setLastNameError(validateLastName(value));
  };

  const handleEmailChange = value => {
    setEmail(value);
    setEmailError(validateEmail(value));
  };

  const handlePasswordChange = value => {
    setPassword(value);
    setPasswordError(validatePassword(value));
  };

  const validateNumberInput = input => {
    const numericRegex = /^[0-9]*$/;
    return numericRegex.test(input);
  };

  const handleNumberChange = input => {
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

  const showAlert = (message, type = 'error') => {
    setAlertMsg(message);
    setAlertType(type);
    setAlertVisible(true);
  };

  const handleNext = async () => {
    let message = '';
    switch (step) {
      case 'selectGender':
        if (!selectedGender) {
          message = 'Please select any one';
          showAlert(message, 'warning');
          return;
        }
        setStep('selectProfession');
        break;

      case 'selectProfession':
        if (!profession && !goal) {
          message = 'Please select any one';
          showAlert(message, 'warning');
          return;
        } else if (!profession) {
          message = 'Please select any one profession';
          showAlert(message, 'warning');
          return;
        } else if (!goal) {
          message = 'Please select any one goal';
          showAlert(message, 'warning');
          return;
        }
        setStep('selectCountry');
        break;

      case 'selectCountry':
        Keyboard.dismiss();
        if (!country || !number || !dateOfBirth) {
          if (!country && !number && !dateOfBirth) {
            message = 'All fields are required';
          } else {
            const missingFields = [];
            if (!country) missingFields.push('Country');
            if (!number) missingFields.push('Number');
            if (!dateOfBirth) missingFields.push('Date of Birth');
            message = `${missingFields.join(', ')} required`;
          }
          showAlert(message, 'warning');
          return;
        }

        if (!validateNumberInput(number)) {
          setHasNumberError(true);
          showAlert('Please enter numbers only', 'warning');
          return;
        }

        if (number.length !== 10) {
          showAlert(
            'Please enter a valid 10-digit mobile number to continue',
            'warning',
          );
          return;
        }

        setStep('guestLogin');
        break;

      case 'guestLogin':
        const firstNameValidation = validateFirstName(firstName);
        const lastNameValidation = validateLastName(lastName);
        const emailValidation = validateEmail(email);
        const passwordValidation = validatePassword(password);

        setFirstNameError(firstNameValidation);
        setLastNameError(lastNameValidation);
        setEmailError(emailValidation);
        setPasswordError(passwordValidation);

        // Check for empty fields first
        if (!firstName || !lastName || !email || !password) {
          const missingFields = [];
          if (!firstName) missingFields.push('First Name');
          if (!lastName) missingFields.push('Last Name');
          if (!email) missingFields.push('Email');
          if (!password) missingFields.push('Password');
          message =
            missingFields.length === 4
              ? 'All fields are required'
              : `${missingFields.join(', ')} required`;
          showAlert(message, 'error');
          return;
        }

        // Check for validation errors (e.g., invalid format)
        if (
          firstNameValidation ||
          lastNameValidation ||
          emailValidation ||
          passwordValidation
        ) {
          message = [
            firstNameValidation,
            lastNameValidation,
            emailValidation,
            passwordValidation,
          ]
            .filter(error => error)
            .join('\n');
          showAlert(message.trim(), 'error');
          return;
        }

        try {
          setLoading(true);
          const body = {
            firstName,
            lastName,
            email,
            password,
            goal,
            profession,
            gender: selectedGender,
            country,
            phoneNumber: number,
            dateOfBirth,
            deviceToken: token,
            isDemoClient: true,
          };

          const response = await guestLogin(body);

          if (response?.data?.message === 'Signup successful') {
            setLoading(false);
            const storeTokenId = {
              token: response?.data?.token,
              id: response?.data?.userData?._id,
              demoClient: response?.data?.userData?.isDemoClient,
            };
            showAlert('Signup successful', 'success');
            dispatch(setGuestToken(storeTokenId));
            dispatch(guestLoginData(response?.data));
            // Optionally navigate to another screen
            // navigation.navigate('Home');
          } else if (response?.data?.message === 'Signin successful') {
            setLoading(false);
            showAlert('User already exists', 'error');
          } else if (response?.data === undefined) {
            setLoading(false);
            showAlert('Email already exists', 'error');
          }
        } catch (err) {
          setLoading(false);
          showAlert('Network error, please try again.', 'error');
        }
        break;

      default:
        break;
    }
  };

  const handleBack = () => {
    switch (step) {
      case 'selectGender':
        navigation.goBack();
        break;
      case 'selectProfession':
        setStep('selectGender');
        break;
      case 'selectCountry':
        setStep('selectProfession');
        break;
      case 'guestLogin':
        setStep('selectCountry');
        break;
      default:
        break;
    }
  };

  const renderHeader = () => {
    switch (step) {
      case 'selectGender':
        return (
          <Animated.View
            style={[
              styles.headerContainer,
              {transform: [{translateY: headerImageAnim}]},
            ]}>
            <LoginHeaderGender
              height={'100%'}
              width={'100%'}
              style={styles.headerImage}
            />
          </Animated.View>
        );
      case 'selectProfession':
        return (
          <Animated.View
            style={[
              styles.headerContainer,
              {transform: [{translateY: headerImageAnim}]},
            ]}>
            <LoginHeaderProfession
              height={'100%'}
              width={'100%'}
              style={styles.headerImage}
            />
          </Animated.View>
        );
      case 'selectCountry':
        return (
          <Animated.View
            style={[
              styles.headerContainer,
              {transform: [{translateY: headerImageAnim}]},
            ]}>
            <LoginHeaderCountry
              height={'100%'}
              width={'100%'}
              style={styles.headerImage}
            />
          </Animated.View>
        );
      case 'guestLogin':
        return (
          <Animated.View
            style={[
              styles.headerContainer,
              {transform: [{translateY: headerImageAnim}]},
            ]}>
            <LoginHeaderGuest
              height={'100%'}
              width={'100%'}
              style={styles.headerImage}
            />
          </Animated.View>
        );
      default:
        return null;
    }
  };

  const renderContent = () => {
    const contentStyle = {
      opacity: contentAnim,
      transform: [
        {
          translateY: contentAnim.interpolate({
            inputRange: [0, 1],
            outputRange: [20, 0], // Slide up from 20px below to its original position
          }),
        },
      ],
    };

    switch (step) {
      case 'selectGender':
        return (
          <Animated.View style={[styles.formContainer, contentStyle]}>
            <Text style={styles.title}>Hi</Text>
            <Text style={[styles.titleText, {fontFamily: Font.PoppinsMedium}]}>
              Select Gender
            </Text>
            <Text style={[styles.titleText, {fontSize: scale(12)}]}>
              Please select your gender to continue
            </Text>
            <View style={styles.selectionContainer}>
              {genderOptions.map(item => (
                <View key={item.id} style={{width: '48%'}}>
                  <CustomShadow>
                    <View style={styles.selectionView}>
                      <TouchableOpacity
                        style={[
                          styles.option,
                          selectedGender === item.id && styles.selected,
                        ]}
                        onPress={() => setSelectedGender(item.id)}>
                        <View
                          style={[
                            styles.iconContainer,
                            {
                              backgroundColor:
                                selectedGender === item.id
                                  ? Color.white
                                  : Color.primaryColor,
                            },
                          ]}>
                          <FontAwesome5
                            name={item.icon}
                            color={
                              selectedGender === item.id
                                ? Color.primaryColor
                                : Color.white
                            }
                            size={26}
                          />
                        </View>
                        <Text
                          style={[
                            styles.titleText,
                            {fontSize: scale(13)},
                            selectedGender === item.id && {color: Color.white},
                          ]}>
                          {item.label}
                        </Text>
                      </TouchableOpacity>
                    </View>
                  </CustomShadow>
                </View>
              ))}
            </View>
          </Animated.View>
        );

      case 'selectProfession':
        return (
          <Animated.View style={[styles.formContainer, contentStyle]}>
            <Text style={[styles.titleText, {marginBottom: verticalScale(5)}]}>
              What is your profession
            </Text>
            <CustomShadow>
              <View style={styles.optionsGrid}>
                {professions.map(item => (
                  <TouchableOpacity
                    key={item.id}
                    style={[
                      styles.optionButton,
                      profession === item.id && styles.selectedButton,
                    ]}
                    onPress={() => setProfession(item.id)}>
                    <Text
                      style={[
                        styles.optionText,
                        profession === item.id && styles.selectedText,
                      ]}>
                      {item.icon(item.id)} {item.label}
                    </Text>
                  </TouchableOpacity>
                ))}
              </View>
            </CustomShadow>
            <Text
              style={[
                styles.titleText,
                {marginBottom: verticalScale(5), marginTop: verticalScale(10)},
              ]}>
              What is your Goal
            </Text>
            <CustomShadow>
              <View style={styles.optionsGrid}>
                {goals.map(item => (
                  <TouchableOpacity
                    key={item.id}
                    style={[
                      styles.optionButton,
                      goal === item.id && styles.selectedButton,
                    ]}
                    onPress={() => setGoal(item.id)}>
                    <Text
                      style={[
                        styles.optionText,
                        goal === item.id && styles.selectedText,
                      ]}>
                      {item.label}
                    </Text>
                  </TouchableOpacity>
                ))}
              </View>
            </CustomShadow>
          </Animated.View>
        );

      case 'selectCountry':
        return (
          <Animated.View style={[styles.formContainer, contentStyle]}>
            <CustomeDropDown
              items={countries}
              inputStyle={{width: '100%', marginVertical: scale(6)}}
              selectedItem={country || 'Select country'}
              onSelect={item => setCountry(item)}
              textStyle={!country ? {color: Color.textColor} : {}}
            />
            <CustomShadow
              color={hasNumberError ? 'rgba(255,0,0,0.3)' : Color.primaryColor}>
              <View style={styles.inputContainer}>
                {country && (
                  <Text style={[styles.inputText, styles.countryCode]}>
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
                  style={[styles.inputText, {flex: 1}]}
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
                    styles.inputText,
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
          </Animated.View>
        );

      case 'guestLogin':
        return (
          <Animated.View style={[styles.formContainer, contentStyle]}>
            <CustomShadow
              color={firstNameError ? 'rgba(255,0,0,0.3)' : undefined}>
              <View style={styles.shadowView}>
                <TextInput
                  value={firstName}
                  placeholder="First Name"
                  onChangeText={handleFirstNameChange}
                  placeholderTextColor={Color.textColor}
                  style={styles.inputText}
                />
              </View>
            </CustomShadow>
            <CustomShadow
              color={lastNameError ? 'rgba(255,0,0,0.3)' : undefined}>
              <View style={styles.shadowView}>
                <TextInput
                  value={lastName}
                  placeholder="Last Name"
                  onChangeText={handleLastNameChange}
                  placeholderTextColor={Color.textColor}
                  style={styles.inputText}
                />
              </View>
            </CustomShadow>
            <CustomShadow color={emailError ? 'rgba(255,0,0,0.3)' : undefined}>
              <View style={styles.shadowView}>
                <TextInput
                  value={email}
                  placeholder="Email"
                  onChangeText={handleEmailChange}
                  placeholderTextColor={Color.textColor}
                  style={styles.inputText}
                />
              </View>
            </CustomShadow>
            <CustomShadow
              color={passwordError ? 'rgba(255,0,0,0.3)' : undefined}>
              <View style={styles.shadowView}>
                <TextInput
                  value={password}
                  placeholder="Password"
                  onChangeText={handlePasswordChange}
                  placeholderTextColor={Color.textColor}
                  style={styles.inputText}
                  secureTextEntry={!passwordVisible}
                />
                <TouchableOpacity
                  onPress={() => setPasswordVisible(!passwordVisible)}
                  style={styles.eyeIconContainer}>
                  <Ionicons
                    name={passwordVisible ? 'eye-off-outline' : 'eye-outline'}
                    color={Color.primaryColor}
                    size={24}
                  />
                </TouchableOpacity>
              </View>
            </CustomShadow>
          </Animated.View>
        );

      default:
        return null;
    }
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
      {loading ? (
        <View style={{flex: 1, justifyContent: 'center', alignItems: 'center'}}>
          <CustomLoader />
        </View>
      ) : (
        <KeyboardAvoidingView
          style={{flex: 1}}
          behavior={Platform.OS === 'ios' ? 'padding' : undefined}>
          <GuestFlowHeader currentStep={step} />
          <ScrollView
            showsVerticalScrollIndicator={false}
            contentContainerStyle={{
              flexGrow: 1,
              paddingBottom: verticalScale(210),
            }}
            keyboardShouldPersistTaps="handled">
            <TouchableOpacity style={styles.backButton} onPress={handleBack}>
              <FontAwesome6
                name="arrow-left"
                size={22}
                color={Color.primaryColor}
              />
            </TouchableOpacity>
            {renderHeader()}
            {renderContent()}
            <View style={styles.buttonContainer}>
              <TouchableOpacity style={styles.button} onPress={handleNext}>
                <FontAwesome6
                  name="arrow-right"
                  size={22}
                  color={Color.white}
                />
              </TouchableOpacity>
            </View>
          </ScrollView>
        </KeyboardAvoidingView>
      )}
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: Color.white,
  },
  backButton: {
    padding: scale(8),
  },
  headerContainer: {
    width: '100%',
    height: '60%',
    overflow: 'hidden',
  },
  headerImage: {
    alignSelf: 'center',
  },
  formContainer: {
    paddingHorizontal: scale(8),
    marginVertical: verticalScale(20),
  },
  title: {
    fontSize: scale(24),
    color: Color.primaryColor,
    letterSpacing: 1,
    fontFamily: Font.PoppinsMedium,
  },
  titleText: {
    fontSize: scale(16),
    color: Color.textColor,
    letterSpacing: 1,
    fontFamily: Font.Poppins,
  },
  inputText: {
    letterSpacing: 1,
    fontFamily: Font.PoppinsMedium,
    color: Color.textColor,
    paddingVertical: scale(5),
  },
  selectionView: {
    backgroundColor: Color.white,
    borderRadius: scale(8),
  },
  selectionContainer: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    width: '100%',
    marginTop: verticalScale(15),
    alignItems: 'center',
  },
  option: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingVertical: verticalScale(12),
    paddingHorizontal: scale(12),
    borderRadius: scale(7),
    borderColor: Color.primaryColor,
  },
  selected: {
    borderColor: Color.primaryColor,
    backgroundColor: Color.primaryColor,
  },
  iconContainer: {
    width: scale(44),
    height: scale(44),
    borderRadius: scale(30),
    justifyContent: 'center',
    alignItems: 'center',
    marginRight: scale(10),
  },
  optionsGrid: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    justifyContent: 'space-between',
  },
  optionButton: {
    width: '48%',
    borderRadius: scale(6),
    padding: scale(4),
    marginBottom: verticalScale(12),
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: Color.white,
  },
  selectedButton: {
    backgroundColor: Color.primaryColor,
    borderColor: Color.primaryColor,
  },
  optionText: {
    fontWeight: '500',
    fontSize: scale(14),
    color: Color.primaryColor,
    letterSpacing: -0.24,
    fontFamily: Font.Poppins,
    marginTop: scale(4),
  },
  selectedText: {
    fontWeight: '500',
    fontSize: scale(14),
    color: Color.white,
    letterSpacing: -0.24,
    fontFamily: Font.Poppins,
    marginTop: scale(4),
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
    marginVertical: verticalScale(6),
  },
  shadowView: {
    backgroundColor: Color.white,
    borderRadius: scale(8),
    marginVertical: verticalScale(6),
    paddingHorizontal: scale(5),
    paddingVertical: verticalScale(5),
  },
  buttonContainer: {
    justifyContent: 'center',
    alignSelf: 'flex-end',
    margin: scale(8),
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
  eyeIconContainer: {
    position: 'absolute',
    right: scale(8),
    top: scale(10),
  },
  countryCode: {
    marginRight: scale(5),
    color: Color.primaryColor,
    fontFamily: Font.PoppinsMedium,
  },
});

export default GuestLoginScreen;
