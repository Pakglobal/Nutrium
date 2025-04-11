import React, { useState } from 'react';
import {
  View,
  Text,
  ScrollView,
  TouchableOpacity,
  StyleSheet,
  SafeAreaView,
  Alert,
} from 'react-native';
import {Color} from '../../../assets/styles/Colors';
import {LeftIcon, RightIcon} from '../../../assets/styles/Icon';
import {scale, verticalScale} from 'react-native-size-matters';
import {useNavigation} from '@react-navigation/native';
import GuestFlowHeader from '../../../Components/GuestFlowHeader';
import {Font} from '../../../assets/styles/Fonts';

const SelectWorkspace = ({ route }) => {
  const navigation = useNavigation();
  const [workspace, setWorkspace] = useState(null);
  const [expertise, setExpertise] = useState(null);


  const goaldata=route?.params
  const selectWorkspace={...goaldata,workspace,expertise}


  const workspaceOptions = [
    { id: 'meal_plans', label: 'Meal Plans' },
    { id: 'client_management', label: 'Client Management' },
    { id: 'nutrition_tracking', label: 'Nutrition Tracking' },
    { id: 'reports_analytics', label: 'Reports & Analytics' },
  ];

  const expertiseOptions = [
    { id: 'spoorts_nutrition', label: 'Sports Nutrition' },
    { id: 'diabetes_management', label: 'Diabetes Management' },
    { id: 'vegan_nutrition', label: 'Vegan Nutrition' },
    { id: 'heart_health', label: 'Heart Health' },
  ];

  const handleNavigation = () => {
    if (!workspace || !expertise) {
      let message = '';
      if (!workspace && !expertise) {
        message = 'Please select your workspace and expertise to continue';
      } else if (!workspace) {
        message = 'Please select your workspace to continue';
      } else {
        message = 'Please select your expertise to continue';
      }

      Alert.alert(
        'Selection Required',
        message,
        [{ text: 'OK', style: 'cancel' }]
      );
      return;
    }
    navigation.navigate('SelectCountry',selectWorkspace);
  };

  return (
    <SafeAreaView style={styles.container}>
      <GuestFlowHeader progress={'60%'} />

      <LeftIcon onGoBack={() => navigation.goBack()} />
      <View style={{paddingHorizontal: scale(16)}}>
        <Text style={[styles.sectionTitle, {fontWeight: '600'}]}>
          Workspace
        </Text>
        {workspaceOptions.map(item => (
          <TouchableOpacity
            key={item?.id}
            style={[
              styles.button,
              {
                backgroundColor:
                  workspace === item?.id ? Color.primaryColor : Color.white,
              },
            ]}
            onPress={() => setWorkspace(item?.id)}>
            <Text
              style={[
                styles.sectionTitle,
                {
                  fontSize: scale(14),
                  textAlign: 'center',
                  color:
                    workspace === item?.id ? Color.white : Color.primaryColor,
                },
              ]}>
              {item?.label}
            </Text>
          </TouchableOpacity>
        ))}

        <Text style={[styles.sectionTitle, {fontWeight: '600'}]}>
          Expertise
        </Text>
        {expertiseOptions.map(item => (
          <TouchableOpacity
            key={item?.id}
            style={[
              styles.button,
              {
                backgroundColor:
                  expertise === item?.id ? Color.primaryColor : Color.white,
              },
            ]}
            onPress={() => setExpertise(item?.id)}>
            <Text
              style={[
                styles.sectionTitle,
                {
                  fontSize: scale(14),
                  textAlign: 'center',
                  color:
                    expertise === item?.id ? Color.white : Color.primaryColor,
                },
              ]}>
              {item?.label}
            </Text>
          </TouchableOpacity>
        ))}
      </View>
      <RightIcon onPress={handleNavigation} />
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: Color.white,
  },
  sectionTitle: {
    fontSize: scale(16),
    fontWeight: '500',
    color: Color.textColor,
    fontFamily: Font.Poppins,
    letterSpacing: -0.24,
    marginVertical: verticalScale(4),
  },
  button: {
    borderWidth: 1,
    borderColor: Color.primaryColor,
    borderRadius: scale(6),
    marginBottom: verticalScale(10),
    padding: scale(4),
  },
});

export default SelectWorkspace;
