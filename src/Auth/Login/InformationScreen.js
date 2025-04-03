import React, {useEffect, useState, useRef} from 'react';
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
  Animated,
  TouchableWithoutFeedback,
  Keyboard,
} from 'react-native';
import {scale, verticalScale} from 'react-native-size-matters';
import AntDesign from 'react-native-vector-icons/AntDesign';
import Ionicons from 'react-native-vector-icons/Ionicons';
import NutriumLogo from '../../assets/Icon/NutriumLogo.svg';
import Color from '../../assets/colors/Colors';
import {CommonActions, useNavigation} from '@react-navigation/native';
import DatePicker from 'react-native-date-picker';
import {useDispatch, useSelector} from 'react-redux';
import {setIsGuest} from '../../redux/user';

const InformationScreen = () => {
  const navigation = useNavigation();
  const dispatch = useDispatch();

  const userData = useSelector(state => state?.user?.userInfo);
  const userName = userData?.name;

  const [loading, setLoading] = useState(false);
  const [isFormValid, setIsFormValid] = useState(false);

  const [activeDropdown, setActiveDropdown] = useState(null);
  const [selectedGender, setSelectedGender] = useState('');
  const [selectedCountry, setSelectedCountry] = useState('');
  const [selectedProfession, setSelectedProfession] = useState('');
  const [selectedExpertise, setSelectedExpertise] = useState('');
  const [selectedGoals, setSelectedGoals] = useState('');
  const [selectedWorkspace, setSelectedWorkspace] = useState('');

  const [mobileNo, setMobileNo] = useState('');
  const [dateOfBirth, setDateOfBirth] = useState(new Date());
  const [datePickerOpen, setDatePickerOpen] = useState(false);
  const [mobileError, setMobileError] = useState('');

  const dropdownAnim = useRef(new Animated.Value(0)).current;

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

  const goalsOptions = [
    {label: 'Weight Loss', value: 'weight_loss'},
    {label: 'Muscle Gain', value: 'muscle_gain'},
    {label: 'Improve Fitness', value: 'fitness_improvement'},
    {label: 'Athletic Performance', value: 'athletic_performance'},
    {label: 'Nutrition Optimization', value: 'nutrition_optimization'},
  ];

  const workspaceOptions = [
    {label: 'Home', value: 'home'},
    {label: 'Gym', value: 'gym'},
    {label: 'Office', value: 'office'},
    {label: 'Outdoors', value: 'outdoors'},
    {label: 'Online', value: 'online'},
  ];

  const handleLogin = async () => {
    if (isFormValid) {
      const userData = {
        gender: selectedGender,
        country: selectedCountry,
        mobileNo,
        profession: selectedProfession,
        goals: selectedGoals,
        dateOfBirth,
        workspace: selectedWorkspace,
        expertise: selectedExpertise,
      };

      dispatch(setIsGuest(true));
      navigation.navigate('BottomNavigation');
    }
  };

  const validateForm = () => {
    const isMobileValid = mobileNo.length === 10;
    const isValid =
      selectedGender &&
      selectedCountry &&
      isMobileValid &&
      selectedProfession &&
      selectedGoals &&
      selectedWorkspace &&
      selectedExpertise;
    setIsFormValid(isValid);
  };

  useEffect(() => {
    validateForm();
  }, [
    selectedGender,
    selectedCountry,
    mobileNo,
    selectedProfession,
    selectedGoals,
    selectedWorkspace,
    selectedExpertise,
  ]);

  const handleMobileError = value => {
    const numericValue = value.replace(/[^0-9]/g, '');

    setMobileNo(numericValue);

    let mobileError = '';

    if (numericValue.length < 10 && numericValue.length > 0) {
      mobileError = 'Mobile number must be 10 digits';
    } else if (numericValue.length > 10) {
      mobileError = 'Mobile number cannot exceed 10 digits';
    }

    setMobileError(mobileError);
  };

  const toggleDropdown = dropdownName => {
    if (activeDropdown === dropdownName) {
      closeDropdown();
    } else {
      Keyboard.dismiss();
      setActiveDropdown(dropdownName);
      Animated.timing(dropdownAnim, {
        toValue: 1,
        duration: 200,
        useNativeDriver: true,
      }).start();
    }
  };

  const closeDropdown = () => {
    Animated.timing(dropdownAnim, {
      toValue: 0,
      duration: 200,
      useNativeDriver: true,
    }).start(() => {
      setActiveDropdown(null);
    });
  };

  const handleOptionSelect = (value, setter) => {
    setter(value);
    closeDropdown();
    validateForm();
  };

  const CustomDropdown = ({
    label,
    options,
    selectedValue,
    setSelectedValue,
    dropdownName,
  }) => {
    const isActive = activeDropdown === dropdownName;

    return (
      <View>
        <Text style={styles.dropdownLabel}>{label}</Text>
        <TouchableOpacity
          style={[
            styles.dropdownContainer,
            isActive && styles.activeDropdownContainer,
          ]}
          onPress={() => toggleDropdown(dropdownName)}>
          <View
            style={[
              styles.dropdownSelector,
              !selectedValue && styles.placeholderStyle,
              isActive && styles.activeDropdownSelector,
            ]}>
            <Text
              style={[
                styles.dropdownText,
                !selectedValue && styles.placeholderText,
              ]}
              numberOfLines={1}>
              {selectedValue
                ? options.find(o => o.value === selectedValue)?.label
                : `Select ${label}`}
            </Text>
            <Ionicons
              name={isActive ? 'chevron-up' : 'chevron-down'}
              size={20}
              color={isActive ? Color.secondary : Color.gray}
            />
          </View>
        </TouchableOpacity>

        {isActive && (
          <Animated.View
            style={[
              styles.dropdownListContainer,
              {
                opacity: dropdownAnim,
                transform: [
                  {
                    translateY: dropdownAnim.interpolate({
                      inputRange: [0, 1],
                      outputRange: [-10, 0],
                    }),
                  },
                ],
              },
            ]}>
            <FlatList
              data={options}
              keyExtractor={item => item.value}
              renderItem={({item}) => (
                <TouchableOpacity
                  style={[
                    styles.dropdownItem,
                    selectedValue === item.value && styles.selectedDropdownItem,
                  ]}
                  onPress={() =>
                    handleOptionSelect(item.value, setSelectedValue)
                  }>
                  <Text style={styles.dropdownItemText}>{item.label}</Text>
                  {selectedValue === item.value && (
                    <Ionicons
                      name="checkmark"
                      size={18}
                      color={Color.secondary}
                    />
                  )}
                </TouchableOpacity>
              )}
              showsVerticalScrollIndicator={false}
              nestedScrollEnabled={true}
              keyboardShouldPersistTaps="handled"
            />
          </Animated.View>
        )}
      </View>
    );
  };

  return (
    <TouchableWithoutFeedback onPress={closeDropdown}>
      <SafeAreaView style={{flex: 1, backgroundColor: Color.white}}>
        <ScrollView
          style={styles.scrollView}
          showsVerticalScrollIndicator={false}
          keyboardShouldPersistTaps="handled">
          <TouchableOpacity
            style={{marginTop: verticalScale(15)}}
            onPress={() => navigation.goBack()}>
            <AntDesign
              name="arrowleft"
              color={Color.black}
              size={verticalScale(18)}
            />
          </TouchableOpacity>
          <View style={styles.headerContainer}>
            <NutriumLogo width={scale(200)} height={verticalScale(40)} />
            <Text style={styles.subtitleText}>
              Hi, {userName}! We need some information to personalize your
              experience.
            </Text>
          </View>

          <View style={styles.formContainer}>
            <CustomDropdown
              label="Gender"
              options={genderOptions}
              selectedValue={selectedGender}
              setSelectedValue={setSelectedGender}
              dropdownName="gender"
            />

            <CustomDropdown
              label="Country"
              options={countryOptions}
              selectedValue={selectedCountry}
              setSelectedValue={setSelectedCountry}
              dropdownName="country"
            />

            <Text style={styles.inputLabel}>Mobile Number</Text>
            <TextInput
              placeholder="Enter mobile number"
              placeholderTextColor={Color.gray}
              value={mobileNo}
              keyboardType="numeric"
              maxLength={10}
              onChangeText={handleMobileError}
              style={[
                styles.inputWrapper,
                {
                  paddingVertical: verticalScale(5),
                  marginBottom: verticalScale(15),
                  color: Color.black,
                },
              ]}
            />
            {mobileError ? (
              <Text style={styles.errorText}>{mobileError}</Text>
            ) : null}

            <CustomDropdown
              label="Profession"
              options={professionOptions}
              selectedValue={selectedProfession}
              setSelectedValue={setSelectedProfession}
              dropdownName="profession"
            />

            <CustomDropdown
              label="Your Goals"
              options={goalsOptions}
              selectedValue={selectedGoals}
              setSelectedValue={setSelectedGoals}
              dropdownName="goals"
            />

            <Text style={styles.inputLabel}>Date of Birth</Text>
            <TouchableOpacity
              style={styles.inputWrapper}
              onPress={() => {
                closeDropdown();
                setDatePickerOpen(true);
              }}>
              <Ionicons
                name="calendar"
                size={20}
                color={Color.secondary}
                style={styles.dateIcon}
              />
              <Text style={styles.dateText}>
                {dateOfBirth.toLocaleDateString()}
              </Text>
            </TouchableOpacity>
            <DatePicker
              modal
              mode="date"
              open={datePickerOpen}
              date={dateOfBirth}
              maximumDate={new Date()}
              onConfirm={date => {
                setDatePickerOpen(false);
                setDateOfBirth(date);
                validateForm();
              }}
              onCancel={() => setDatePickerOpen(false)}
            />

            <CustomDropdown
              label="Workspace"
              options={workspaceOptions}
              selectedValue={selectedWorkspace}
              setSelectedValue={setSelectedWorkspace}
              dropdownName="workspace"
            />

            <CustomDropdown
              label="Expertise"
              options={expertiseOptions}
              selectedValue={selectedExpertise}
              setSelectedValue={setSelectedExpertise}
              dropdownName="expertise"
            />

            <TouchableOpacity
              disabled={!isFormValid}
              onPress={handleLogin}
              style={[
                styles.continueButton,
                !isFormValid && styles.disabledButton,
              ]}>
              {loading ? (
                <ActivityIndicator size="small" color={Color.white} />
              ) : (
                <View style={styles.buttonContent}>
                  <Text
                    style={[
                      styles.continueButtonText,
                      !isFormValid && styles.disableText,
                    ]}>
                    Continue
                  </Text>
                  <AntDesign
                    name="arrowright"
                    color={isFormValid ? Color.white : Color.black}
                    size={20}
                  />
                </View>
              )}
            </TouchableOpacity>
          </View>
        </ScrollView>
      </SafeAreaView>
    </TouchableWithoutFeedback>
  );
};

const styles = StyleSheet.create({
  placeholderStyle: {
    borderColor: '#E0E0E0',
    backgroundColor: Color.white,
  },
  placeholderText: {
    color: Color.gray,
  },
  inputIconContainer: {
    marginRight: scale(10),
  },
  inputWithIcon: {
    flex: 1,
  },
  dateIcon: {
    marginRight: scale(10),
  },
  disabledButton: {
    backgroundColor: '#E0E0E0',
  },
  disableText: {
    color: Color.black,
  },
  container: {
    flex: 1,
    backgroundColor: Color.white,
  },
  scrollView: {
    flex: 1,
    marginHorizontal: scale(16),
  },
  headerContainer: {
    alignItems: 'center',
    paddingVertical: verticalScale(20),
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
    lineHeight: verticalScale(20),
  },
  formContainer: {
    paddingBottom: verticalScale(30),
    backgroundColor: Color.white,
  },
  dropdownContainer: {
    marginBottom: verticalScale(5),
  },
  activeDropdownContainer: {
    marginBottom: verticalScale(0),
  },
  dropdownLabel: {
    fontSize: scale(13),
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
    paddingHorizontal: scale(12),
    paddingVertical: verticalScale(8),
    marginBottom: verticalScale(8),
  },
  activeDropdownSelector: {
    borderColor: Color.secondary,
    borderBottomLeftRadius: 0,
    borderBottomRightRadius: 0,
  },
  dropdownText: {
    fontSize: scale(12),
    color: Color.black,
    flex: 1,
  },
  dropdownListContainer: {
    borderWidth: 1,
    borderTopWidth: 0,
    borderColor: Color.secondary,
    borderBottomLeftRadius: scale(10),
    borderBottomRightRadius: scale(10),
    maxHeight: verticalScale(200),
    backgroundColor: Color.white,
    marginBottom: verticalScale(15),
    elevation: 2,
    shadowColor: '#000',
    shadowOffset: {width: 0, height: 1},
    shadowOpacity: 0.1,
    shadowRadius: 2,
  },
  dropdownItem: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingVertical: verticalScale(12),
    paddingHorizontal: scale(15),
    borderBottomWidth: 1,
    borderBottomColor: '#F0F0F0',
  },
  selectedDropdownItem: {
    backgroundColor: '#F8F8F8',
  },
  dropdownItemText: {
    fontSize: scale(12),
    color: Color.black,
    flex: 1,
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
    paddingVertical: verticalScale(8),
    paddingHorizontal: scale(12),
    marginBottom: verticalScale(12),
  },
  input: {
    flex: 1,
    fontSize: scale(12),
    color: Color.black,
  },
  datePickerContainer: {},
  dateText: {
    fontSize: scale(12),
    color: Color.black,
    flex: 1,
  },
  continueButton: {
    backgroundColor: Color.secondary,
    borderRadius: scale(10),
    paddingVertical: verticalScale(12),
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
  errorText: {
    color: 'red',
    marginBottom: verticalScale(15),
    marginTop: verticalScale(-10),
    fontSize: scale(11),
  },
});

export default InformationScreen;
