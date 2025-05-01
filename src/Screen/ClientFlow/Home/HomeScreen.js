import React, {useCallback, useEffect, useState} from 'react';
import {
  View,
  Text,
  StyleSheet,
  SafeAreaView,
  ScrollView,
  RefreshControl,
} from 'react-native';
import {Color} from '../../../assets/styles/Colors';
import PhysicalActivity from '../../../Components/PhysicalActivity';
import {scale, verticalScale} from 'react-native-size-matters';
import Header from '../../../Components/Header';
import AppointmentCard from '../../../Components/AppointmentCard';
import MealsLikeInHome from '../../../Components/MealsLikeInHome';
import MoreForYou from '../../../Components/MoreForYou';
import {useFocusEffect, useNavigation} from '@react-navigation/native';
import {useDispatch, useSelector} from 'react-redux';
import {
  GetUserApi,
} from '../../../Apis/ClientApis/ProfileApi';
import {GetAppointmentByClientId} from '../../../Apis/ClientApis/ClientAppointmentApi';
import OnOffFunctionality from '../../../Components/OnOffFunctionality';
import HydratedStay from '../../../Components/HydratedStay';
import {shadowStyle, ShadowValues} from '../../../assets/styles/Shadow';
import CustomShadow from '../../../Components/CustomShadow';
import {loginData, profileData} from '../../../redux/user';
import {setImage} from '../../../redux/client';
import {TouchableOpacity} from 'react-native';
import CustomLoader from '../../../Components/CustomLoader';
import { GetClientData } from '../../../Apis/AdminScreenApi/ClientApi';

const HomeScreen = () => {
  const navigation = useNavigation();
  const [loading, setLoading] = useState(false);
  const [userData, setUserData] = useState(null);
  const [modalVisible, setModalVisible] = useState(false);
  const [receivedMessage, setReceivedMessage] = useState(null);

  const [activeAppointments, setActiveAppointments] = useState([]);
  const [selectedAppointment, setSelectedAppointment] = useState(null);

  const tokenId = useSelector(state => state?.user?.token);
  const guestTokenId = useSelector(state => state?.user?.guestToken);
  const token = tokenId?.token || guestTokenId?.token;
  const id = tokenId?.id || guestTokenId?.id;

  const dispatch = useDispatch();

  const [refreshing, setRefreshing] = useState(false);

  const GetUserApiData = async () => {
    try {
      const response = await GetUserApi(token);
      if (response) {
        setUserData(response?.data);
        dispatch(profileData(response?.data));
      }
    } catch (error) {
      console.error('Error fetching user data', error);
    }
  };

  const GetProfileImage = async () => {
    try {
      const response = await GetClientData(token, id);

      if (response) {
        dispatch(setImage(response[0]?.image));
      }
    } catch (error) {
      console.error('Error fetching profile image data', error);
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
    FetchAppointmentData();
    GetProfileImage();
    if (tokenId) {
      GetUserApiData();
    }
  }, [token, id]);

  const onRefresh = useCallback(() => {
    setRefreshing(true);
    if (tokenId) {
      GetUserApiData();
    }
    GetProfileImage();
    FetchAppointmentData()
      .then(() => {
        setRefreshing(false);
      })
      .catch(() => {
        setRefreshing(false);
      });
  }, []);

  const handleGoToChallenge = () => {
    navigation.navigate('ChallengesScreen');
  };

  return (
    <SafeAreaView style={{flex: 1, backgroundColor: Color.white}}>
      <Header logoHeader={true} />
      {loading ? (
        <CustomLoader style={{marginTop: verticalScale(30)}} />
      ) : (
        <View style={{flex: 1}}>
          <TouchableOpacity
            style={{
              backgroundColor: Color?.primaryColor,
              paddingVertical: 12,
              paddingHorizontal: 20,
              borderRadius: 10,
              alignItems: 'center',
              marginVertical: 16,
              marginHorizontal: 20,
            }}
            onPress={handleGoToChallenge}>
            <Text style={{color: 'white', fontSize: 16, fontWeight: 'bold'}}>
              Go to Challenge
            </Text>
          </TouchableOpacity>

          <ScrollView
            contentContainerStyle={{paddingBottom: 90}}
            refreshControl={
              <RefreshControl refreshing={refreshing} onRefresh={onRefresh} />
            }
            showsVerticalScrollIndicator={false}>
            <View style={{paddingHorizontal: scale(16)}}>
              <AppointmentCard
                refreshAppointments={FetchAppointmentData}
                activeAppointments={activeAppointments}
                setActiveAppointments={setActiveAppointments}
                selectedAppointment={selectedAppointment}
                setSelectedAppointment={setSelectedAppointment}
              />
              <MealsLikeInHome />
              <MoreForYou />
              <OnOffFunctionality />
              <HydratedStay />
              <OnOffFunctionality />
              <PhysicalActivity
                header={true}
                subHeader={true}
                bottomButton={true}
              />
            </View>
          </ScrollView>
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
