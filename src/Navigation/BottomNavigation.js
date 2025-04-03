import React, { useState } from 'react';
import {
  Image,
  Modal,
  Pressable,
  StyleSheet,
  Text,
  TouchableOpacity,
  TouchableWithoutFeedback,
  View,
} from 'react-native';
import { createBottomTabNavigator } from '@react-navigation/bottom-tabs';
import Ionicons from 'react-native-vector-icons/Ionicons';
import { scale, verticalScale } from 'react-native-size-matters';
import { useNavigation } from '@react-navigation/native';
import HomeScreen from '../Screen/ClientFlow/Home/HomeScreen';
import MealScreen from '../Screen/ClientFlow/Meal/MealScreen';
import RecommendationScreen from '../Screen/ClientFlow/Recommend/RecommendationScreen';
import ProfileMenuScreen from '../Screen/ClientFlow/Profile/ProfileMenuScreen';
import Color from '../assets/colors/Colors';
import HomeGreen from '../assets/Icon/homeGreen.svg';
import MealWhite from '../assets/Icon/mealWhite.svg';
import RecommendationWhite from '../assets/Icon/recommendationWhite.svg';
import ProfileWhite from '../assets/Icon/profileWhite.svg';
import HomeWhite from '../assets/Icon/homeWhite.svg';
import MealGreen from '../assets/Icon/mealGreen.svg';
import RecommendationGreen from '../assets/Icon/recommendationGreen.svg';
import ProfileGreen from '../assets/Icon/profileGreen.svg';

const modalScreens = [
  {
    id: 0,
    name: 'Add meal',
    root: 'addMeal',
  },
  {
    id: 1,
    name: 'Add water intake',
    root: 'waterIntake',
  },
  {
    id: 2,
    name: 'Log weight',
    root: 'measurements',
  },
  {
    id: 3,
    name: 'Log physical activity',
    root: 'physicalActivity',
  },
];

const screenOption = [
  { id: 0, name: 'home', component: HomeScreen, activeIcon: HomeGreen, inactiveIcon: HomeWhite },
  { id: 1, name: 'mealScreen', component: MealScreen, activeIcon: MealGreen, inactiveIcon: MealWhite },
  { id: 2, name: 'recommendation', component: RecommendationScreen, activeIcon: RecommendationGreen, inactiveIcon: RecommendationWhite },
  { id: 3, name: 'profileMenu', component: ProfileMenuScreen, activeIcon: ProfileGreen, inactiveIcon: ProfileWhite },
];

const BottomNavigation = () => {
  const [isModalVisible, setModalVisible] = useState(false);
  const Tab = createBottomTabNavigator();
  const navigation = useNavigation();

  const closeModal = () => setModalVisible(false);

  return (
    <View style={{ flex: 1, backgroundColor: Color?.white }}>
      <Tab.Navigator
        screenOptions={({ route }) => ({
          tabBarActiveTintColor: Color?.primaryColor,
          tabBarInactiveTintColor: Color.white,
          headerShown: false,
          tabBarShowLabel: false,
          tabBarStyle: styles.tabBarStyle,
          tabBarIcon: ({ focused }) => {
            const currentItem = screenOption.find(item => item.name === route.name);
            const IconComponent = focused ? currentItem.activeIcon : currentItem.inactiveIcon;
            
            return (
              <View style={[styles.iconContainer, focused && styles.activeTab]}>
                <IconComponent 
                  width={scale(22)} 
                  height={scale(22)} 
                />
              </View>
            );
          },
        })}
      >
        {screenOption.map(item => (
          <Tab.Screen key={item.id} name={item.name} component={item.component} />
        ))}
      </Tab.Navigator>

      {/* Floating Add Button */}
      <TouchableOpacity style={styles.plusBtn} onPress={() => setModalVisible(true)}>
        {/* <Image source={require('../assets/Images/BottomTabIcon/bottomIcon.png')} /> */}
        <Ionicons 
          name="add-outline" 
          color={Color.primaryColor} 
          size={verticalScale(23)} 
          style={{position: "absolute", alignSelf: "center", top: scale(27)}} 
        />
      </TouchableOpacity>

      <Modal
        visible={isModalVisible}
        onRequestClose={closeModal}
        transparent={true}
        animationType="fade">
        <TouchableWithoutFeedback onPress={closeModal}>
          <View style={styles.modalContainer}>
            <View style={styles.modalView}>
              <View style={{ marginHorizontal: scale(20) }}>
                <Pressable style={{ marginBottom: verticalScale(15) }}>
                  <Text style={styles.modalHeaderTxt}>
                    Add Activity
                  </Text>
                </Pressable>
                {modalScreens.map(item => (
                  <TouchableOpacity
                    key={item.id}
                    onPress={() => {
                      navigation.navigate(item.root);
                      setModalVisible(false);
                    }}
                    style={styles.modalItemContainer}>
                    <Text style={styles.modalTxt}>{item.name}</Text>
                  </TouchableOpacity>
                ))}
              </View>
            </View>
          </View>
        </TouchableWithoutFeedback>
      </Modal>
    </View>
  );
};

export default BottomNavigation;

const styles = StyleSheet.create({
  tabBarStyle: {
    height: verticalScale(50),
    backgroundColor: Color?.primaryColor,
    borderRadius: scale(18),
    elevation: 5,
    shadowColor: '#000',
    shadowOpacity: 0.1,
    shadowOffset: { width: 0, height: 4 },
    shadowRadius: 4,
    marginHorizontal: scale(10),
    bottom: scale(5)
  },
  iconContainer: {
    padding: scale(7),
    borderRadius: scale(20),
  },
  activeTab: {
    backgroundColor: 'white',
    borderRadius: scale(50),
  },
  plusBtn: {
    position: 'absolute',
    bottom: verticalScale(6),
    alignSelf: 'center',
  },
  modalContainer: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: 'rgba(0,0,0,0.6)',
  },
  modalView: {
    width: '85%',
    paddingVertical: verticalScale(15),
    backgroundColor: Color.white,
    borderRadius: scale(10),
  },
  modalHeaderTxt: {
    fontSize: scale(15), 
    color: Color.txt,
    fontWeight: '500',
  },
  modalItemContainer: {
    marginVertical: verticalScale(15),
    paddingVertical: verticalScale(5),
  },
  modalTxt: {
    fontSize: scale(13),
    color: Color.txt,
  }
});