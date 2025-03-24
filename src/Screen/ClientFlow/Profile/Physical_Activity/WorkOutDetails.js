import React, {useEffect, useState} from 'react';
import {
  StyleSheet,
  SafeAreaView,
  Text,
  TextInput,
  TouchableOpacity,
  View,
  ActivityIndicator,
} from 'react-native';
import {useNavigation} from '@react-navigation/native';
import {scale, verticalScale} from 'react-native-size-matters';
import Color from '../../../../assets/colors/Colors';
import BackHeader from '../../../../Components/BackHeader';
import DatePicker from 'react-native-date-picker';
import {
  SetPhysicalActivityDetails,
  SetQuickAccess,
  UpdatePhysicalActivity,
} from '../../../../Apis/ClientApis/PhysicalActivityApi';
import {useSelector} from 'react-redux';
import Toast from 'react-native-simple-toast';

const WorkOutDetails = ({route}) => {
  const showToast = message => {
    Toast.show(message, Toast.LONG, Toast.BOTTOM);
  };

  const plus = route?.params?.plus;
  const activity = plus
    ? route?.params?.name
    : route?.params?.activity?.activity;
  const defaultDuration = plus
    ? route?.params?.time || ''
    : route?.params?.activity?.time;
  const defaultDate = plus ? new Date() : route?.params?.activity?.date;

  const navigation = useNavigation();

  const getToken = useSelector(state => state?.user?.userInfo);
  const token = getToken?.token;
  const id = getToken?.userData?._id || getToken?.user?._id;
  const activityId = route?.params?.activity?.id;

  const [date, setDate] = useState(new Date(defaultDate));
  const [duration, setDuration] = useState(defaultDuration.toString());
  const [dateOpen, setDateOpen] = useState(false);
  const [calories, setCalories] = useState('0');
  const [loading, setLoading] = useState(false);
  const [errorMessage, setErrorMessage] = useState('');

  useEffect(() => {
    const calculateCalories = minutes => {
      if (!minutes || isNaN(minutes)) return '0';
      const averageCalorieBurnPerMinute = 6;
      return (parseFloat(minutes) * averageCalorieBurnPerMinute).toFixed(2);
    };

    setCalories(calculateCalories(duration));
  }, [duration]);

  const validateInput = () => {
    if (!duration || duration <= 0) {
      setErrorMessage('Please enter a valid min value');
      return false;
    }
    if (duration > 5000) {
      setErrorMessage(`weight cannot exceed 5000min`);
      return false;
    }
    setErrorMessage('');
    return true;
  };

  const handleAddActivity = async () => {
    if (!validateInput()) return;

    setLoading(true);
    try {
      const payload = {
        id: id,
        token: token,
        activity: activity,
        time: parseInt(duration),
        byactivity: calories + ' kcal',
        timeunit: 'minutes',
      };

      const response = await SetPhysicalActivityDetails(payload);

      if (
        response.message ===
          'Activity added successfully and updated in quick access' ||
        response?.success === true
      ) {
        navigation.navigate('physicalActivity');
      } else {
        showToast(response?.message);
        setLoading(false);
      }
    } catch (error) {
      showToast(error);
      setLoading(false);
    }
  };

  const handleUpdateActivity = async () => {
    setLoading(true);
    try {
      const payload = {
        clientId: id,
        activityId: activityId,
        token: token,
        time: parseInt(duration),
        timeunit: 'minutes',
        byactivity: calories + ' kcal',
        date: date,
        activity: activity,
      };

      const response = await UpdatePhysicalActivity(payload);
      if (
        response?.message === 'Activity updated successfully' ||
        response?.success === true
      ) {
        navigation.navigate('physicalActivity');
      } else {
        showToast(response?.message);
        setLoading(false);
      }
    } catch (error) {
      showToast(error);
      setLoading(false);
    }
  };

  const handleSave = () => {
    plus ? handleAddActivity() : handleUpdateActivity();
  };

  return (
    <SafeAreaView style={styles.container}>
      <BackHeader
        titleName={'Workout details'}
        backText={'Physical activity'}
        onPressBack={() => navigation.navigate('physicalActivity')}
        onPress={handleSave}
        onSave={true}
        loading={loading}
      />

      <View style={styles.content}>
        <Text style={styles.label}>Physical activity</Text>
        <View style={styles.inputContainer}>
          <TextInput
            style={styles.input}
            placeholder="Enter activity"
            value={activity}
            placeholderTextColor={Color.gray}
            editable={false}
          />
        </View>

        <Text style={styles.label}>Date</Text>
        <TouchableOpacity
          style={styles.pickerButton}
          onPress={() => setDateOpen(true)}>
          <Text style={styles.dateText}>{date.toLocaleDateString()}</Text>
        </TouchableOpacity>

        <DatePicker
          modal
          mode="date"
          open={dateOpen}
          date={date}
          onConfirm={date => {
            setDateOpen(false);
            setDate(date);
          }}
          onCancel={() => {
            setDateOpen(false);
          }}
        />

        <View>
          <Text style={styles.label}>Duration</Text>
          <View style={styles.inputContainer}>
            <TextInput
              style={styles.input}
              placeholder="Enter duration"
              keyboardType="numeric"
              value={duration}
              onChangeText={setDuration}
              placeholderTextColor={Color.black}
            />
            <Text style={styles.unit}>min</Text>
          </View>
          {errorMessage ? (
            <Text style={styles.error}>{errorMessage}</Text>
          ) : null}
        </View>

        <Text style={styles.label}>Energy</Text>
        <View style={styles.inputContainer}>
          <TextInput
            style={styles.input}
            editable={false}
            value={calories}
            placeholderTextColor={Color.gray}
          />
          <Text style={styles.unit}>kcal</Text>
        </View>
      </View>
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: Color.primary,
  },
  content: {
    marginHorizontal: scale(16),
  },
  inputContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    borderWidth: 1,
    borderColor: '#ccc',
    paddingHorizontal: scale(10),
    borderRadius: scale(20),
  },
  unit: {
    marginLeft: 5,
    color: Color.black,
  },
  input: {
    flex: 1,
    paddingVertical: verticalScale(5),
    color: Color.black,
  },
  label: {
    fontSize: scale(14),
    color: Color.gray,
    marginTop: verticalScale(15),
    marginBottom: verticalScale(5),
  },
  pickerButton: {
    borderWidth: 1,
    borderColor: '#ccc',
    padding: scale(10),
    borderRadius: scale(20),
  },
  dateText: {
    color: Color.black,
  },
  error: {
    color: 'red',
    fontSize: scale(12),
    marginTop: verticalScale(5),
    marginLeft: scale(5),
  },
});

export default WorkOutDetails;
