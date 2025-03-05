import React, {useCallback, useEffect, useState} from 'react';
import {
  View,
  Text,
  StyleSheet,
  TouchableOpacity,
  Image,
  SafeAreaView,
} from 'react-native';
import {scale, verticalScale} from 'react-native-size-matters';
import Color from '../../../assets/colors/Colors';
import {useFocusEffect, useNavigation} from '@react-navigation/native';
import {useDispatch, useSelector} from 'react-redux';
import {GetAppointmentData} from '../../../Apis/AdminScreenApi/AppointmentApi';
import {appointmentData} from '../../../redux/admin';
import moment from 'moment';

const AppointmentScreen = ({selected, setSelected}) => {
  const navigation = useNavigation();
  const dispatch = useDispatch();

  const [loading, setLoading] = useState(false);

  if (loading) {
    return (
      <View
        style={{
          flex: 1,
          justifyContent: 'center',
          alignItems: 'center',
        }}>
        <ActivityIndicator size="large" color={Color.primaryGreen} />
      </View>
    );
  }

  useEffect(() => {
    const fetchData = async () => {
      try {
        setLoading(true);
        const response = await GetAppointmentData(token);
        dispatch(appointmentData(response));
        setLoading(false);
      } catch (error) {
        console.error('Error fetching clients:', error);
      } finally {
        setLoading(false);
      }
    };
    fetchData();
  }, []);

  const getToken = useSelector(state => state?.user?.userInfo);
  const token = getToken?.token;

  const getAllAppointmentData = useSelector(
    state => state?.admin?.appointmentInfo,
  );

  const currentDate = new Date();

  // const formatTime = dateString => {
  //   const date = new Date(dateString);
  //   let hours = date.getHours();
  //   const minutes = String(date.getMinutes()).padStart(2, '0');
  //   const amPm = hours >= 12 ? 'PM' : 'AM';
  //   hours = hours % 12 || 12;

  //   return `${hours}:${minutes} ${amPm}`;
  // };

  // const formatDate = dateString => {
  //   const date = new Date(dateString);
  //   const monthNames = [
  //     'January',
  //     'February',
  //     'March',
  //     'April',
  //     'May',
  //     'June',
  //     'July',
  //     'August',
  //     'September',
  //     'October',
  //     'November',
  //     'December',
  //   ];
  //   const month = monthNames[date.getMonth()];
  //   const day = String(date.getDate()).padStart(2, '0');

  //   return `${month} ${day}`;
  // };

  const formatDate = dateString => {
    return moment(dateString).format('MMMM DD');
  };

  const formatTime = isoString => {
    return moment(isoString).format('h.mm A');
  };

  const groupAppointmentsByDate = appointments => {
    if (!appointments) return {};

    return appointments.reduce((acc, item) => {
      const dateKey = formatDate(item?.start);
      if (!acc[dateKey]) acc[dateKey] = [];
      acc[dateKey].push(item);
      return acc;
    }, {});
  };

  const previousAppointments = groupAppointmentsByDate(
    getAllAppointmentData?.getallappointments?.filter(
      item => new Date(item?.start) < currentDate,
    ),
  );

  const nextAppointments = groupAppointmentsByDate(
    getAllAppointmentData?.getallappointments?.filter(
      item => new Date(item?.start) >= currentDate,
    ),
  );

  const options = [
    {id: 0, label: 'PREVIOUS'},
    {id: 1, label: 'NEXT'},
  ];

  const handleSelectedOption = id => {
    setSelected(id);
  };

  const handleMessageCard = () => {
    navigation.navigate('Chat');
  };

  return (
    <SafeAreaView>
      <View style={styles.optionContainer}>
        {options.map(item => (
          <TouchableOpacity
            key={item?.id}
            onPress={() => handleSelectedOption(item?.id)}
            style={{
              flex: 1,
              justifyContent: 'center',
              alignItems: 'center',
              backgroundColor:
                item?.id === selected ? Color.primaryGreen : Color.primary,
            }}>
            <Text
              style={{
                color: item?.id === selected ? Color.primary : Color.black,
                fontSize: scale(14),
              }}>
              {item?.label}
            </Text>
          </TouchableOpacity>
        ))}
      </View>

      {selected === 0 && (
        <View>
          {Object.keys(previousAppointments).length > 0 ? (
            Object.entries(previousAppointments).map(([date, items]) => (
              <View key={date}>
                <Text style={styles.dateHeader}>{date}</Text>
                {items.map(item => (
                  <TouchableOpacity
                    style={styles.messageCard}
                    onPress={handleMessageCard}
                    key={item?._id}>
                    <View style={styles.messageCardContainer}>
                      <View style={styles.avatar} />
                      <View>
                        <View
                          style={{flexDirection: 'row', alignItems: 'center'}}>
                          <Text style={styles.time}>
                            {formatTime(item?.start)}
                          </Text>
                          <Text> {item?.workplace}</Text>
                        </View>
                        <Text style={styles.clientName}>
                          {item?.clientName}
                        </Text>
                      </View>
                    </View>
                  </TouchableOpacity>
                ))}
              </View>
            ))
          ) : (
            <Text style={styles.noDataText}>No Previous Appointments</Text>
          )}
        </View>
      )}

      {selected === 1 && (
        <View>
          {Object.keys(nextAppointments).length > 0 ? (
            Object.entries(nextAppointments).map(([date, items]) => (
              <View key={date}>
                <Text style={styles.dateHeader}>{date}</Text>
                {items.map(item => (
                  <TouchableOpacity
                    style={styles.messageCard}
                    onPress={handleMessageCard}
                    key={item?._id}>
                    <View style={styles.messageCardContainer}>
                      <View style={styles.avatar} />
                      <View>
                        <View
                          style={{flexDirection: 'row', alignItems: 'center'}}>
                          <Text style={styles.time}>
                            {formatTime(item?.start)}
                          </Text>
                          <Text> {item?.workplace}</Text>
                        </View>
                        <Text style={styles.clientName}>
                          {item?.clientName}
                        </Text>
                      </View>
                    </View>
                  </TouchableOpacity>
                ))}
              </View>
            ))
          ) : (
            <Text style={styles.noDataText}>No Upcoming Appointments</Text>
          )}
        </View>
      )}
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  optionContainer: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    height: scale(45),
  },
  dateHeader: {
    fontSize: scale(13),
    marginTop: verticalScale(10),
    fontWeight: '600',
    color: Color.gray,
  },
  messageCardContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    padding: scale(10),
    paddingVertical: verticalScale(10),
  },
  messageCard: {
    backgroundColor: '#fff',
    marginTop: scale(5),
    borderLeftColor: Color.primaryGreen,
    borderLeftWidth: 2,
    borderRadius: scale(5),
  },
  avatar: {
    width: scale(40),
    height: scale(40),
    borderRadius: 25,
    marginRight: scale(10),
    backgroundColor: Color.primaryGreen,
  },
  clientName: {
    fontSize: scale(12),
    color: '#777',
  },
  time: {
    fontWeight: 'bold',
    fontSize: scale(13),
  },
  noDataText: {
    textAlign: 'center',
    marginTop: scale(30),
    fontSize: scale(14),
    color: Color.gray,
  },
});

export default AppointmentScreen;
