import React, { useEffect, useState } from 'react';
import { createNativeStackNavigator } from '@react-navigation/native-stack';
import { NavigationContainer, useNavigation } from '@react-navigation/native';
import SelectRegistrationType from '../Auth/Registartion/SelectRegistrationType';
import Registration from '../Auth/Registartion/Registration';
import UnlockAccess from '../Auth/Registartion/UnlockAccess';
import GetAccess from '../Auth/Registartion/GetAccess';
import HelpForRegistration from '../Auth/Registartion/HelpForRegistration';
import LoginScreen from '../Auth/Login/LoginScreen';
import BottomNavigation from './BottomNavigation';
import MainProfile from '../Screen/ClientFlow/Profile/MainProfile';
import Settings from '../Screen/ClientFlow/Profile/Settings';
import PhysicalActivityy from '../Screen/ClientFlow/Profile/Physical_Activity/PhysicalActivityy';
import WorkOutDetails from '../Screen/ClientFlow/Profile/Physical_Activity/WorkOutDetails';
import FoodDiary from '../Screen/ClientFlow/Profile/Food_Diary/FoodDiary';
import AddMeal from '../Screen/ClientFlow/Profile/Food_Diary/AddMeal';
import LogMeal from '../Screen/ClientFlow/Profile/Food_Diary/LogMeal';
import WaterIntake from '../Screen/ClientFlow/Profile/Water_Intake/WaterIntake';
import Measurements from '../Screen/ClientFlow/Profile/Measurements/Measurements';
import AdminHomeScreen from '../Screen/AdminFlow/HomeScreen/AdminHomeScreen';
import { persistor, store } from '../redux/Store';
import { Provider, useDispatch, useSelector } from 'react-redux';
import { PersistGate } from 'redux-persist/integration/react';
import ClientProfileScreen from '../Screen/AdminFlow/Clients/ClientProfileScreen';
import ClientChatScreen from '../Screen/AdminFlow/Clients/ClientChatScreen';
import { createDrawerNavigator } from '@react-navigation/drawer';
import SideBar from './SideBar';
import SettingScreen from '../Screen/AdminFlow/HomeScreen/SettingScreen';
import WaterIntakeLog from '../Screen/ClientFlow/Profile/Water_Intake/WaterIntakeLog';
import SwapMeal from '../Screen/ClientFlow/Profile/Food_Diary/SwapMeal';
import FoodSearch from '../Screen/ClientFlow/Profile/Food_Diary/FoodSearch';
import LogPhysicalActivity from '../Screen/ClientFlow/Profile/Physical_Activity/LogPhysicalActivity';
import Practitioner from '../Screen/ClientFlow/Profile/Practitioner';
import Message from '../Screen/ClientFlow/Profile/Message/Message';
import MeasurementDetail from '../Screen/ClientFlow/Profile/Measurements/MeasurementDetails';
import AddMeasurement from '../Screen/ClientFlow/Profile/Measurements/AddMeasurement';
import AllLogs from '../Screen/ClientFlow/Profile/Measurements/AllLogs';
import ShoppingList from '../Screen/ClientFlow/Profile/Shopping_Lists/ShoppingList';
import NewShoppingList from '../Screen/ClientFlow/Profile/Shopping_Lists/NewShoppingList';
import MyList from '../Screen/ClientFlow/Profile/Shopping_Lists/MyList';
import MessageClient from '../Screen/AdminFlow/Message/MessageClient';
import ClientDrawerContent from './ClientDrawer';
import LoginChoiceScreen from '../Auth/Login/LoginChoiceScreen';
import OnboardingScreen from './OnboardingScreen';
import SelectCountry from '../Screen/GuestFlow/login/SelectCountry';
import GuestLogin from '../Screen/GuestFlow/login/GuestLogin';
import SelectGender from '../Screen/GuestFlow/login/SelectGender';
import SelectProfession from '../Screen/GuestFlow/login/SelectProfession';
import linking from './linking';
import ChallengesScreen from '../Screen/ClientFlow/ChallengeFlow/ChallengesScreen';
import CreateChallenge from '../Screen/ClientFlow/ChallengeFlow/CreateChallenge';
import ChallengesDetailsScreen from '../Screen/ClientFlow/ChallengeFlow/ChallengesDetailsScreen';
import ViewChallengDetailsScreen from '../Screen/ClientFlow/ChallengeFlow/ViewChallengDetailsScreen';
import JoinRequestScreen from '../Screen/ClientFlow/ChallengeFlow/JoinRequestScreen';
import ForgotPasswordScreen from '../Auth/Login/ForgotPasswordScreen';

const Stack = createNativeStackNavigator();
const Drawer = createDrawerNavigator();
const ClientDrawer = createDrawerNavigator();

const ClientDrawerNavigator = () => {
  return (
    <ClientDrawer.Navigator
      drawerContent={props => <ClientDrawerContent {...props} />}
      screenOptions={{
        headerShown: false,
        drawerStyle: {
          width: '70%',
        },
      }}>
      <ClientDrawer.Screen name="ClientHome" component={BottomNavigation} />
      <ClientDrawer.Screen name="ChallengesScreen" component={ChallengesScreen} />
      <ClientDrawer.Screen name="CreateChallenge" component={CreateChallenge} />

    </ClientDrawer.Navigator>
  );
};

const MyDrawer = () => {
  const [selectedScreen, setSelectedScreen] = useState('MESSAGES');

  const options = [
    { id: 0, label: 'MESSAGES' },
    { id: 1, label: 'CLIENTS' },
    { id: 2, label: 'APPOINTMENTS' },
  ];

  return (
    <Drawer.Navigator
      drawerContent={props => (
        <SideBar
          {...props}
          selectedScreen={selectedScreen}
          onSelectScreen={setSelectedScreen}
        />
      )}
      screenOptions={{ headerShown: false }}>
      {options.map(item => (
        <Drawer.Screen key={item?.label} name={item?.label}>
          {props => (
            <AdminHomeScreen
              {...props}
              selectedScreen={selectedScreen}
              onSelectScreen={setSelectedScreen}
            />
          )}
        </Drawer.Screen>
      ))}
    </Drawer.Navigator>
  );
};

const AdminFlowStack = () => (
  <Stack.Navigator screenOptions={{ headerShown: false }}>
    <Stack.Screen name="adminFlow" component={MyDrawer} />
    <Stack.Screen name="ClientProfile" component={ClientProfileScreen} />
    <Stack.Screen name="Chat" component={ClientChatScreen} />
    <Stack.Screen name="Settings" component={SettingScreen} />
    <Stack.Screen name="Messages" component={MessageClient} />
  </Stack.Navigator>
);

const AuthStack = ({ route }) => {
  const { onboardingCompleted } = route.params || {};


  return (
    <Stack.Navigator screenOptions={{ headerShown: false }}>
      {!onboardingCompleted ? (
        <Stack.Screen name="onBoarding" component={OnboardingScreen} />
      ) : null}
      <Stack.Screen name="loginChoice" component={LoginChoiceScreen} />
      <Stack.Screen name="GuestFlow" component={GuestStack} />
      <Stack.Screen name="BottomNavigation" component={BottomNavigation} />
      <Stack.Screen name="loginScreen" component={LoginScreen} />
      <Stack.Screen name="forgotPassword" component={ForgotPasswordScreen} />
      <Stack.Screen
        name="registrationType"
        component={SelectRegistrationType}
      />
      <Stack.Screen name="registration" component={Registration} />
      <Stack.Screen name="unlockAccess" component={UnlockAccess} />
      <Stack.Screen name="getAccess" component={GetAccess} />
      <Stack.Screen
        name="helpForRegistration"
        component={HelpForRegistration}
      />
    </Stack.Navigator>
  );
};

const UserFlowStack = () => (
  <Stack.Navigator screenOptions={{ headerShown: false }}>
    <Stack.Screen name="ClientDrawer" component={ClientDrawerNavigator} />
    <Stack.Screen name="mainProfile" component={MainProfile} />
    <Stack.Screen name="practitioner" component={Practitioner} />
    <Stack.Screen name="ChallengesScreen" component={ChallengesScreen} />
    <Stack.Screen name="CreateChallenge" component={CreateChallenge} />
    <Stack.Screen name="ChallengesDetailsScreen" component={ChallengesDetailsScreen} />
    <Stack.Screen name="ViewChallengDetailsScreen" component={ViewChallengDetailsScreen} />
    <Stack.Screen name="JoinRequestScreen" component={JoinRequestScreen} />
    <Stack.Screen name="settings" component={Settings} />
    <Stack.Screen name="foodDiary" component={FoodDiary} />
    <Stack.Screen name="addMeal" component={AddMeal} />
    <Stack.Screen name="logMeal" component={LogMeal} />
    <Stack.Screen name="swapMeal" component={SwapMeal} />
    <Stack.Screen name="foodSearch" component={FoodSearch} />
    <Stack.Screen name="physicalActivity" component={PhysicalActivityy} />
    <Stack.Screen name="logPhysicalActivity" component={LogPhysicalActivity} />
    <Stack.Screen name="workOutDetails" component={WorkOutDetails} />
    <Stack.Screen name="waterIntake" component={WaterIntake} />
    <Stack.Screen name="waterIntakeLog" component={WaterIntakeLog} />
    <Stack.Screen name="measurements" component={Measurements} />
    <Stack.Screen name="addMeasurement" component={AddMeasurement} />
    <Stack.Screen name="measurementDetail" component={MeasurementDetail} />
    <Stack.Screen name="allLogs" component={AllLogs} />
    <Stack.Screen name="messages" component={Message} />
    <Stack.Screen name="shoppingLists" component={ShoppingList} />
    <Stack.Screen name="newShoppingLists" component={NewShoppingList} />
    <Stack.Screen name="myLists" component={MyList} />
  </Stack.Navigator>
);

const GuestStack = () => {
  return (
    <Stack.Navigator screenOptions={{ headerShown: false }}>
      <Stack.Screen name="SelectGender" component={SelectGender} />
      <Stack.Screen name="SelectProfession" component={SelectProfession} />
      <Stack.Screen name="SelectCountry" component={SelectCountry} />
      <Stack.Screen name="GuestLogin" component={GuestLogin} />
      {/* <Stack.Screen name="BottomNavigation" component={BottomNavigation} /> */}
    </Stack.Navigator>
  );
};

const MainStack = () => {
  const userInfo = useSelector(state => state.user?.userInfo);
  const role = userInfo?.user?.role || userInfo?.userData?.role;
  const onboardingCompleted = useSelector(state => state.user?.isCompleted);
  const demoClient = useSelector((state) => state?.user?.guestToken?.demoClient);
  // console.log(demoClient);


  if (onboardingCompleted === null) {
    return null;
  }

  return (
    <Stack.Navigator screenOptions={{ headerShown: false }}>
      {role === 'Admin' ? (
        <Stack.Screen name="AdminFlow" component={AdminFlowStack} />
      ) : role === 'Client' || demoClient ? (
        <Stack.Screen name="UserFlow" component={UserFlowStack} />
      ) : (
        <Stack.Screen
          name="AuthStack"
          component={AuthStack}
          initialParams={{ onboardingCompleted }}
        />
      )}
    </Stack.Navigator>
  );
};

const RootNavigation = () => (
  <Provider store={store}>
    <PersistGate loading={null} persistor={persistor}>
      <NavigationContainer linking={linking} >
        <MainStack />
      </NavigationContainer>
    </PersistGate>
  </Provider>
);

export default RootNavigation;