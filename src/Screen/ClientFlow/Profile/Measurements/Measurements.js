import React, { useCallback, useEffect, useState } from 'react';
import {
  View,
  Text,
  StyleSheet,
  FlatList,
  RefreshControl,
  ActivityIndicator,
  Pressable,
} from 'react-native';
import { useNavigation } from '@react-navigation/native';
import { scale, verticalScale } from 'react-native-size-matters';
import { Color } from '../../../../assets/styles/Colors';
import { useDispatch, useSelector } from 'react-redux';
import { GetMeasurementData } from '../../../../Apis/ClientApis/MeasurementApi';
import { measurementData } from '../../../../redux/client';
import Header from '../../../../Components/Header';
import { Font } from '../../../../assets/styles/Fonts';
import CustomShadow from '../../../../Components/CustomShadow';
import AntDesign from 'react-native-vector-icons/AntDesign';
import Feather from 'react-native-vector-icons/Feather';

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
      return '—';
    }

    return measurementData.currentValue + ' ' + (getUnitForType(type) || '');
  };

  const getSubtext = type => {
    const measurementData = measurement[type];
    if (
      !measurementData ||
      !measurementData?.entries ||
      measurementData?.entries.length === 0
    ) {
      return 'Not measured yet';
    }

    // Check if the latest measurement date is today
    const latestDate = measurementData.currentDate;
    const today = new Date().toISOString().split('T')[0]; // Format: YYYY-MM-DD
    const measurementDate = new Date(latestDate).toISOString().split('T')[0];

    return measurementDate === today ? 'Updated Today' : `Updated ${measurementDate}`;
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

  const renderMenuItem = ({ item }) => {
    if (item?.type === 'header') {
      return (
        <View key={item?.id}>
          <Text style={styles.title}>{item?.label}</Text>
        </View>
      );
    }

    return (
      <CustomShadow key={item?.id} color={Color?.gray} radius={2}>
        <Pressable
          style={styles.cardcontainer}
          onPress={() => navigateToDetail(item?.key)}
          accessibilityLabel={`${item?.label} measurement`}
          accessibilityRole="button"
        >
          <View style={styles.iconContainer}>
            <Feather name="activity" size={20} color={Color.primaryColor || '#4CAF50'} />
          </View>

          <View style={styles.details}>
            <Text style={styles.label}>{item?.label}</Text>
            <Text style={styles.subtext}>{getSubtext(item?.key)}</Text>
          </View>

          <View style={styles.valueContainer}>
            <Text style={styles.value}>{getLatestValue(item?.key)}</Text>
            <AntDesign name="edit" size={20} color={Color?.textColor} />
          </View>
        </Pressable>
      </CustomShadow>
    );
  };

  return (
    <View style={styles.container}>
      <Header
        screenheader={true}
        screenName={'Measurements'}
        rightHeaderButton={false}
      />
      {loading ? (
        <View style={styles.loadingContainer}>
          <ActivityIndicator color={Color?.primaryColor} size={'large'} />
        </View>
      ) : (
        <View style={styles.contentContainer}>
          <FlatList
            refreshControl={
              <RefreshControl refreshing={refreshing} onRefresh={onRefresh} />
            }
            data={menuItems}
            renderItem={renderMenuItem}
            keyExtractor={item => item.id}
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
    marginHorizontal: scale(10),
    flex: 1,
  },
  loadingContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    // marginTop: verticalScale(50),
  },
  title: {
    fontSize: scale(14),
    color: Color.textColor,
    fontFamily: Font?.PoppinsMedium,
    marginVertical: scale(8),
    marginLeft: scale(10),
  },
  cardcontainer: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: Color?.white,
    marginVertical: scale(5),
    width: '98%',
    alignSelf: 'center',
    borderRadius: scale(8),
    padding: scale(5),
  },
  iconContainer: {
    width: scale(40),
    height: scale(40),
    borderRadius: scale(50),
    backgroundColor: Color?.lightGreen,
    justifyContent: 'center',
    alignItems: 'center',
    marginRight: scale(10),
  },
  details: {
    flex: 1,
    // flexDirection: 'column',
  },
  label: {
    color: Color?.textColor,
    fontSize: scale(14),
    fontFamily: Font?.PoppinsMedium,
  },
  subtext: {
    color: Color?.textColor,
    fontSize: scale(12),
    fontFamily: Font?.Poppins,
    opacity: 0.6,
  },
  valueContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'flex-end',
    width: '25%',
  },
  value: {
    color: Color?.textColor,
    fontSize: scale(14),
    fontFamily: Font?.PoppinsMedium,
    marginRight: scale(8),
  },
});