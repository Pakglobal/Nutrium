import React, {useState} from 'react';
import {View, Text, TouchableOpacity, StyleSheet} from 'react-native';
import {scale, verticalScale} from 'react-native-size-matters';
import AntDesign from 'react-native-vector-icons/AntDesign';
import {useNavigation} from '@react-navigation/native';
import Color from '../../../../assets/colors/Colors';
import BackHeader from '../../../../Components/BackHeader';
import DatePicker from 'react-native-date-picker';
import moment from 'moment';
import {useDispatch} from 'react-redux';
import {addData} from '../../../../redux/client';

const allMeal = [
  {id: '1', label: 'Breakfast', value: 'Breakfast'},
  {id: '2', label: 'Brunch', value: 'Brunch'},
  {id: '3', label: 'Morning snack', value: 'Morning snack'},
  {id: '4', label: 'Lunch', value: 'Lunch'},
  {id: '5', label: 'Afternoon snack', value: 'Afternoon snack'},
  {id: '6', label: 'Pre-workout snack', value: 'Pre-workout snack'},
  {id: '7', label: 'Post-workout snack', value: 'Post-workout snack'},
  {id: '8', label: 'Dinner', value: 'Dinner'},
  {id: '9', label: 'Supper', value: 'Supper'},
];

const AddMeal = () => {
  const navigation = useNavigation();
  const dispatch = useDispatch();
  const [selectedMeal, setSelectedMeal] = useState('Breakfast');
  const [showDropDown, setShowDropDown] = useState(false);
  const [timeOpen, setTimeOpen] = useState(false);
  const [time, setTime] = useState(new Date());

  const formatTime = isoString => {
    return moment(isoString).format('h.mm A');
  };

  const addMeal = {
    time: formatTime(time),
    meal: selectedMeal,
    press: 'plus',
  };

  const handleSave = () => {
    navigation.navigate('logMeal');
    dispatch(addData(addMeal));
  };

  const handleSelect = value => {
    setSelectedMeal(value);
    setShowDropDown(false);
  };

  return (
    <View style={{flex: 1, backgroundColor: Color.white}}>
      <BackHeader
        onPressBack={() => navigation.goBack()}
        titleName="Add meal"
        backText="Food diary"
        onSave={true}
        onPress={() => handleSave()}
      />

      <View style={{marginHorizontal: scale(16)}}>
        <View>
          <Text style={styles.label}>Meal</Text>
          <TouchableOpacity
            onPress={() => setShowDropDown(!showDropDown)}
            style={[
              styles.pickerButton,
              {
                flexDirection: 'row',
                alignItems: 'center',
                justifyContent: 'space-between',
              },
            ]}>
            <Text style={styles.selectedMeal}>{selectedMeal}</Text>
            <View>
              <AntDesign
                name={showDropDown === true ? 'up' : 'down'}
                size={verticalScale(12)}
                color={Color.gray}
              />
            </View>
          </TouchableOpacity>

          {showDropDown === true ? (
            <View style={styles.dropDownItem}>
              {allMeal.map(option => (
                <TouchableOpacity
                  style={styles.allMeal}
                  key={option.id}
                  onPress={() => handleSelect(option.value)}>
                  <Text style={styles.mealLabel}>{option.label}</Text>
                </TouchableOpacity>
              ))}
            </View>
          ) : null}
        </View>

        <Text style={styles.label}>Meal time</Text>
        <TouchableOpacity
          style={styles.pickerButton}
          onPress={() => setTimeOpen(true)}>
          <Text style={{color: Color.black}}>
            {time.toLocaleTimeString([], {hour: '2-digit', minute: '2-digit'})}
          </Text>
        </TouchableOpacity>

        <DatePicker
          modal
          mode="time"
          open={timeOpen}
          date={time}
          onConfirm={time => {
            setTimeOpen(false);
            setTime(time);
          }}
          onCancel={() => {
            setTimeOpen(false);
          }}
        />
      </View>
    </View>
  );
};

export default AddMeal;
const styles = StyleSheet.create({
  title: {
    color: Color.gray,
    fontWeight: '600',
    fontSize: scale(14),
  },
  dropDownView: {
    height: verticalScale(35),
    width: '100%',
    borderWidth: 1,
    borderColor: Color.txt,
    borderRadius: 50,
    flexDirection: 'row',
    marginTop: verticalScale(5),
    alignItems: 'center',
    justifyContent: 'space-between',
  },
  selectedMeal: {
    fontSize: scale(14),
    color: Color.txt,
  },
  dropDownItem: {
    width: '100%',
    backgroundColor: Color.headerBG,
    borderRadius: 5,
    shadowColor: '#000',
    shadowOffset: {
      width: 0,
      height: 1,
    },
    shadowOpacity: 0.1,
    shadowRadius: 2,
    elevation: 1,
    marginTop: verticalScale(5),
  },
  allMeal: {
    marginVertical: verticalScale(10),
  },
  mealLabel: {
    fontWeight: '500',
    marginStart: scale(15),
    fontSize: scale(14),
    color: Color.txt,
  },
  pickerButton: {
    borderWidth: 1,
    borderColor: '#ccc',
    padding: scale(10),
    borderRadius: scale(20),
  },
  label: {
    fontSize: scale(16),
    color: 'gray',
    marginTop: verticalScale(20),
    marginBottom: verticalScale(5),
  },
});
