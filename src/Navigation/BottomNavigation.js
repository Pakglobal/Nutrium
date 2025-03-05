import React, {useState} from 'react';
import {
  Modal,
  Pressable,
  StyleSheet,
  Text,
  TouchableOpacity,
  TouchableWithoutFeedback,
  View,
} from 'react-native';
import {createBottomTabNavigator} from '@react-navigation/bottom-tabs';
import Ionicons from 'react-native-vector-icons/Ionicons';
import {scale, verticalScale} from 'react-native-size-matters';
import {useNavigation} from '@react-navigation/native';
import HomeScreen from '../Screen/ClientFlow/Home/HomeScreen';
import MealScreen from '../Screen/ClientFlow/Meal/MealScreen';
import RecommendationScreen from '../Screen/ClientFlow/Recommend/RecommendationScreen';
import ProfileMenuScreen from '../Screen/ClientFlow/Profile/ProfileMenuScreen';
import Color from '../assets/colors/Colors';

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
  {
    id: 0,
    name: 'home',
    component: HomeScreen,
    icon: 'apps-outline',
  },
  {
    id: 1,
    name: 'mealScreen',
    component: MealScreen,
    icon: 'restaurant-outline',
  },
  {
    id: 2,
    name: 'recommendation',
    component: RecommendationScreen,
    icon: 'reorder-three-outline',
  },
  {
    id: 3,
    name: 'profileMenu',
    component: ProfileMenuScreen,
    icon: 'ellipsis-horizontal-outline',
  },
];

const BottomNavigation = () => {
  const [isModalVisible, setModalVisible] = useState(false);
  const Tab = createBottomTabNavigator();
  const navigation = useNavigation();

  const closeModal = () => {
    setModalVisible(false);
  };

  return (
    <View style={{flex: 1}}>
      <Tab.Navigator
        screenOptions={{
          tabBarActiveTintColor: Color.secondary,
          tabBarInactiveTintColor: Color.gray,
          headerShown: false,
          tabBarShowLabel: false,
          tabBarStyle: styles.tabBarStyle,
        }}>
        {screenOption &&
          screenOption.map(item => {
            return (
              <Tab.Screen
                key={item.id}
                name={item.name}
                component={item.component}
                options={{
                  tabBarIcon: ({color, size}) => (
                    <>
                      <Ionicons
                        name={item.icon}
                        color={color}
                        size={verticalScale(20)}
                      />
                    </>
                  ),
                  tabBarIconStyle: {
                    ...(item.icon === 'restaurant-outline' && {
                      right: scale(25),
                    }),
                    ...(item.icon === 'reorder-three-outline' && {
                      left: scale(25),
                    }),
                  },
                }}
              />
            );
          })}
      </Tab.Navigator>

      <TouchableOpacity
        style={styles.plusBtn}
        onPress={() => setModalVisible(true)}>
        <Ionicons
          name="add-outline"
          color={Color.secondary}
          size={verticalScale(25)}
        />
      </TouchableOpacity>

      <Modal
        visible={isModalVisible}
        onRequestClose={closeModal}
        transparent={true}>
        <TouchableWithoutFeedback onPress={closeModal}>
          <View style={styles.modalContainer}>
            <View style={styles.modalView}>
              <View style={{marginHorizontal: scale(20)}}>
                <Pressable style={{marginBottom: verticalScale(15)}}>
                  <Text style={{fontSize: scale(15), color: Color.txt}}>
                    New message
                  </Text>
                </Pressable>
                {modalScreens &&
                  modalScreens.map(item => {
                    return (
                      <TouchableOpacity
                        key={item.id}
                        onPress={() => {
                          navigation.navigate(item.root);
                          setModalVisible(false);
                        }}
                        style={{marginVertical: verticalScale(15)}}>
                        <Text style={styles.modalTxt}>{item.name}</Text>
                      </TouchableOpacity>
                    );
                  })}
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
    flexDirection: 'row',
    height: verticalScale(70),
    backgroundColor: Color.primary,
  },
  plusBtn: {
    position: 'absolute',
    bottom: scale(22),
    alignSelf: 'center',
    backgroundColor: 'rgba(232, 150, 106, 0.3)',
    padding: scale(10),
    borderRadius: scale(30),
    marginHorizontal: scale(50),
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
    backgroundColor: Color.primary,
  },
  modalTxt: {
    fontSize: scale(13),
    color: Color.txt,
  },
});
