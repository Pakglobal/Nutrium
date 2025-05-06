// import {
//     StyleSheet,
//     Text,
//     View,
//     FlatList,
//     TouchableOpacity,
//     Alert,
//   } from 'react-native';
//   import React, {useEffect, useState} from 'react';
//   import {
//     challengeAcceptAndRejectedApi,
//     getAllChallengePendingRequest,
//   } from '../../../Apis/ClientApis/ChallengesApi';
//   import {useSelector} from 'react-redux';
//   import {useNavigation} from '@react-navigation/native';
//   import moment from 'moment';
//   import CustomLoader from '../../../Components/CustomLoader';

//   const InvitationScreen = () => {
//     const userInfo = useSelector(state => state?.user?.userInfo);
//     const [requests, setRequests] = useState([]);
//     const [loading, setLoading] = useState(true);
//     const navigation = useNavigation();

//     useEffect(() => {
//       GetJoiningRequest();
//     }, []);

//     const GetJoiningRequest = async () => {
//       try {
//         setLoading(true);
//         const response = await getAllChallengePendingRequest(
//           userInfo?.token,
//           userInfo?.userData?._id,
//         );
//         if (response?.success) {
//           setRequests(response?.challenges || []);
//         }
//       } catch (error) {
//         if (error?.response) {
//           const statusCode = error.response.status;
//           const message = error.response.data?.message || 'Something went wrong';
//           Alert.alert(`Error ${statusCode}`, message);
//         } else {
//           Alert.alert('Error', 'Network error or server not responding');
//         }
//       } finally {
//         setLoading(false);
//       }
//     };

//     const renderRequest = ({item}) => {
//       return (
//         <View style={styles.card}>
//           <Text style={styles.title}>{item.name}</Text>
//           <Text style={styles.detail}>
//             From {item.createdBy?.name || 'Unknown'} {'\n'}
//             {moment(item.startDate).format('MMM DD, YYYY')}
//           </Text>
//           <View style={styles.buttonRow}>
//             <TouchableOpacity
//               style={styles.rejectBtn}
//               onPress={() => handleReject(item._id)}>
//               <Text style={styles.btnText}>Reject</Text>
//             </TouchableOpacity>
//             <TouchableOpacity
//               style={styles.acceptBtn}
//               onPress={() => handleAccept(item._id)}>
//               <Text style={styles.btnText}>Accept</Text>
//             </TouchableOpacity>
//           </View>
//         </View>
//       );
//     };

//     const handleAccept = id => {
//       const action = {
//         action: 'accepted',
//       };
//       aceeptAndRejectAnctionHandle(id, action);
//     };

//     const handleReject = id => {
//       const action = {
//         action: 'rejected',
//       };
//       aceeptAndRejectAnctionHandle(id);
//     };

//     const aceeptAndRejectAnctionHandle = async (id, action) => {
//       try {
//         setLoading(true);
//         const response = await challengeAcceptAndRejectedApi(
//           userInfo?.token,
//           id,
//           userInfo?.userData?._id,
//           action,
//         );
//         if (response?.success) {
//           Alert.alert('Success', response.message, [
//             {text: 'OK', onPress: () => navigation.goBack()},
//           ]);
//         }
//       } catch (error) {
//         if (error?.response) {
//           const statusCode = error.response.status;
//           const message = error.response.data?.message || 'Something went wrong';
//           Alert.alert(`Error ${statusCode}`, message);
//         } else {
//           Alert.alert('Error', 'Network error or server not responding');
//         }
//       } finally {
//         setLoading(false);
//       }
//     };

//     if (loading) {
//       return <CustomLoader />;
//     }

//     return (
//       <View style={styles.container}>
//         <FlatList
//           data={requests}
//           keyExtractor={item => item._id}
//           renderItem={renderRequest}
//           contentContainerStyle={{paddingBottom: 20}}
//           ListEmptyComponent={
//             <Text style={styles.emptyText}>No requests available</Text>
//           }
//         />
//       </View>
//     );
//   };

//   export default InvitationScreen;

//   const styles = StyleSheet.create({
//     container: {
//       flex: 1,
//       padding: 16,
//       backgroundColor: '#F7F7F7',
//     },
//     card: {
//       backgroundColor: '#fff',
//       borderRadius: 8,
//       padding: 12,
//       marginBottom: 10,
//       shadowColor: '#000',
//       shadowOpacity: 0.1,
//       shadowOffset: {width: 0, height: 2},
//       shadowRadius: 4,
//       elevation: 2,
//     },
//     title: {
//       fontSize: 16,
//       fontWeight: 'bold',
//       color: '#000',
//       marginBottom: 4,
//     },
//     detail: {
//       fontSize: 14,
//       color: '#666',
//       marginBottom: 8,
//     },
//     buttonRow: {
//       flexDirection: 'row',
//       justifyContent: 'flex-end',
//     },
//     acceptBtn: {
//       backgroundColor: '#4CAF50',
//       paddingVertical: 6,
//       paddingHorizontal: 12,
//       borderRadius: 4,
//       marginLeft: 8,
//     },
//     rejectBtn: {
//       backgroundColor: '#F44336',
//       paddingVertical: 6,
//       paddingHorizontal: 12,
//       borderRadius: 4,
//     },
//     btnText: {
//       color: '#fff',
//       fontSize: 14,
//       fontWeight: '600',
//     },
//     emptyText: {
//       marginTop: 20,
//       textAlign: 'center',
//       color: '#888',
//       fontSize: 16,
//     },
//   });

import {
  StyleSheet,
  Text,
  View,
  FlatList,
  TouchableOpacity,
  Alert,
  Animated,
  Dimensions,
} from 'react-native';
import React, {useState} from 'react';
import {useNavigation} from '@react-navigation/native';
import moment from 'moment';
import CustomLoader from '../../../Components/CustomLoader';
import {Color} from '../../../assets/styles/Colors';
import CustomShadow from '../../../Components/CustomShadow';
import {shadowStyle} from '../../../assets/styles/Shadow';
import {scale} from 'react-native-size-matters';
import {GestureHandlerRootView, Swipeable} from 'react-native-gesture-handler';

const InvitationScreen = () => {
  const [loading, setLoading] = useState(false);
  const navigation = useNavigation();

  const staticRequests = [
    {
      _id: '1',
      name: 'Weekly Challenge',
      createdBy: {name: 'John Doe'},
      startDate: '2025-04-24',
    },
    {
      _id: '2',
      name: 'Fitness Challenge',
      createdBy: {name: 'Jane Smith'},
      startDate: '2025-04-23',
    },
    {
      _id: '3',
      name: 'Fitness Challenge',
      createdBy: {name: 'Jane Smith'},
      startDate: '2025-04-23',
    },
  ];

  const handleAccept = id => {
    Alert.alert('Success', `Challenge ${id} accepted!`, [
      {text: 'OK', onPress: () => console.log('accept')},
    ]);
  };

  const handleReject = id => {
    Alert.alert('Success', `Challenge ${id} rejected!`, [
      {text: 'OK', onPress: () => console.log('reject')},
    ]);
  };

  // Get screen width to calculate 10% threshold
  const screenWidth = Dimensions.get('window').width;
  const swipeThreshold = 0.1; // 10% of screen width

  const renderRightActions = (progress, dragX) => {
    const opacity = progress.interpolate({
      inputRange: [0, swipeThreshold, swipeThreshold + 0.1], // Start showing at 10% swipe
      outputRange: [0, 0, 1], // Stay invisible until threshold, then fade in
      extrapolate: 'clamp',
    });

    return (
      <Animated.View style={[styles.rightAction, {opacity}]}>
        <Text style={styles.actionText}>Accept</Text>
      </Animated.View>
    );
  };

  const renderLeftActions = (progress, dragX) => {
    const opacity = progress.interpolate({
      inputRange: [0, swipeThreshold, swipeThreshold + 0.1], // Start showing at 10% swipe
      outputRange: [0, 0, 1], // Stay invisible until threshold, then fade in
      extrapolate: 'clamp',
    });

    return (
      <Animated.View style={[styles.leftAction, {opacity}]}>
        <Text style={styles.actionText}>Reject</Text>
      </Animated.View>
    );
  };

  const renderRequest = ({item}) => {
    return (
      <View style={{marginHorizontal: 5, marginTop: 12}}>
        <CustomShadow style={shadowStyle} shadowColor={'#000'}>
          <Swipeable
            renderRightActions={renderRightActions}
            renderLeftActions={renderLeftActions}
            onSwipeableRightOpen={() => handleAccept(item._id)}
            onSwipeableLeftOpen={() => handleReject(item._id)}
            friction={2}
            overshootLeft={false}
            overshootRight={false}
            // Optional: Adjust the swipe distance required to trigger the action
            leftThreshold={screenWidth * swipeThreshold * 2} // Adjust for left swipe
            rightThreshold={screenWidth * swipeThreshold * 2} // Adjust for right swipe
          >
            <View style={styles.card}>
              <View style={{width: '60%'}}>
                <Text style={styles.title}>{item.name}</Text>
                <Text style={styles.detail}>
                  From {item.createdBy?.name || 'Unknown'} {'\n'}
                  {moment(item.startDate).format('MMM DD, YYYY')}
                </Text>
              </View>
              <View
                style={{
                  width: '40%',
                  flexDirection: 'row',
                  justifyContent: 'space-between',
                }}>
                <TouchableOpacity
                  style={[styles.button, {backgroundColor: '#F44336'}]}
                  onPress={() => handleReject(item._id)}>
                  <Text style={styles.btnText}>Reject</Text>
                </TouchableOpacity>
                <TouchableOpacity
                  style={styles.button}
                  onPress={() => handleAccept(item._id)}>
                  <Text style={styles.btnText}>Accept</Text>
                </TouchableOpacity>
              </View>
            </View>
          </Swipeable>
        </CustomShadow>
      </View>
    );
  };

  if (loading) {
    return <CustomLoader />;
  }

  return (
    <GestureHandlerRootView style={{flex: 1}}>
      <View style={styles.container}>
        <FlatList
          data={staticRequests}
          keyExtractor={item => item._id}
          renderItem={renderRequest}
          contentContainerStyle={{paddingBottom: 20}}
          ListEmptyComponent={
            <Text style={styles.emptyText}>No requests available</Text>
          }
          initialNumToRender={10}
          maxToRenderPerBatch={10}
          windowSize={21}
        />
      </View>
    </GestureHandlerRootView>
  );
};

export default InvitationScreen;

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: Color.white,
  },
  card: {
    backgroundColor: Color.white,
    borderRadius: 8,
    padding: 12,
    flexDirection: 'row',
    justifyContent: 'space-between',
  },
  title: {
    fontSize: 16,
    fontWeight: 'bold',
    color: '#000',
    marginBottom: 4,
  },
  detail: {
    fontSize: 14,
    color: '#666',
    marginBottom: 8,
  },
  button: {
    backgroundColor: '#4CAF50',
    borderRadius: scale(6),
    margin: scale(4),
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
    height: 35,
  },
  btnText: {
    color: '#fff',
    fontSize: 14,
    fontWeight: '600',
  },
  emptyText: {
    marginTop: 20,
    textAlign: 'center',
    color: '#888',
    fontSize: 16,
  },
  rightAction: {
    backgroundColor: '#4CAF50',
    justifyContent: 'center',
    alignItems: 'flex-end',
    flex: 1,
    paddingRight: 20,
    borderTopRightRadius: 8,
    borderBottomRightRadius: 8,
  },
  leftAction: {
    backgroundColor: '#F44336',
    justifyContent: 'center',
    alignItems: 'flex-start',
    flex: 1,
    paddingLeft: 20,
    borderTopLeftRadius: 8,
    borderBottomLeftRadius: 8,
  },
  actionText: {
    color: '#fff',
    fontWeight: '600',
    fontSize: 16,
  },
});
