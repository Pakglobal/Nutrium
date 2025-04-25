import {
  SafeAreaView,
  StyleSheet,
  Text,
  TouchableOpacity,
  View,
  Alert,
  BackHandler,
} from 'react-native';
import React, { useEffect, useState } from 'react';
import FontAwesome6 from 'react-native-vector-icons/FontAwesome6';
import FontAwesome5 from 'react-native-vector-icons/FontAwesome5';
import { Color } from '../../../assets/styles/Colors';
import { scale, verticalScale } from 'react-native-size-matters';
import IconStyle, {
  IconPadding,
  LeftIcon,
  RightIcon,
} from '../../../assets/styles/Icon';
import { useFocusEffect, useNavigation } from '@react-navigation/native';
import LoginHeader from '../../../assets/Images/SelectGender.svg';
import GuestFlowHeader from '../../../Components/GuestFlowHeader';
import { useDispatch } from 'react-redux';
import { Font } from '../../../assets/styles/Fonts';
import { Progress } from '../../../assets/styles/Progress';
import { shadowStyle, ShadowValues } from '../../../assets/styles/Shadow';
import useAndroidBack from '../../../Navigation/useAndroidBack';
import CustomShadow from '../../../Components/CustomShadow';
import CustomAlertBox from '../../../Components/CustomAlertBox';

const SelectGender = () => {
  const navigation = useNavigation();
  const dispatch = useDispatch();
  const [selectedGender, setSelectedGender] = useState('');
  const [alertVisible, setAlertVisible] = useState(false);
  const [alertType, setAlertType] = useState('error');
  const [alertMsg, setAlertMsg] = useState('');
  useAndroidBack();

  const handleSelect = gender => {
    setSelectedGender(gender);
  };


  const handleNavigation = () => {
    if (!selectedGender) {
      setAlertMsg('Please select your gender to continue');
      setAlertType('warning');
      setAlertVisible(true);
      return;
    }
    navigation.navigate('SelectProfession', { gender: selectedGender });
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
      <GuestFlowHeader progress={Progress.selectGender} />

      <LeftIcon onGoBack={() => navigation.goBack()} />

      <LoginHeader height={'45%'} width={'100%'} style={{ marginTop: 50 }} />

      <View
        style={{
          paddingHorizontal: scale(16),
        }}>
        <Text
          style={[
            styles.titleText,
            { color: Color.primaryColor, marginTop: verticalScale(20) },
          ]}>
          Hi
        </Text>
        <Text
          style={[
            styles.titleText,
            {
              fontSize: scale(14),
              fontWeight: '600',
              fontFamily: Font.PoppinsMedium,
            },
          ]}>
          Select Gender
        </Text>
        <Text style={[styles.titleText, { fontSize: scale(12) }]}>
          Please select your gender to continue
        </Text>

        <View style={styles.selectionContainer}>
          <View style={{ width: '48%' }}>
            <CustomShadow>
              <View style={shadowStyle}>
                <TouchableOpacity
                  style={[
                    styles.option,
                    selectedGender === 'Female' && styles.selected,
                  ]}
                  onPress={() => handleSelect('Female')}>
                  <View
                    style={[
                      styles.iconContainer,
                      {
                        backgroundColor:
                          selectedGender === 'Female'
                            ? Color.white
                            : Color.primaryColor,
                      },
                    ]}>
                    <FontAwesome5
                      name="female"
                      color={
                        selectedGender === 'Female'
                          ? Color.primaryColor
                          : Color.white
                      }
                      size={IconStyle.headerIconSize}
                    />
                  </View>
                  <Text
                    style={[
                      styles.titleText,
                      { fontSize: scale(13) },
                      selectedGender === 'Female' && { color: Color.white },
                    ]}>
                    Female
                  </Text>
                </TouchableOpacity>
              </View>
            </CustomShadow>
          </View>

          <View style={{ width: '48%' }}>
            <CustomShadow>
              <View style={shadowStyle}>
                <TouchableOpacity
                  style={[
                    styles.option,
                    selectedGender === 'Male' && styles.selected,
                  ]}
                  onPress={() => handleSelect('Male')}>
                  <View
                    style={[
                      styles.iconContainer,
                      {
                        backgroundColor:
                          selectedGender === 'Male'
                            ? Color.white
                            : Color.primaryColor,
                      },
                    ]}>
                    <FontAwesome5
                      name="male"
                      color={
                        selectedGender === 'Male'
                          ? Color.primaryColor
                          : Color.white
                      }
                      size={IconStyle.headerIconSize}
                    />
                  </View>
                  <Text
                    style={[
                      styles.titleText,
                      { fontSize: scale(13) },
                      selectedGender === 'Male' && { color: Color.white },
                    ]}>
                    Male
                  </Text>
                </TouchableOpacity>
              </View>
            </CustomShadow>
          </View>
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
    fontSize: scale(28),
    color: Color.textColor,
    letterSpacing: 1,
    fontFamily: Font.Poppins,
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
});
