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
import CustomShadow from '../Components/CustomShadow';
import {shadowStyle} from '../assets/styles/Shadow';

const Tab = createBottomTabNavigator();

const CustomTabBarButton = ({children, onPress}) => (
  <TouchableOpacity
    style={{bottom: scale(10), height: scale(40)}}
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
                  // <Image
                  //   source={require('../assets/Icon/1221.png')}
                  //   style={{padding: 35}}
                  //   resizeMode="contain"
                  // />
                  <CustomShadow
                    radius={3}
                    style={shadowStyle}
                    color={Color?.gray}>
                    <View
                      style={{
                        backgroundColor: Color?.white,
                        borderRadius: scale(50),
                        height: scale(45),
                        width: scale(45),
                        justifyContent: 'center',
                      }}>
                      <MaterialIcons
                        name={'add'}
                        size={30}
                        color={Color.primaryColor}
                        style={{alignSelf: 'center'}}
                      />
                    </View>
                  </CustomShadow>
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
    borderRadius: scale(25),
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
    // alignSelf: 'center',
    // alignItems: 'center',
    // justifyContent: 'center',
    // backgroundColor: 'red'
  },
  customButton: {
    width: scale(30),
    height: scale(30),
    justifyContent: 'center',
    alignItems: 'center',
  },
});
