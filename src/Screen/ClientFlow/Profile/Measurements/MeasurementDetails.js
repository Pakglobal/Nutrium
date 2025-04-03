import React, {useCallback, useEffect, useState} from 'react';
import {
  View,
  Text,
  StyleSheet,
  FlatList,
  TouchableOpacity,
  Dimensions,
  ActivityIndicator,
} from 'react-native';
import {
  useFocusEffect,
  useNavigation,
  useRoute,
} from '@react-navigation/native';
import {scale, verticalScale} from 'react-native-size-matters';
import Color from '../../../../assets/colors/Colors';
import BackHeader from '../../../../Components/BackHeader';
import {LineChart} from 'react-native-chart-kit';
import {GetMeasurementData} from '../../../../Apis/ClientApis/MeasurementApi';
import {useDispatch, useSelector} from 'react-redux';

const MeasurementDetail = () => {
  const navigation = useNavigation();
  const dispatch = useDispatch();
  const route = useRoute();
  const {measurementType, data} = route.params;
  const unit = route?.params?.unit;

  const measurementId = route?.params?.data?._id;

  const [currentData, setCurrentData] = useState(route?.params?.data || {});
  const periods = ['Week', 'Month', 'Year'];
  const [loading, setLoading] = useState(false);
  const [selectedPeriod, setSelectedPeriod] = useState('Week');
  const [dateRange, setDateRange] = useState('');
  const [filteredData, setFilteredData] = useState([]);
  const [stats, setStats] = useState({
    current: {value: '-'},
    highest: {value: '-'},
    lowest: {value: '-'},
    totalVariation: '-',
  });

  const tokenId = useSelector(state => state?.user?.token);
  const token = tokenId?.token;
  const id = tokenId?.id;

  const fetchLatestData = useCallback(async () => {
    if (!token || !id) return;

    try {
      setLoading(true);
      const response = await GetMeasurementData(token, id);

      if (response?.success === true) {
        const measurementList = response?.measurement?.measurements || [];
        const targetMeasurement = measurementList.find(
          item => item.measurementtype === measurementType,
        );

        if (targetMeasurement) {
          const entries = targetMeasurement.entries || [];
          const stats = calculateStats(entries);

          setCurrentData({
            entries: entries,
            _id: targetMeasurement._id,
            ...stats,
          });

          filterDataByPeriod(selectedPeriod, entries);
        }
      }
      setLoading(false);
    } catch (error) {
      console.error(error);
      setLoading(false);
    }
  }, [token, id, measurementType, selectedPeriod]);

  useFocusEffect(
    useCallback(() => {
      fetchLatestData();
    }, [fetchLatestData]),
  );

  const routeData = {
    measurementType,
    measurementId: currentData?._id,
    data: currentData,
    unit: unit,
  };

  const measurementEntries =
    data && data.entries ? data.entries : Array.isArray(data) ? data : [];

  const handleAddNewMeasurement = () => {
    navigation.navigate('addMeasurement', {
      routeData,
    });
  };

  const calculateStats = entries => {
    if (!entries || !entries.length) {
      return {
        current: {value: '-'},
        highest: {value: '-'},
        lowest: {value: '-'},
        totalVariation: '-',
      };
    }

    const sortedByNewest = [...entries].sort(
      (a, b) => new Date(b.date) - new Date(a.date),
    );

    const sortedChronologically = [...entries].sort(
      (a, b) => new Date(a.date) - new Date(b.date),
    );

    const current = {
      value: sortedByNewest[0].value,
    };

    let highest = {value: Number(entries[0].value)};
    let lowest = {value: Number(entries[0].value)};

    entries.forEach(entry => {
      const value = Number(entry.value);

      if (value > highest.value) {
        highest = {value};
      }

      if (value < lowest.value) {
        lowest = {value};
      }
    });

    let totalVariation = '-';
    if (sortedChronologically.length >= 2) {
      const firstValue = Number(sortedChronologically[0].value);
      const lastValue = Number(
        sortedChronologically[sortedChronologically.length - 1].value,
      );
      const difference = lastValue - firstValue;

      totalVariation =
        difference > 0 ? `+${difference.toFixed(1)}` : difference.toFixed(1);
    }

    return {
      current: {
        value: current.value,
      },
      highest: {
        value: highest.value,
      },
      lowest: {
        value: lowest.value,
      },
      totalVariation,
    };
  };

  useEffect(() => {
    filterDataByPeriod(selectedPeriod);
  }, [selectedPeriod, data]);

  useFocusEffect(
    useCallback(() => {
      const newStats = calculateStats(filteredData);
      setStats(newStats);
    }, [filteredData]),
  );

  const filterDataByPeriod = (period, entries = currentData.entries) => {
    setLoading(true);
    const measurementEntries = entries || [];

    if (!measurementEntries || !measurementEntries.length) {
      setFilteredData([]);
      setDateRange('No data');
      setLoading(false);
      return;
    }

    const now = new Date();
    let filteredEntries = [];
    let startDate, endDate;

    switch (period) {
      case 'Week':
        startDate = new Date(now);
        startDate.setDate(now.getDate() - 6);
        startDate.setHours(0, 0, 0, 0);

        endDate = new Date(now);
        endDate.setHours(23, 59, 59, 999);

        filteredEntries = measurementEntries.filter(entry => {
          const entryDate = new Date(entry.date);
          return entryDate >= startDate && entryDate <= endDate;
        });

        const weekStart = startDate.toLocaleDateString('en-US', {
          month: 'short',
          day: 'numeric',
        });
        const weekEnd = now.toLocaleDateString('en-US', {
          month: 'short',
          day: 'numeric',
        });
        setDateRange(`${weekStart} - ${weekEnd}`);
        break;

      case 'Month':
        startDate = new Date(now.getFullYear(), now.getMonth(), 1);
        startDate.setHours(0, 0, 0, 0);

        endDate = new Date(now);
        endDate.setHours(23, 59, 59, 999);

        filteredEntries = measurementEntries.filter(entry => {
          const entryDate = new Date(entry.date);
          return entryDate >= startDate && entryDate <= endDate;
        });

        const monthStart = startDate.toLocaleDateString('en-US', {
          month: 'short',
          day: 'numeric',
        });
        const monthEnd = now.toLocaleDateString('en-US', {
          month: 'short',
          day: 'numeric',
        });
        setDateRange(`${monthStart} - ${monthEnd}`);
        break;

      case 'Year':
        startDate = new Date(now);
        startDate.setMonth(now.getMonth() - 11);
        startDate.setDate(1);
        startDate.setHours(0, 0, 0, 0);

        endDate = new Date(now);
        endDate.setHours(23, 59, 59, 999);

        filteredEntries = measurementEntries.filter(entry => {
          const entryDate = new Date(entry.date);
          return entryDate >= startDate && entryDate <= endDate;
        });

        const yearStart = startDate.toLocaleDateString('en-US', {
          month: 'short',
          year: 'numeric',
        });
        const yearEnd = now.toLocaleDateString('en-US', {
          month: 'short',
          year: 'numeric',
        });
        setDateRange(`${yearStart} - ${yearEnd}`);
        break;
    }

    setFilteredData(filteredEntries);
    setLoading(false);
  };

  const formatChartDates = (entries, period) => {
    if (!entries || !entries.length) return [];
    const sortedEntries = [...entries].sort(
      (a, b) => new Date(a.date) - new Date(b.date),
    );

    switch (period) {
      case 'Week':
        return sortedEntries.map(entry => {
          const date = new Date(entry.date);
          return `${date.getMonth() + 1}/${date.getDate()}`;
        });

      case 'Month': {
        if (sortedEntries.length <= 5) {
          return sortedEntries.map(entry => {
            const date = new Date(entry.date);
            return `${date.getMonth() + 1}/${date.getDate()}`;
          });
        }

        const firstEntry = sortedEntries[0];
        const lastEntry = sortedEntries[sortedEntries.length - 1];
        const firstDate = new Date(firstEntry.date);
        const lastDate = new Date(lastEntry.date);

        const totalDays =
          Math.ceil((lastDate - firstDate) / (1000 * 60 * 60 * 24)) || 1;
        const numLabels = Math.min(5, totalDays);
        const interval = Math.max(Math.floor(totalDays / (numLabels - 1)), 1);

        const labels = [];
        let currentDate = new Date(firstDate);

        while (currentDate <= lastDate) {
          labels.push(`${currentDate.getMonth() + 1}/${currentDate.getDate()}`);
          currentDate = new Date(currentDate);
          currentDate.setDate(currentDate.getDate() + interval);
        }

        if (
          labels.length > 0 &&
          labels[labels.length - 1] !==
            `${lastDate.getMonth() + 1}/${lastDate.getDate()}`
        ) {
          labels.push(`${lastDate.getMonth() + 1}/${lastDate.getDate()}`);
        }

        return labels;
      }

      case 'Year': {
        const monthsWithData = new Map();

        sortedEntries.forEach(entry => {
          const date = new Date(entry.date);
          const monthYear = `${date.getFullYear()}-${date.getMonth()}`;
          monthsWithData.set(monthYear, true);
        });

        const labels = [];
        const firstEntry = sortedEntries[0];
        const lastEntry = sortedEntries[sortedEntries.length - 1];
        const firstDate = new Date(firstEntry.date);
        const lastDate = new Date(lastEntry.date);

        const monthNames = [
          'Jan',
          'Feb',
          'Mar',
          'Apr',
          'May',
          'Jun',
          'Jul',
          'Aug',
          'Sep',
          'Oct',
          'Nov',
          'Dec',
        ];

        let currentDate = new Date(
          firstDate.getFullYear(),
          firstDate.getMonth(),
          1,
        );

        while (currentDate <= lastDate) {
          const monthYear = `${currentDate.getFullYear()}-${currentDate.getMonth()}`;

          if (monthsWithData.has(monthYear)) {
            labels.push(
              `${
                monthNames[currentDate.getMonth()]
              } ${currentDate.getFullYear()}`,
            );
          }

          currentDate.setMonth(currentDate.getMonth() + 1);
        }

        return labels;
      }

      default:
        return [];
    }
  };

  const formattedDates = formatChartDates(filteredData, selectedPeriod);
  const values = filteredData.map(entry => Number(entry?.value));

  return (
    <View style={styles.container}>
      <BackHeader
        onPressBack={() => navigation.goBack()}
        titleName={measurementType}
        showRightButton={false}
        onPress={handleAddNewMeasurement}
        backText={'Measurement'}
      />

      <View>
        <View style={styles.periodSelectorContainer}>
          {periods.map((item, index) => (
            <TouchableOpacity
              key={index}
              style={[
                styles.periodButton,
                selectedPeriod === item && styles.selectedPeriod,
              ]}
              onPress={() => setSelectedPeriod(item)}>
              <Text
                style={[
                  styles.periodText,
                  selectedPeriod === item && styles.selectedPeriodText,
                ]}>
                {item}
              </Text>
            </TouchableOpacity>
          ))}
        </View>

        <Text style={styles.dateRangeText}>{dateRange}</Text>

        <View style={{height: '30%'}}>
          {filteredData.length > 0 ? (
            <LineChart
              data={{
                labels: formattedDates,
                datasets: [
                  {
                    data: values.length ? values : [0],
                    color: (opacity = 1) => Color.primaryGreen,
                    strokeWidth: 2,
                  },
                ],
              }}
              width={Dimensions.get('window').width}
              height={220}
              yAxisSide="left"
              chartConfig={{
                backgroundColor: Color.white,
                backgroundGradientFrom: Color.white,
                backgroundGradientTo: Color.white,
                decimalPlaces: 1,
                color: (opacity = 1) => `rgba(255, 255, 255, ${opacity})`,
                labelColor: (opacity = 1) => `rgba(0, 0, 0, ${opacity})`,
                propsForDots: {
                  r: '6',
                  stroke: Color.primaryGreen,
                  strokeWidth: '2',
                  fill: Color.white,
                },
                propsForVerticalLabels: {
                  fontSize: 10,
                  rotation: 0,
                },
              }}
              style={{
                marginVertical: verticalScale(15),
              }}
            />
          ) : (
            <View style={styles.noDataContainer}>
              <Text style={styles.noDataText}>
                No data available for this period
              </Text>
            </View>
          )}
        </View>
      </View>

      <View style={{marginHorizontal: scale(16)}}>
        <View style={{marginVertical: verticalScale(15)}}>
          <View style={styles.detailContainer}>
            <Text style={styles.title}>Current</Text>
            <View style={styles.valueContainer}>
              <Text style={styles.value}>
                {stats.current.value !== '-'
                  ? `${stats.current.value} ${unit}`
                  : '-'}
              </Text>
            </View>
          </View>

          <View style={styles.detailContainer}>
            <Text style={styles.title}>Total variation</Text>
            <Text
              style={[
                styles.value,
                stats.totalVariation && stats.totalVariation.charAt(0) === '+'
                  ? styles.positiveValue
                  : stats.totalVariation &&
                    stats.totalVariation.charAt(0) === '-'
                  ? styles.negativeValue
                  : null,
              ]}>
              {stats.totalVariation !== '-'
                ? `${stats.totalVariation} ${unit}`
                : '-'}
            </Text>
          </View>

          <View style={styles.detailContainer}>
            <Text style={styles.title}>Highest</Text>
            <View style={styles.valueContainer}>
              <Text style={styles.value}>
                {stats.highest.value !== '-'
                  ? `${stats.highest.value} ${unit}`
                  : '-'}
              </Text>
            </View>
          </View>

          <View style={styles.detailContainer}>
            <Text style={styles.title}>Lowest</Text>
            <View style={styles.valueContainer}>
              <Text style={styles.value}>
                {stats.lowest.value !== '-'
                  ? `${stats.lowest.value} ${unit}`
                  : '-'}
              </Text>
            </View>
          </View>
        </View>
        <TouchableOpacity
          style={styles.buttonContainer}
          onPress={() => navigation.navigate('allLogs', {data: routeData})}>
          <Text style={styles.buttonText}>See logs</Text>
        </TouchableOpacity>
      </View>
    </View>
  );
};

export default MeasurementDetail;

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: Color.white,
  },
  content: {
    flex: 1,
    marginHorizontal: scale(16),
    marginTop: verticalScale(20),
  },
  headerContainer: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    paddingVertical: verticalScale(10),
    borderBottomWidth: 2,
    borderBottomColor: Color.primaryGreen,
  },
  headerText: {
    fontSize: scale(16),
    fontWeight: 'bold',
    color: Color.black,
  },
  itemContainer: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    paddingVertical: verticalScale(12),
    borderBottomWidth: 1,
    borderBottomColor: '#DDD',
  },
  itemText: {
    fontSize: scale(14),
    color: Color.black,
  },
  buttonContainer: {
    backgroundColor: Color.secondary,
    height: verticalScale(35),
    borderRadius: scale(20),
    alignItems: 'center',
    justifyContent: 'center',
    marginBottom: verticalScale(20),
  },
  buttonText: {
    color: Color.white,
    fontSize: scale(14),
    fontWeight: '500',
  },
  periodSelectorContainer: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingVertical: verticalScale(10),
    backgroundColor: Color.common,
    paddingHorizontal: scale(16),
  },
  periodButton: {
    paddingVertical: verticalScale(5),
    paddingHorizontal: scale(20),
  },
  selectedPeriod: {
    borderBottomWidth: 2,
    borderBottomColor: Color.primaryGreen,
  },
  periodText: {
    color: Color.gray,
    fontSize: scale(14),
  },
  selectedPeriodText: {
    color: Color.primaryGreen,
    fontWeight: '500',
  },
  dateRangeText: {
    color: Color.gray,
    fontSize: scale(14),
    marginVertical: verticalScale(10),
    marginHorizontal: scale(16),
    fontWeight: '600',
  },
  noDataContainer: {
    height: 220,
    justifyContent: 'center',
    alignItems: 'center',
  },
  noDataText: {
    color: Color.gray,
    fontSize: scale(14),
  },
  detailContainer: {
    paddingVertical: verticalScale(10),
    flexDirection: 'row',
    borderBottomColor: '#DDD',
    borderBottomWidth: 1,
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  value: {
    color: Color.black,
    fontSize: scale(14),
    fontWeight: '500',
  },
  valueContainer: {
    alignItems: 'flex-end',
  },
  title: {
    color: Color.gray,
    fontSize: scale(13),
    marginHorizontal: scale(8),
  },
  positiveValue: {
    color: Color.primaryGreen,
  },
  negativeValue: {
    color: '#E74C3C',
  },
});
