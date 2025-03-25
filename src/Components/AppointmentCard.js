import React, {useState, useEffect, useCallback} from 'react';
import {
  View,
  Text,
  Image,
  TouchableOpacity,
  Modal,
  Pressable,
  TouchableWithoutFeedback,
  StyleSheet,
  FlatList,
  ActivityIndicator,
} from 'react-native';
import {useSelector} from 'react-redux';
import FontAwesome from 'react-native-vector-icons/FontAwesome';
import MaterialIcons from 'react-native-vector-icons/MaterialIcons';
import moment from 'moment';
import {scale, verticalScale} from 'react-native-size-matters';
import Color from '../assets/colors/Colors';
import {
  GetAppointmentByClientId,
  UpdateAppointmentStatus,
} from '../Apis/ClientApis/ClientAppointmentApi';
import {useFocusEffect} from '@react-navigation/native';

const AppointmentCard = ({
  refreshAppointments,
  activeAppointments,
  selectedAppointment,
  setSelectedAppointment,
  setActiveAppointments,
}) => {
  const userInfo = useSelector(state => state?.user?.userInfo);
  const token = userInfo?.token;
  const id = userInfo?.userData?._id || userInfo?.user?._id;

  const [isModalVisible, setModalVisible] = useState(false);
  const [loading, setLoading] = useState(false);

  const formatDate = isoString =>
    isoString ? moment(isoString).format('dddd, D MMMM') : '';
  const formatTime = isoString =>
    isoString ? moment(isoString).format('h:mm A') : '';

  const handleCancelAppointment = async () => {
    if (!selectedAppointment) return;
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
    }
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
    } catch (error) {
      console.error('Error confirming appointment:', error);

      const resetAppointments = activeAppointments.map(app => ({
        ...app,
        isLoading: false,
      }));
      setActiveAppointments(resetAppointments);
    }
  };

  const renderAppointmentItem = ({item}) => {
    const date = formatDate(item?.start);
    const time = `${formatTime(item?.start)} - ${formatTime(item?.end)}`;
    const isPending = item?.status === 'not_confirmed';

    return (
      <View
        style={[
          styles.cardContainer,
          {
            backgroundColor: isPending
              ? 'rgba(232, 150, 106, 0.3)'
              : Color.common,
          },
        ]}>
        <View style={styles.header}>
          <Text style={styles.title}>Appointment</Text>
          <View style={styles.status}>
            <FontAwesome name="calendar" size={14} color="#D97848" />
            <Text style={styles.statusText}>
              {isPending
                ? 'Pending'
                : item?.status.charAt(0)?.toUpperCase() + item?.status.slice(1)}
            </Text>
          </View>
        </View>

        <View style={styles.card}>
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
          <View style={styles.details}>
            <Text style={styles.date}>{date}</Text>
            <View style={styles.timeRow}>
              <FontAwesome name="clock-o" size={14} color="#555" />
              <Text style={styles.time}>{time}</Text>
            </View>
          </View>

          <TouchableOpacity
            onPress={() => {
              setSelectedAppointment(item);
              setModalVisible(true);
            }}>
            <MaterialIcons name="more-vert" size={24} color="#555" />
          </TouchableOpacity>
        </View>

        {isPending && (
          <TouchableOpacity
            style={styles.confirmButton}
            onPress={() => handleConfirm(item)}
            disabled={item.isLoading}>
            <Text style={styles.confirmText}>
              {item.isLoading ? 'Confirming...' : 'Confirm'}
            </Text>
          </TouchableOpacity>
        )}
      </View>
    );
  };
  return (
    <View style={styles.container}>
      {activeAppointments?.length > 0 ? (
        <FlatList
          data={activeAppointments}
          renderItem={renderAppointmentItem}
          keyExtractor={item => item?._id}
        />
      ) : (
null
      )}

      <Modal
        visible={isModalVisible}
        onRequestClose={() => setModalVisible(false)}
        transparent={true}>
        <TouchableWithoutFeedback onPress={() => setModalVisible(false)}>
          <View style={styles.modalContainer}>
            <View style={styles.modalView}>
              <View style={{marginHorizontal: scale(20)}}>
                <Pressable style={{marginBottom: verticalScale(12)}}>
                  <Text style={{fontSize: scale(15), color: Color.txt}}>
                    Manage appointment
                  </Text>
                </Pressable>

                <TouchableOpacity
                  onPress={handleCancelAppointment}
                  style={{marginVertical: verticalScale(10)}}>
                  <Text style={styles.modalTxt}>
                    {selectedAppointment?.status === 'not_confirmed'
                      ? 'Reject Appointment'
                      : 'Cancel Appointment'}
                  </Text>
                </TouchableOpacity>
              </View>
            </View>
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
  },
  loaderContainer: {
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: 'rgba(255, 255, 255, 0.7)',
    zIndex: 999,
  },
  cardContainer: {
    borderRadius: scale(15),
    padding: scale(10),
    marginHorizontal: scale(16),
    marginTop: scale(10),
  },
  header: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  title: {
    fontSize: scale(15),
    fontWeight: '600',
    color: Color.black,
  },
  status: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: scale(5),
    padding: scale(5),
    borderRadius: scale(10),
  },
  statusText: {
    color: Color.secondary,
    fontSize: scale(13),
    fontWeight: '600',
    marginLeft: scale(5),
  },
  card: {
    flexDirection: 'row',
    alignItems: 'center',
    padding: scale(10),
    borderRadius: scale(15),
  },
  avatar: {
    width: scale(40),
    height: scale(40),
    borderRadius: scale(20),
    marginRight: scale(10),
  },
  details: {
    flex: 1,
  },
  date: {
    fontSize: scale(14),
    fontWeight: '500',
    color: Color.black,
  },
  timeRow: {
    flexDirection: 'row',
    alignItems: 'center',
    marginTop: verticalScale(5),
  },
  time: {
    fontSize: scale(12),
    color: Color.black,
    marginLeft: scale(5),
    marginTop: verticalScale(2),
  },
  moreIcon: {
    backgroundColor: Color.primary,
    padding: scale(5),
    borderRadius: scale(10),
  },
  confirmButton: {
    backgroundColor: Color.secondary,
    padding: scale(10),
    borderRadius: scale(20),
    marginTop: verticalScale(10),
    alignItems: 'center',
  },
  confirmText: {
    color: Color.primary,
    fontWeight: '600',
    fontSize: scale(16),
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
    borderRadius: scale(10),
  },
  modalTxt: {
    fontSize: scale(13),
    color: Color.txt,
  },
});
