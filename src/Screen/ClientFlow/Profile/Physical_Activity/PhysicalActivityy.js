import React, { useCallback, useState } from 'react';
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
import {Color} from '../../../../assets/styles/Colors';
import PhysicalActivity from '../../../../Components/PhysicalActivity';
import {useStepTracking} from '../../../../Components/StepTrackingService';
import {
  DeletePhysicalActivity,
  GetPhysicalActivityDetails,
} from '../../../../Apis/ClientApis/PhysicalActivityApi';
import {useSelector} from 'react-redux';
import Icon from 'react-native-vector-icons/MaterialCommunityIcons';
import OnOffFunctionality from '../../../../Components/OnOffFunctionality';
import Toast from 'react-native-simple-toast';
import Header from '../../../../Components/Header';
import { Shadow } from 'react-native-shadow-2';
import { ShadowValues } from '../../../../assets/styles/Shadow';
import { Font } from '../../../../assets/styles/Fonts';
import ModalComponent from '../../../../Components/ModalComponent';

const PhysicalActivityScreen = () => {
  const navigation = useNavigation();
  const {steps, calories, workouts, currentDay} = useStepTracking();

  const [dayOffset, setDayOffset] = useState(0);
  const [physicalActivity, setPhysicalActivity] = useState({
    physicalActivity: [],
  });
  const [modalVisible, setModalVisible] = useState(false);
  const [selectedEntry, setSelectedEntry] = useState(null);
  const [loading, setLoading] = useState(false);
  const [deleteLoading, setDeleteLoading] = useState(false);

  const tokenId = useSelector(state => state?.user?.token);
  const token = tokenId?.token;
  const id = tokenId?.id;

  const getDateString = () => {
    if (dayOffset === 0) return 'This Week';
    if (dayOffset === -1) return 'Last Week';

    const startDate = new Date();
    startDate.setDate(startDate.getDate() + dayOffset * 7 - startDate.getDay());
    const endDate = new Date(startDate);
    endDate.setDate(endDate.getDate() + 6);

    return `Week of ${startDate.toLocaleDateString('en-US', {
      month: 'short',
      day: 'numeric',
      year: 'numeric',
    })} to ${endDate.toLocaleDateString('en-US', {
      month: 'short',
      day: 'numeric',
      year: 'numeric',
    })}`;
  };

  const showToast = message => {
    Toast.show(message, Toast.LONG, Toast.BOTTOM);
  };

  const fetchPhysicalActivityData = useCallback(async () => {
    if (!token || !id) return;

    try {
      setLoading(true);
      const response = await GetPhysicalActivityDetails(token, id);
      if (response?.success === true) {
        setPhysicalActivity(response?.data);
      } else {
        showToast(response?.message || 'Failed to fetch activity data');
      }
    } catch (error) {
      console.error('Error fetching physical activity data:', error);
      showToast('An error occurred while fetching activity data');
    } finally {
      setLoading(false);
    }
  }, [token, id]);

  useFocusEffect(
    useCallback(() => {
      fetchPhysicalActivityData();
    }, [fetchPhysicalActivityData]),
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
    if (!selectedEntry) {
      showToast('No entry selected for editing');
      return;
    }

    navigation.navigate('workOutDetails', {
      activity: selectedEntry,
      isEditing: true,
    });

    setModalVisible(false);
  };

  const handleDelete = async () => {
    setModalVisible(false);

    if (!selectedEntry?.id) {
      showToast('No entry selected for deletion');
      return;
    }

    setLoading(true);

    try {
      const payload = {
        token,
        clientId: id,
        activityId: selectedEntry.id,
      };

      const response = await DeletePhysicalActivity(payload);

      if (response?.success === true) {
        await fetchPhysicalActivityData();
        showToast('Activity deleted successfully');
      } else {
        showToast(response?.message || 'Failed to delete activity');
      }
    } catch (error) {
      console.error('Error deleting activity:', error);
      showToast('An error occurred while deleting the activity');
    } finally {
      setLoading(false);
    }
  };

  const filterActivitiesByWeek = useCallback(() => {
    if (!physicalActivity?.physicalActivity?.length) return [];

    const today = new Date();
    const startOfWeek = new Date(today);
    startOfWeek.setDate(today.getDate() + dayOffset * 7 - today.getDay());
    startOfWeek.setHours(0, 0, 0, 0);

    const endOfWeek = new Date(startOfWeek);
    endOfWeek.setDate(startOfWeek.getDate() + 6);
    endOfWeek.setHours(23, 59, 59, 999);

    return physicalActivity.physicalActivity.filter(activity => {
      const activityDate = new Date(activity.date);
      return activityDate >= startOfWeek && activityDate <= endOfWeek;
    });
  }, [physicalActivity, dayOffset]);

  const sortActivitiesByDate = useCallback(activities => {
    if (!activities?.length) return [];

    return [...activities].sort((a, b) => {
      return new Date(b.date) - new Date(a.date);
    });
  }, []);

  const physicalActivityData = sortActivitiesByDate(filterActivitiesByWeek());

  const handleSelectEntry = item => {
    setSelectedEntry({
  id: item?._id,
  activity: item?.activity,
  time: item?.time,
  date: item?.date,
    });
    setModalVisible(true);
  };

  const navigateToLogActivity = () => {
    const plusData = {
      press: 'plus',
      token,
      id,
    };
    navigation.navigate('logPhysicalActivity', {plusData});
  };



  const renderActivityItem = ({ item }) => (
    <View style={{ marginTop: scale(10), marginHorizontal: scale(4) }} >
      <Shadow
        distance={3}
        startColor={ShadowValues.blackShadow}
        style={styles.fullWidth}
      >
        <View style={styles.entryItem}>
          <View style={styles.entryLeftSection}>
            <Text style={styles.activities}>{item?.activity}</Text>
            <Text style={styles.date}>{formatDate(item?.date)}</Text>
          </View>
          <View style={styles.rightEntry}>
            <View>
              <Text style={styles.activities}>
                {item?.time} {item?.timeunit}
              </Text>
              <Text style={styles.rightEntryText}>{item?.byactivity}</Text>
            </View>
            <View>
              <TouchableOpacity
                style={styles.menuButton}
                onPress={() => handleSelectEntry(item)}
              >

                <Icon name="dots-vertical" size={20} color={Color.primaryColor} />
              </TouchableOpacity>
            </View>
          </View>
        </View>
      </Shadow>
    </View>
  );

  const renderEmptyState = () => (
    <View style={styles.emptyStateContainer}>
      <Text style={styles.emptyStateText}>
        There are no records of physical activity
      </Text>
    </View>
  );


  const renderActionModal = () => (
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
            onPress={handleDelete}
            disabled={deleteLoading}>
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


  );

  return (
    <SafeAreaView style={styles.container}>
      <Header
        screenheader={true}
        screenName={'Physical Activity'}
        handlePlus={navigateToLogActivity}
        plus={true}
      />

      <CalenderHeader
        onPressLeft={() => setDayOffset(dayOffset - 1)}
        onPressRight={() => setDayOffset(dayOffset + 1)}
        rightColor={dayOffset === 0 ? Color.txt : Color.primaryColor}
        disabled={dayOffset === 0}
        txtFunction={getDateString()}
      />

      <View style={styles.contentContainer}>
        <View style={styles.summaryContainer}>
          <Shadow
            distance={4}
            startColor={ShadowValues.color}
            style={styles.fullWidth}>
            <View style={styles.shadow}>
              <PhysicalActivity />
            </View>
          </Shadow>
        </View>

        <OnOffFunctionality
          ShowTitle={true}
          title={'Your workouts'}
          style={styles.sectionHeader}
        />

        {loading ? (
          <View style={styles.loadingContainer}>
            <ActivityIndicator size="large" color={Color.primaryColor} />
          </View>
        ) : (
          <View style={styles.entriesContainer}>
            <FlatList
              data={physicalActivityData}
              renderItem={renderActivityItem}
              keyExtractor={(item, index) => `activity-${index}`}
              showsVerticalScrollIndicator={false}
              ListEmptyComponent={renderEmptyState}
              contentContainerStyle={styles.flatListContent}
            />
          </View>
        )}
      </View>

      {renderActionModal()}
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: Color.white,
  },
  contentContainer: {
    flex: 1,
    // paddingHorizontal: scale(10),
  },
  summaryContainer: {
    marginVertical: scale(10),
    paddingHorizontal: scale(15),
  },
  fullWidth: {
    width: '100%',
  },
  shadow: {
    borderRadius: scale(10),
    backgroundColor: Color.white,
  },
  sectionHeader: {
    marginTop: scale(8),
    borderBottomWidth: 1,
    paddingVertical: scale(10),
    borderBottomColor: Color.lightgray,
  },
  loadingContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
  entriesContainer: {
    flex: 1,
    paddingHorizontal: scale(10),
  },
  flatListContent: {
    paddingBottom: scale(20),
  },
  shadowContainer: {
    width: '100%',
    marginBottom: scale(10),
  },
  entryItem: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    padding: scale(10),
    borderRadius: scale(6),
    backgroundColor: Color.white,
    borderWidth: 1,
    borderColor: Color?.gray,
    marginTop: scale(5),
  },
  entryLeftSection: {
    width: '60%',
  },
  activities: {
    fontWeight: '500',
    color: Color.black,
    fontSize: scale(13),
    fontFamily: Font?.Poppins
  },
  date: {
    color: Color.gray,
    fontSize: scale(12),
    fontFamily: Font?.Poppins

  },
  rightEntry: {
    flexDirection: 'row',
    alignItems: 'center',
    width: '35%',
    justifyContent: 'space-between',
  },
  rightEntryText: {
    fontSize: scale(12),
    color: Color.black,
    fontFamily: Font?.Poppins

  },
  menuButton: {
  },
  emptyStateContainer: {
    padding: verticalScale(10),
    marginTop: scale(10),
    alignItems: 'center',
  },
  emptyStateText: {
    textAlign: 'center',
    color: '#5D6163',
    fontSize: scale(15),
    fontWeight: '500',
    fontFamily: Font?.Poppins

  },
  modalOptionContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: 'rgba(0, 0, 0, 0.5)',
  },
  modalOptionContent: {
    backgroundColor: Color.white,
    padding: scale(15),
    borderRadius: scale(10),
    width: scale(200),
    alignItems: 'center',
    justifyContent: 'center',
  },
  modalOption: {
    paddingVertical: verticalScale(10),
    width: '100%',
    alignItems: 'center',
  },
  modalText: {
    fontSize: scale(15),
    textAlign: 'center',
    color: Color.black,
  },
});

export default PhysicalActivityScreen;
