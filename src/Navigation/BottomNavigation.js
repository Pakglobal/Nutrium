// import React, {useState} from 'react';
// import {
//   Image,
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
// import {Color} from '../assets/styles/Colors';
// import HomeGreen from '../assets/Icon/homeGreen.svg';
// import MealWhite from '../assets/Icon/mealWhite.svg';
// import RecommendationWhite from '../assets/Icon/recommendationWhite.svg';
// import ProfileWhite from '../assets/Icon/profileWhite.svg';
// import HomeWhite from '../assets/Icon/homeWhite.svg';
// import MealGreen from '../assets/Icon/mealGreen.svg';
// import RecommendationGreen from '../assets/Icon/recommendationGreen.svg';
// import ProfileGreen from '../assets/Icon/profileGreen.svg';
// import BottomPlus from '../assets/Icon/bottomPlus.svg';
// import {Shadow} from 'react-native-shadow-2';

// const screenOption = [
//   {
//     id: 0,
//     name: 'home',
//     component: HomeScreen,
//     activeIcon: HomeGreen,
//     inactiveIcon: HomeWhite,
//   },
//   {
//     id: 1,
//     name: 'mealScreen',
//     component: MealScreen,
//     activeIcon: MealGreen,
//     inactiveIcon: MealWhite,
//   },
//   {
//     id: 2,
//     name: 'recommendation',
//     component: RecommendationScreen,
//     activeIcon: RecommendationGreen,
//     inactiveIcon: RecommendationWhite,
//   },
//   {
//     id: 3,
//     name: 'profileMenu',
//     component: ProfileMenuScreen,
//     activeIcon: ProfileGreen,
//     inactiveIcon: ProfileWhite,
//   },
// ];

// const BottomNavigation = () => {
//   const Tab = createBottomTabNavigator();

//   return (
//     <View style={{flex: 1, backgroundColor: Color?.white}}>
//       <Tab.Navigator
//         screenOptions={({route}) => ({
//           tabBarActiveTintColor: Color?.primaryColor,
//           tabBarInactiveTintColor: Color.white,
//           headerShown: false,
//           tabBarShowLabel: false,
//           tabBarStyle: styles.tabBarStyle,
//           tabBarIcon: ({focused}) => {
//             const currentItem = screenOption.find(
//               item => item?.name === route?.name,
//             );
//             const IconComponent = focused
//               ? currentItem?.activeIcon
//               : currentItem?.inactiveIcon;

//             const mealStyle = {
//               marginRight: route.name === 'mealScreen' ? scale(20) : 0,
//             };
//             const recommendationStyle = {
//               marginLeft: route.name === 'recommendation' ? scale(20) : 0,
//             };

//             return (
//               <View
//                 style={[
//                   styles.iconContainer,
//                   focused && styles.activeTab,
//                   mealStyle,
//                   recommendationStyle,
//                 ]}>
//                 <IconComponent width={scale(24)} height={scale(24)} />
//               </View>
//             );
//           },
//         })}>
//         {screenOption.map(item => (
//           <Tab.Screen
//             key={item.id}
//             name={item.name}
//             component={item.component}
//           />
//         ))}
//       </Tab.Navigator>

//       <TouchableOpacity
//         style={styles.plusBtn}>

//         <BottomPlus height={80} width={60} resizeMode="cover" />
//       </TouchableOpacity>
//     </View>
//   );
// };

// export default BottomNavigation;

// const styles = StyleSheet.create({
// tabBarStyle: {
//   height: verticalScale(65),
//   backgroundColor: Color?.primaryColor,
//   borderRadius: scale(18),
//   shadowColor: '#000',
//   shadowOpacity: 0.1,
//   shadowOffset: {width: 0, height: 4},
//   shadowRadius: 4,
//   marginHorizontal: scale(20),
//   bottom: scale(5),
// },
//   iconContainer: {
//     padding: scale(7),
//   },
//   activeTab: {
//     backgroundColor: Color.white,
//     borderRadius: scale(50),
//     height: scale(44),
//     width: scale(44),
//     alignItems: 'center',
//     justifyContent: 'center',
//   },
//   plusBtn: {
//     position: 'absolute',
//     bottom: verticalScale(38),
//     alignSelf: 'center',
//     // backgroundColor: 'red',
//     alignItems: 'center',
//     justifyContent: 'center',
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
//     borderRadius: scale(10),
//   },
//   modalHeaderTxt: {
//     fontSize: scale(15),
//     color: Color.txt,
//     fontWeight: '500',
//   },
//   modalItemContainer: {
//     marginVertical: verticalScale(15),
//     paddingVertical: verticalScale(5),
//   },
//   modalTxt: {
//     fontSize: scale(13),
//     color: Color.txt,
//   },
// });

import React from 'react';
import {
  View,
  TouchableOpacity,
  StyleSheet,
  Platform,
  Image,
} from 'react-native';
import {createBottomTabNavigator} from '@react-navigation/bottom-tabs';
import Icon from 'react-native-vector-icons/MaterialCommunityIcons';
import MaterialIcons from 'react-native-vector-icons/MaterialIcons';
import HomeScreen from '../Screen/ClientFlow/Home/HomeScreen';
import MealScreen from '../Screen/ClientFlow/Meal/MealScreen';
import RecommendationScreen from '../Screen/ClientFlow/Recommend/RecommendationScreen';
import ProfileMenuScreen from '../Screen/ClientFlow/Profile/ProfileMenuScreen';
import Deo from './Deo';
import {Color} from '../assets/styles/Colors';
import {scale, verticalScale} from 'react-native-size-matters';

const Tab = createBottomTabNavigator();

const CustomTabBarButton = ({children, onPress}) => (
  <TouchableOpacity
    style={styles.customButtonContainer}
    onPress={onPress}
    activeOpacity={0.9}>
    <View style={styles.customButton}>{children}</View>
  </TouchableOpacity>
);

const BottomNavigation = () => {
  return (
    <View style={{flex: 1, backgroundColor: Color.white}}>
      <Tab.Navigator
        screenOptions={({route}) => ({
          headerShown: false,
          tabBarShowLabel: false,
          tabBarHideOnKeyboard: true,
          tabBarStyle: [styles.tabBarStyle, {display: 'flex'}, null],
          tabBarIcon: ({focused, color, size}) => {
            let iconName;
            switch (route.name) {
              case 'home':
                iconName = 'home';
                break;
              case 'meal':
                iconName = 'silverware-fork-knife';
                break;
              case 'deo':
                iconName = 'plus';
                break;
              case 'recommendation':
                iconName = 'check-all';
                break;
              case 'profileMenu':
                iconName = 'account-circle-outline';
                break;
              default:
                iconName = 'circle';
            }

            return (
              <View
                style={[
                  focused && route.name !== 'deo'
                    ? styles.iconFocusedBackground
                    : null,
                ]}>
                {route.name === 'deo' ? (
                  <Image
                    source={require('../assets/Icon/1221.png')}
                    style={{padding: 35}}
                    resizeMode="contain"
                  />
                ) : route.name == 'recommendation' ? (
                  <MaterialIcons
                    name={'checklist'}
                    size={26}
                    color={focused ? Color.primaryColor : Color.white}
                  />
                ) : (
                  <Icon
                    name={iconName}
                    size={26}
                    color={focused ? Color.primaryColor : Color.white}
                  />
                )}
              </View>
            );
          },
        })}>
        <Tab.Screen name="home" component={HomeScreen} />
        <Tab.Screen name="meal" component={MealScreen} />
        <Tab.Screen
          name="deo"
          component={Deo}
          options={{
            tabBarButton: props => <CustomTabBarButton {...props} />,
          }}
        />
        <Tab.Screen name="recommendation" component={RecommendationScreen} />
        <Tab.Screen name="profileMenu" component={ProfileMenuScreen} />
      </Tab.Navigator>
    </View>
  );
};

export default BottomNavigation;

const styles = StyleSheet.create({
  tabBarStyle: {
    position: 'absolute',
    bottom: verticalScale(10),
    height: verticalScale(65),
    borderRadius: 30,
    backgroundColor: Color.primaryColor,
    elevation: 0,
    paddingHorizontal: scale(10),
    marginHorizontal: scale(16),
  },
  iconFocusedBackground: {
    backgroundColor: Color.white,
    padding: scale(10),
    borderRadius: scale(30),
  },
  plusBtn: {
    position: 'absolute',
    bottom: verticalScale(38),
    alignSelf: 'center',
    alignItems: 'center',
    justifyContent: 'center',
    alignItems: 'center',
  },
  customButton: {
    width: scale(30),
    height: scale(30),
    justifyContent: 'center',
    alignItems: 'center',
  },
});
