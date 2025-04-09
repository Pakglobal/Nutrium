import {
  SafeAreaView,
  StyleSheet,
  Text,
  TouchableOpacity,
  View,
  Alert, 
} from 'react-native';
import React, {useState} from 'react';
import FontAwesome6 from 'react-native-vector-icons/FontAwesome6';
import FontAwesome5 from 'react-native-vector-icons/FontAwesome5';
import Color, {Font, ShadowValues} from '../../../assets/colors/Colors';
import {scale, verticalScale} from 'react-native-size-matters';
import IconStyle, {
  IconPadding,
  LeftIcon,
  RightIcon,
} from '../../../assets/styles/Icon';
import {useNavigation} from '@react-navigation/native';
import LoginHeader from '../../../assets/Images/SelectGender.svg';
import {Shadow} from 'react-native-shadow-2';
import GuestFlowHeader from '../../../Components/GuestFlowHeader';

const SelectGender = () => {
  const navigation = useNavigation();
  const [selectedGender, setSelectedGender] = useState(null);

  const handleSelect = gender => {
    setSelectedGender(gender);
  };

  const handleNavigation = () => {
    if (!selectedGender) {
      // Show alert if no gender is selected
      Alert.alert(
        'Selection Required',
        'Please select your gender to continue',
        [{text: 'OK', style: 'cancel'}]
      );
      return;
    }
    navigation.navigate('SelectProfession');
  };

  return (
    <SafeAreaView style={styles.container}>
      <GuestFlowHeader progress={'20%'} />

      <LeftIcon />

      <View
        style={{
          height: '40%',
          width: '100%',
          alignItems: 'center',
          justifyContent: 'center',
        }}>
        <LoginHeader height={'100%'} width={'100%'} />
      </View>

      <View
        style={{
          height: '42%',
          marginHorizontal: scale(16),
        }}>
        <Text
          style={[
            styles.titleText,
            {color: Color.primaryColor, marginTop: verticalScale(18)},
          ]}>
          Hi
        </Text>
        <Text style={[styles.titleText, {fontSize: scale(16), fontWeight: '600'}]}>
          Select Gender
        </Text>
        <Text
          style={[styles.titleText, {fontSize: scale(12)}]}>
          Please select your gender to continue
        </Text>

        <View style={styles.selectionContainer}>
          <TouchableOpacity
            style={[
              styles.option,
              selectedGender === 'female' && styles.selected,
            ]}
            onPress={() => handleSelect('female')}>
            <View
              style={[
                styles.iconContainer,
                {
                  backgroundColor:
                    selectedGender === 'female'
                      ? Color.white
                      : Color.primaryColor,
                },
              ]}>
              <FontAwesome5
                name="female"
                color={
                  selectedGender === 'female' ? Color.primaryColor : Color.white
                }
                size={IconStyle.headerIconSize}
              />
            </View>
            <Text
              style={[
                styles.titleText,
                {fontSize: scale(14)},
                selectedGender === 'female' && styles.selectedText,
              ]}>
              Female
            </Text>
          </TouchableOpacity>

          <TouchableOpacity
            style={[
              styles.option,
              selectedGender === 'male' && styles.selected,
            ]}
            onPress={() => handleSelect('male')}>
            <View
              style={[
                styles.iconContainer,
                {
                  backgroundColor:
                    selectedGender === 'male'
                      ? Color.white
                      : Color.primaryColor,
                },
              ]}>
              <FontAwesome5
                name="male"
                color={
                  selectedGender === 'male' ? Color.primaryColor : Color.white
                }
                size={IconStyle.headerIconSize}
              />
            </View>
            <Text
              style={[
                styles.titleText,
                {fontSize: scale(14)},
                selectedGender === 'male' && styles.selectedText,
              ]}>
              Male
            </Text>
          </TouchableOpacity>
        </View>
      </View>

      <RightIcon onPress={handleNavigation} />
    </SafeAreaView>
  );
};

export default SelectGender;

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: Color.white,
  },
  titleText: {
    fontWeight: '500',
    fontSize: scale(32),
    color: Color.textColor,
    letterSpacing: 1,
    fontFamily: Font.Poppins,
  },
  boxContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    padding: scale(10),
  },
  genderContainer: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginTop: scale(20),
    width: '100%',
  },
  genderItemWrapper: {
    width: '48%',
  },
  shadowStyle: {
    width: '100%',
    borderRadius: scale(5),
  },
  selectionContainer: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    width: '100%',
    gap: 10,
    marginTop: verticalScale(15),
  },
  option: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingVertical: verticalScale(15),
    paddingHorizontal: scale(20),
    borderRadius: scale(8),
    borderWidth: 1,
    borderColor: Color.primaryColor,
    flex: 1,
  },
  selected: {
    borderColor: Color.primaryColor,
    backgroundColor: Color.primaryColor,
  },
  selectedText: {
    color: Color.white,
  },
  iconContainer: {
    width: scale(44),
    height: scale(44),
    borderRadius: scale(30),
    justifyContent: 'center',
    alignItems: 'center',
    marginRight: 10,
  },
  text: {
    fontSize: 16,
    fontWeight: '500',
    color: '#333',
  },
});