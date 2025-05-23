import React, {useCallback, useEffect, useState} from 'react';
import {
  View,
  Text,
  StyleSheet,
  TouchableOpacity,
  Dimensions,
} from 'react-native';
import {
  useFocusEffect,
  useNavigation,
  useRoute,
} from '@react-navigation/native';
import {scale, verticalScale} from 'react-native-size-matters';
import {Color} from '../../../../assets/styles/Colors';
import {LineChart} from 'react-native-chart-kit';
import {GetMeasurementData} from '../../../../Apis/ClientApis/MeasurementApi';
import {useSelector} from 'react-redux';
import Header from '../../../../Components/Header';
import {Font} from '../../../../assets/styles/Fonts';
import CustomLoader from '../../../../Components/CustomLoader';

const MeasurementDetail = () => {
  const navigation = useNavigation();
  const route = useRoute();

  const {measurementType, data} = route.params;
  const unit = route?.params?.unit;

  const [currentData, setCurrentData] = useState(route?.params?.data || {});
  const periods = ['Week', 'Month', 'Year'];
  const [selectedPeriod, setSelectedPeriod] = useState('Week');
  const [filteredData, setFilteredData] = useState([]);
  const [isLoading, setIsLoading] = useState(true);
  const [stats, setStats] = useState({
    current: {value: '-'},
    highest: {value: '-'},
    lowest: {value: '-'},
    totalVariation: '-',
  });

  const tokenId = useSelector(state => state?.user?.token);
  const guestTokenId = useSelector(state => state?.user?.guestToken);
  const token = tokenId?.token || guestTokenId?.token;
  const id = tokenId?.id || guestTokenId?.id;

  const fetchLatestData = useCallback(async () => {
    if (!token || !id) {
      setIsLoading(false);
      return;
    }

    setIsLoading(true);
    try {
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
    } catch (error) {
      console.error(error);
    } finally {
      setIsLoading(false);
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
    const measurementEntries = entries || [];

    if (!measurementEntries || !measurementEntries.length) {
      setFilteredData([]);
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
        break;
    }

    setFilteredData(filteredEntries);
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

  const chartConfig = {
    backgroundColor: Color.white,
    backgroundGradientFrom: Color.white,
    backgroundGradientTo: Color.white,
    decimalPlaces: 0,
    color: (opacity = 0.5) => 'lightgray',
    labelColor: (opacity = 1) => `rgba(0, 0, 0, ${opacity})`,
    propsForDots: {
      r: '6',
      strokeWidth: '2',
      stroke: Color.primaryColor,
      fill: Color.white,
    },
    fillShadowGradient: Color.primaryLight,
    fillShadowGradientOpacity: 0.5,
  };

  const formattedDates = formatChartDates(filteredData, selectedPeriod);
  const values = filteredData.map(entry => Number(entry?.value));

  const statItems = [
    {
      title: 'Current',
      value:
        stats.current.value !== '-' ? `${stats.current.value} ${unit}` : '-',
      useValueContainer: true,
      valueStyle: styles.value,
    },
    {
      title: 'Total variation',
      value:
        stats.totalVariation !== '-' ? `${stats.totalVariation} ${unit}` : '-',
      useValueContainer: false,
      valueStyle: [
        styles.value,
        stats.totalVariation && stats.totalVariation.charAt(0) === '+'
          ? styles.positiveValue
          : stats.totalVariation && stats.totalVariation.charAt(0) === '-'
          ? styles.negativeValue
          : null,
      ],
    },
    {
      title: 'Highest',
      value:
        stats.highest.value !== '-' ? `${stats.highest.value} ${unit}` : '-',
      useValueContainer: true,
      valueStyle: styles.value,
    },
    {
      title: 'Lowest',
      value: stats.lowest.value !== '-' ? `${stats.lowest.value} ${unit}` : '-',
      useValueContainer: true,
      valueStyle: styles.value,
    },
  ];

  const renderChart = () => {
    if (isLoading) {
      return <CustomLoader size={'small'} />;
    }

    if (!values || values.length === 0) {
      return (
        <Text style={styles.noDataText}>No data available for this period</Text>
      );
    }

    return (
      <LineChart
        bezier
        data={{
          labels: formattedDates || [],
          datasets: [
            {
              data: values,
              color: (opacity = 1) => Color.primaryColor,
              strokeWidth: 1.5,
            },
          ],
        }}
        width={Dimensions.get('window').width}
        height={220}
        yAxisSide="left"
        chartConfig={chartConfig}
      />
    );
  };

  return (
    <View style={styles.container}>
      <Header screenheader={true} screenName={measurementType} />
      <Text style={styles.lebal}>{measurementType}</Text>

      <View style={{paddingHorizontal: scale(8)}}>
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
      </View>

      <View
        style={{
          marginTop: verticalScale(50),
          marginBottom: verticalScale(20),
          height: '25%',
          justifyContent: 'center',
          alignItems: 'center',
        }}>
        {renderChart()}
      </View>

      <View style={{paddingHorizontal: scale(8)}}>
        {statItems.map((item, index) => (
          <View key={index} style={styles.detailContainer}>
            <Text style={styles.title}>{item.title}</Text>
            <View style={styles.valueContainer}>
              <Text style={item.valueStyle}>{item.value}</Text>
            </View>
          </View>
        ))}
      </View>

      <TouchableOpacity
        style={styles.buttonContainer}
        onPress={() => navigation.navigate('allLogs', {data: routeData})}>
        <Text style={styles.buttonText}>See logs</Text>
      </TouchableOpacity>
    </View>
  );
};

export default MeasurementDetail;

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: Color.white,
  },
  buttonContainer: {
    backgroundColor: Color.primaryColor,
    height: verticalScale(35),
    borderRadius: scale(6),
    alignItems: 'center',
    justifyContent: 'center',
    position: 'absolute',
    bottom: 15,
    alignSelf: 'center',
    marginHorizontal: scale(8),
    width: '95%',
  },
  buttonText: {
    color: Color.white,
    fontSize: scale(14),
    fontFamily: Font?.PoppinsMedium,
  },
  periodSelectorContainer: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingVertical: verticalScale(5),
    paddingHorizontal: scale(8),
    backgroundColor: 'rgba(107, 203, 119, 0.3)',
    width: '100%',
    borderRadius: scale(8),
    marginVertical: verticalScale(6),
  },
  periodButton: {
    paddingVertical: verticalScale(3),
    paddingHorizontal: scale(25),
  },
  selectedPeriod: {
    backgroundColor: Color?.primaryColor,
    borderRadius: scale(6),
  },
  periodText: {
    color: Color.primaryColor,
    fontSize: scale(14),
    fontFamily: Font?.PoppinsMedium,
  },
  selectedPeriodText: {
    color: Color.white,
  },
  dateRangeText: {
    color: Color.gray,
    fontSize: scale(14),
    marginVertical: verticalScale(10),
    fontFamily: Font.Poppins,
  },
  noDataText: {
    color: Color.gray,
    fontSize: scale(14),
    fontFamily: Font.Poppins,
    textAlign: 'center',
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
    color: Color.textColor,
    fontSize: scale(14),
    fontFamily: Font.PoppinsMedium,
  },
  valueContainer: {
    alignItems: 'flex-end',
  },
  title: {
    color: Color.gray,
    fontSize: scale(13),
    marginHorizontal: scale(8),
    fontFamily: Font.PoppinsMedium,
  },
  positiveValue: {
    color: Color.primaryColor,
  },
  negativeValue: {
    color: Color.red,
  },
  lebal: {
    color: Color?.textColor,
    fontFamily: Font?.Poppins,
    fontWeight: '500',
    fontSize: scale(18),
    marginTop: scale(15),
    paddingHorizontal: scale(8),
  },
});
