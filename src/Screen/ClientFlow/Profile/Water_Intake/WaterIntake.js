import {
  StyleSheet,
  Text,
  View,
  TouchableOpacity,
  FlatList,
  Modal,
  ScrollView,
  SafeAreaView,
} from 'react-native';
import React, {useState, useEffect, useCallback, useMemo} from 'react';
import {useNavigation} from '@react-navigation/native';
import {
  DeleteWaterIntake,
  GetWaterIntakeDetails,
  GetWaterintakeLimitData,
} from '../../../../Apis/ClientApis/WaterIntakeApi';
import {useDispatch, useSelector} from 'react-redux';
import Icon from 'react-native-vector-icons/MaterialCommunityIcons';
import Ionicons from 'react-native-vector-icons/Ionicons';
import {BarChart} from 'react-native-gifted-charts';
import {scale, verticalScale} from 'react-native-size-matters';
import moment from 'moment';
import Header from '../../../../Components/Header';
import {Font} from '../../../../assets/styles/Fonts';
import {Color} from '../../../../assets/styles/Colors';
import ModalComponent from '../../../../Components/ModalComponent';
import CustomShadow from '../../../../Components/CustomShadow';
import {getWaterIntake} from '../../../../redux/client';
import CustomLoader from '../../../../Components/CustomLoader';

const WaterIntake = () => {
  const navigation = useNavigation();
  const dispatch = useDispatch();
  const scrollRef = React.createRef();

  const [dateLabels, setDateLabels] = useState([]);
  const [selectedDate, setSelectedDate] = useState(null);
  const [selectedIntake, setSelectedIntake] = useState([]);
  const [modalVisible, setModalVisible] = useState(false);
  const [selectedEntry, setSelectedEntry] = useState(null);
  const [waterIntake, setWaterIntake] = useState(null);
  const [loading, setLoading] = useState(true);
  const [limit, setLimit] = useState('');
  const [menuPosition, setMenuPosition] = useState({x: 0, y: 0});

  const tokenId = useSelector(state => state?.user?.token);
  const guestTokenId = useSelector(state => state?.user?.guestToken);
  const token = tokenId?.token || guestTokenId?.token;
  const id = tokenId?.id || guestTokenId?.id;

  // Utility to filter and sort water intake records
  const filterAndSortRecords = useCallback((records, date) => {
    if (!records || !date) return [];

    const formattedDate = date.toISOString().split('T')[0];
    return records
      .filter(record => {
        if (!record?.date) return false;
        try {
          return (
            new Date(record.date).toISOString().split('T')[0] === formattedDate
          );
        } catch (error) {
          console.error('Error processing record date:', error);
          return false;
        }
      })
      .map(record => ({
        ...record,
        waterIntakeAmount: [...(record.waterIntakeAmount || [])].sort(
          (a, b) => {
            if (!a.time || !b.time) return 0;
            const timeA = a.time.split(':').map(Number);
            const timeB = b.time.split(':').map(Number);
            if (timeA[0] !== timeB[0]) return timeB[0] - timeA[0];
            return timeB[1] - timeA[1];
          },
        ),
      }));
  }, []);

  // Handle date selection
  const handleDate = useCallback(
    date => {
      if (!date?.fullDate) {
        console.warn('Invalid date selected');
        return;
      }
      const formattedDate = date.fullDate.toISOString().split('T')[0];
      setSelectedDate(formattedDate);
      if (waterIntake?.waterIntakeData?.waterIntakeRecords) {
        setSelectedIntake(
          filterAndSortRecords(
            waterIntake.waterIntakeData.waterIntakeRecords,
            date.fullDate,
          ),
        );
      }
    },
    [waterIntake, filterAndSortRecords],
  );

  // Generate last 10 days
  const getLast10Days = useCallback(() => {
    const dates = [];
    for (let i = 10; i >= 0; i--) {
      const date = new Date();
      date.setDate(date.getDate() - i);
      dates.push({
        fullDate: date,
        day: date.getDate(),
        month: date.toLocaleString('default', {month: 'short'}),
      });
    }
    return dates;
  }, []);

  // Calculate daily intake
  const calculateDailyIntake = useCallback((date, records) => {
    if (!records || !date) return 0;
    const formattedDate = date.toISOString().split('T')[0];
    const dayRecord = records.find(record =>
      record?.date?.startsWith(formattedDate),
    );
    return (
      dayRecord?.waterIntakeAmount?.reduce(
        (total, entry) => total + (parseInt(entry?.amount) || 0),
        0,
      ) || 0
    );
  }, []);

  // Format chart data
  const chartData = useMemo(
    () =>
      dateLabels.map(dateObj => {
        if (!dateObj?.fullDate) return {value: 0, frontColor: '#75BFFF'};
        const formattedDate = dateObj.fullDate.toISOString().split('T')[0];
        const dailyIntake = calculateDailyIntake(
          dateObj.fullDate,
          waterIntake?.waterIntakeData?.waterIntakeRecords,
        );
        return {
          value: dailyIntake,
          frontColor: selectedDate === formattedDate ? '#1976D2' : '#75BFFF',
          date: formattedDate,
        };
      }),
    [dateLabels, waterIntake, selectedDate, calculateDailyIntake],
  );

  // Fetch water intake data
  const getWaterIntakeData = useCallback(async () => {
    try {
      setLoading(true);
      const response = await GetWaterIntakeDetails(token, id);
      if (response?.success) {
        setWaterIntake(response);
        if (selectedDate) {
          setSelectedIntake(
            filterAndSortRecords(
              response.waterIntakeData.waterIntakeRecords,
              new Date(selectedDate),
            ),
          );
        }
      }
    } catch (error) {
      console.error('Error fetching water intake:', error);
    } finally {
      setLoading(false);
    }
  }, [token, id, selectedDate, filterAndSortRecords]);

  // Fetch water limit
  const getWaterLimit = useCallback(async () => {
    try {
      const response = await GetWaterintakeLimitData(token, id);
      setLimit(response?.waterIntakeLimit?.waterIntakeLimit || '');
    } catch (error) {
      console.error('Error fetching water limit:', error);
    }
  }, [token, id]);

  // Initial setup
  useEffect(() => {
    const dates = getLast10Days();
    setDateLabels(dates);
    if (dates.length > 0) {
      handleDate(dates[dates.length - 1]);
    }
  }, [getLast10Days, handleDate]);

  // Fetch data on mount or token/id change
  useEffect(() => {
    getWaterIntakeData();
    getWaterLimit();
  }, [token, id, getWaterIntakeData, getWaterLimit]);

  // Scroll to end on mount
  useEffect(() => {
    setTimeout(() => {
      scrollRef.current?.scrollToEnd({animated: true});
    }, 100);
  }, []);

  // Dispatch selected date intake
  const selectedDateIntake = useMemo(
    () =>
      selectedDate
        ? calculateDailyIntake(
            new Date(selectedDate),
            waterIntake?.waterIntakeData?.waterIntakeRecords,
          )
        : 0,
    [selectedDate, waterIntake, calculateDailyIntake],
  );

  useEffect(() => {
    dispatch(getWaterIntake(selectedDateIntake));
  }, [dispatch, selectedDateIntake]);

  // Handle delete
  const handleDelete = useCallback(async () => {
    setModalVisible(false);
    if (!selectedEntry) return;

    const payload = {
      waterIntakeId: selectedEntry.waterIntakeId,
      waterRecordId: selectedEntry.waterRecordId,
      waterIntakeAmountId: selectedEntry.waterIntakeAmountId,
      token,
    };

    try {
      const response = await DeleteWaterIntake(payload);
      if (
        response?.success ||
        response?.message === 'Water intake data deleted successfully.'
      ) {
        // Update waterIntake state locally
        setWaterIntake(prev => {
          if (!prev?.waterIntakeData?.waterIntakeRecords) return prev;

          const updatedRecords = prev.waterIntakeData.waterIntakeRecords
            .map(record => {
              if (record._id === selectedEntry.waterRecordId) {
                return {
                  ...record,
                  waterIntakeAmount: record.waterIntakeAmount.filter(
                    intake => intake._id !== selectedEntry.waterIntakeAmountId,
                  ),
                };
              }
              return record;
            })
            .filter(record => record.waterIntakeAmount.length > 0); // Remove records with no intake

          return {
            ...prev,
            waterIntakeData: {
              ...prev.waterIntakeData,
              waterIntakeRecords: updatedRecords,
            },
          };
        });

        // Update selectedIntake state locally
        setSelectedIntake(prev =>
          prev
            .map(record => {
              if (record._id === selectedEntry.waterRecordId) {
                return {
                  ...record,
                  waterIntakeAmount: record.waterIntakeAmount.filter(
                    intake => intake._id !== selectedEntry.waterIntakeAmountId,
                  ),
                };
              }
              return record;
            })
            .filter(record => record.waterIntakeAmount.length > 0),
        );
      } else {
        console.warn(response?.message || 'Failed to delete entry');
      }
    } catch (error) {
      console.error('Error deleting entry:', error);
    }
  }, [selectedEntry, token]);

  // Handle edit
  const handleEdit = useCallback(() => {
    if (selectedEntry) {
      navigation.navigate('waterIntakeLog', {
        intake: {
          waterIntakeId: selectedEntry.waterIntakeId,
          waterRecordId: selectedEntry.waterRecordId,
          waterIntakeAmountId: selectedEntry.waterIntakeAmountId,
          date: new Date(selectedEntry.date),
          amount: selectedEntry.amount,
          time: selectedEntry.time,
          token,
        },
        isEditing: true,
      });
      setModalVisible(false);
    }
  }, [selectedEntry, token, navigation]);

  // Format time
  const formatTime = useCallback(timeString => {
    if (!timeString) return '';
    return moment(timeString, 'HH:mm').format('h:mm A');
  }, []);

  // Handle dot menu press
  const handleDotMenuPress = useCallback(
    (event, entry) => {
      setMenuPosition({x: event.nativeEvent.pageX, y: event.nativeEvent.pageY});
      setSelectedEntry({
        waterIntakeId: waterIntake?.waterIntakeData?._id,
        waterRecordId: entry.recordId,
        waterIntakeAmountId: entry.intakeId,
        date: entry.date,
        amount: entry.amount,
        time: entry.time,
      });
      setModalVisible(true);
    },
    [waterIntake],
  );

  const dailyGoal = limit ? limit * 1000 : 0;
  const hasData =
    selectedIntake?.length > 0 &&
    selectedIntake[0]?.waterIntakeAmount?.length > 0;
  const plusData = {clientId: id, token, date: selectedDate, press: 'plus'};

  return (
    <SafeAreaView style={styles.container}>
      <Header
        onPress={() => navigation.goBack()}
        screenheader
        screenName="Water intake"
        handlePlus={() => navigation.navigate('waterIntakeLog', {plusData})}
        plus
        rightHeaderButton
      />

      <View style={{height: verticalScale(220)}}>
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
                  key={`${date.day}-${date.month}`}
                  style={styles.singleDateChart}
                  onPress={() => handleDate(date)}>
                  <BarChart
                    data={[{value: chartData[index]?.value || 0}]}
                    width={50}
                    height={150}
                    barWidth={35}
                    spacing={0}
                    hideRules
                    hideAxesAndRules
                    xAxisThickness={0}
                    yAxisThickness={0}
                    barBorderRadius={6}
                    hideYAxisText
                    maxValue={Math.max(
                      dailyGoal,
                      ...chartData.map(item => item.value || 0),
                    )}
                    frontColor={
                      isSelected ? Color.primaryColor : Color.primaryLight
                    }
                  />
                  <View style={styles.dateBox}>
                    <Text style={styles.dateText}>{date.day}</Text>
                    <Text style={styles.monthText}>
                      {date.month.toUpperCase()}
                    </Text>
                  </View>
                </TouchableOpacity>
              );
            })}
          </View>
        </ScrollView>
      </View>

      <View style={styles.bottomContentContainer}>
        <View style={styles.statsContainer}>
          <View style={{width: '46%'}}>
            <CustomShadow color={Color.lightgray}>
              <View style={styles.mlContainer}>
                <Text style={styles.statValue}>{selectedDateIntake} mL</Text>
                <Text style={styles.statLabel}>Water intake</Text>
              </View>
            </CustomShadow>
          </View>
          <View style={{width: '46%'}}>
            <CustomShadow color={Color.lightgray}>
              <View style={styles.mlContainer}>
                <Text style={styles.statValue}>{dailyGoal} mL</Text>
                <Text style={styles.statLabel}>Daily goal</Text>
              </View>
            </CustomShadow>
          </View>
        </View>

        {loading ? (
          <CustomLoader style={{marginTop: verticalScale(25)}} />
        ) : hasData ? (
          <View style={styles.entriesContainer}>
            <FlatList
              data={selectedIntake}
              renderItem={({item: record, index: recordIndex}) => (
                <FlatList
                  data={record?.waterIntakeAmount}
                  renderItem={({item: intake, index: intakeIndex}) => (
                    <View style={styles.entryItem}>
                      <View style={styles.entryLeft}>
                        <Ionicons
                          name="water"
                          size={24}
                          color={Color.primaryColor}
                        />
                        <Text style={styles.entryAmount}>{intake?.amount}</Text>
                      </View>
                      <View style={styles.entryRight}>
                        <Text style={styles.entryTime}>
                          {formatTime(intake?.time)}
                        </Text>
                        <TouchableOpacity
                          onPress={event =>
                            handleDotMenuPress(event, {
                              recordId: record?._id,
                              intakeId: intake?._id,
                              date: record?.date,
                              amount: intake?.amount,
                              time: intake?.time,
                            })
                          }>
                          <Icon
                            name="dots-vertical"
                            size={24}
                            color={Color.primaryColor}
                          />
                        </TouchableOpacity>
                      </View>
                    </View>
                  )}
                  keyExtractor={item =>
                    `intake-${item?._id || `${recordIndex}-${intakeIndex}`}`
                  }
                />
              )}
              keyExtractor={item => `record-${item?._id || recordIndex}`}
            />
          </View>
        ) : (
          <View style={styles.noDataContainer}>
            <Text style={styles.noDataText}>
              There are no records of water intake
            </Text>
          </View>
        )}
      </View>

      <ModalComponent
        visible={modalVisible}
        handleEdit={handleEdit}
        modalstyle={{position: 'absolute', right: 20, top: menuPosition.y - 80}}
        handleDelete={handleDelete}
        setModalVisible={() => setModalVisible(false)}
      />
    </SafeAreaView>
  );
};

export default WaterIntake;

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: Color.white,
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
    fontSize: scale(12),
    fontWeight: 'bold',
    color: Color.black,
  },
  monthText: {
    fontSize: scale(10),
    color: '#888',
  },
  dateBox: {
    alignItems: 'center',
    alignSelf: 'center',
  },
  statsContainer: {
    flexDirection: 'row',
    gap: scale(16),
    justifyContent: 'space-between',
    paddingHorizontal: scale(16),
    marginTop: verticalScale(40),
    marginBottom: verticalScale(20),
    width: '100%',
  },
  statValue: {
    fontSize: scale(20),
    fontWeight: '600',
    color: Color.textColor,
    fontFamily: Font.Poppins,
    textAlign: 'center',
  },
  statLabel: {
    fontSize: scale(16),
    color: Color.textColor,
    textAlign: 'center',
    fontFamily: Font.Poppins,
  },
  mlContainer: {
    backgroundColor: Color.white,
    borderRadius: scale(10),
    padding: scale(10),
  },
  entriesContainer: {
    flex: 1,
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
    fontSize: scale(14),
    color: Color.textColor,
    fontWeight: '500',
    fontFamily: Font.Poppins,
    marginTop: verticalScale(2),
  },
  entryRight: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: scale(12),
  },
  entryTime: {
    color: '#767878',
    fontSize: scale(14),
    fontFamily: Font.Poppins,
    marginTop: verticalScale(2),
  },
  noDataContainer: {
    margin: scale(10),
    alignItems: 'center',
  },
  noDataText: {
    textAlign: 'center',
    color: Color.textColor,
    fontSize: scale(13),
    fontFamily: Font.PoppinsMedium,
  },
});
