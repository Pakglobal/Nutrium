import {useFocusEffect, useNavigation} from '@react-navigation/native';
import React, {useState, useCallback, useMemo} from 'react';
import {
  StyleSheet,
  Text,
  View,
  TextInput,
  ScrollView,
  TouchableOpacity,
  SafeAreaView,
  ActivityIndicator,
} from 'react-native';
import DatePicker from 'react-native-date-picker';
import InviteFriendsModal from './InviteFriendsModal';
import {useSelector} from 'react-redux';
import {
  createChallenge,
  getChallengeRange,
  getChallengeType,
} from '../../../Apis/ClientApis/ChallengesApi';
import CustomAlertBox from '../../../Components/CustomAlertBox';
import {Color} from '../../../assets/styles/Colors';
import {Font} from '../../../assets/styles/Fonts';
import {moderateScale, scale, verticalScale} from 'react-native-size-matters';
import Header from '../../../Components/Header';
import CustomeDropDown from '../../../Components/CustomeDropDown';
import CustomShadow from '../../../Components/CustomShadow';
import {shadowStyle} from '../../../assets/styles/Shadow';
import MaterialCommunityIcons from 'react-native-vector-icons/MaterialCommunityIcons';

const MIN_DAYS_DIFFERENCE = 2;

const CreateChallenge = () => {
  const navigation = useNavigation();
  const [challengeName, setChallengeName] = useState('');
  const [challengeType, setChallengeType] = useState(null);
  const [challengeTypeId, setChallengeTypeId] = useState(null);
  const [startDate, setStartDate] = useState(new Date());
  const [endDate, setEndDate] = useState(
    new Date(new Date().getTime() + MIN_DAYS_DIFFERENCE * 24 * 60 * 60 * 1000),
  );
  const [description, setDescription] = useState('');
  const [targetGoal, setTargetGoal] = useState('');
  const [participantsLimit, setParticipantsLimit] = useState(100);
  const [coinReward, setCoinReward] = useState('');
  const [isPublic, setIsPublic] = useState(true);
  const [isDatePickerOpen, setIsDatePickerOpen] = useState(false);
  const [selectedDateField, setSelectedDateField] = useState('start');
  const [isInviteModalVisible, setInviteModalVisible] = useState(false);
  const [challengeTypeOptions, setChallengeTypeOptions] = useState([]);
  const [challengeRangeOptions, setChallengeRangeOptions] = useState([]);
  const [selectedChallengeRange, setSelectedChallengeRange] = useState(null);
  const [loading, setLoading] = useState(false);
  const [selectedFriends, setSelectedFriends] = useState([]);
  const [alertVisible, setAlertVisible] = useState(false);
  const [alertType, setAlertType] = useState('success');
  const [alertMessage, setAlertMessage] = useState('');

  const tokenId = useSelector(state => state?.user?.token);
  const guestTokenId = useSelector(state => state?.user?.guestToken);
  const token = tokenId?.token || guestTokenId?.token;
  const id = tokenId?.id || guestTokenId?.id;

  const fetchChallengeTypeData = useCallback(async () => {
    if (!token) {
      setAlertType('error');
      setAlertMessage('User authentication token is missing.');
      setAlertVisible(true);
      return;
    }
    try {
      const response = await getChallengeType(token);
      if (response?.success && Array.isArray(response.data)) {
        setChallengeTypeOptions(response.data);
      } else {
        throw new Error('Invalid challenge type data');
      }
    } catch (error) {
      console.error('Error fetching challenge types:', error);
      setAlertType('error');
      setAlertMessage('Failed to fetch challenge types. Please try again.');
      setAlertVisible(true);
    }
  }, [token]);

  useFocusEffect(
    useCallback(() => {
      setChallengeName('');
      setChallengeType(null);
      setChallengeTypeId(null);
      setStartDate(new Date());
      setEndDate(
        new Date(
          new Date().getTime() + MIN_DAYS_DIFFERENCE * 24 * 60 * 60 * 1000,
        ),
      );
      setDescription('');
      setTargetGoal('');
      setParticipantsLimit(100);
      setCoinReward('');
      setIsPublic(true);
      setIsDatePickerOpen(false);
      setSelectedDateField('start');
      setInviteModalVisible(false);
      setChallengeTypeOptions([]);
      setChallengeRangeOptions([]);
      setSelectedChallengeRange(null);
      setLoading(false);
      setSelectedFriends([]);
      setAlertVisible(false);
      setAlertType('success');
      setAlertMessage('');

      fetchChallengeTypeData();

      return () => {};
    }, [fetchChallengeTypeData]),
  );

  const isValidEndDate = (start, end) => {
    if (
      !(start instanceof Date) ||
      !(end instanceof Date) ||
      isNaN(start) ||
      isNaN(end)
    ) {
      return false;
    }
    const diffTime = end.getTime() - start.getTime();
    const diffDays = diffTime / (1000 * 3600 * 24);
    return diffDays >= MIN_DAYS_DIFFERENCE;
  };

  const showAlert = (message, type = 'error') => {
    setAlertType(type);
    setAlertMessage(message);
    setAlertVisible(true);
  };

  const validateForm = () => {
    const isAllEmpty =
      !challengeName.trim() &&
      !challengeTypeId &&
      !selectedChallengeRange?._id &&
      !description.trim() &&
      (!targetGoal || parseInt(targetGoal, 10) <= 0) &&
      (!coinReward || parseInt(coinReward, 10) <= 0);

    if (isAllEmpty) {
      showAlert('All fields are required.');
      return false;
    }

    if (!challengeName.trim()) {
      showAlert('Challenge name is required.');
      return false;
    }

    if (!challengeTypeId) {
      showAlert('Challenge type is required.');
      return false;
    }

    if (!selectedChallengeRange?._id) {
      showAlert('Challenge range is required.');
      return false;
    }

    if (!startDate || isNaN(startDate.getTime())) {
      showAlert('Valid start date is required.');
      return false;
    }

    if (!endDate || isNaN(endDate.getTime())) {
      showAlert('Valid end date is required.');
      return false;
    }

    if (!isValidEndDate(startDate, endDate)) {
      showAlert(
        `End date must be at least ${MIN_DAYS_DIFFERENCE} days after the start date.`,
      );
      return false;
    }

    if (!description.trim()) {
      showAlert('Description is required.');
      return false;
    }

    const target = parseInt(targetGoal, 10);
    if (!targetGoal || isNaN(target) || target <= 0) {
      showAlert('Valid target goal is required.');
      return false;
    }

    const limit = parseInt(participantsLimit, 10);
    if (!participantsLimit || isNaN(limit) || limit <= 0) {
      showAlert('Valid participant limit is required.');
      return false;
    }

    const reward = parseInt(coinReward, 10);
    if (!coinReward || isNaN(reward) || reward <= 0) {
      showAlert('Valid coin reward is required.');
      return false;
    }

    return true;
  };

  const handleDateConfirm = date => {
    setIsDatePickerOpen(false);
    if (!(date instanceof Date) || isNaN(date.getTime())) {
      showAlert('Invalid date selected.');
      return;
    }
    if (selectedDateField === 'start') {
      setStartDate(date);
      if (endDate <= date) {
        setEndDate(
          new Date(date.getTime() + MIN_DAYS_DIFFERENCE * 24 * 60 * 60 * 1000),
        );
      }
    } else {
      if (isValidEndDate(startDate, date)) {
        setEndDate(date);
      } else {
        showAlert(
          `End date must be at least ${MIN_DAYS_DIFFERENCE} days after the start date.`,
        );
      }
    }
  };

  const challengeData = useMemo(
    () => ({
      name: challengeName.trim(),
      type: challengeTypeId,
      description: description.trim(),
      startDate: startDate.toISOString(),
      endDate: endDate.toISOString(),
      targetValue: parseInt(targetGoal, 10),
      participationLimit: parseInt(participantsLimit, 10),
      privacy: isPublic ? 'public' : 'private',
      rewardRange: selectedChallengeRange?._id,
      selectedClients: isPublic ? [] : selectedFriends,
    }),
    [
      challengeName,
      challengeTypeId,
      description,
      startDate,
      endDate,
      targetGoal,
      participantsLimit,
      isPublic,
      selectedChallengeRange,
      selectedFriends,
    ],
  );

  const handleSubmit = async () => {
    if (!token || !id) {
      showAlert('User authentication is required to create a challenge.');
      return;
    }
    if (!validateForm()) return;
    setLoading(true);

    try {
      const response = await createChallenge(token, id, challengeData);
      showAlert(
        response?.message || 'Challenge created successfully.',
        'success',
      );
      setChallengeName('');
      setChallengeType(null);
      setChallengeTypeId(null);
      setStartDate(new Date());
      setEndDate(
        new Date(
          new Date().getTime() + MIN_DAYS_DIFFERENCE * 24 * 60 * 60 * 1000,
        ),
      );
      setDescription('');
      setTargetGoal('');
      setParticipantsLimit(100);
      setCoinReward('');
      setIsPublic(true);
      setSelectedChallengeRange(null);
      setSelectedFriends([]);
    } catch (error) {
      console.error('Create Challenge Error:', error);
      showAlert(
        error.response?.data?.message ||
          error.message ||
          'An error occurred while creating the challenge.',
      );
    } finally {
      setLoading(false);
    }
  };

  const handleSelectChallengeType = async item => {
    if (!item?._id || !item?.value) {
      showAlert('Invalid challenge type selected.');
      return;
    }

    setChallengeType(item.value);
    setChallengeTypeId(item._id);
    setChallengeRangeOptions([]);
    setSelectedChallengeRange(null);
    setCoinReward('');

    if (!token) {
      showAlert('User authentication token is missing.');
      return;
    }

    try {
      const response = await getChallengeRange(token, item._id);
      if (response?.success && Array.isArray(response.data)) {
        setChallengeRangeOptions(response.data);
      } else {
        throw new Error('Invalid challenge range data');
      }
    } catch (error) {
      console.error('Error fetching challenge range:', error);
      showAlert('Failed to fetch challenge range. Please try again.');
    }
  };

  const handleSelectChallengeRangeType = value => {
    if (!value?._id || !value?.coin) {
      showAlert('Invalid challenge range selected.');
      return;
    }
    setCoinReward(String(value.coin));
    setSelectedChallengeRange(value);
  };

  return (
    <SafeAreaView style={styles.mainContainer}>
      <CustomAlertBox
        visible={alertVisible}
        type={alertType}
        message={alertMessage}
        closeAlert={() => setAlertVisible(false)}
        onClose={() => {
          setAlertVisible(false);
          if (alertType === 'success' && navigation.canGoBack()) {
            navigation.goBack();
          }
        }}
      />
      <Header screenheader={true} screenName={'Create Challenge'} />
      <ScrollView
        style={styles.container}
        keyboardShouldPersistTaps="handled"
        showsVerticalScrollIndicator={false}>
        <Text style={styles.header}>Create Challenge</Text>

        <Text style={styles.nameText}>Challenge Name</Text>
        <CustomShadow radius={1} style={shadowStyle}>
          <TextInput
            style={styles.input}
            placeholder="Enter challenge name"
            placeholderTextColor={Color.black}
            value={challengeName}
            onChangeText={setChallengeName}
            accessibilityLabel="Challenge name input"
            returnKeyType="next"
          />
        </CustomShadow>

        <Text style={styles.nameText}>Challenge Type</Text>
        <CustomeDropDown
          items={challengeTypeOptions}
          selectedItem={challengeType || 'Select Challenge'}
          onSelect={handleSelectChallengeType}
          textStyle={!challengeType ? {color: Color.textColor} : {}}
          shadowRadius={1}
          accessibilityLabel="Challenge type dropdown"
        />

        <Text style={styles.nameText}>Challenge Range</Text>
        <CustomeDropDown
          items={challengeRangeOptions}
          selectedItem={selectedChallengeRange?.value || 'Select Range'}
          onSelect={handleSelectChallengeRangeType}
          textStyle={
            !selectedChallengeRange?.value ? {color: Color.textColor} : {}
          }
          shadowRadius={1}
          accessibilityLabel="Challenge range dropdown"
        />

        <Text style={styles.nameText}>Coin Reward</Text>
        <CustomShadow radius={1} style={shadowStyle}>
          <View style={[styles.input, {justifyContent: 'center'}]}>
            <Text style={{color: Color.black, fontFamily: Font.Poppins}}>
              {coinReward || 'N/A'}
            </Text>
          </View>
        </CustomShadow>

        <View style={{flexDirection: 'row', justifyContent: 'space-between'}}>
          <View style={{width: '48%'}}>
            <Text style={styles.nameText}>Select Start Date</Text>
            <CustomShadow radius={1} style={shadowStyle}>
              <TouchableOpacity
                activeOpacity={0.7}
                style={[
                  styles.input,
                  {
                    flexDirection: 'row',
                    alignItems: 'center',
                    justifyContent: 'space-between',
                  },
                ]}
                onPress={() => {
                  setSelectedDateField('start');
                  setIsDatePickerOpen(true);
                }}
                accessibilityLabel="Select start date"
                accessibilityRole="button">
                <Text style={{color: Color.black, fontFamily: Font.Poppins}}>
                  {startDate && !isNaN(startDate.getTime())
                    ? startDate.toLocaleDateString()
                    : 'Start Date'}
                </Text>
                <MaterialCommunityIcons
                  name="calendar-month"
                  color={Color.primaryColor}
                  size={scale(20)}
                />
              </TouchableOpacity>
            </CustomShadow>
          </View>
          <View style={{width: '48%'}}>
            <Text style={styles.nameText}>Select End Date</Text>
            <CustomShadow radius={1} style={shadowStyle}>
              <TouchableOpacity
                activeOpacity={0.7}
                style={[
                  styles.input,
                  {
                    flexDirection: 'row',
                    alignItems: 'center',
                    justifyContent: 'space-between',
                  },
                ]}
                onPress={() => {
                  setSelectedDateField('end');
                  setIsDatePickerOpen(true);
                }}
                accessibilityLabel="Select end date"
                accessibilityRole="button">
                <Text style={{color: Color.black, fontFamily: Font.Poppins}}>
                  {endDate && !isNaN(endDate.getTime())
                    ? endDate.toLocaleDateString()
                    : 'End Date'}
                </Text>
                <MaterialCommunityIcons
                  name="calendar-month"
                  color={Color.primaryColor}
                  size={scale(20)}
                />
              </TouchableOpacity>
            </CustomShadow>
          </View>
        </View>

        <DatePicker
          modal
          mode="date"
          open={isDatePickerOpen}
          date={selectedDateField === 'start' ? startDate : endDate}
          minimumDate={new Date()}
          onConfirm={handleDateConfirm}
          onCancel={() => setIsDatePickerOpen(false)}
          accessibilityLabel="Date picker"
        />

        <Text style={styles.nameText}>Challenge Description</Text>
        <CustomShadow style={shadowStyle} radius={1}>
          <TextInput
            style={[
              styles.input,
              {height: verticalScale(60), textAlignVertical: 'top'},
            ]}
            placeholder="Enter description"
            placeholderTextColor={Color.black}
            value={description}
            onChangeText={setDescription}
            multiline
            accessibilityLabel="Challenge description input"
            returnKeyType="done"
          />
        </CustomShadow>

        <Text style={styles.nameText}>
          Target Goal ({challengeType || 'N/A'})
        </Text>
        <CustomShadow style={shadowStyle} radius={1}>
          <TextInput
            style={styles.input}
            placeholder={`Enter target goal for ${
              challengeType || 'challenge'
            }`}
            keyboardType="numeric"
            placeholderTextColor={Color.black}
            value={targetGoal}
            onChangeText={setTargetGoal}
            accessibilityLabel="Target goal input"
            returnKeyType="next"
          />
        </CustomShadow>

        <Text style={styles.nameText}>Participants Limit</Text>
        <CustomShadow style={shadowStyle} radius={1}>
          <TextInput
            style={styles.input}
            placeholder="Enter participant limit"
            keyboardType="numeric"
            value={participantsLimit.toString()}
            onChangeText={text => setParticipantsLimit(parseInt(text) || 1)}
            accessibilityLabel="Participants limit input"
            returnKeyType="done"
          />
        </CustomShadow>

        <View style={styles.radioGroup}>
          <Text style={styles.radioText}>Privacy</Text>
          <TouchableOpacity
            style={styles.radioContainer}
            onPress={() => setIsPublic(true)}
            accessibilityLabel="Public challenge option"
            accessibilityRole="radio"
            accessibilityState={{checked: isPublic}}>
            <MaterialCommunityIcons
              name={isPublic ? 'radiobox-marked' : 'radiobox-blank'}
              color={isPublic ? Color.primaryColor : Color.gray}
              size={scale(20)}
              style={{marginHorizontal: scale(5)}}
            />
            <Text style={styles.radioText}>Public</Text>
          </TouchableOpacity>

          <TouchableOpacity
            style={styles.radioContainer}
            onPress={() => setIsPublic(false)}
            accessibilityLabel="Private challenge option"
            accessibilityRole="radio"
            accessibilityState={{checked: !isPublic}}>
            <MaterialCommunityIcons
              name={!isPublic ? 'radiobox-marked' : 'radiobox-blank'}
              color={!isPublic ? Color.primaryColor : Color.gray}
              size={scale(20)}
              style={{marginHorizontal: scale(5)}}
            />
            <Text style={styles.radioText}>Private</Text>
          </TouchableOpacity>
        </View>

        {!isPublic && (
          <TouchableOpacity
            style={[
              styles.button,
              {
                marginBottom: verticalScale(10),
                backgroundColor: Color.white,
                borderWidth: scale(1),
                borderColor: Color.primaryColor,
              },
            ]}
            onPress={() => setInviteModalVisible(true)}
            accessibilityLabel="Invite friends button"
            accessibilityRole="button">
            <Text
              style={[
                styles.buttonText,
                {
                  color: Color.primaryColor,
                },
              ]}>
              Invite{' '}
              {selectedFriends?.length > 0 ? `(${selectedFriends.length})` : ''}
            </Text>
          </TouchableOpacity>
        )}

        <TouchableOpacity
          onPress={handleSubmit}
          disabled={loading}
          style={styles.button}
          accessibilityLabel="Create challenge button"
          accessibilityRole="button"
          accessibilityState={{disabled: loading}}>
          {loading ? (
            <ActivityIndicator size="small" color={Color.white} />
          ) : (
            <Text style={styles.buttonText}>Create Challenge</Text>
          )}
        </TouchableOpacity>

        <InviteFriendsModal
          onClose={() => setInviteModalVisible(false)}
          isInviteModalVisible={isInviteModalVisible}
          setInviteModalVisible={setInviteModalVisible}
          onInvite={friends => {
            setSelectedFriends(friends || []);
            setInviteModalVisible(false);
          }}
        />
      </ScrollView>
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  mainContainer: {
    backgroundColor: Color.white,
    flex: 1,
  },
  container: {
    paddingHorizontal: scale(8),
  },
  header: {
    fontSize: moderateScale(20),
    fontWeight: '500',
    textAlign: 'center',
    marginTop: verticalScale(18),
    color: Color.textColor,
    fontFamily: Font.PoppinsMedium,
  },
  input: {
    height: verticalScale(36),
    backgroundColor: Color.white,
    paddingHorizontal: scale(10),
    paddingVertical: verticalScale(5),
    fontSize: moderateScale(14),
    fontFamily: Font.Poppins,
    color: Color.black,
    width: '98%',
    alignSelf: 'center',
    borderRadius: scale(6),
  },
  button: {
    backgroundColor: Color.primaryColor,
    marginBottom: verticalScale(15),
    borderColor: Color.red,
    borderRadius: scale(6),
    alignItems: 'center',
    justifyContent: 'center',
    height: scale(43),
  },
  buttonText: {
    color: Color.white,
    fontSize: moderateScale(16),
    fontFamily: Font.PoppinsSemiBold,
  },
  nameText: {
    fontFamily: Font.Poppins,
    color: Color.textColor,
    paddingHorizontal: scale(4),
    paddingVertical: verticalScale(5),
    marginTop: verticalScale(9),
    fontSize: moderateScale(14),
  },
  radioGroup: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: verticalScale(30),
    paddingHorizontal: scale(4),
    marginTop: verticalScale(10),
    gap: scale(20),
  },
  radioContainer: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  radioText: {
    fontFamily: Font.Poppins,
    color: Color.textColor,
    fontSize: moderateScale(14),
    marginTop: verticalScale(2),
  },
});
export default CreateChallenge;
