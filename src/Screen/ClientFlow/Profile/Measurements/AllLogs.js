import {FlatList, ScrollView, StyleSheet, Text, View} from 'react-native';
import React, {useMemo} from 'react';
import {useNavigation, useRoute} from '@react-navigation/native';
import {format} from 'date-fns';
import BackHeader from '../../../../Components/BackHeader';
import {scale, verticalScale} from 'react-native-size-matters';
import Color from '../../../../assets/colors/Colors';

const AllLogs = () => {
  const route = useRoute();
  const navigation = useNavigation();

  const displaydata = route?.params?.data?.data;
  const measurementType = route?.params?.data?.measurementType;

  const sortedEntries = useMemo(() => {
    if (!displaydata?.entries || !Array.isArray(displaydata.entries)) {
      return [];
    }

    return [...displaydata.entries].sort((a, b) => {
      return new Date(b?.date) - new Date(a?.date);
    });
  }, [displaydata?.entries]);

  const renderItem = ({item}) => {
    return (
      <View style={styles.logContainer}>
        <View>
          <Text style={{color: Color.gray}}>You</Text>
          <Text style={{color: Color.black, fontSize: scale(13)}}>
            {item?.value || 'N/A'} {item?.unit || 'N/A'}
          </Text>
        </View>
        <Text style={{color: Color.black, fontSize: scale(12)}}>
          {item?.date ? format(new Date(item?.date), 'MMMM dd, yyyy') : 'N/A'}
        </Text>
      </View>
    );
  };

  const renderEmptyList = () => {
    return (
      <View style={styles.noDataContainer}>
        <Text style={styles.noDataText}>No data available</Text>
      </View>
    );
  };

  return (
    <View style={{flex: 1, backgroundColor: Color.primary}}>
      <BackHeader
        titleName={'All logs'}
        showRightButton={false}
        backText={measurementType}
        onPressBack={() => navigation.goBack()}
      />

      <FlatList
        data={sortedEntries}
        renderItem={renderItem}
        keyExtractor={(item, index) => index.toString()}
        ListEmptyComponent={renderEmptyList}
        showsVerticalScrollIndicator={false}
      />
    </View>
  );
};

export default AllLogs;

const styles = StyleSheet.create({
  noDataContainer: {
    justifyContent: 'center',
    alignItems: 'center',
  },
  noDataText: {
    color: Color.gray,
    fontSize: scale(14),
    padding: verticalScale(20),
  },
  logContainer: {
    borderBottomColor: '#DDD',
    borderBottomWidth: 1,
    paddingVertical: verticalScale(8),
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginHorizontal: scale(16),
  },
});
