import {
  SafeAreaView,
  StyleSheet,
  Text,
  TouchableOpacity,
  View,
  Alert,
  BackHandler,
} from 'react-native';
import React, {useEffect, useState} from 'react';
import FontAwesome6 from 'react-native-vector-icons/FontAwesome6';
import FontAwesome5 from 'react-native-vector-icons/FontAwesome5';
import {Color} from '../../../assets/styles/Colors';
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
import {useDispatch} from 'react-redux';
import {setGuestMode} from '../../../redux/user';
import {Font} from '../../../assets/styles/Fonts';
import {Progress} from '../../../assets/styles/Progress';
import {ShadowValues} from '../../../assets/styles/Shadow';

const SelectGender = () => {
  const navigation = useNavigation();
  const dispatch = useDispatch();
  const [selectedGender, setSelectedGender] = useState(null);

  const handleSelect = gender => {
    setSelectedGender(gender);
  };

  const handleNavigation = () => {
    if (!selectedGender) {
      Alert.alert(
        'Selection Required',
        'Please select your gender to continue',
        [{text: 'OK', style: 'cancel'}],
      );
      return;
    }
    navigation.navigate('SelectProfession');
  };

  useEffect(() => {
    const backAction = () => {
      dispatch(setGuestMode());
      return true; // Prevent default behavior (exit)
    };

    const backHandler = BackHandler.addEventListener(
      'hardwareBackPress',
      backAction,
    );

    return () => backHandler.remove(); // Clean up
  }, []);

  return (
    <SafeAreaView style={styles.container}>
      <GuestFlowHeader progress={Progress.selectGender} />

      <LeftIcon onGoBack={() => dispatch(setGuestMode())} />

      <LoginHeader height={'45%'} width={'100%'} style={{marginTop: 50}} />

      <View
        style={{
          paddingHorizontal: scale(16),
        }}>
        <Text
          style={[
            styles.titleText,
            {color: Color.primaryColor, marginTop: verticalScale(20)},
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
        <Text style={[styles.titleText, {fontSize: scale(12)}]}>
          Please select your gender to continue
        </Text>

        <View style={styles.selectionContainer}>
          <View style={{width: '48%'}}>
            <Shadow
              distance={ShadowValues.blackShadowDistance}
              startColor={Color.primaryColor}
              style={{width: '100%', borderRadius: scale(8)}}>
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
                      selectedGender === 'female'
                        ? Color.primaryColor
                        : Color.white
                    }
                    size={IconStyle.headerIconSize}
                  />
                </View>
                <Text
                  style={[
                    styles.titleText,
                    {fontSize: scale(13)},
                    selectedGender === 'female' && {color: Color.white},
                  ]}>
                  Female
                </Text>
              </TouchableOpacity>
            </Shadow>
          </View>

          <View style={{width: '48%'}}>
            <Shadow
              distance={ShadowValues.blackShadowDistance}
              startColor={Color.primaryColor}
              style={{width: '100%', borderRadius: scale(8)}}>
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
                      selectedGender === 'male'
                        ? Color.primaryColor
                        : Color.white
                    }
                    size={IconStyle.headerIconSize}
                  />
                </View>
                <Text
                  style={[
                    styles.titleText,
                    {fontSize: scale(13)},
                    selectedGender === 'male' && {color: Color.white},
                  ]}>
                  Male
                </Text>
              </TouchableOpacity>
            </Shadow>
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
