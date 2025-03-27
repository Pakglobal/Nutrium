import React, {useEffect, useState} from 'react';
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
  KeyboardAvoidingView,
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
import {useDispatch, useSelector} from 'react-redux';
import {loginData} from '../../redux/user';

const InformationScreen = () => {
  const navigation = useNavigation();
  const dispatch = useDispatch();

  const userData = useSelector(state => state?.user?.userInfo);
  const userName = userData?.name;

  const [loading, setLoading] = useState(false);
  const [isFormValid, setIsFormValid] = useState(false);

  const [genderDropdownVisible, setGenderDropdownVisible] = useState(false);
  const [countryDropdownVisible, setCountryDropdownVisible] = useState(false);
  const [professionDropdownVisible, setProfessionDropdownVisible] =
    useState(false);
  const [expertiseDropdownVisible, setExpertiseDropdownVisible] =
    useState(false);
  const [goalsDropdownVisible, setGoalsDropdownVisible] = useState(false);
  const [workspaceDropdownVisible, setWorkspaceDropdownVisible] =
    useState(false);

  const [selectedGender, setSelectedGender] = useState('');
  const [selectedCountry, setSelectedCountry] = useState('');
  const [selectedProfession, setSelectedProfession] = useState('');
  const [selectedExpertise, setSelectedExpertise] = useState([]);
  const [selectedGoals, setSelectedGoals] = useState('');
  const [selectedWorkspace, setSelectedWorkspace] = useState('');

  const [mobileNo, setMobileNo] = useState('');
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

  const handleLogin = () => {
    if (userData?.role === 'Guest') {
      navigation.navigate('BottomNavigation');
    }
  };

  const validateForm = () => {
    const isValid =
      selectedGender &&
      selectedCountry &&
      mobileNo &&
      selectedProfession &&
      selectedGoals &&
      selectedWorkspace &&
      selectedExpertise.length > 0;
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
      <View>
        <Text style={styles.dropdownLabel}>{label}</Text>
        <TouchableOpacity
          style={styles.dropdownContainer}
          onPress={() => setVisible(true)}>
          <View
            style={[
              styles.dropdownSelector,
              !selectedValue && styles.placeholderStyle,
            ]}>
            <Text
              style={[
                styles.dropdownText,
                !selectedValue && styles.placeholderText,
              ]}>
              {multiple
                ? selectedValue.length > 0
                  ? selectedValue
                      .map(sel => options.find(o => o?.value === sel)?.label)
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
              colors={['#FFFFFF', '#F6F6F6']}
              style={styles.modalContainer}>
              <View style={styles.modalHeader}>
                <Text style={styles.modalTitle}>{label}</Text>
                <TouchableOpacity
                  onPress={() => setVisible(false)}
                  hitSlop={{top: 20, bottom: 20, left: 20, right: 20}}>
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
                showsVerticalScrollIndicator={false}
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
      </View>
    );
  };

  const CustomInput = ({
    label,
    value,
    onChangeText,
    placeholder,
    keyboardType = 'numeric',
  }) => (
    <View style={styles.inputContainer}>
      <Text style={styles.inputLabel}>{label}</Text>
      <View
        style={[
          styles.inputWrapper,
          {paddingVertical: verticalScale(0), height: verticalScale(34)},
        ]}>
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
    <SafeAreaView style={{flex: 1, backgroundColor: Color.primary}}>
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

          {/* <CustomInput
            label="Mobile Number"
            value={mobileNo}
            onChangeText={e => setMobileNo(e)}
            placeholder="Enter your mobile number"
            keyboardType="numeric"
          /> */}

          <CustomInput
            label="Mobile Number"
            value={mobileNo}
            onChangeText={text => {
              setMobileNo(text);
              setTimeout(() => validateForm(), 100); // Delay to prevent keyboard closing
            }}
            placeholder="Enter your mobile number"
            keyboardType="numeric"
          />

          <CustomDropdown
            label="Profession"
            options={professionOptions}
            visible={professionDropdownVisible}
            setVisible={setProfessionDropdownVisible}
            selectedValue={selectedProfession}
            setSelectedValue={setSelectedProfession}
          />

          <CustomDropdown
            label="Your Goals"
            options={goalsOptions}
            visible={goalsDropdownVisible}
            setVisible={setGoalsDropdownVisible}
            selectedValue={selectedGoals}
            setSelectedValue={setSelectedGoals}
          />

          <Text style={styles.inputLabel}>Date of Birth</Text>
          <TouchableOpacity
            style={styles.datePickerContainer}
            onPress={() => setDatePickerOpen(true)}>
            <View style={styles.inputWrapper}>
              <Ionicons
                name="calendar"
                size={20}
                color={Color.secondary}
                style={styles.dateIcon}
              />
              <Text style={styles.dateText}>
                {dateOfBirth.toLocaleDateString()}
              </Text>
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

          <CustomDropdown
            label="Workspace"
            options={workspaceOptions}
            visible={workspaceDropdownVisible}
            setVisible={setWorkspaceDropdownVisible}
            selectedValue={selectedWorkspace}
            setSelectedValue={setSelectedWorkspace}
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
            style={[
              styles.continueButton,
              !isFormValid && styles.disabledButton,
            ]}>
            {loading ? (
              <ActivityIndicator size="small" color={Color.primary} />
            ) : (
              <View style={styles.buttonContent}>
                <Text style={styles.continueButtonText}>Continue</Text>
                <AntDesign name="arrowright" color={Color.primary} size={20} />
              </View>
            )}
          </TouchableOpacity>
        </View>
      </ScrollView>
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  placeholderStyle: {
    borderColor: '#E0E0E0',
    backgroundColor: Color.primary,
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
    opacity: 0.5,
  },
  container: {
    flex: 1,
    backgroundColor: Color.primary,
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
  },
  formContainer: {
    paddingBottom: verticalScale(30),
    backgroundColor: Color.primary,
  },
  dropdownContainer: {
    marginBottom: verticalScale(15),
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
  },
  dropdownText: {
    fontSize: scale(12),
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
    fontSize: scale(15),
    fontWeight: 'bold',
    color: Color.black,
  },
  dropdownItem: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingVertical: verticalScale(12),
    paddingHorizontal: scale(15),
    borderBottomWidth: 1,
    borderBottomColor: '#E0E0E0',
  },
  dropdownItemText: {
    fontSize: scale(12),
    color: Color.black,
  },
  doneButton: {
    backgroundColor: Color.secondary,
    paddingVertical: verticalScale(15),
    alignItems: 'center',
  },
  doneButtonText: {
    color: Color.primary,
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
    paddingVertical: verticalScale(8),
    paddingHorizontal: scale(12),
  },
  input: {
    flex: 1,
    fontSize: scale(12),
    color: Color.black,
  },
  datePickerContainer: {
    marginBottom: verticalScale(15),
  },
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
    color: Color.primary,
    fontSize: scale(16),
    fontWeight: 'bold',
    marginRight: scale(10),
  },
  selectedItem: {
    backgroundColor: '#F0F0F0',
  },
  checkboxContainer: {
    width: 24,
    height: 24,
    borderWidth: 2,
    borderColor: Color.gray,
    borderRadius: 4,
    justifyContent: 'center',
    alignItems: 'center',
  },
  selectedCheckbox: {
    backgroundColor: Color.secondary,
    borderColor: Color.secondary,
  },
});

export default InformationScreen;
