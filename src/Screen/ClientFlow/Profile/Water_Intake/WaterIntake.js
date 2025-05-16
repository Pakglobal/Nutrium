import {
  StyleSheet,
  Text,
  View,
  Dimensions,
  TouchableOpacity,
  FlatList,
  Modal,
  ScrollView,
  SafeAreaView,
} from 'react-native';
import React, {useState, useEffect, useCallback} from 'react';
import {useFocusEffect, useNavigation} from '@react-navigation/native';
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

  const [dateLabels, setDateLabels] = useState([]);
  const [selectedDate, setSelectedDate] = useState(null);
  const [selectedIntake, setSelectedIntake] = useState([]);
  const [modalVisible, setModalVisible] = useState(false);
  const [selectedEntry, setSelectedEntry] = useState(null);
  const [waterIntake, setWaterIntake] = useState([]);
  const [loading, setLoading] = useState(false);
  const [dataFetched, setDataFetched] = useState(false);
  const [limit, setLimit] = useState('');
  const [menuPosition, setMenuPosition] = useState({x: 0, y: 0});
  const [highlightEdit, setHighlightEdit] = useState(false);
  const [highlightCancel, setHighlightCancel] = useState(false);

  const tokenId = useSelector(state => state?.user?.token);
  const guestTokenId = useSelector(state => state?.user?.guestToken);
  const token = tokenId?.token || guestTokenId?.token;
  const id = tokenId?.id || guestTokenId?.id;

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
    } catch (error) {
      console.error('Error in getLast10Days:', error);
      return [];
    }
  };

  const getWaterIntakeData = async () => {
    try {
      if (!dataFetched) {
        setLoading(true);
      }
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
      setDataFetched(true);
      setLoading(false);
    } catch (error) {
      console.error('Error in getWaterIntakeData:', error);
      setDataFetched(true);
      setLoading(false);
    }
  };

  const getWaterLimit = async () => {
    try {
      const data = await GetWaterintakeLimitData(token, id);
      setLimit(data?.waterIntakeLimit?.waterIntakeLimit);
    } catch (error) {
      console.error('Error in getWaterLimit:', error);
    }
  };

  const handleDataRefresh = () => {
    setDataFetched(false);
  };

  useFocusEffect(
    useCallback(() => {
      if (!dataFetched) {
        getWaterIntakeData();
        getWaterLimit();
      }
    }, [token, id, dataFetched]),
  );

  useEffect(() => {
    if (dataFetched && selectedDate) {
      handleDate({fullDate: new Date(selectedDate)});
    }
  }, [selectedDate, dataFetched]);

  const dailyGoal = limit * 1000 || 2000;

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
        setHighlightEdit(true);
        setTimeout(() => {
          setHighlightEdit(false);
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
            onEditComplete: handleDataRefresh,
          });
          setModalVisible(false);
        }, 200);
      } catch (error) {
        console.error('Error in handleEdit:', error);
        setLoading(false);
      }
    }
  };

  const handleCancel = async () => {
    setHighlightCancel(true);
    setTimeout(() => {
      setHighlightCancel(false);
      setModalVisible(false);
    }, 200);
  };

  const handleDelete = async () => {
    setModalVisible(false);

    const previousSelectedIntake = [...selectedIntake];
    const previousWaterIntake = {...waterIntake};

    const updatedIntake = selectedIntake
      .map(record => {
        if (record._id === selectedEntry?.waterRecordId) {
          return {
            ...record,
            waterIntakeAmount: record.waterIntakeAmount.filter(
              intake => intake._id !== selectedEntry?.waterIntakeAmountId,
            ),
          };
        }
        return record;
      })
      .filter(record => record.waterIntakeAmount.length > 0);

    const updatedWaterIntake = {
      ...waterIntake,
      waterIntakeData: {
        ...waterIntake.waterIntakeData,
        waterIntakeRecords: waterIntake.waterIntakeData.waterIntakeRecords
          .map(record => {
            if (record._id === selectedEntry?.waterRecordId) {
              return {
                ...record,
                waterIntakeAmount: record.waterIntakeAmount.filter(
                  intake => intake._id !== selectedEntry?.waterIntakeAmountId,
                ),
              };
            }
            return record;
          })
          .filter(record => record.waterIntakeAmount.length > 0),
      },
    };

    setSelectedIntake(updatedIntake);
    setWaterIntake(updatedWaterIntake);

    const payload = {
      waterIntakeId: selectedEntry?.waterIntakeId,
      waterRecordId: selectedEntry?.waterRecordId,
      waterIntakeAmountId: selectedEntry?.waterIntakeAmountId,
      token: token,
    };

    try {
      const response = await DeleteWaterIntake(payload);
      if (
        response?.message !== 'Water intake data deleted successfully.' &&
        response?.success !== true
      ) {
        setSelectedIntake(previousSelectedIntake);
        setWaterIntake(previousWaterIntake);
        showToast(response?.message || 'Failed to delete entry');
      }
    } catch (error) {
      setSelectedIntake(previousSelectedIntake);
      setWaterIntake(previousWaterIntake);
      showToast('An error occurred while deleting');
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

  useEffect(() => {
    if (selectedDateIntake) {
      dispatch(getWaterIntake(selectedDateIntake));
    }
  }, [selectedDateIntake, dispatch]);

  const plusData = {
    clientId: id,
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

  const handleDotMenuPress = (event, entry, intakeIndex, totalIntakes) => {
    const pageX = event.nativeEvent.pageX;
    const pageY = event.nativeEvent.pageY;
    const isLastThree = intakeIndex >= totalIntakes - 3 && totalIntakes >= 3;
    const modalHeight = 100;
    const offset = isLastThree ? -(modalHeight + 10) : 10;
    setMenuPosition({x: pageX, y: pageY + offset});
    setSelectedEntry({
      waterIntakeId: waterIntake?.waterIntakeData?._id,
      waterRecordId: entry.recordId,
      waterIntakeAmountId: entry.intakeId,
      date: entry.date,
      amount: entry.amount,
      time: entry.time,
    });
    setModalVisible(true);
  };

  const hasData =
    selectedIntake &&
    selectedIntake.length > 0 &&
    selectedIntake[0]?.waterIntakeAmount?.length > 0;

  return (
    <SafeAreaView style={styles.container}>
      <Header
        onPress={() => navigation.goBack(selectedDate)}
        screenheader={true}
        screenName={'Water intake'}
        handlePlus={() =>
          navigation.navigate('waterIntakeLog', {
            plusData: plusData,
            onAddComplete: handleDataRefresh,
          })
        }
        plus={true}
        rightHeaderButton={true}
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
                  key={index}
                  style={styles.singleDateChart}
                  onPress={() => handleDate(date)}>
                  <BarChart
                    data={[{value: formatChartData()[index]?.value || 0}]}
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
                      ...formatChartData().map(item => item.value || 0),
                    )}
                    frontColor={
                      isSelected ? Color?.primaryColor : Color.primaryLight
                    }
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
      </View>

      <View style={styles.bottomContentContainer}>
        <View style={styles.statsContainer}>
          <View style={{width: '48%'}}>
            <CustomShadow color={Color.lightgray}>
              <View style={styles.mlContainer}>
                <Text style={styles.statValue}>{selectedDateIntake} mL</Text>
                <Text style={styles.statLabel}>Water intake</Text>
              </View>
            </CustomShadow>
          </View>
          <View style={{width: '48%'}}>
            <CustomShadow color={Color.lightgray}>
              <View style={styles.mlContainer}>
                <Text style={styles.statValue}>{dailyGoal} mL</Text>
                <Text style={styles.statLabel}>Daily goal</Text>
              </View>
            </CustomShadow>
          </View>
        </View>

        {loading ? (
          <CustomLoader style={{marginTop: verticalScale(25)}} size={'small'} />
        ) : hasData ? (
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
                          <Ionicons
                            name="water"
                            size={24}
                            color={Color?.primaryColor}
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
                            onPress={event =>
                              handleDotMenuPress(
                                event,
                                {
                                  recordId: record?._id,
                                  intakeId: intake?._id,
                                  date: record?.date,
                                  amount: intake?.amount,
                                  time: intake?.time,
                                },
                                intakeIndex,
                                record?.waterIntakeAmount?.length,
                              )
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
                    keyExtractor={(item, index) =>
                      `intake-${recordIndex}-${index}-${item?._id || index}`
                    }
                  />
                </View>
              )}
              showsVerticalScrollIndicator={false}
              keyExtractor={(item, index) =>
                `record-${index}-${item?._id || index}`
              }
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
        highlightEdit={highlightEdit}
        highlightCancel={highlightCancel}
        handleEdit={handleEdit}
        handleDelete={handleDelete}
        modalstyle={{
          top: menuPosition.y,
          left: menuPosition.x - 140,
        }}
        cancelmodalstyle={{
          top: menuPosition.y,
          left: menuPosition.x - 195,
        }}
        handleCancel={handleCancel}
        setModalVisible={() => setModalVisible(false)}
      />
    </SafeAreaView>
  );
};
export default WaterIntake;

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
    fontSize: scale(12),
    fontWeight: 'bold',
    color: '#000',
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
    paddingHorizontal: scale(8),
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
    color: Color?.textColor,
    textAlign: 'center',
    fontFamily: Font.Poppins,
  },
  mlContainer: {
    backgroundColor: Color?.white,
    borderRadius: scale(10),
    padding: scale(10),
  },
  entriesContainer: {
    flex: 1,
  },
  entryItem: {
    paddingHorizontal: scale(8),
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
    fontFamily: Font?.Poppins,
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
    fontFamily: Font?.Poppins,
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
    fontFamily: Font?.PoppinsMedium,
  },
});
