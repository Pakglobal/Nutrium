import {
  SafeAreaView,
  StyleSheet,
  Text,
  TouchableOpacity,
  View,
  Alert,
  BackHandler,
} from 'react-native';
import React, {useState} from 'react';
import FontAwesome from 'react-native-vector-icons/FontAwesome';
import FontAwesome5 from 'react-native-vector-icons/FontAwesome5';
import {Color} from '../../../assets/styles/Colors';
import {scale, verticalScale} from 'react-native-size-matters';
import IconStyle, {
  IconPadding,
  LeftIcon,
  RightIcon,
} from '../../../assets/styles/Icon';
import {useFocusEffect, useNavigation} from '@react-navigation/native';
import LoginHeader from '../../../assets/Images/SelectProfession.svg';
import {Shadow} from 'react-native-shadow-2';
import GuestFlowHeader from '../../../Components/GuestFlowHeader';
import Feather from 'react-native-vector-icons/Feather';
import Octicons from 'react-native-vector-icons/Octicons';
import {setGuestMode} from '../../../redux/user';
import {useDispatch} from 'react-redux';
import {Font} from '../../../assets/styles/Fonts';
import {Progress} from '../../../assets/styles/Progress';
import useAndroidBack from '../../../Navigation/useAndroidBack';

const SelectProfession = ({route}) => {
  const navigation = useNavigation();
  const [profession, setProfession] = useState(null);
  const [goal, setGoal] = useState(null);
  const Gender = route?.params?.gender;
  const selectedGoal = {goal, profession, Gender};
  useAndroidBack();
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

  const handleNavigation = () => {
    if (!profession || !goal) {
      let message = '';
      if (!profession && !goal) {
        message = 'Please select your profession and goal to continue';
      } else if (!profession) {
        message = 'Please select your profession to continue';
      } else {
        message = 'Please select your goal to continue';
      }

      Alert.alert('Selection Required', message, [
        {text: 'OK', style: 'cancel'},
      ]);
      return;
    }
    navigation.navigate('SelectCountry', selectedGoal);
  };

  return (
    <SafeAreaView style={{flex: 1, backgroundColor: Color.white}}>
      <GuestFlowHeader progress={Progress.selectProfession} />

      <LeftIcon onGoBack={() => navigation.goBack()} />

      <LoginHeader height={'40%'} width={'100%'} style={{marginTop: 50}} />

      <View style={styles.formContainer}>
        <Text style={styles.titleText}>What is your profession</Text>
        <View style={styles.optionsGrid}>
          {professions.map(item => (
            <TouchableOpacity
              key={item?.id}
              style={[
                styles.optionButton,
                profession === item?.id && styles.selectedButton,
              ]}
              onPress={() => setProfession(item?.id)}>
              <Text
                style={[
                  styles.optionText,
                  profession === item?.id && styles.selectedText,
                ]}>
                {item?.icon(item.id)} {item?.label}
              </Text>
            </TouchableOpacity>
          ))}
        </View>

        <Text style={styles.titleText}>What is your Goal</Text>
        <View style={styles.optionsGrid}>
          {goals.map(item => (
            <TouchableOpacity
              key={item?.id}
              style={[
                styles.optionButton,
                goal === item?.id && styles.selectedButton,
              ]}
              onPress={() => setGoal(item?.id)}>
              <Text
                style={[
                  styles.optionText,
                  goal === item?.id && styles.selectedText,
                ]}>
                {item?.label}
              </Text>
            </TouchableOpacity>
          ))}
        </View>
      </View>

      <RightIcon onPress={handleNavigation} />
    </SafeAreaView>
  );
};

export default SelectProfession;

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: Color.white,
  },
  titleText: {
    fontWeight: '500',
    fontSize: scale(14),
    color: Color.textColor,
    letterSpacing: 1,
    fontFamily: Font.PoppinsMedium,
    marginBottom: scale(4),
    marginTop: verticalScale(10),
  },
  formContainer: {
    paddingHorizontal: scale(16),
  },
  optionsGrid: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    justifyContent: 'space-between',
  },
  optionButton: {
    width: '48%',
    borderWidth: 1,
    borderColor: Color.primaryColor,
    borderRadius: scale(6),
    padding: scale(4),
    marginBottom: verticalScale(10),
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
  },
  selectedButton: {
    backgroundColor: Color.primaryColor,
    borderColor: Color.primaryColor,
  },
  optionIcon: {
    marginRight: scale(8),
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
});
