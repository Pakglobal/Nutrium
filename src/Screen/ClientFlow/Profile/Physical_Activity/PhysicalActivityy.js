// import React, { useCallback, useEffect, useState } from 'react';
// import {
//   View,
//   Text,
//   StyleSheet,
//   TouchableOpacity,
//   Modal,
//   FlatList,
//   ActivityIndicator,
//   SafeAreaView,
// } from 'react-native';
// import { scale, verticalScale } from 'react-native-size-matters';
// import { useFocusEffect, useNavigation } from '@react-navigation/native';
// import CalenderHeader from '../../../../Components/CalenderHeader';
// import {Color} from '../../../../assets/styles/Colors';
// import BackHeader from '../../../../Components/BackHeader';
// import PhysicalActivity from '../../../../Components/PhysicalActivity';
// import { useStepTracking } from '../../../../Components/StepTrackingService';
// import {
//   DeletePhysicalActivity,
//   GetPhysicalActivityDetails,
// } from '../../../../Apis/ClientApis/PhysicalActivityApi';
// import { useSelector } from 'react-redux';
// import Icon from 'react-native-vector-icons/MaterialCommunityIcons';
// import OnOffFunctionality from '../../../../Components/OnOffFunctionality';
// import { ScrollView } from 'react-native-virtualized-view';
// import Toast from 'react-native-simple-toast';
// import Header from '../../../../Components/Header';
// import { Shadow } from 'react-native-shadow-2';
// import { ShadowValues } from '../../../../assets/styles/Shadow';

// const PhysicalActivityy = () => {
//   const navigation = useNavigation();
//   const { steps, calories, workouts, currentDay } = useStepTracking();

//   const [dayOffset, setDayOffset] = useState(0);
//   const [physicalActivity, setPhysicalActivity] = useState([]);
//   const [modalVisible, setModalVisible] = useState(false);
//   const [selectedEntry, setSelectedEntry] = useState(null);
//   const [loading, setLoading] = useState(false);
//   const [deleteLoading, setDeleteLoading] = useState(false);

//   const tokenId = useSelector(state => state?.user?.token);
//   const token = tokenId?.token;
//   const id = tokenId?.id;

//   const getDateString = () => {
//     if (dayOffset === 0) return 'This Week';
//     else if (dayOffset === -1) return 'Last Week';

//     const startDate = new Date();
//     startDate.setDate(startDate.getDate() + dayOffset * 7 - startDate.getDay());
//     const endDate = new Date(startDate);
//     endDate.setDate(endDate.getDate() + 6);

//     const formattedDate = `Week of ${startDate.toLocaleDateString('en-US', {
//       month: 'short',
//       day: 'numeric',
//       year: 'numeric',
//     })} to ${endDate.toLocaleDateString('en-US', {
//       month: 'short',
//       day: 'numeric',
//       year: 'numeric',
//     })}`;

//     return formattedDate;
//   };

//   const FetchPhysicalActivityData = async () => {
//     try {
//       setLoading(true);
//       const response = await GetPhysicalActivityDetails(token, id);
//       if (response?.success === true) {
//         setPhysicalActivity(response?.data);
//       }
//       setLoading(false);
//     } catch (error) {
//       console.error(error);
//       setLoading(false);
//     }
//   };

//   const showToast = message => {
//     Toast.show(message, Toast.LONG, Toast.BOTTOM);
//   };

//   useFocusEffect(
//     useCallback(() => {
//       FetchPhysicalActivityData();
//     }, [token, id]),
//   );

//   const formatDate = date => {
//     const activityDate = new Date(date);
//     const today = new Date();
//     const yesterday = new Date(today);
//     yesterday.setDate(yesterday.getDate() - 1);

//     const formattedTime = activityDate.toLocaleTimeString([], {
//       hour: '2-digit',
//       minute: '2-digit',
//       hour12: true,
//     });

//     if (activityDate.toDateString() === today.toDateString()) {
//       return `Today, ${formattedTime}`;
//     } else if (activityDate.toDateString() === yesterday.toDateString()) {
//       return `Yesterday, ${formattedTime}`;
//     } else {
//       return `${activityDate.toLocaleDateString()}, ${formattedTime}`;
//     }
//   };

//   const handleEdit = () => {
//     try {
//       if (!selectedEntry) {
//         console.error('No entry selected for editing');
//         return;
//       }
//       setLoading(true);
//       navigation.navigate('workOutDetails', {
//         activity: selectedEntry,
//         isEditing: true,
//       });

//       setModalVisible(false);
//       setLoading(false);
//     } catch (error) {
//       console.error(error);
//       setLoading(false);
//     }
//   };

//   const handleDelete = async () => {
//     setDeleteLoading(true);
//     try {
//       const payload = {
//         token: token,
//         clientId: physicalActivity?.clientId,
//         activityId: selectedEntry?.id,
//       };
//       const response = await DeletePhysicalActivity(payload);
//       if (
//         response?.message === 'Activity deleted successfully' ||
//         response?.success === true
//       ) {
//         FetchPhysicalActivityData();
//       } else {
//         showToast(response?.message);
//         setDeleteLoading(false);
//       }
//       setModalVisible(false);
//     } catch (error) {
//       showToast(error);
//       setDeleteLoading(false);
//     }
//   };

//   const filterActivitiesByWeek = () => {
//     if (!physicalActivity?.physicalActivity) return [];

//     const today = new Date();
//     const startOfWeek = new Date(today);
//     startOfWeek?.setDate(today.getDate() + dayOffset * 7 - today?.getDay());
//     startOfWeek?.setHours(0, 0, 0, 0);

//     const endOfWeek = new Date(startOfWeek);
//     endOfWeek.setDate(startOfWeek?.getDate() + 6);
//     endOfWeek?.setHours(23, 59, 59, 999);

//     return physicalActivity?.physicalActivity?.filter(activity => {
//       const activityDate = new Date(activity.date);
//       return activityDate >= startOfWeek && activityDate <= endOfWeek;
//     });
//   };

//   const sortActivitiesByDate = activities => {
//     if (!activities) return [];

//     const sortedActivities = [...activities];

//     sortedActivities.sort((a, b) => {
//       const dateA = new Date(a.date);
//       const dateB = new Date(b.date);
//       return dateB - dateA;
//     });

//     return sortedActivities;
//   };

//   const physicalActivityData = sortActivitiesByDate(filterActivitiesByWeek());

//   const plusData = {
//     press: 'plus',
//     token: token,
//     id: id,
//   };

//   return (
//     <SafeAreaView style={{ flex: 1, backgroundColor: Color.white }}>

//       <Header screenheader={true} screenName={'Physical Activity'} handlePlus={() =>
//         navigation.navigate('logPhysicalActivity', { plusData: plusData })} plus={true} />
//       <CalenderHeader
//         onPressLeft={() => setDayOffset(dayOffset - 1)}
//         onPressRight={() => setDayOffset(dayOffset + 1)}
//         rightColor={dayOffset === 0 ? Color.txt : Color.primaryColor}
//         disabled={dayOffset === 0}
//         txtFunction={getDateString()}
//       />
//       <View style={{ paddingHorizontal: scale(10) }} >
//         <View
//           style={{ marginVertical: scale(10), }}>
//           <Shadow
//             distance={ShadowValues.distance}
//             startColor={ShadowValues.color}
//             style={{ width: '100%' }}>
//             <View style={styles.shadow}>
//               <PhysicalActivity />
//             </View>
//           </Shadow>
//         </View>
//         <OnOffFunctionality
//           title={'Your workouts'}
//           style={{
//             marginTop: scale(8),
//             borderBottomWidth: 1,
//             paddingVertical: scale(10),
//             borderBottomColor: Color?.lightgray,
//           }}
//         />

//         {loading ? (
//           <View style={{ flex: 1, justifyContent: 'center', alignItems: 'center' }}>
//             <ActivityIndicator size="large" color={Color.primaryColor} />
//           </View>
//         ) : physicalActivityData && physicalActivityData?.length > 0 ? (
//           <View style={styles.entriesContainer}>
//             <FlatList
//               data={physicalActivityData}
//               showsVerticalScrollIndicator={false}
//               renderItem={({ item }) => (
//                 <View style={styles.entryItem}>
//                   <View style={{ width: '65%', marginLeft: scale(8) }}>
//                     <Text style={styles.activities}>{item?.activity}</Text>
//                     <Text style={styles.date}>{formatDate(item?.date)}</Text>
//                   </View>
//                   <View style={styles.rightEntry}>
//                     <View>
//                       <Text style={styles.rightEntryText}>
//                         {item?.time} {item?.timeunit}
//                       </Text>
//                       <Text style={styles.rightEntryText}>
//                         {item?.byactivity}
//                       </Text>
//                     </View>
//                     <View>
//                       <TouchableOpacity
//                         style={{ marginLeft: scale(15) }}
//                         onPress={() => {
//                           setSelectedEntry({
//                             id: item?._id,
//                             activity: item?.activity,
//                             time: item?.time,
//                             date: item?.date,
//                           });
//                           setModalVisible(true);
//                         }}>
//                         <Icon name="dots-vertical" size={20} color={Color.gray} />
//                       </TouchableOpacity>
//                     </View>
//                   </View>
//                 </View>
//               )}
//               keyExtractor={(item, index) => `activity-${index}`}
//             />
//           </View>
//         ) : (
//           <View style={{ padding: verticalScale(10), marginTop: scale(10) }}>
//             <Text
//               style={{
//                 textAlign: 'center',
//                 color: Color.textColor,
//                 fontSize: scale(15),
//                 fontWeight: '500',
//               }}>
//               There are no records of physical activity
//             </Text>
//           </View>
//         )}

//         {modalVisible && (
//           <Modal
//             transparent={true}
//             visible={modalVisible}
//             animationType="fade"
//             onRequestClose={() => setModalVisible(false)}>
//             <View style={styles.modalOptionContainer}>
//               <View style={styles.modalOptionContent}>
//                 <TouchableOpacity style={styles.modalOption} onPress={handleEdit}>
//                   <Text style={styles.modalText}>Edit</Text>
//                 </TouchableOpacity>
//                 <TouchableOpacity
//                   style={styles.modalOption}
//                   onPress={handleDelete}>
//                   <Text style={styles.modalText}>Delete</Text>
//                 </TouchableOpacity>
//                 <TouchableOpacity
//                   style={styles.modalOption}
//                   onPress={() => setModalVisible(false)}>
//                   <Text style={styles.modalText}>Cancel</Text>
//                 </TouchableOpacity>
//               </View>
//             </View>
//           </Modal>
//         )}
//       </View>
//     </SafeAreaView>
//   );
// };

// export default PhysicalActivityy;

// const styles = StyleSheet.create({
//   imgBG: {
//     width: '100%',
//     height: verticalScale(100),
//     marginTop: verticalScale(20),
//   },
//   shadowView: {
//     height: '100%',
//     width: '100%',
//     borderRadius: 20,
//   },
//   firstTitle: {
//     fontSize: verticalScale(15),
//     fontWeight: '700',
//     color: Color.white,
//     marginTop: verticalScale(15),
//   },
//   fisrtCardContainer: {
//     flexDirection: 'row',
//     marginTop: verticalScale(15),
//     alignItems: 'center',
//   },
//   numberTxt: {
//     fontSize: verticalScale(30),
//     fontWeight: '700',
//     color: Color.white,
//     marginEnd: scale(15),
//   },
//   dayRound: {
//     height: verticalScale(20),
//     width: verticalScale(20),
//     borderRadius: 50,
//     backgroundColor: Color.white,
//     marginHorizontal: scale(7),
//   },
//   dayTxt: {
//     fontSize: verticalScale(11),
//     fontWeight: '600',
//     color: Color.txt,
//     marginVertical: verticalScale(5),
//   },
//   bothCardContainer: {
//     flexDirection: 'row',
//     marginTop: verticalScale(20),
//     justifyContent: 'space-between',
//   },
//   modalOptionContainer: {
//     flex: 1,
//     justifyContent: 'center',
//     alignItems: 'center',
//     backgroundColor: 'rgba(0, 0, 0, 0.5)',
//   },
//   modalOptionContent: {
//     backgroundColor: '#fff',
//     padding: scale(15),
//     borderRadius: scale(10),
//     width: scale(200),
//     height: scale(160),
//     alignItems: 'center',
//     justifyContent: 'center',
//   },
//   modalOption: {
//     paddingVertical: verticalScale(10),
//   },
//   modalText: {
//     fontSize: scale(15),
//     textAlign: 'center',
//     color: Color.black,
//   },
//   title: {
//     fontSize: verticalScale(14),
//     fontWeight: '500',
//     color: Color.txt,
//     marginHorizontal: scale(16),
//     marginVertical: verticalScale(10),
//   },
//   header: {
//     flexDirection: 'row',
//     justifyContent: 'space-between',
//     alignItems: 'center',
//     marginVertical: verticalScale(10),
//   },
//   buttonContainer: {
//     flexDirection: 'row',
//     alignItems: 'center',
//     paddingHorizontal: scale(10),
//     paddingVertical: verticalScale(5),
//     marginHorizontal: scale(16),
//     borderRadius: scale(20),
//     backgroundColor: Color.white,
//     elevation: 1,
//   },
//   buttonText: {
//     color: Color.gray,
//     fontWeight: '600',
//     marginStart: scale(5),
//   },
//   entriesContainer: {
//     // flex: 1,
//     // paddingHorizontal: scale(16),
//     marginTop: scale(15),
//     backgroundColor: Color?.white,
//   },
//   entryItem: {
//     elevation: 5,
//     shadowColor: Color?.black,
//     shadowOpacity: 0.8,
//     shadowRadius: 8,
//     shadowOffset: {
//       width: 5,
//       height: 5,
//     },
//     width: '96%',
//     alignSelf: 'center',
//     flexDirection: 'row',
//     justifyContent: 'space-between',
//     alignItems: 'center',
//     borderWidth: scale(1),
//     borderColor: '#DDD',
//     paddingVertical: verticalScale(10),
//     borderRadius: scale(6),
//     // backgroundColor:'red',
//     marginBottom: scale(10),
//     backgroundColor: Color?.white,
//   },
//   rightEntry: {
//     flexDirection: 'row',
//     alignItems: 'center',
//     width: '32%',
//     justifyContent: 'space-between',
//   },
//   activities: {
//     fontWeight: '500',
//     color: Color.black,
//     fontSize: scale(13),
//     width: '90%',
//   },
//   rightEntryText: {
//     fontSize: scale(12),
//     color: Color.black,
//   },
//   date: {
//     color: Color.gray,
//     fontSize: scale(12),
//   },
//   modalView: {
//     flex: 1,
//     alignItems: 'center',
//     justifyContent: 'center',
//     backgroundColor: 'rgba(100,100,100,0.5)',
//   },
//   modalContainer: {
//     width: '80%',
//     paddingVertical: verticalScale(20),
//     backgroundColor: 'white',
//     borderRadius: 10,
//   },
//   modalTitle: {
//     fontSize: verticalScale(16),
//     color: Color.txt,
//   },
//   modalBtnView: {
//     flexDirection: 'row',
//     justifyContent: 'flex-end',
//     marginTop: verticalScale(10),
//   },
//   modalBtnTxt: {
//     letterSpacing: 1.5,
//     fontSize: verticalScale(12),
//     color: Color.primaryColor,
//     fontWeight: '600',
//   },
//   description: {
//     color: Color.gray,
//     marginTop: verticalScale(10),
//     fontSize: scale(12),
//   },
//   shadow: {
//     borderRadius: scale(10),
//     backgroundColor: Color?.white,
//   },
// });

import React, {useCallback, useState} from 'react';
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
import {Shadow} from 'react-native-shadow-2';
import {ShadowValues} from '../../../../assets/styles/Shadow';

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

  const renderActivityItem = ({item}) => (
    // <Shadow
    //   distance={4}
    //   startColor={'rgba(0, 0, 0, 0.1)'}
    //   style={styles.shadowContainer}
    // >
    <View style={styles.entryItem}>
      <View style={styles.entryLeftSection}>
        <Text style={styles.activities}>{item?.activity}</Text>
        <Text style={styles.date}>{formatDate(item?.date)}</Text>
      </View>
      <View style={styles.rightEntry}>
        <View>
          <Text style={styles.rightEntryText}>
            {item?.time} {item?.timeunit}
          </Text>
          <Text style={styles.rightEntryText}>{item?.byactivity}</Text>
        </View>
        <TouchableOpacity
          style={styles.menuButton}
          onPress={() => handleSelectEntry(item)}>
          <Icon name="dots-vertical" size={20} color={Color.gray} />
        </TouchableOpacity>
      </View>
    </View>
    // </Shadow>
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
            distance={ShadowValues.distance}
            startColor={ShadowValues.color}
            style={styles.fullWidth}>
            <View style={styles.shadow}>
              <PhysicalActivity />
            </View>
          </Shadow>
        </View>

        <OnOffFunctionality
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
    paddingHorizontal: scale(10),
  },
  summaryContainer: {
    marginVertical: scale(10),
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
    // marginTop: scale(15),
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
    width: '65%',
    marginLeft: scale(8),
  },
  activities: {
    fontWeight: '500',
    color: Color.black,
    fontSize: scale(13),
    width: '90%',
  },
  date: {
    color: Color.gray,
    fontSize: scale(12),
  },
  rightEntry: {
    flexDirection: 'row',
    alignItems: 'center',
    width: '32%',
    justifyContent: 'space-between',
  },
  rightEntryText: {
    fontSize: scale(12),
    color: Color.black,
  },
  menuButton: {
    marginLeft: scale(15),
    padding: scale(5),
  },
  emptyStateContainer: {
    padding: verticalScale(10),
    marginTop: scale(10),
    alignItems: 'center',
  },
  emptyStateText: {
    textAlign: 'center',
    color: Color.textColor,
    fontSize: scale(15),
    fontWeight: '500',
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
