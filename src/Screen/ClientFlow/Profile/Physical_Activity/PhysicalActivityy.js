import React, {useCallback, useEffect, useState} from 'react';
import {
  View,
  Text,
  StyleSheet,
  TouchableOpacity,
  Modal,
  FlatList,
  ActivityIndicator,
  SafeAreaView,
} from 'react-native';
import {scale, verticalScale} from 'react-native-size-matters';
import {useFocusEffect, useNavigation} from '@react-navigation/native';
import CalenderHeader from '../../../../Components/CalenderHeader';
import Color from '../../../../assets/colors/Colors';
import BackHeader from '../../../../Components/BackHeader';
import PhysicalActivity from '../../../../Components/PhysicalActivity';
import {useStepTracking} from '../../../../Components/StepTrackingService';
import {
  DeletePhysicalActivity,
  GetPhysicalActivityDetails,
} from '../../../../Apis/ClientApis/PhysicalActivityApi';
import {useSelector} from 'react-redux';
import Icon from 'react-native-vector-icons/MaterialCommunityIcons';
import OnOffFunctionality from '../../../../Components/OnOffFunctionality';
import {ScrollView} from 'react-native-virtualized-view';
import Toast from 'react-native-simple-toast';

const PhysicalActivityy = () => {
  const navigation = useNavigation();
  const {steps, calories, workouts, currentDay} = useStepTracking();

  const [dayOffset, setDayOffset] = useState(0);
  const [physicalActivity, setPhysicalActivity] = useState([]);
  const [modalVisible, setModalVisible] = useState(false);
  const [selectedEntry, setSelectedEntry] = useState(null);
  const [loading, setLoading] = useState(false);
  const [deleteLoading, setDeleteLoading] = useState(false);

  const getToken = useSelector(state => state?.user?.userInfo);
  const token = getToken?.token;
  const id = getToken?.userData?._id || getToken?.user?._id;

  const getDateString = () => {
    if (dayOffset === 0) return 'This Week';
    else if (dayOffset === -1) return 'Last Week';

    const startDate = new Date();
    startDate.setDate(startDate.getDate() + dayOffset * 7 - startDate.getDay());
    const endDate = new Date(startDate);
    endDate.setDate(endDate.getDate() + 6);

    const formattedDate = `Week of ${startDate.toLocaleDateString('en-US', {
      month: 'short',
      day: 'numeric',
      year: 'numeric',
    })} to ${endDate.toLocaleDateString('en-US', {
      month: 'short',
      day: 'numeric',
      year: 'numeric',
    })}`;

    return formattedDate;
  };

  const FetchPhysicalActivityData = async () => {
    try {
      setLoading(true);
      const response = await GetPhysicalActivityDetails(token, id);
      if (response?.success === true) {
        setPhysicalActivity(response?.data);
      }
      setLoading(false);
    } catch (error) {
      console.error(error);
      setLoading(false);
    }
  };

  const showToast = message => {
    Toast.show(message, Toast.LONG, Toast.BOTTOM);
  };

  useFocusEffect(
    useCallback(() => {
      FetchPhysicalActivityData();
    }, [token, id]),
  );

  const formatDate = date => {
    const activityDate = new Date(date);
    const today = new Date();
    const yesterday = new Date(today);
    yesterday.setDate(yesterday.getDate() - 1);

    const formattedTime = activityDate.toLocaleTimeString([], {
      hour: '2-digit',
      minute: '2-digit',
      hour12: true,
    });

    if (activityDate.toDateString() === today.toDateString()) {
      return `Today, ${formattedTime}`;
    } else if (activityDate.toDateString() === yesterday.toDateString()) {
      return `Yesterday, ${formattedTime}`;
    } else {
      return `${activityDate.toLocaleDateString()}, ${formattedTime}`;
    }
  };

  const handleEdit = () => {
    try {
      if (!selectedEntry) {
        console.error('No entry selected for editing');
        return;
      }
      setLoading(true);
      navigation.navigate('workOutDetails', {
        activity: selectedEntry,
        isEditing: true,
      });

      setModalVisible(false);
      setLoading(false);
    } catch (error) {
      console.error(error);
      setLoading(false);
    }
  };

  const handleDelete = async () => {
    setDeleteLoading(true);
    try {
      const payload = {
        token: token,
        clientId: physicalActivity?.clientId,
        activityId: selectedEntry?.id,
      };
      const response = await DeletePhysicalActivity(payload);
      if (
        response?.message === 'Activity deleted successfully' ||
        response?.success === true
      ) {
        FetchPhysicalActivityData();
      } else {
        showToast(response?.message);
        setDeleteLoading(false);
      }
      setModalVisible(false);
    } catch (error) {
      showToast(error);
      setDeleteLoading(false);
    }
  };

  const filterActivitiesByWeek = () => {
    if (!physicalActivity?.physicalActivity) return [];

    const today = new Date();
    const startOfWeek = new Date(today);
    startOfWeek?.setDate(today.getDate() + dayOffset * 7 - today?.getDay());
    startOfWeek?.setHours(0, 0, 0, 0);

    const endOfWeek = new Date(startOfWeek);
    endOfWeek.setDate(startOfWeek?.getDate() + 6);
    endOfWeek?.setHours(23, 59, 59, 999);

    return physicalActivity?.physicalActivity?.filter(activity => {
      const activityDate = new Date(activity.date);
      return activityDate >= startOfWeek && activityDate <= endOfWeek;
    });
  };

  const sortActivitiesByDate = activities => {
    if (!activities) return [];

    const sortedActivities = [...activities];

    sortedActivities.sort((a, b) => {
      const dateA = new Date(a.date);
      const dateB = new Date(b.date);
      return dateB - dateA;
    });

    return sortedActivities;
  };

  const physicalActivityData = sortActivitiesByDate(filterActivitiesByWeek());

  const plusData = {
    press: 'plus',
    token: token,
    id: id,
  };

  return (
    <SafeAreaView style={{flex: 1, backgroundColor: Color.primary}}>
      <BackHeader
        titleName={'Physical activity'}
        onPressBack={() => navigation.goBack()}
        onPress={() =>
          navigation.navigate('logPhysicalActivity', {plusData: plusData})
        }
      />
      <CalenderHeader
        onPressLeft={() => setDayOffset(dayOffset - 1)}
        onPressRight={() => setDayOffset(dayOffset + 1)}
        rightColor={dayOffset === 0 ? Color.txt : Color.primaryGreen}
        disabled={dayOffset === 0}
        txtFunction={getDateString()}
      />

      <PhysicalActivity />
      <OnOffFunctionality title={'Your workouts'} />

      {loading ? (
        <View style={{flex: 1, justifyContent: 'center', alignItems: 'center'}}>
          <ActivityIndicator size="large" color={Color.primaryGreen} />
        </View>
      ) : physicalActivityData && physicalActivityData?.length > 0 ? (
        <View style={styles.entriesContainer}>
          <FlatList
            data={physicalActivityData}
            showsVerticalScrollIndicator={false}
            renderItem={({item}) => (
              <View style={styles.entryItem}>
                <View style={{width: '65%'}}>
                  <Text style={styles.activities}>{item?.activity}</Text>
                  <Text style={styles.date}>{formatDate(item?.date)}</Text>
                </View>
                <View style={styles.rightEntry}>
                  <View>
                    <Text style={styles.rightEntryText}>
                      {item?.time} {item?.timeunit}
                    </Text>
                    <Text style={styles.rightEntryText}>
                      {item?.byactivity}
                    </Text>
                  </View>
                  <View>
                    <TouchableOpacity
                      style={{marginLeft: scale(15)}}
                      onPress={() => {
                        setSelectedEntry({
                          id: item?._id,
                          activity: item?.activity,
                          time: item?.time,
                          date: item?.date,
                        });
                        setModalVisible(true);
                      }}>
                      <Icon name="dots-vertical" size={20} color={Color.gray} />
                    </TouchableOpacity>
                  </View>
                </View>
              </View>
            )}
            keyExtractor={(item, index) => `activity-${index}`}
          />
        </View>
      ) : (
        <View style={{padding: verticalScale(16)}}>
          <Text style={{textAlign: 'center', color: Color.gray}}>
            There are no records of physical activity
          </Text>
        </View>
      )}

      {modalVisible && (
        <Modal
          transparent={true}
          visible={modalVisible}
          animationType="fade"
          onRequestClose={() => setModalVisible(false)}>
          <View style={styles.modalOptionContainer}>
            <View style={styles.modalOptionContent}>
              <TouchableOpacity style={styles.modalOption} onPress={handleEdit}>
                <Text style={styles.modalText}>Edit</Text>
              </TouchableOpacity>
              <TouchableOpacity
                style={styles.modalOption}
                onPress={handleDelete}>
                <Text style={styles.modalText}>Delete</Text>
              </TouchableOpacity>
              <TouchableOpacity
                style={styles.modalOption}
                onPress={() => setModalVisible(false)}>
                <Text style={styles.modalText}>Cancel</Text>
              </TouchableOpacity>
            </View>
          </View>
        </Modal>
      )}
    </SafeAreaView>
  );
};

export default PhysicalActivityy;

const styles = StyleSheet.create({
  imgBG: {
    width: '100%',
    height: verticalScale(100),
    marginTop: verticalScale(20),
  },
  shadowView: {
    height: '100%',
    width: '100%',
    borderRadius: 20,
  },
  firstTitle: {
    fontSize: verticalScale(15),
    fontWeight: '700',
    color: Color.primary,
    marginTop: verticalScale(15),
  },
  fisrtCardContainer: {
    flexDirection: 'row',
    marginTop: verticalScale(15),
    alignItems: 'center',
  },
  numberTxt: {
    fontSize: verticalScale(30),
    fontWeight: '700',
    color: Color.primary,
    marginEnd: scale(15),
  },
  dayRound: {
    height: verticalScale(20),
    width: verticalScale(20),
    borderRadius: 50,
    backgroundColor: Color.primary,
    marginHorizontal: scale(7),
  },
  dayTxt: {
    fontSize: verticalScale(11),
    fontWeight: '600',
    color: Color.txt,
    marginVertical: verticalScale(5),
  },
  bothCardContainer: {
    flexDirection: 'row',
    marginTop: verticalScale(20),
    justifyContent: 'space-between',
  },
  modalOptionContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: 'rgba(0, 0, 0, 0.5)',
  },
  modalOptionContent: {
    backgroundColor: '#fff',
    padding: scale(15),
    borderRadius: scale(10),
    width: scale(200),
    height: scale(160),
    alignItems: 'center',
    justifyContent: 'center',
  },
  modalOption: {
    paddingVertical: verticalScale(10),
  },
  modalText: {
    fontSize: scale(15),
    textAlign: 'center',
    color: Color.black,
  },
  title: {
    fontSize: verticalScale(14),
    fontWeight: '500',
    color: Color.txt,
    marginHorizontal: scale(16),
    marginVertical: verticalScale(10),
  },
  header: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginVertical: verticalScale(10),
  },
  buttonContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: scale(10),
    paddingVertical: verticalScale(5),
    marginHorizontal: scale(16),
    borderRadius: scale(20),
    backgroundColor: Color.primary,
    elevation: 1,
  },
  buttonText: {
    color: Color.gray,
    fontWeight: '600',
    marginStart: scale(5),
  },
  entriesContainer: {
    flex: 1,
    paddingHorizontal: scale(16),
  },
  entryItem: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    borderBottomWidth: 1,
    borderBottomColor: '#DDD',
    paddingVertical: verticalScale(10),
  },
  rightEntry: {
    flexDirection: 'row',
    alignItems: 'center',
    width: '32%',
    justifyContent: 'space-between',
  },
  activities: {
    fontWeight: '500',
    color: Color.black,
    fontSize: scale(13),
    width: '90%',
  },
  rightEntryText: {
    fontSize: scale(12),
    color: Color.black,
  },
  date: {
    color: Color.gray,
    fontSize: scale(12),
  },
  modalView: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: 'rgba(100,100,100,0.5)',
  },
  modalContainer: {
    width: '80%',
    paddingVertical: verticalScale(20),
    backgroundColor: 'white',
    borderRadius: 10,
  },
  modalTitle: {
    fontSize: verticalScale(16),
    color: Color.txt,
  },
  modalBtnView: {
    flexDirection: 'row',
    justifyContent: 'flex-end',
    marginTop: verticalScale(10),
  },
  modalBtnTxt: {
    letterSpacing: 1.5,
    fontSize: verticalScale(12),
    color: Color.primaryGreen,
    fontWeight: '600',
  },
  description: {
    color: Color.gray,
    marginTop: verticalScale(10),
    fontSize: scale(12),
  },
});
