import {FlatList, StyleSheet, Text, View} from 'react-native';
import React from 'react';
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

  const renderItem = ({item}) => {
    return (
      <View
        style={{
          borderBottomColor: '#DDD',
          borderBottomWidth: 1,
          paddingVertical: verticalScale(10),
          flexDirection: 'row',
          justifyContent: 'space-between',
          alignItems: 'center',
        }}>
        <View>
          <Text>You</Text>
          <Text style={{color: Color.black, fontSize: scale(14)}}>
            {item?.value || 'N/A'} {item?.unit || 'N/A'}
          </Text>
        </View>

        <Text style={{color: Color.black, fontSize: scale(13)}}>
          {item?.date ? format(new Date(item?.date), 'MMMM dd, yyyy') : 'N/A'}
        </Text>
      </View>
    );
  };

  const renderEmptyList = () => {
    return (
      <View style={styles.emptyContainer}>
        <Text style={styles.emptyText}>No data available</Text>
      </View>
    );
  };

  return (
    <View>
      <BackHeader
        titleName={'All logs'}
        showRightButton={false}
        backText={measurementType}
        onPressBack={() => navigation.goBack()}
      />
      <View style={{marginHorizontal: scale(16)}}>
        <FlatList
          data={displaydata?.entries}
          renderItem={renderItem}
          keyExtractor={(item, index) => index.toString()}
          ListEmptyComponent={renderEmptyList}
          contentContainerStyle={styles.listContainer}
        />
      </View>
    </View>
  );
};

export default AllLogs;

const styles = StyleSheet.create({
  listContainer: {
    flexGrow: 1,
  },
  emptyContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    marginTop: verticalScale(50),
  },
  emptyText: {
    fontSize: scale(16),
    color: Color.gray,
  },
});
