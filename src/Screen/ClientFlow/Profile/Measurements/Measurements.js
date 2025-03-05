import React, {useCallback, useState} from 'react';
import {
  View,
  Text,
  StyleSheet,
  ActivityIndicator,
  TouchableOpacity,
} from 'react-native';
import {useFocusEffect, useNavigation} from '@react-navigation/native';
import {scale, verticalScale} from 'react-native-size-matters';
import Color from '../../../../assets/colors/Colors';
import BackHeader from '../../../../Components/BackHeader';
import {useDispatch, useSelector} from 'react-redux';
import {GetMeasurementData} from '../../../../Apis/ClientApis/MeasurementApi';
import {measurementData} from '../../../../redux/client';
import Toast from 'react-native-simple-toast';

const Measurements = () => {
  const navigation = useNavigation();
  const dispatch = useDispatch();

  const [measurement, setMeasurement] = useState({});
  const [loading, setLoading] = useState(false);

  const getToken = useSelector(state => state?.user?.userInfo);
  const token = getToken?.token;
  const id = getToken?.userData?._id || getToken?.user?._id;
  const units = useSelector(state => state.units.units);

  useFocusEffect(
    useCallback(() => {
      getAllMeasurements();
    }, [token, id, units]),
  );

  const showToast = message => {
    Toast.show(message, Toast.LONG, Toast.BOTTOM);
  };

  const getAllMeasurements = async () => {
    if (!token || !id) return;

    try {
      setLoading(true);
      const response = await GetMeasurementData(token, id);

      if (response?.success === true) {
        const measurementList = response?.measurement?.measurements || [];
        const formattedData = {};

        measurementList.forEach(item => {
          const entries = item.entries || [];
          const stats = calculateMeasurementStats(entries);

          formattedData[item.measurementtype] = {
            entries: entries,
            _id: item._id,
            ...stats,
          };
        });
        dispatch(measurementData(measurementList));
        setMeasurement(formattedData);
      } else {
        showToast(response?.message);
        setLoading(false);
      }
    } catch (error) {
      showToast(error);
    } finally {
      setLoading(false);
    }
  };

  const calculateMeasurementStats = entries => {
    if (!entries || entries.length === 0) {
      return {
        currentValue: null,
        highestValue: null,
        lowestValue: null,
        currentDate: null,
        highestDate: null,
        lowestDate: null,
      };
    }

    const sortedEntries = [...entries].sort(
      (a, b) => new Date(b.date) - new Date(a.date),
    );

    const currentValue = sortedEntries[0].value;
    const currentDate = sortedEntries[0].date;

    let highestValue = Number(entries[0].value);
    let lowestValue = Number(entries[0].value);
    let highestDate = entries[0].date;
    let lowestDate = entries[0].date;

    entries.forEach(entry => {
      const value = Number(entry.value);

      if (value > highestValue) {
        highestValue = value;
        highestDate = entry.date;
      }

      if (value < lowestValue) {
        lowestValue = value;
        lowestDate = entry.date;
      }
    });

    return {
      currentValue,
      highestValue,
      lowestValue,
      currentDate,
      highestDate,
      lowestDate,
    };
  };

  const getLatestValue = type => {
    const measurementData = measurement[type];
    if (
      !measurementData ||
      !measurementData?.entries ||
      measurementData?.entries.length === 0
    ) {
      return '-';
    }

    return measurementData.currentValue + ' ' + (getUnitForType(type) || '');
  };

  // const getUnitForType = type => {
  //   if (!type) return '';

  //   switch (type.toLowerCase()) {
  //     case 'weight':
  //       return ' kg';
  //     case 'height':
  //       return ' cm';
  //     case 'waist circumference':
  //       return ' cm';
  //     case 'hip circumference':
  //       return ' cm';
  //     case 'body fat percentage':
  //       return ' %';
  //     case 'muscle mass':
  //       return ' kg';
  //     case 'bmi':
  //       return ' %';
  //     default:
  //       return '';
  //   }
  // };

  const getUnitForType = type => {
    if (!type) return '';

    switch (type.toLowerCase()) {
      case 'weight':
        return units?.Weight === 'Kilogram' ? 'kg' : 'lbs';
      case 'height':
        return units?.Height === 'Centimeter' ? 'cm' : 'ft';
      case 'waist circumference':
        return units?.Height === 'Centimeter' ? 'cm' : 'in';
      case 'hip circumference':
        return units?.Height === 'Centimeter' ? 'cm' : 'in';
      case 'body fat percentage':
        return ' %';
      case 'muscle mass':
        return units?.Weight === 'Kilogram' ? 'kg' : 'lbs';
      case 'bmi':
        return units?.Weight === 'Kilogram' ? 'kg' : 'lbs';
      default:
        return '';
    }
  };

  const navigateToDetail = type => {
    const measurementData = measurement[type];
    navigation.navigate('measurementDetail', {
      measurementType: type,
      data: measurementData,
      unit: getUnitForType(type),
    });
  };

  const menuItems = [
    {
      id: 'firstHeader',
      label: 'Anthropometric measurements',
      type: 'header',
    },
    {
      id: 'weight',
      label: 'Weight',
      type: 'title',
      key: 'Weight',
    },
    {
      id: 'height',
      label: 'Height',
      type: 'title',
      key: 'Height',
    },
    {
      id: 'bmi',
      label: 'BMI',
      type: 'title',
      key: 'BMI',
    },
    {
      id: 'waist',
      label: 'Waist circumference',
      type: 'title',
      key: 'Waist circumference',
    },
    {
      id: 'hip',
      label: 'Hip circumference',
      type: 'title',
      key: 'Hip circumference',
    },
    {
      id: 'secondHeader',
      label: 'Body composition',
      type: 'header',
    },
    {
      id: 'body',
      label: 'Body fat percentage',
      type: 'title',
      key: 'Body fat percentage',
    },
    {
      id: 'muscle',
      label: 'Muscle mass',
      type: 'title',
      key: 'Muscle mass',
    },
  ];

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

  const renderMenuItem = item => {
    if (item?.type === 'header') {
      return (
        <View key={item?.id}>
          <Text style={styles.title}>{item?.label}</Text>
        </View>
      );
    }

    return (
      <TouchableOpacity
        key={item?.id}
        style={styles.cardcontainer}
        onPress={() => navigateToDetail(item?.key)}
        accessibilityLabel={`${item?.label} measurement`}
        accessibilityRole="button">
        <Text style={styles.cardTxt}>{item?.label}</Text>
        <Text style={styles.cardTxt}>{getLatestValue(item?.key)}</Text>
      </TouchableOpacity>
    );
  };

  return (
    <View style={styles.container}>
      <BackHeader
        onPressBack={() => navigation.goBack()}
        titleName="Measurements"
        showRightButton={false}
      />
      <View style={styles.contentContainer}>
        {menuItems.map(item => renderMenuItem(item))}
      </View>
    </View>
  );
};

export default Measurements;

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: Color.primary,
  },
  contentContainer: {
    marginHorizontal: scale(16),
    flex: 1,
  },
  title: {
    fontSize: scale(14),
    color: Color.gray,
    fontWeight: '700',
    marginTop: verticalScale(35),
  },
  cardcontainer: {
    paddingVertical: verticalScale(10),
    flexDirection: 'row',
    borderBottomColor: '#DDD',
    borderBottomWidth: 1,
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  cardTxt: {
    color: Color.black,
    fontSize: scale(13),
    marginHorizontal: scale(8),
  },
  loadingContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    marginTop: verticalScale(50),
  },
});
