import {
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
import { useFocusEffect, useNavigation } from '@react-navigation/native';
import { scale, verticalScale } from 'react-native-size-matters';
import { Color } from '../../../../assets/styles/Colors';
import AntDesign from 'react-native-vector-icons/AntDesign';
import {
  GetPhysicalActivities,
  GetQuickAccess,
} from '../../../../Apis/ClientApis/PhysicalActivityApi';
import Header from '../../../../Components/Header';
import { Shadow } from 'react-native-shadow-2';
import { ShadowValues } from '../../../../assets/styles/Shadow';
import { Font } from '../../../../assets/styles/Fonts';
import CustomShadow from '../../../../Components/CustomShadow';
import CustomLoader from '../../../../Components/CustomLoader';

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
    <SafeAreaView style={{ flex: 1, backgroundColor: Color.white }}>

      <Header screenheader={true} screenName={'Physical Activity'} rightHeaderButton={false} />

      <View style={{marginHorizontal: scale(16)}}>
        <Text style={styles.topTitle}>Log Physical Activity</Text>
        <CustomShadow>
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
                size={verticalScale(18)}
                color={Color.primaryColor}
              />
            </Pressable>
          </View>
        </CustomShadow>
      </View>

      {loading ? (
       <CustomLoader />
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
                    style={{marginVertical: verticalScale(5)}}
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
    borderRadius: scale(5),
    backgroundColor: Color.white,
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: verticalScale(10)
  },
  topTitle: {
    color: Color?.textColor,
    marginVertical: verticalScale(15),
    fontSize: scale(16),
    fontWeight: '500',
    fontFamily:Font?.PoppinsMedium,
  },
  inputView: {
    fontSize: scale(12),
    fontWeight: '600',
    color: Color.textColor,
    width: '85%',
    marginHorizontal: scale(8),
    // fontFamily:Font?.PoppinsMedium,
    marginTop: verticalScale(2),
    height: scale(35)
  },
  clearButton: {
    marginEnd: scale(10),
  },
  title: {
    marginVertical: verticalScale(10),
    fontSize: scale(16),
    color: Color.textColor,
    fontWeight: '500',
    fontFamily:Font?.Poppins
  },
  name: {
    fontSize: scale(12),
    fontWeight: '500',
    paddingVertical: verticalScale(10),
    borderBottomWidth: 1,
    borderBottomColor: '#DDD',
    color:'#675A5A',
    fontFamily:Font?.Poppins
  },
  activity: {
    fontSize: scale(12),
    fontWeight: '500',
    color: Color.textColor,
    fontFamily:Font?.PoppinsMedium
  },
  time: {
    fontSize: scale(10),
    borderBottomWidth: 1,
    borderBottomColor: '#DDD',
    color: '#999595',
    fontFamily:Font?.Poppins,
    paddingBottom: verticalScale(5)
  },
  emptyContainer: {
    padding: scale(20),
    alignItems: 'center',
  },
  emptyText: {
    color: Color.gray,
    fontSize: scale(14),
    fontFamily:Font?.Poppins

  },
});
