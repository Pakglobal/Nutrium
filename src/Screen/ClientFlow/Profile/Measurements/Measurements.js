import React, { useCallback, useEffect, useState } from 'react';
import {
  View,
  Text,
  StyleSheet,
  TouchableOpacity,
  Pressable,
  FlatList,
  RefreshControl,
  ActivityIndicator,
} from 'react-native';
import { useFocusEffect, useNavigation } from '@react-navigation/native';
import { scale, verticalScale } from 'react-native-size-matters';
import { Color } from '../../../../assets/styles/Colors';
import BackHeader from '../../../../Components/BackHeader';
import { useDispatch, useSelector } from 'react-redux';
import { GetMeasurementData } from '../../../../Apis/ClientApis/MeasurementApi';
import { measurementData } from '../../../../redux/client';
import Header from '../../../../Components/Header';
import CustomLoader from '../../../../Components/CustomLoader';
import { Font } from '../../../../assets/styles/Fonts';

const Measurements = () => {
  const navigation = useNavigation();
  const dispatch = useDispatch();

  const [measurement, setMeasurement] = useState({});
  const [loading, setLoading] = useState(false);
  const [refreshing, setRefreshing] = useState(false);

  const tokenId = useSelector(state => state?.user?.token);
  const guestTokenId = useSelector(state => state?.user?.guestToken);
  const token = tokenId?.token || guestTokenId?.token;
  const id = tokenId?.id || guestTokenId?.id;
  const units = useSelector(state => state?.unit?.units);

  useEffect(() => {
    getAllMeasurements();
  }, [token, id, units]);

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
        setLoading(false);
      }
      setLoading(false);
    } catch (error) {
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
        return '%';
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

  const onRefresh = useCallback(() => {
    setRefreshing(true);
    getAllMeasurements().finally(() => setRefreshing(false));
  }, [getAllMeasurements]);

  const renderMenuItem = item => {
    if (item?.type === 'header') {
      return (
        <View key={item?.id}>
          <Text style={styles.title}>{item?.label}</Text>
        </View>
      );
    }

    return (
      <Pressable
        key={item?.id}
        style={styles.cardcontainer}
        onPress={() => navigateToDetail(item?.key)}
        accessibilityLabel={`${item?.label} measurement`}
        accessibilityRole="button">
        <Text style={styles.cardTxt}>{item?.label}</Text>
        <Text style={styles.cardTxt}>{getLatestValue(item?.key)}</Text>
      </Pressable>
    );
  };

  return (
    <View style={styles.container}>
      {/* <BackHeader
        onPressBack={() => navigation.goBack()}
        titleName="Measurements"
        showRightButton={false}
      /> */}
      <Header
        screenheader={true}
        screenName={'Measurements'}
        rightHeaderButton={false}
      />
      {loading ? (
        <ActivityIndicator color={Color?.primaryColor} size={'large'} />
      ) : (
        <View style={styles.contentContainer}>
          <FlatList
            refreshControl={
              <RefreshControl refreshing={refreshing} onRefresh={onRefresh} />
            }
            data={menuItems}
            renderItem={({ item }) => renderMenuItem(item)}
          />
        </View>
      )}

    </View>
  );
};

export default Measurements;

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: Color.white,
  },
  contentContainer: {
    marginHorizontal: scale(16),
    flex: 1,
  },
  title: {
    fontSize: scale(14),
    color: Color.textColor,
    fontWeight: '700',
    marginTop: verticalScale(25),
    fontFamily: Font?.Poppins

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
    color: Color?.lightGrayText,
    fontSize: scale(13),
    marginHorizontal: scale(8),
    fontFamily: Font?.Poppins
  },
  loadingContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    marginTop: verticalScale(50),
  },
});