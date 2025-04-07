import {
  ActivityIndicator,
  FlatList,
  Pressable,
  SafeAreaView,
  StyleSheet,
  Text,
  TextInput,
  TouchableOpacity,
  View,
  ScrollView,
} from 'react-native';
import React, {useCallback, useEffect, useState} from 'react';
import BackHeader from '../../../../Components/BackHeader';
import {useFocusEffect, useNavigation} from '@react-navigation/native';
import {scale, verticalScale} from 'react-native-size-matters';
import Color from '../../../../assets/colors/Colors';
import AntDesign from 'react-native-vector-icons/AntDesign';
import {
  GetPhysicalActivities,
  GetQuickAccess,
} from '../../../../Apis/ClientApis/PhysicalActivityApi';
import Header from '../../../../Components/Header';

const LogPhysicalActivity = ({route}) => {
  const token = route?.params?.plusData?.token;
  const id = route?.params?.plusData?.id;
  const plus = route?.params?.plusData?.press === 'plus';

  const navigation = useNavigation();
  const [searchActivity, setSearchActivity] = useState('');
  const [quickAccess, setQuickAccess] = useState([]);
  const [activityData, setActivityData] = useState([]);
  const [filteredData, setFilteredData] = useState([]);
  const [loading, setLoading] = useState(false);
  const [quickAccessData, setQuickAccessData] = useState([]);

  const handlePressItem = async (name, time) => {
    navigation.navigate('workOutDetails', {
      name: name,
      time: time,
      plus: plus,
    });
  };

  const handleSearch = text => {
    setSearchActivity(text);

    if (text.trim() == '') {
      setFilteredData(activityData);
      setQuickAccessData(quickAccess);
    } else {
      setQuickAccessData(null);
      const filtered = activityData.filter(item =>
        item?.activity?.toLowerCase().includes(text.toLowerCase().trim()),
      );

      setFilteredData(filtered);
    }
  };

  const clearSearch = () => {
    setSearchActivity('');
    setFilteredData(activityData);
    setQuickAccessData(quickAccess);
  };

  const FetchActivityData = async () => {
    try {
      setLoading(true);
      const response = await GetPhysicalActivities();
      if (response?.success === true) {
        setActivityData(response?.data);
        setFilteredData(response?.data);
      }
      setLoading(false);
    } catch (error) {
      console.error(error);
      setLoading(false);
    }
  };

  const FetchQuickAccessData = async () => {
    try {
      setLoading(true);
      const response = await GetQuickAccess(token, id);

      const data = response?.data?.physicalActivity?.flat();
      setQuickAccess(data);
      setQuickAccessData(data);
      setLoading(false);
    } catch (error) {
      console.error(error);
      setLoading(false);
    }
  };

  useEffect(() => {
    FetchQuickAccessData();
    FetchActivityData();
  }, []);

  return (
    <SafeAreaView style={{flex: 1, backgroundColor: Color.white}}>
      {/* <BackHeader
        titleName={'Log physical activity'}
        backText={'Physical activity'}
        onPressBack={() => navigation.goBack()}
        showRightButton={false}
      /> */}
      <Header
        showIcon={{}}
        backIcon={true}
        screenName="Physical activity"
        iconStyle={{left: scale(-170)}}
        onPress={() =>
          navigation.navigate('logPhysicalActivity', {plusData: plusData})
        }
      />

      <View style={{marginHorizontal: scale(16)}}>
        <Text style={styles.topTitle}>Log Physical Activity</Text>
        <View style={styles.searchContainer}>
          <TextInput
            placeholder="Search for an activity..."
            placeholderTextColor={Color.gray}
            value={searchActivity}
            onChangeText={handleSearch}
            style={styles.inputView}
          />
          <Pressable style={styles.clearButton} onPress={clearSearch}>
            <AntDesign
              name="close"
              size={verticalScale(22)}
              color={Color.primaryColor}
            />
          </Pressable>
        </View>
      </View>

      {loading ? (
        <View
          style={{
            flex: 1,
            justifyContent: 'center',
            alignItems: 'center',
          }}>
          <ActivityIndicator size="large" color={Color.primaryColor} />
        </View>
      ) : filteredData?.length > 0 ? (
        <FlatList
          data={filteredData}
          ListHeaderComponent={
            <View style={{marginHorizontal: scale(16)}}>
              {quickAccessData?.length > 0 && (
                <View>
                  <Text style={styles.title}>Quick access</Text>
                  {quickAccessData?.map((item, index) => (
                    <TouchableOpacity
                      key={index}
                      onPress={() =>
                        handlePressItem(item?.activity, item?.time)
                      }>
                      <Text style={styles.activity}>{item?.activity}</Text>
                      <Text style={styles.time}>
                        {item?.time} {item?.timeunit}
                      </Text>
                    </TouchableOpacity>
                  ))}
                </View>
              )}

              <Text style={styles.title}>All physical activities</Text>
            </View>
          }
          renderItem={({item}) => (
            <TouchableOpacity
              onPress={() => handlePressItem(item?.activity)}
              style={{marginHorizontal: scale(16)}}>
              <Text style={styles.name}>{item?.activity}</Text>
            </TouchableOpacity>
          )}
          keyExtractor={(item, index) => item?._id || index.toString()}
          ListEmptyComponent={() => (
            <View style={styles.emptyContainer}>
              <Text style={styles.emptyText}>
                {searchActivity.trim()
                  ? 'No matching activities found'
                  : 'No activities available'}
              </Text>
            </View>
          )}
          showsVerticalScrollIndicator={false}
        />
      ) : null}
    </SafeAreaView>
  );
};

export default LogPhysicalActivity;

const styles = StyleSheet.create({
  scrollView: {
    marginHorizontal: scale(16),
  },
  searchContainer: {
    // paddingVertical: verticalScale(2),
    width: '100%',
    borderRadius: scale(5),
    backgroundColor: Color.white,
    marginTop: verticalScale(15),
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    elevation: 7,
    shadowColor: Color?.primaryColor,
    shadowOpacity: 0.8,
    shadowRadius: 8,
    shadowOffset: {
      width: 5,
      height: 5,
    },
    marginBottom: scale(10),
  },
  topTitle: {
    color: Color?.textColor,
    marginTop: scale(10),
    fontSize: scale(17),
    fontWeight: '500',
  },
  inputView: {
    // marginStart: scale(10),
    fontSize: scale(13),
    fontWeight: '600',
    color: Color.txt,
    width: '85%',
    marginHorizontal: scale(8),
  },
  clearButton: {
    marginEnd: scale(10),
    // padding: scale(5),
  },
  title: {
    marginTop: verticalScale(20),
    marginBottom: verticalScale(10),
    fontSize: scale(16),
    color: Color.textColor,
    fontWeight: '500',
  },
  name: {
    fontSize: scale(14),
    fontWeight: '500',
    paddingVertical: verticalScale(10),
    borderBottomWidth: 1,
    borderBottomColor: '#DDD',
    color: '#675A5A',
  },
  activity: {
    fontSize: scale(14),
    fontWeight: '500',
    color: '#675A5A',
    paddingTop: verticalScale(10),
  },
  time: {
    fontSize: scale(12),
    paddingBottom: verticalScale(10),
    borderBottomWidth: 1,
    borderBottomColor: '#DDD',
    color: '#999595',
  },
  emptyContainer: {
    padding: scale(20),
    alignItems: 'center',
  },
  emptyText: {
    color: Color.gray,
    fontSize: scale(14),
  },
});
