import {FlatList, ScrollView, StyleSheet, Text, View} from 'react-native';
import React, {useMemo} from 'react';
import {useNavigation, useRoute} from '@react-navigation/native';
import {format} from 'date-fns';
import BackHeader from '../../../../Components/BackHeader';
import {scale, verticalScale} from 'react-native-size-matters';
import {Color} from '../../../../assets/styles/Colors';
import Header from '../../../../Components/Header';
import {Font} from '../../../../assets/styles/Fonts';

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
          <Text style={{color: Color.lightGrayText, fontFamily: Font?.Poppins}}>
            You
          </Text>
        </View>
        <View style={{flexDirection: 'row', justifyContent: 'space-between'}}>
          <Text
            style={{
              color: Color.textColor,
              fontSize: scale(13),
              fontFamily: Font?.Poppins,
            }}>
            {item?.value || 'N/A'} {item?.unit || 'N/A'}
          </Text>
          <Text
            style={{
              color: Color.textColor,
              fontSize: scale(12),
              fontFamily: Font?.Poppins,
            }}>
            {item?.date ? format(new Date(item?.date), 'MMMM dd, yyyy') : 'N/A'}
          </Text>
        </View>
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
    <View style={{flex: 1, backgroundColor: Color.white}}>
      {/* <BackHeader
        titleName={'All logs'}
        showRightButton={false}
        backText={measurementType}
        onPressBack={() => navigation.goBack()}
      /> */}
      <Header
        screenheader={true}
        screenName={measurementType}
        rightHeaderButton={false}
      />

      <View style={{marginHorizontal: scale(16)}}>
        <Text style={styles.lebal}>{'All logs'}</Text>
        <FlatList
          data={sortedEntries}
          renderItem={renderItem}
          keyExtractor={(item, index) => index.toString()}
          ListEmptyComponent={renderEmptyList}
          showsVerticalScrollIndicator={false}
        />
      </View>
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
  },
  lebal: {
    color: Color?.textColor,
    fontFamily: Font?.Poppins,
    fontWeight: '500',
    fontSize: scale(18),
    marginTop: scale(8),
  },
});
