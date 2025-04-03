// import React, {useState} from 'react';
// import {
//   Modal,
//   Pressable,
//   StyleSheet,
//   Text,
//   TouchableOpacity,
//   TouchableWithoutFeedback,
//   View,
// } from 'react-native';
// import {createBottomTabNavigator} from '@react-navigation/bottom-tabs';
// import Ionicons from 'react-native-vector-icons/Ionicons';
// import {scale, verticalScale} from 'react-native-size-matters';
// import {useNavigation} from '@react-navigation/native';
// import HomeScreen from '../Screen/ClientFlow/Home/HomeScreen';
// import MealScreen from '../Screen/ClientFlow/Meal/MealScreen';
// import RecommendationScreen from '../Screen/ClientFlow/Recommend/RecommendationScreen';
// import ProfileMenuScreen from '../Screen/ClientFlow/Profile/ProfileMenuScreen';
// import Color from '../assets/colors/Colors';
// import { useSelector } from 'react-redux';

// const modalScreens = [
//   {
//     id: 0,
//     name: 'Add meal',
//     root: 'addMeal',
//   },
//   {
//     id: 1,
//     name: 'Add water intake',
//     root: 'waterIntake',
//   },
//   {
//     id: 2,
//     name: 'Log weight',
//     root: 'measurements',
//   },
//   {
//     id: 3,
//     name: 'Log physical activity',
//     root: 'physicalActivity',
//   },
// ];

// const screenOption = [
//   {
//     id: 0,
//     name: 'home',
//     component: HomeScreen,
//     icon: 'apps-outline',
//   },
//   {
//     id: 1,
//     name: 'mealScreen',
//     component: MealScreen,
//     icon: 'restaurant-outline',
//   },
//   {
//     id: 2,
//     name: 'recommendation',
//     component: RecommendationScreen,
//     icon: 'reorder-three-outline',
//   },
//   {
//     id: 3,
//     name: 'profileMenu',
//     component: ProfileMenuScreen,
//     icon: 'ellipsis-horizontal-outline',
//   },
// ];

// const BottomNavigation = () => {
//   const isGuest = useSelector(state => state.user?.isGuest);

//   const [isModalVisible, setModalVisible] = useState(false);
//   const Tab = createBottomTabNavigator();
//   const navigation = useNavigation();

//   const closeModal = () => {
//     setModalVisible(false);
//   };

//   return (
//     <View style={{flex: 1}}>
//       <Tab.Navigator
//         screenOptions={{
//           tabBarActiveTintColor: Color.secondary,
//           tabBarInactiveTintColor: Color.gray,
//           headerShown: false,
//           tabBarShowLabel: false,
//           tabBarStyle: styles.tabBarStyle,
//         }}>
//         {screenOption &&
//           screenOption.map(item => {
//             return (
//               <Tab.Screen
//                 key={item.id}
//                 name={item.name}
//                 component={item.component}
//                 options={{
//                   tabBarIcon: ({color, size}) => (
//                     <>
//                       <Ionicons
//                         name={item.icon}
//                         color={color}
//                         size={verticalScale(20)}
//                       />
//                     </>
//                   ),
//                   tabBarIconStyle: {
//                     ...(item.icon === 'restaurant-outline' && {
//                       right: scale(25),
//                     }),
//                     ...(item.icon === 'reorder-three-outline' && {
//                       left: scale(25),
//                     }),
//                   },
//                 }}
//               />
//             );
//           })}
//       </Tab.Navigator>

//       <TouchableOpacity
//         style={styles.plusBtn}
//         onPress={() => setModalVisible(true)}>
//         <Ionicons
//           name="add-outline"
//           color={Color.secondary}
//           size={verticalScale(25)}
//         />
//       </TouchableOpacity>

//       <Modal
//         visible={isModalVisible}
//         onRequestClose={closeModal}
//         transparent={true}>
//         <TouchableWithoutFeedback onPress={closeModal}>
//           <View style={styles.modalContainer}>
//             <View style={styles.modalView}>
//               <View style={{marginHorizontal: scale(20)}}>
//                 <Pressable style={{marginBottom: verticalScale(15)}}>
//                   <Text style={{fontSize: scale(15), color: Color.txt}}>
//                     New message
//                   </Text>
//                 </Pressable>
//                 {modalScreens &&
//                   modalScreens.map(item => {
//                     return (
//                       <TouchableOpacity
//                         key={item.id}
//                         onPress={() => {
//                           navigation.navigate(item.root);
//                           setModalVisible(false);
//                         }}
//                         style={{marginVertical: verticalScale(15)}}>
//                         <Text style={styles.modalTxt}>{item.name}</Text>
//                       </TouchableOpacity>
//                     );
//                   })}
//               </View>
//             </View>
//           </View>
//         </TouchableWithoutFeedback>
//       </Modal>
//     </View>
//   );
// };
// export default BottomNavigation;

// const styles = StyleSheet.create({
//   tabBarStyle: {
//     flexDirection: 'row',
//     height: verticalScale(55),
//     backgroundColor: Color.white,
//   },
//   plusBtn: {
//     position: 'absolute',
//     bottom: scale(7),
//     alignSelf: 'center',
//     backgroundColor: 'rgba(232, 150, 106, 0.3)',
//     padding: scale(10),
//     borderRadius: scale(30),
//     marginHorizontal: scale(50),
//   },
//   modalContainer: {
//     flex: 1,
//     alignItems: 'center',
//     justifyContent: 'center',
//     backgroundColor: 'rgba(0,0,0,0.6)',
//   },
//   modalView: {
//     width: '85%',
//     paddingVertical: verticalScale(15),
//     backgroundColor: Color.white,
//   },
//   modalTxt: {
//     fontSize: scale(13),
//     color: Color.txt,
//   },
// });




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
import Entypo from 'react-native-vector-icons/Entypo';
import FontAwesome6 from 'react-native-vector-icons/FontAwesome6';
import { scale, verticalScale } from 'react-native-size-matters';
import { useNavigation } from '@react-navigation/native';
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
  { id: 0, name: 'home', component: HomeScreen, icon: 'home' },
  { id: 1, name: 'mealScreen', component: MealScreen, icon: 'restaurant' },
  { id: 2, name: 'recommendation', component: RecommendationScreen, icon: 'reorder-three' },
  { id: 3, name: 'profileMenu', component: ProfileMenuScreen, icon: 'ellipsis-horizontal' },
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
          tabBarIcon: ({ color, focused }) => {
            const currentItem = screenOption.find(item => item.name === route.name);
            return (
              <View style={[styles.iconContainer, focused && styles.activeTab]}>
                <Ionicons name={currentItem.icon} color={color} size={verticalScale(22)} />
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
        {/* <FontAwesome6 name='location-pin' color={Color?.white} size={50} style={{
          
        }} /> */}
        <Image source={require('../assets/Images/BottomTabIcon/bottomIcon.png')} />
        <Ionicons name="add-outline" color={Color.primaryColor} size={verticalScale(23)} style={{position:"absolute",alignSelf:"center",top:scale(27)}} />
        {/* <Entypo name="plus" color={Color.primaryColor} size={(25)} style={{ position: "absolute", alignSelf: "center", top: scale(30) }} /> */}
      </TouchableOpacity>

      <Modal
        visible={isModalVisible}
        onRequestClose={closeModal}
        transparent={true}>
        <TouchableWithoutFeedback onPress={closeModal}>
          <View style={styles.modalContainer}>
            <View style={styles.modalView}>
              <View style={{ marginHorizontal: scale(20) }}>
                <Pressable style={{ marginBottom: verticalScale(15) }}>
                  <Text style={{ fontSize: scale(15), color: Color.txt }}>
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
                        style={{ marginVertical: verticalScale(15) }}>
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
    height: verticalScale(50),
    backgroundColor: Color?.primaryColor, // Dark blue color
    borderRadius: scale(18),
    elevation: 5, // Shadow for Android
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
    backgroundColor: 'white', // White background for active tab
    borderRadius: scale(50),
  },
  plusBtn: {
    position: 'absolute',
    bottom: verticalScale(6),
    alignSelf: 'center',
    // padding: scale(8),
    // borderRadius: scale(40),
    // elevation: 5, // Android shadow
    // shadowColor: '#000',
    // shadowOpacity: 0.1,
    // shadowOffset: { width: 0, height: 4 },
    // shadowRadius: 4
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
  },
  modalTxt: {
    fontSize: scale(13),
    color: Color.txt,
  }
});
