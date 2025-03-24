import React, {useCallback, useEffect, useState} from 'react';
import {
  View,
  Text,
  ScrollView,
  TouchableOpacity,
  StyleSheet,
  ActivityIndicator,
  SafeAreaView,
  Modal,
  Pressable,
  RefreshControl,
} from 'react-native';
import {scale, verticalScale} from 'react-native-size-matters';
import {useFocusEffect, useNavigation} from '@react-navigation/native';
import Color from '../../../assets/colors/Colors';
import Header from '../../../Components/Header';
import {GetAppointmentByClientId} from '../../../Apis/ClientApis/ClientAppointmentApi';
import {useSelector} from 'react-redux';
import AppointmentCard from '../../../Components/AppointmentCard';
import MealsLikeInHome from '../../../Components/MealsLikeInHome';
import MoreForYou from '../../../Components/MoreForYou';
import HydratedStay from '../../../Components/HydratedStay';
import AntDesign from 'react-native-vector-icons/AntDesign';
import PhysicalActivity from '../../../Components/PhysicalActivity';
import OnOffFunctionality from '../../../Components/OnOffFunctionality';
import {GetUserApi} from '../../../Apis/ClientApis/ProfileApi';
import {connectSocket, joinRoom} from '../../../Components/SocketService';

const HomeScreen = () => {
  const navigation = useNavigation();
  const [loading, setLoading] = useState(false);
  const [userData, setUserData] = useState(null);
  const [modalVisible, setModalVisible] = useState(false);
  const [receivedMessage, setReceivedMessage] = useState(null);

  const [activeAppointments, setActiveAppointments] = useState([]);
  const [selectedAppointment, setSelectedAppointment] = useState(null);

  const getToken = useSelector(state => state?.user?.userInfo);
  const token = getToken?.token;
  const id = getToken?.userData?._id || getToken?.user?._id;

  const [refreshing, setRefreshing] = useState(false);

  const onRefresh = useCallback(() => {
    setRefreshing(true);
    GetUserApiData();
    FetchAppointmentData().then(() => {
      setRefreshing(false);
    });
  }, []);

  const FetchAppointmentData = async () => {
    try {
      setLoading(true);
      const response = await GetAppointmentByClientId(token, id);

      const active = response
        ?.filter(app => app?.status !== 'canceled')
        ?.sort((a, b) => new Date(a?.start) - new Date(b?.start));

      setActiveAppointments(active);
      if (active.length > 0) setSelectedAppointment(active[0]);
    } catch (error) {
      console.error('Error fetching appointments:', error);
      setLoading(false);
    }
  };

  const GetUserApiData = async () => {
    try {
      const response = await GetUserApi(token);
      setUserData(response?.data);
    } catch (error) {
      console.error('Error fetching user data', error);
    }
  };

  useFocusEffect(
    useCallback(() => {
      const fetchSocket = async () => {
        await connectSocket();
      };
      fetchSocket();
    }, []),
  );

  useEffect(() => {
    if (!userData?._id) {
      console.warn('⚠️ UserData not available, exiting effect');
      return;
    }

    console.log('🔗 Connecting to Socket...');
    const socket = connectSocket();
    joinRoom(id, userData?._id);

    const handleMessage = message => {
      console.log('📩 Received Message:', message);
      setReceivedMessage(message?.message);
      setModalVisible(true);

      setTimeout(() => {
        setModalVisible(false);
      }, 2000);
    };

    socket.on('receiveMessage', handleMessage);
    console.log('🛠️ Listener for receiveMessage set');

    return () => {
      console.log('🔄 Cleaning up listener...');
      socket.off('receiveMessage', handleMessage);
    };
  }, [userData, id]);

  return (
    <SafeAreaView style={{flex: 1, backgroundColor: Color.primary}}>
      <Header showIcon={true} />
      {loading ? (
        <View
          style={{
            flex: 1,
            justifyContent: 'center',
            alignItems: 'center',
          }}>
          <ActivityIndicator size="large" color={Color.primaryGreen} />
        </View>
      ) : (
        <ScrollView
          refreshControl={
            <RefreshControl refreshing={refreshing} onRefresh={onRefresh} />
          }
          style={{flex: 1, backgroundColor: Color.primary}}
          showsVerticalScrollIndicator={false}>
          <AppointmentCard
            refreshAppointments={FetchAppointmentData}
            activeAppointments={activeAppointments}
            selectedAppointment={selectedAppointment}
            setSelectedAppointment={setSelectedAppointment}
          />

          <Text style={styles.title}>What were your meals like?</Text>
          <MealsLikeInHome />
          <Text style={styles.title}>More for you</Text>
          <MoreForYou />

          <HydratedStay />

          <Pressable
            style={styles.waterView}
            onPress={() => navigation.navigate('waterIntake')}>
            <Text style={styles.waterText}>See all water logs</Text>
            <AntDesign
              name="arrowright"
              size={verticalScale(15)}
              color={Color.txt}
            />
          </Pressable>
          <OnOffFunctionality title={'Your physical activity'} />

          <PhysicalActivity />

          <Pressable
            style={styles.logButton}
            onPress={() => navigation.navigate('physicalActivity')}>
            <Text style={styles.logText}>See all physical activity stats</Text>
            <AntDesign
              name="arrowright"
              size={verticalScale(15)}
              color={Color.txt}
            />
          </Pressable>
        </ScrollView>
      )}

      <Modal
        transparent={true}
        visible={modalVisible}
        animationType="fade"
        onRequestClose={() => setModalVisible(false)}>
        <Pressable
          style={styles.modalOverlay}
          onPress={() => navigation.navigate('messages', {data: userData})}>
          <View style={styles.centeredView}>
            <View style={styles.modalView}>
              <View style={styles.leftBorder} />
              <View style={styles.contentContainer}>
                <Text style={styles.subtitleText}>{userData?.fullName}</Text>
                <Text style={styles.messageText}>{receivedMessage}</Text>
              </View>
            </View>
          </View>
        </Pressable>
      </Modal>
    </SafeAreaView>
  );
};

export default HomeScreen;

const styles = StyleSheet.create({
  title: {
    fontSize: verticalScale(14),
    fontWeight: '500',
    color: Color.txt,
    marginHorizontal: scale(16),
    marginVertical: verticalScale(10),
    marginTop: verticalScale(20),
  },
  logButton: {
    flexDirection: 'row',
    alignItems: 'center',
    marginStart: scale(15),
    marginVertical: verticalScale(10),
  },
  logText: {
    fontSize: verticalScale(12),
    color: Color.txt,
    fontWeight: '500',
    marginRight: scale(10),
  },
  loaderContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },

  modalOverlay: {
    flex: 1,
    backgroundColor: 'rgba(0, 0, 0, 0.5)',
    alignItems: 'center',
  },
  centeredView: {
    justifyContent: 'center',
    alignItems: 'center',
    marginTop: verticalScale(15),
    marginHorizontal: scale(16),
  },
  modalView: {
    flexDirection: 'row',
    backgroundColor: Color.primary,
    borderRadius: scale(15),
    shadowColor: Color.black,
    shadowOffset: {
      width: 0,
      height: 2,
    },
    shadowOpacity: 0.25,
    shadowRadius: 4,
    elevation: 5,
    overflow: 'hidden',
  },
  leftBorder: {
    width: scale(6),
    backgroundColor: Color.primaryGreen,
  },
  contentContainer: {
    padding: scale(10),
    flex: 1,
  },
  messageText: {
    fontSize: scale(15),
    fontWeight: '600',
    color: Color.black,
    marginBottom: 4,
  },
  subtitleText: {
    fontSize: 14,
    color: '#8E8E93',
    marginRight: 5,
  },
  waterText: {
    marginLeft: scale(15),
    fontSize: verticalScale(12),
    color: Color.txt,
    fontWeight: '500',
    marginRight: scale(10),
    marginVertical: verticalScale(10),
  },
  waterView: {
    backgroundColor: '#d3e5ff',
    flexDirection: 'row',
    alignItems: 'center',
    marginTop: verticalScale(-1),
  },
});