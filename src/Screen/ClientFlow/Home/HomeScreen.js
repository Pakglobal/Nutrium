import React, {useCallback, useEffect, useState} from 'react';
import {
  View,
  Text,
  StyleSheet,
  SafeAreaView,
  ScrollView,
  RefreshControl,
  ActivityIndicator,
} from 'react-native';
import {Shadow} from 'react-native-shadow-2';
import {Color} from '../../../assets/styles/Colors';
import PhysicalActivity from '../../../Components/PhysicalActivity';
import {scale, verticalScale} from 'react-native-size-matters';
import Header from '../../../Components/Header';
import AppointmentCard from '../../../Components/AppointmentCard';
import MealsLikeInHome from '../../../Components/MealsLikeInHome';
import MoreForYou from '../../../Components/MoreForYou';
import {useFocusEffect, useNavigation} from '@react-navigation/native';
import {useSelector} from 'react-redux';
import {GetUserApi} from '../../../Apis/ClientApis/ProfileApi';
import {GetAppointmentByClientId} from '../../../Apis/ClientApis/ClientAppointmentApi';
import OnOffFunctionality from '../../../Components/OnOffFunctionality';
import HydratedStay from '../../../Components/HydratedStay';
import {shadowStyle, ShadowValues} from '../../../assets/styles/Shadow';
import CustomShadow from '../../../Components/CustomShadow';

const HomeScreen = () => {
  const navigation = useNavigation();
  const [loading, setLoading] = useState(false);
  const [userData, setUserData] = useState(null);
  const [modalVisible, setModalVisible] = useState(false);
  const [receivedMessage, setReceivedMessage] = useState(null);

  const [activeAppointments, setActiveAppointments] = useState([]);
  const [selectedAppointment, setSelectedAppointment] = useState(null);

  const isGuest = useSelector(state => state.user?.guestMode);

  const tokenId = useSelector(state => state?.user?.token);
  const token = tokenId?.token;
  const id = tokenId?.id;

  const [refreshing, setRefreshing] = useState(false);

  const GetUserApiData = async () => {
    try {
      const response = await GetUserApi(token);
      setUserData(response?.data);
    } catch (error) {
      console.error('Error fetching user data', error);
    }
  };

  const FetchAppointmentData = async () => {
    try {
      setLoading(true);
      const response = await GetAppointmentByClientId(token, id);

      if (response && response.length > 0) {
        const active = response
          ?.filter(app => app?.status !== 'canceled')
          ?.sort((a, b) => new Date(a?.start) - new Date(b?.start));

        setActiveAppointments(active);

        if (active.length > 0) {
          setSelectedAppointment(active[0]);
        }
      } else {
        setActiveAppointments([]);
        setSelectedAppointment(null);
      }

      setLoading(false);
    } catch (error) {
      console.error('Error fetching appointments:', error);

      setActiveAppointments([]);
      setSelectedAppointment(null);
      setLoading(false);
    }
  };

  useEffect(() => {
    if (isGuest) {
      return;
    } else {
      FetchAppointmentData();
    }
  }, [token, id]);

  const onRefresh = useCallback(() => {
    setRefreshing(true);
    GetUserApiData();
    FetchAppointmentData()
      .then(() => {
        setRefreshing(false);
      })
      .catch(() => {
        setRefreshing(false);
      });
  }, []);

  return (
    <SafeAreaView style={{flex: 1, backgroundColor: Color.white}}>
      <Header logoHeader={true} />

      {isGuest ? (
        <ScrollView
          style={{backgroundColor: Color.white, paddingHorizontal: scale(8)}}>
          <View style={{paddingHorizontal: scale(10)}}>
            <View style={{marginVertical: scale(10)}}>
              <CustomShadow style={{width: '100%', borderRadius: scale(10)}}>
                <MealsLikeInHome />
              </CustomShadow>
            </View>

            <MoreForYou />
            <View style={{marginVertical: scale(10)}}>
              <CustomShadow style={{width: '100%', borderRadius: scale(10)}}>
                <HydratedStay />
              </CustomShadow>
            </View>
          </View>
        </ScrollView>
      ) : (
        <View>
          {loading ? (
            <View
              style={{
                justifyContent: 'center',
                alignItems: 'center',
                marginTop: verticalScale(20),
              }}>
              <ActivityIndicator size="large" color={Color.primaryColor} />
            </View>
          ) : (
            <ScrollView
              refreshControl={
                <RefreshControl refreshing={refreshing} onRefresh={onRefresh} />
              }
              showsVerticalScrollIndicator={false}>
              <View
                style={{
                  paddingHorizontal: scale(16),
                  marginTop: verticalScale(12),
                }}>
                <AppointmentCard
                  refreshAppointments={FetchAppointmentData}
                  activeAppointments={activeAppointments}
                  setActiveAppointments={setActiveAppointments}
                  selectedAppointment={selectedAppointment}
                  setSelectedAppointment={setSelectedAppointment}
                />

                <CustomShadow style={shadowStyle}>
                  <MealsLikeInHome />
                </CustomShadow>

                <MoreForYou />
                <OnOffFunctionality />

                <CustomShadow style={shadowStyle}>
                  <HydratedStay />
                </CustomShadow>

                <OnOffFunctionality />

                <View style={{marginBottom: verticalScale(100)}}>
                  <CustomShadow style={shadowStyle}>
                    <PhysicalActivity
                      header={true}
                      subHeader={true}
                      bottomButton={true}
                    />
                  </CustomShadow>
                </View>
              </View>
            </ScrollView>
          )}
        </View>
      )}
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: '#f8f8f8',
  },
  box: {
    width: 150,
    height: 100,
    backgroundColor: 'white',
    justifyContent: 'center',
    alignItems: 'center',
    borderRadius: 10,
  },
  text: {
    fontSize: 16,
    fontWeight: 'bold',
  },
  shadow: {
    borderRadius: scale(10),
    backgroundColor: Color?.white,
  },
});

export default HomeScreen;
