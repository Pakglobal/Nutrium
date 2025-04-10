import React, {useState, useRef, useEffect} from 'react';
import {
  View,
  Text,
  Image,
  TouchableOpacity,
  Modal,
  TouchableWithoutFeedback,
  StyleSheet,
  Dimensions,
  ActivityIndicator,
  Alert,
  Animated,
} from 'react-native';
import {useSelector} from 'react-redux';
import Carousel from 'react-native-snap-carousel';
import moment from 'moment';
import {scale, verticalScale} from 'react-native-size-matters';
import {Color} from '../assets/styles/Colors';
import {
  GetAppointmentByClientId,
  UpdateAppointmentStatus,
} from '../Apis/ClientApis/ClientAppointmentApi';
import {Shadow} from 'react-native-shadow-2';
import Entypo from 'react-native-vector-icons/Entypo';
import { Font } from '../assets/styles/Fonts';

const SCREEN_WIDTH = Dimensions.get('window').width;

const AppointmentCard = ({navigation}) => {
  const tokenId = useSelector(state => state?.user?.token);
  const token = tokenId?.token;
  const id = tokenId?.id;

  const [activeAppointments, setActiveAppointments] = useState([]);
  const [selectedAppointment, setSelectedAppointment] = useState(null);

  const filteredAppointments = activeAppointments.filter(
    app => app.status === 'not_confirmed' || app.status === 'confirmed',
  );

  const [isModalVisible, setModalVisible] = useState(false);
  const [loading, setLoading] = useState(false);
  const [currentIndex, setCurrentIndex] = useState(0);
  const carouselRef = useRef(null);
  const fadeAnim = useRef(new Animated.Value(0)).current;

  useEffect(() => {
    Animated.timing(fadeAnim, {
      toValue: 1,
      duration: 500,
      useNativeDriver: true,
    }).start();
  }, []);

  useEffect(() => {
    if (carouselRef.current) {
      setCurrentIndex(carouselRef.current.currentIndex || 0);
    }
  }, [filteredAppointments]);

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

  const refreshAppointments = FetchAppointmentData;

  useEffect(() => {
    FetchAppointmentData();
  }, [token, id]);

  const formatDate = isoString =>
    isoString ? moment(isoString).format('dddd, D MMMM') : '';

  const formatTime = isoString =>
    isoString ? moment(isoString).format('h:mm A') : '';

  const getStatusText = status => {
    switch (status) {
      case 'not_confirmed':
        return 'Pending';
      case 'confirmed':
        return 'Confirmed';
      default:
        return status.charAt(0).toUpperCase() + status.slice(1);
    }
  };

  const handleCancelAppointment = async () => {
    if (!selectedAppointment) return;

    Alert.alert(
      'Cancel Appointment',
      'Are you sure you want to cancel this appointment?',
      [
        {
          text: 'No',
          style: 'cancel',
        },
        {
          text: 'Yes, Cancel',
          style: 'destructive',
          onPress: async () => {
            try {
              setLoading(true);
              await UpdateAppointmentStatus(token, selectedAppointment?._id, {
                status: 'canceled',
              });
              await refreshAppointments();
              setModalVisible(false);
              setLoading(false);
            } catch (error) {
              console.error('Error canceling appointment:', error);
              setLoading(false);
              Alert.alert(
                'Error',
                'Failed to cancel the appointment. Please try again.',
              );
            }
          },
        },
      ],
    );
  };

  const handleConfirm = async appointment => {
    try {
      const updatedAppointments = activeAppointments.map(app =>
        app._id === appointment._id ? {...app, isLoading: true} : app,
      );
      setActiveAppointments(updatedAppointments);

      await UpdateAppointmentStatus(token, appointment?._id, {
        status: 'confirmed',
      });

      await refreshAppointments();

      // Alert.alert('Success', 'Appointment confirmed successfully!');
    } catch (error) {
      console.error('Error confirming appointment:', error);
      Alert.alert(
        'Error',
        'Failed to confirm the appointment. Please try again.',
      );

      const resetAppointments = activeAppointments.map(app => ({
        ...app,
        isLoading: false,
      }));
      setActiveAppointments(resetAppointments);
    }
  };

  const handleViewDetails = appointment => {
    if (navigation) {
      navigation.navigate('AppointmentDetails', {appointment});
    }
    setModalVisible(false);
  };

  const handleReschedule = appointment => {
    if (navigation) {
      navigation.navigate('RescheduleAppointment', {appointment});
    }
    setModalVisible(false);
  };

  const renderAppointmentItem = ({item, index}) => {
    const date = formatDate(item?.start);
    const timeRange = `${formatTime(item?.start)}-${formatTime(item?.end)}`;
    const isPending = item?.status === 'not_confirmed';
    const statusText = getStatusText(item?.status);

    return (
      <Animated.View
        style={[
          {
            marginVertical: verticalScale(8),
            paddingHorizontal: scale(15),
            alignSelf: 'center',
            width: '100%',
          },
          {opacity: fadeAnim},
        ]}>
        <Shadow
          distance={3}
          startColor={Color.primaryColor}
          style={{width: '100%', borderRadius: scale(16)}}>
          <View style={styles.cardContainer}>
            <View style={styles.cardHeader}>
              <Text style={styles.cardTitle}>Appointment</Text>
              <Text style={styles.statusText}>{statusText}</Text>
            </View>

            <View style={styles.appointmentDetails}>
              <Image
                source={
                  item?.image
                    ? {uri: item?.image}
                    : item?.gender === 'Female'
                    ? require('../assets/Images/woman.png')
                    : require('../assets/Images/man.png')
                }
                style={styles.avatar}
              />
              <View style={styles.dateTimeContainer}>
                <Text style={styles.dateText}>{date}</Text>
                <Text style={styles.timeText}>{timeRange}</Text>
              </View>
              <TouchableOpacity
                style={{padding: scale(10)}}
                onPress={() => {
                  setSelectedAppointment(item);
                  setModalVisible(true);
                }}>
                <Entypo
                  name="dots-three-vertical"
                  size={24}
                  color={Color.primaryColor}
                />
              </TouchableOpacity>
            </View>

            {isPending && (
              <TouchableOpacity
                style={styles.confirmButton}
                onPress={() => handleConfirm(item)}
                disabled={item.isLoading}>
                {item.isLoading ? (
                  <ActivityIndicator size="small" color="#FFFFFF" />
                ) : (
                  <Text style={styles.confirmButtonText}>Confirm</Text>
                )}
              </TouchableOpacity>
            )}
          </View>
        </Shadow>
      </Animated.View>
    );
  };

  const renderPagination = () => {
    return (
      <View style={styles.paginationContainer}>
        {filteredAppointments.map((_, index) => (
          <View
            key={index}
            style={[
              styles.paginationDot,
              {
                width: index === currentIndex ? scale(16) : scale(8),
                backgroundColor:
                  index === currentIndex ? Color.primaryColor : '#E0E0E0',
              },
            ]}
          />
        ))}
      </View>
    );
  };

  const renderEmptyState = () => {
    return (
      <View style={styles.noAppointmentsContainer}>
        <Text style={styles.noAppointmentsTitle}>No Active Appointments</Text>
        <Text style={styles.noAppointmentsText}>
          You don't have any pending or confirmed appointments at the moment.
        </Text>
        <TouchableOpacity
          style={styles.bookAppointmentButton}
          onPress={() => navigation?.navigate('BookAppointment')}>
          <Text style={styles.bookAppointmentText}>Book an Appointment</Text>
        </TouchableOpacity>
      </View>
    );
  };

  return (
    <View style={styles.container}>
      {filteredAppointments?.length > 0 ? (
        <>
          <Carousel
            ref={carouselRef}
            data={filteredAppointments}
            renderItem={renderAppointmentItem}
            sliderWidth={SCREEN_WIDTH}
            itemWidth={SCREEN_WIDTH}
            inactiveSlideScale={0.92}
            inactiveSlideOpacity={0.7}
            enableMomentum={true}
            activeSlideAlignment="center"
            onSnapToItem={index => setCurrentIndex(index)}
            keyExtractor={item => item?._id}
          />
          {renderPagination()}
        </>
      ) : (
        renderEmptyState()
      )}

      <Modal
        visible={isModalVisible}
        onRequestClose={() => setModalVisible(false)}
        transparent={true}
        animationType="fade">
        <TouchableWithoutFeedback onPress={() => setModalVisible(false)}>
          <View style={styles.modalContainer}>
            <TouchableWithoutFeedback>
              <View style={styles.modalView}>
                <View style={styles.modalHeader}>
                  <Text style={styles.modalTitle}>Appointment Options</Text>
                  <TouchableOpacity onPress={() => setModalVisible(false)}>
                    <Text style={styles.closeButton}>✕</Text>
                  </TouchableOpacity>
                </View>

                <View style={styles.modalDivider} />

                <View style={styles.modalContent}>
                  <TouchableOpacity
                    style={styles.modalOption}
                    onPress={() => handleViewDetails(selectedAppointment)}>
                    <Text style={styles.modalOptionText}>View Details</Text>
                  </TouchableOpacity>

                  <TouchableOpacity
                    style={styles.modalOption}
                    onPress={() => handleReschedule(selectedAppointment)}>
                    <Text style={styles.modalOptionText}>Reschedule</Text>
                  </TouchableOpacity>

                  <TouchableOpacity
                    onPress={handleCancelAppointment}
                    style={[styles.modalOption, styles.modalOptionDanger]}>
                    {loading ? (
                      <ActivityIndicator size="small" color="#F44336" />
                    ) : (
                      <Text style={styles.modalOptionTextDanger}>
                        {selectedAppointment?.status === 'not_confirmed'
                          ? 'Reject Appointment'
                          : 'Cancel Appointment'}
                      </Text>
                    )}
                  </TouchableOpacity>
                </View>
              </View>
            </TouchableWithoutFeedback>
          </View>
        </TouchableWithoutFeedback>
      </Modal>
    </View>
  );
};

export default AppointmentCard;

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
  cardContainer: {
    padding: scale(10),
    borderRadius: scale(16),
    backgroundColor: Color.white,
  },
  cardHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: verticalScale(15),
  },
  cardTitle: {
    fontSize: scale(16),
    fontWeight: '500',
    color: Color.textColor,
    fontFamily: Font.Poppins,
  },
  statusText: {
    fontSize: scale(14),
    fontWeight: '500',
    fontFamily: Font.Poppins,
    color: Color.primaryColor,
  },
  appointmentDetails: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: verticalScale(10),
  },
  avatar: {
    width: scale(48),
    height: scale(48),
    borderRadius: scale(24),
    marginRight: scale(12),
  },
  dateTimeContainer: {
    flex: 1,
  },
  dateText: {
    fontSize: scale(14),
    fontWeight: '500',
    color: Color.textColor,
    fontFamily: Font.Poppins,
    marginBottom: verticalScale(4),
  },
  timeText: {
    fontSize: scale(12),
    color: Color.textColor,
    fontFamily: Font.Poppins,
    fontWeight: '400',
  },
  confirmButton: {
    backgroundColor: Color.primaryColor,
    borderRadius: scale(18),
    alignItems: 'center',
    justifyContent: 'center',
    height: verticalScale(33),
  },
  confirmButtonText: {
    color: Color.white,
    fontWeight: '600',
    fontSize: scale(16),
    fontFamily: Font.Poppins,
  },
  paginationContainer: {
    flexDirection: 'row',
    justifyContent: 'center',
    alignItems: 'center',
    paddingTop: verticalScale(3),
    paddingBottom: verticalScale(10),
  },
  paginationDot: {
    height: scale(8),
    borderRadius: scale(4),
    marginHorizontal: scale(3),
  },
  modalContainer: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: 'rgba(0,0,0,0.6)',
  },
  modalView: {
    width: '85%',
    backgroundColor: Color.white,
    borderRadius: scale(15),
    overflow: 'hidden',
  },
  modalHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    padding: scale(15),
  },
  modalTitle: {
    fontSize: scale(16),
    fontWeight: '600',
    color: Color.textColor,
    fontFamily: Font.Poppins,
  },
  closeButton: {
    fontSize: scale(18),
    color: Color.textColor,
    fontWeight: '600',
  },
  modalDivider: {
    height: 1,
    backgroundColor: '#E0E0E0',
  },
  modalContent: {
    padding: scale(10),
  },
  modalOption: {
    padding: scale(15),
    borderRadius: scale(8),
    marginVertical: verticalScale(5),
  },
  modalOptionText: {
    fontSize: scale(15),
    color: Color.textColor,
    fontFamily: Font.Poppins,
  },
  modalOptionDanger: {
    marginTop: verticalScale(10),
  },
  modalOptionTextDanger: {
    color: '#F44336',
    fontSize: scale(15),
    fontFamily: Font.Poppins,
  },
  noAppointmentsContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    padding: scale(20),
  },
  noAppointmentsTitle: {
    fontSize: scale(18),
    fontWeight: '600',
    color: Color.textColor,
    fontFamily: Font.Poppins,
    marginBottom: verticalScale(8),
  },
  noAppointmentsText: {
    fontSize: scale(14),
    color: Color.textColor,
    fontFamily: Font.Poppins,
    textAlign: 'center',
    marginBottom: verticalScale(20),
  },
  bookAppointmentButton: {
    backgroundColor: Color.primaryColor,
    paddingVertical: verticalScale(10),
    paddingHorizontal: scale(20),
    borderRadius: scale(25),
  },
  bookAppointmentText: {
    color: Color.white,
    fontSize: scale(14),
    fontWeight: '600',
    fontFamily: Font.Poppins,
  },
});
