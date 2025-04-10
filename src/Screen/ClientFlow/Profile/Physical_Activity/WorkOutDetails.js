import React, { useEffect, useState } from 'react';
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
import {Color} from '../../../../assets/styles/Colors';
import BackHeader from '../../../../Components/BackHeader';
import DatePicker from 'react-native-date-picker';
import {
  SetPhysicalActivityDetails,
  SetQuickAccess,
  UpdatePhysicalActivity,
} from '../../../../Apis/ClientApis/PhysicalActivityApi';
import { useSelector } from 'react-redux';
import Toast from 'react-native-simple-toast';
import Header from '../../../../Components/Header';

const WorkOutDetails = ({ route }) => {
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

  const tokenId = useSelector(state => state?.user?.token);
  const token = tokenId?.token;
  const id = tokenId?.id;
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

    try {
      setLoading(true);
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
      setLoading(false);
    } catch (error) {
      showToast(error);
      setLoading(false);
    }
  };

  const handleUpdateActivity = async () => {
    try {
      setLoading(true);
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
      setLoading(false);
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
      {/* <BackHeader
        titleName={'Workout details'}
        backText={'Physical activity'}
        onPressBack={() => navigation.navigate('physicalActivity')}
        onPress={handleSave}
        onSave={true}
        loading={loading}
      /> */}


      <Header screenheader={true} screenName={'Water intake'} handlePlus={handleSave} />

      {/* <Header
        showIcon={'save'}
        backIcon={true}
        screenName="Physical activity"
        iconStyle={{left: scale(-65)}}
        onSave={handleSave}
        onPress={() =>
          navigation.navigate('logPhysicalActivity', {plusData: plusData})
        }
      /> */}

      <View style={styles.content}>
        <Text style={styles.topTitle}>Workout Details</Text>
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
    backgroundColor: Color.white,
  },
  content: {
    marginHorizontal: scale(16),
  },
  inputContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    borderWidth: scale(0.5),
    borderColor: Color?.primaryColor,
    paddingHorizontal: scale(10),
    borderRadius: scale(6),
    elevation: 7,
    shadowColor: Color?.primaryColor,
    shadowOpacity: 0.8,
    shadowRadius: 8,
    shadowOffset: {
      width: 5,
      height: 5,
    },
    backgroundColor: Color?.white,
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
    color: '#646D73',
    fontWeight: '500',
    marginTop: verticalScale(15),
    marginBottom: verticalScale(5),
  },
  pickerButton: {
    padding: scale(10),

    // flexDirection: 'row',
    // alignItems: 'center',
    borderWidth: scale(0.5),
    borderColor: Color?.primaryColor,
    paddingHorizontal: scale(10),
    borderRadius: scale(6),
    elevation: 7,
    shadowColor: Color?.primaryColor,
    shadowOpacity: 0.8,
    shadowRadius: 8,
    shadowOffset: {
      width: 5,
      height: 5,
    },
    backgroundColor: Color?.white,
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
  topTitle: {
    color: Color?.textColor,
    marginTop: scale(10),
    fontSize: scale(17),
    fontWeight: '500',
  },
});

export default WorkOutDetails;
