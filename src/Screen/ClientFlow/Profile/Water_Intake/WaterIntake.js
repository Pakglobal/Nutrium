import {
  StyleSheet,
  Text,
  View,
  Dimensions,
  TouchableOpacity,
  FlatList,
  Modal,
  ScrollView,
  ActivityIndicator,
  SafeAreaView,
} from 'react-native';
import React, {useState, useEffect, useCallback} from 'react';
import BackHeader from '../../../../Components/BackHeader';
import {useFocusEffect, useNavigation} from '@react-navigation/native';
import {
  DeleteWaterIntake,
  GetWaterIntakeDetails,
} from '../../../../Apis/ClientApis/WaterIntakeApi';
import {useDispatch, useSelector} from 'react-redux';
import Icon from 'react-native-vector-icons/MaterialCommunityIcons';
import {BarChart} from 'react-native-gifted-charts';
import {scale, verticalScale} from 'react-native-size-matters';
import Color from '../../../../assets/colors/Colors';
import moment from 'moment';
import Toast from 'react-native-simple-toast';

const WaterIntake = () => {
  const navigation = useNavigation();
  const [dateLabels, setDateLabels] = useState([]);
  const [selectedDate, setSelectedDate] = useState(null);
  const [selectedIntake, setSelectedIntake] = useState([]);
  const [modalVisible, setModalVisible] = useState(false);
  const [selectedEntry, setSelectedEntry] = useState(null);
  const [waterIntake, setWaterIntake] = useState([]);
  const [loading, setLoading] = useState(false);

  const showToast = message => {
    Toast.show(message, Toast.LONG, Toast.BOTTOM);
  };

  const getToken = useSelector(state => state?.user?.userInfo);
  const token = getToken?.token;
  const id = getToken?.userData?._id || getToken?.user?._id;

  const handleDate = selectedDate => {
    try {
      if (!selectedDate || !selectedDate.fullDate) {
        console.warn('Invalid date selected');
        return;
      }

      const formattedDate = selectedDate.fullDate.toISOString().split('T')[0];

      let matchingRecords =
        waterIntake?.waterIntakeData?.waterIntakeRecords?.filter(record => {
          if (!record || !record.date) return false;

          try {
            const recordFormattedDate = new Date(record.date)
              .toISOString()
              .split('T')[0];
            return recordFormattedDate === formattedDate;
          } catch (error) {
            console.error('Error processing record date:', error);
            return false;
          }
        }) || [];

      matchingRecords = matchingRecords.map(record => {
        try {
          const sortedIntake = [...(record.waterIntakeAmount || [])].sort(
            (a, b) => {
              if (!a.time || !b.time) return 0;

              const timeA = a.time ? a.time.split(':').map(Number) : [0, 0];
              const timeB = b.time ? b.time.split(':').map(Number) : [0, 0];

              if (timeA[0] !== timeB[0]) return timeB[0] - timeA[0];
              return timeB[1] - timeA[1];
            },
          );

          return {
            ...record,
            waterIntakeAmount: sortedIntake,
          };
        } catch (error) {
          console.error('Error sorting intake data:', error);
          return record;
        }
      });

      setSelectedDate(formattedDate);
      setSelectedIntake(matchingRecords);
    } catch (error) {
      console.error('Error in handleDate:', error);
    }
  };

  const getLast10Days = () => {
    try {
      const dates = [];
      for (let i = 9; i >= 0; i--) {
        const date = new Date();
        date.setDate(date.getDate() - i);
        dates.push({
          fullDate: date,
          day: date.getDate(),
          month: date.toLocaleString('default', {month: 'short'}),
        });
      }
      return dates;
    } catch (error) {
      console.error('Error in getLast10Days:', error);
      return [];
    }
  };

  useEffect(() => {
    const dates = getLast10Days();
    setDateLabels(dates);
  }, []);

  const getWaterIntakeData = async () => {
    try {
      setLoading(true);

      const response = await GetWaterIntakeDetails(token, id);
      if (response?.success === true) {
        setWaterIntake(response);
      }

      if (selectedDate) {
        let matchingRecords =
          response?.waterIntakeData?.waterIntakeRecords?.filter(record => {
            if (!record || !record.date) return false;

            try {
              const recordFormattedDate = new Date(record.date)
                .toISOString()
                .split('T')[0];
              return recordFormattedDate === selectedDate;
            } catch (error) {
              console.error(
                'Error processing record date in getWaterIntakeData:',
                error,
              );
              return false;
            }
          }) || [];

        matchingRecords = matchingRecords.map(record => {
          try {
            const sortedIntake = [...(record.waterIntakeAmount || [])].sort(
              (a, b) => {
                if (!a.time || !b.time) return 0;

                const timeA = a.time ? a.time.split(':').map(Number) : [0, 0];
                const timeB = b.time ? b.time.split(':').map(Number) : [0, 0];

                if (timeA[0] !== timeB[0]) return timeB[0] - timeA[0];
                return timeB[1] - timeA[1];
              },
            );

            return {
              ...record,
              waterIntakeAmount: sortedIntake,
            };
          } catch (error) {
            console.error(
              'Error sorting intake data in getWaterIntakeData:',
              error,
            );
            return record;
          }
        });

        setSelectedIntake(matchingRecords);
      }
      setLoading(false);
    } catch (error) {
      console.error('Error in getWaterIntakeData:', error);
      setLoading(false);
    }
  };

  useFocusEffect(
    useCallback(() => {
      getWaterIntakeData();
    }, [token, id, selectedDate]),
  );

  const dailyGoal =
    waterIntake?.waterIntakeData?.waterIntakeRecords?.[0]?.DailyGoal || 2000;

  const calculateDailyIntake = (date, records) => {
    if (!records || !date) return 0;

    try {
      const dayRecord = records.find(record => {
        if (!record?.date) return false;
        return record.date.startsWith(date);
      });

      if (!dayRecord?.waterIntakeAmount) return 0;

      return dayRecord.waterIntakeAmount.reduce((total, entry) => {
        const amount = parseInt(entry?.amount) || 0;
        return total + amount;
      }, 0);
    } catch (error) {
      console.error('Error in calculateDailyIntake:', error);
      return 0;
    }
  };

  const formatChartData = useCallback(() => {
    try {
      if (!waterIntake?.waterIntakeData?.waterIntakeRecords) return [];

      return dateLabels.map(dateObj => {
        if (!dateObj?.fullDate) return {value: 0, frontColor: '#2196F3'};

        const formattedDate = dateObj.fullDate.toISOString().split('T')[0];
        const dailyIntake = calculateDailyIntake(
          formattedDate,
          waterIntake.waterIntakeData.waterIntakeRecords,
        );

        const isSelected = selectedDate === formattedDate;

        return {
          value: dailyIntake,
          frontColor: isSelected ? '#1976D2' : '#75BFFF',
          date: formattedDate,
        };
      });
    } catch (error) {
      console.error('Error in formatChartData:', error);
      return [];
    }
  }, [waterIntake, dateLabels, selectedDate]);

  useEffect(() => {
    try {
      const dates = getLast10Days();
      setDateLabels(dates);

      if (dates.length > 0) {
        const today = dates[dates.length - 1];
        handleDate(today);
      }
    } catch (error) {
      console.error('Error in initial date setup:', error);
    }
  }, []);

  const handleEdit = async () => {
    if (selectedEntry) {
      try {
        setLoading(true);
        const entryDate = new Date(selectedEntry?.date);

        navigation.navigate('waterIntakeLog', {
          intake: {
            waterIntakeId: selectedEntry?.waterIntakeId,
            waterRecordId: selectedEntry?.waterRecordId,
            waterIntakeAmountId: selectedEntry?.waterIntakeAmountId,
            date: entryDate,
            amount: selectedEntry?.amount,
            time: selectedEntry?.time,
            token: token,
          },
          isEditing: true,
        });

        setModalVisible(false);
        setLoading(false);
      } catch (error) {
        console.error('Error in handleEdit:', error);
        setLoading(false);
      }
    }
  };

  const handleDelete = async () => {
    try {
      setLoading(true);
      const payload = {
        waterIntakeId: selectedEntry?.waterIntakeId,
        waterRecordId: selectedEntry?.waterRecordId,
        waterIntakeAmountId: selectedEntry?.waterIntakeAmountId,
        token: token,
      };

      const response = await DeleteWaterIntake(payload);

      if (
        response?.message === 'Water intake data deleted successfully.' ||
        response?.success === true
      ) {
        getWaterIntakeData();
      } else {
        showToast(response?.message || 'Failed to delete entry');
      }
      setModalVisible(false);
      setLoading(false);
    } catch (error) {
      showToast('An error occurred while deleting');
      setLoading(false);
    }
  };

  const scrollRef = React.createRef();

  useEffect(() => {
    setTimeout(() => {
      if (scrollRef.current) {
        scrollRef.current.scrollToEnd({animated: true});
      }
    }, 100);
  }, []);

  const selectedDateIntake = selectedDate
    ? calculateDailyIntake(
        selectedDate,
        waterIntake?.waterIntakeData?.waterIntakeRecords,
      )
    : 0;

  const plusData = {
    clientId: waterIntake?.waterIntakeData?.clientId,
    token: token,
    date: selectedDate,
    press: 'plus',
  };

  const formatTime = timeString => {
    if (!timeString) return '';

    try {
      return moment(timeString, 'HH:mm').format('h:mm A');
    } catch (error) {
      console.error('Error formatting time:', error);
      return timeString;
    }
  };

  return (
    <SafeAreaView style={styles.container}>
      <BackHeader
        titleName={'Water intake'}
        onPressBack={() => navigation.goBack()}
        onPress={() =>
          navigation.navigate('waterIntakeLog', {plusData: plusData})
        }
      />

      <ScrollView
        horizontal
        ref={scrollRef}
        scrollEventThrottle={16}
        showsHorizontalScrollIndicator={false}
        style={styles.scrollContainer}>
        <View style={styles.chartWithDates}>
          {dateLabels.map((date, index) => {
            if (!date?.fullDate) return null;

            const formattedDate = date.fullDate.toISOString().split('T')[0];
            const isSelected = selectedDate === formattedDate;

            return (
              <TouchableOpacity
                key={index}
                style={styles.singleDateChart}
                onPress={() => handleDate(date)}>
                <BarChart
                  data={[{value: formatChartData()[index]?.value || 0}]}
                  width={40}
                  height={150}
                  barWidth={20}
                  spacing={0}
                  hideRules
                  hideAxesAndRules
                  xAxisThickness={0}
                  yAxisThickness={0}
                  hideYAxisText
                  maxValue={Math.max(
                    dailyGoal,
                    ...formatChartData().map(item => item.value || 0),
                  )}
                  frontColor={isSelected ? '#1976D2' : '#75BFFF'}
                />
                <View style={styles.dateBox}>
                  <Text style={styles.dateText}>{date.day}</Text>
                  <Text style={styles.monthText}>
                    {date.month?.toUpperCase()}
                  </Text>
                </View>
              </TouchableOpacity>
            );
          })}
        </View>
      </ScrollView>

      <View style={styles.bottomContentContainer}>
        <View style={styles.statsContainer}>
          <View style={styles.statCard}>
            <Text style={styles.statValue}>{selectedDateIntake} mL</Text>
            <Text style={styles.statLabel}>Water intake</Text>
          </View>
          <View style={styles.statCard}>
            <Text style={styles.statValue}>{dailyGoal} mL</Text>
            <Text style={styles.statLabel}>Daily goal</Text>
          </View>
        </View>

        {loading ? (
          <View
            style={{flex: 1, justifyContent: 'center', alignItems: 'center'}}>
            <ActivityIndicator size="large" color={Color.primaryGreen} />
          </View>
        ) : selectedIntake && selectedIntake?.length > 0 ? (
          <View style={styles.entriesContainer}>
            <FlatList
              data={selectedIntake}
              renderItem={({item: record, index: recordIndex}) => (
                <View>
                  <FlatList
                    data={record?.waterIntakeAmount}
                    renderItem={({item: intake, index: intakeIndex}) => (
                      <View style={styles.entryItem}>
                        <View style={styles.entryLeft}>
                          <Icon
                            name="water-outline"
                            size={24}
                            color="#2196F3"
                          />
                          <Text style={styles.entryAmount}>
                            {intake?.amount}
                          </Text>
                        </View>

                        <View style={styles.entryRight}>
                          <Text style={styles.entryTime}>
                            {formatTime(intake?.time)}
                          </Text>
                          <TouchableOpacity
                            onPress={() => {
                              setSelectedEntry({
                                waterIntakeId:
                                  waterIntake?.waterIntakeData?._id,
                                waterRecordId: record?._id,
                                waterIntakeAmountId: intake?._id,
                                date: record?.date,
                                amount: intake?.amount,
                                time: intake?.time,
                              });
                              setModalVisible(true);
                            }}>
                            <Icon
                              name="dots-vertical"
                              size={20}
                              color={Color.gray}
                            />
                          </TouchableOpacity>
                        </View>
                      </View>
                    )}
                    keyExtractor={(item, index) =>
                      `intake-${recordIndex}-${index}-${item?._id || index}`
                    }
                  />
                </View>
              )}
              keyExtractor={(item, index) =>
                `record-${index}-${item?._id || index}`
              }
            />
          </View>
        ) : (
          <View style={{padding: verticalScale(16)}}>
            <Text style={{textAlign: 'center', color: Color.gray}}>
              There are no records of water intake
            </Text>
          </View>
        )}
      </View>

      <Modal
        transparent={true}
        visible={modalVisible}
        animationType="fade"
        onRequestClose={() => setModalVisible(false)}>
        <View style={styles.modalContainer}>
          <View style={styles.modalContent}>
            <TouchableOpacity style={styles.modalOption} onPress={handleEdit}>
              <Text style={styles.modalText}>Edit</Text>
            </TouchableOpacity>
            <TouchableOpacity style={styles.modalOption} onPress={handleDelete}>
              <Text style={styles.modalText}>Delete</Text>
            </TouchableOpacity>
            <TouchableOpacity
              style={styles.modalOption}
              onPress={() => setModalVisible(false)}>
              <Text style={styles.modalText}>Cancel</Text>
            </TouchableOpacity>
          </View>
        </View>
      </Modal>
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#fff',
  },
  scrollContainer: {
    height: verticalScale(0),
  },
  bottomContentContainer: {
    flex: 1,
  },
  chartWithDates: {
    flexDirection: 'row',
    alignItems: 'flex-end',
  },
  singleDateChart: {
    alignItems: 'center',
  },
  dateText: {
    fontSize: scale(13),
    fontWeight: 'bold',
    color: '#000',
  },
  monthText: {
    fontSize: scale(11),
    color: '#888',
  },
  dateBox: {
    alignItems: 'center',
    alignSelf: 'center',
  },
  statsContainer: {
    flexDirection: 'row',
    gap: scale(16),
    marginHorizontal: scale(16),
    marginVertical: verticalScale(10),
  },
  statCard: {
    flex: 1,
    backgroundColor: Color.common,
    padding: scale(16),
    borderRadius: scale(12),
    alignItems: 'center',
  },
  statValue: {
    fontSize: scale(17),
    fontWeight: 'bold',
    marginBottom: verticalScale(4),
    color: Color.black,
  },
  statLabel: {
    fontSize: scale(13),
    color: '#757575',
  },
  entriesContainer: {
    flex: 1,
    marginVertical: verticalScale(5),
  },
  entryItem: {
    marginHorizontal: scale(16),
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingVertical: verticalScale(8),
    borderBottomWidth: 1,
    borderBottomColor: '#EEEEEE',
  },
  entryLeft: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: scale(12),
  },
  entryAmount: {
    fontSize: scale(15),
    color: Color.black,
  },
  entryRight: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: scale(12),
  },
  entryTime: {
    color: '#757575',
    fontSize: scale(13),
  },
  modalContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: 'rgba(0, 0, 0, 0.5)',
  },
  modalContent: {
    backgroundColor: '#fff',
    padding: scale(15),
    borderRadius: scale(10),
    width: scale(200),
    height: scale(160),
    alignItems: 'center',
    justifyContent: 'center',
  },
  modalOption: {
    marginVertical: verticalScale(10),
  },
  modalText: {
    fontSize: scale(15),
    textAlign: 'center',
    color: Color.black,
  },
});

export default WaterIntake;
