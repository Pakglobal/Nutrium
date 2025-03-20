import React, {useCallback, useEffect, useMemo, useState} from 'react';
import {
  View,
  Text,
  StyleSheet,
  TouchableOpacity,
  Image,
  SafeAreaView,
  ActivityIndicator,
  ScrollView,
  FlatList,
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

  const token = useSelector(state => state?.user?.userInfo?.token);
  const getAllAppointmentData = useSelector(
    state => state?.admin?.appointmentInfo,
  );  

  useEffect(() => {
    const fetchData = async () => {
      if (!token) return;
      setLoading(true);
      try {
        const response = await GetAppointmentData(token);        
        dispatch(appointmentData(response));
      } catch (error) {
        console.error('Error fetching appointments:', error);
      } finally {
        setLoading(false);
      }
    };
    fetchData();
  }, [token]);

  const currentDate = useMemo(() => new Date(), []);

  const formatDate = useCallback(
    dateString => moment(dateString).format('MMMM DD, YYYY'),
    [],
  );
  const formatTime = useCallback(
    isoString => moment(isoString).format('h:mm A'),
    [],
  );

  const groupAppointmentsByDate = useCallback(
    appointments => {
      if (!appointments) return {};
      return appointments.reduce((acc, item) => {
        const dateKey = formatDate(item?.start);
        if (!acc[dateKey]) acc[dateKey] = [];
        acc[dateKey].push(item);
        return acc;
      }, {});
    },
    [formatDate],
  );

  const groupedAppointments = useMemo(() => {
    const filteredAppointments =
      getAllAppointmentData?.getallappointments?.filter(item =>
        selected === 0
          ? new Date(item?.start) < currentDate
          : new Date(item?.start) >= currentDate,
      ) || []; 
    return groupAppointmentsByDate(filteredAppointments);
  }, [getAllAppointmentData, selected, currentDate, groupAppointmentsByDate]);

  const handleSelectedOption = useCallback(
    id => setSelected(id),
    [setSelected],
  );
  const handleMessageCard = useCallback(
    () => navigation.navigate('Chat'),
    [navigation],
  );

  
  
  return (
    <SafeAreaView>
      <View style={styles.optionContainer}>
        {[
          {id: 0, label: 'PREVIOUS'},
          {id: 1, label: 'NEXT'},
        ].map(item => (
          <TouchableOpacity
            key={item.id}
            onPress={() => handleSelectedOption(item.id)}
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
      {loading ? (
  <View style={{ justifyContent: 'center', alignItems: 'center' }}>
    <ActivityIndicator size="large" color={Color.primaryGreen} />
  </View>
) : (
  <View style={{ height: '89%', marginTop: verticalScale(10) }}>
    {groupedAppointments && Object.keys(groupedAppointments).length > 0 ? (
      <FlatList
        data={Object.entries(groupedAppointments)}
        keyExtractor={([date]) => date}
        showsVerticalScrollIndicator={false}
        renderItem={({ item }) => {
          const [date, appointments] = item;
          return (
            <View>
              <Text style={styles.dateHeader}>{date}</Text>
              {appointments.map((appt) => (
                <TouchableOpacity
                  key={appt?._id}
                  style={styles.messageCard}
                  onPress={handleMessageCard}
                >
                  <View style={styles.messageCardContainer}>
                    <View style={styles.avatar} />
                    <View>
                      <View style={{ flexDirection: 'row', alignItems: 'center' }}>
                        <Text style={styles.time}>{formatTime(appt?.start)}</Text>
                        <Text style={{ color: Color.black }}> {appt?.workplace}</Text>
                      </View>
                      <Text style={styles.clientName}>{appt?.clientName}</Text>
                    </View>
                  </View>
                </TouchableOpacity>
              ))}
            </View>
          );
        }}
      />
    ) : (
      <View>
        <Text style={{ color: Color.gray, textAlign: 'center' }}>No Appointments Available</Text>
      </View>
    )}
  </View>
)}

    </SafeAreaView>
  );
};

export default React.memo(AppointmentScreen);

const styles = StyleSheet.create({
  optionContainer: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    height: scale(45),
  },
  dateHeader: {
    fontSize: scale(13),
    marginTop: verticalScale(5),
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
    color: Color.black
  },
  noDataText: {
    textAlign: 'center',
    marginTop: scale(30),
    fontSize: scale(14),
    color: Color.gray,
  },
});
