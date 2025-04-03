// import React, { useCallback, useEffect, useState } from 'react';
// import {
//   View,
//   Text,
//   ScrollView,
//   TouchableOpacity,
//   StyleSheet,
//   ActivityIndicator,
//   SafeAreaView,
//   Modal,
//   Pressable,
//   RefreshControl,
// } from 'react-native';
// import { scale, verticalScale } from 'react-native-size-matters';
// import { useFocusEffect, useNavigation } from '@react-navigation/native';
// import Color from '../../../assets/colors/Colors';
// import Header from '../../../Components/Header';
// import { GetAppointmentByClientId } from '../../../Apis/ClientApis/ClientAppointmentApi';
// import { useSelector } from 'react-redux';
// import AppointmentCard from '../../../Components/AppointmentCard';
// import MealsLikeInHome from '../../../Components/MealsLikeInHome';
// import MoreForYou from '../../../Components/MoreForYou';
// import HydratedStay from '../../../Components/HydratedStay';
// import AntDesign from 'react-native-vector-icons/AntDesign';
// import PhysicalActivity from '../../../Components/PhysicalActivity';
// import OnOffFunctionality from '../../../Components/OnOffFunctionality';
// import { GetUserApi } from '../../../Apis/ClientApis/ProfileApi';
// import { connectSocket, joinRoom } from '../../../Components/SocketService';
// import Shadow from 'react-native-shadow-2'

// const HomeScreen = () => {
// const navigation = useNavigation();
// const [loading, setLoading] = useState(false);
// const [userData, setUserData] = useState(null);
// const [modalVisible, setModalVisible] = useState(false);
// const [receivedMessage, setReceivedMessage] = useState(null);

// const [activeAppointments, setActiveAppointments] = useState([]);
// const [selectedAppointment, setSelectedAppointment] = useState(null);

// const isGuest = useSelector(state => state.user?.guestMode);

// const tokenId = useSelector(state => state?.user?.token);
// const token = tokenId?.token;
// const id = tokenId?.id;

// const [refreshing, setRefreshing] = useState(false);

// const GetUserApiData = async () => {
//   try {
//     const response = await GetUserApi(token);
//     setUserData(response?.data);
//   } catch (error) {
//     console.error('Error fetching user data', error);
//   }
// };

// const FetchAppointmentData = async () => {
//   try {
//     setLoading(true);
//     const response = await GetAppointmentByClientId(token, id);

//     if (response && response.length > 0) {
//       const active = response
//         ?.filter(app => app?.status !== 'canceled')
//         ?.sort((a, b) => new Date(a?.start) - new Date(b?.start));

//       setActiveAppointments(active);

//       if (active.length > 0) {
//         setSelectedAppointment(active[0]);
//       }
//     } else {
//       setActiveAppointments([]);
//       setSelectedAppointment(null);
//     }

//     setLoading(false);
//   } catch (error) {
//     console.error('Error fetching appointments:', error);

//     setActiveAppointments([]);
//     setSelectedAppointment(null);
//     setLoading(false);
//   }
// };

// useEffect(() => {
//   if (isGuest) {
//     return;
//   } else {
//     FetchAppointmentData();
//   }
// }, [token, id]);

// const onRefresh = useCallback(() => {
//   setRefreshing(true);
//   GetUserApiData();
//   FetchAppointmentData()
//     .then(() => {
//       setRefreshing(false);
//     })
//     .catch(() => {
//       setRefreshing(false);
//     });
// }, []);

// useFocusEffect(
//   useCallback(() => {
//     const fetchSocket = async () => {
//       await connectSocket();
//     };
//     fetchSocket();
//   }, []),
// );

// useEffect(() => {
//   if (!userData?._id) {
//     console.warn('⚠️ UserData not available, exiting effect');
//     return;
//   }

//   console.log('🔗 Connecting to Socket...');
//   const socket = connectSocket();
//   joinRoom(id, userData?._id);

//   const handleMessage = message => {
//     console.log('📩 Received Message:', message);
//     setReceivedMessage(message?.message);
//     setModalVisible(true);

//     setTimeout(() => {
//       setModalVisible(false);
//     }, 2000);
//   };

//   socket.on('receiveMessage', handleMessage);
//   console.log('🛠️ Listener for receiveMessage set');

//   return () => {
//     console.log('🔄 Cleaning up listener...');
//     socket.off('receiveMessage', handleMessage);
//   };
// }, [userData, id]);

//   return (
//     <SafeAreaView style={{ flex: 1, backgroundColor: Color.white, }}>
//       <Header showIcon={true} logo={true} />
//       {isGuest ? (
//         <ScrollView style={{ backgroundColor: Color.white, paddingHorizontal: scale(8) }}>
//           <View style={[styles.mealContainer]} >
//             <MealsLikeInHome />
//             {/* <Text style={styles.title}>More for you</Text> */}
//           </View>
//           <MoreForYou />
//           <HydratedStay />
//         </ScrollView>
//       ) : (
//         <View>
//           {loading ? (
//             <View
//               style={{
//                 justifyContent: 'center',
//                 alignItems: 'center',
//                 marginTop: verticalScale(20),
//               }}>
//               <ActivityIndicator size="large" color={Color.primaryColor} />
//             </View>
//           ) : (
// <ScrollView
//   refreshControl={
//     <RefreshControl refreshing={refreshing} onRefresh={onRefresh} />
//   }
// style={{ backgroundColor: Color.white, paddingHorizontal: scale(5) }}
// showsVerticalScrollIndicator={false}>
//   <AppointmentCard
//     refreshAppointments={FetchAppointmentData}
//     activeAppointments={activeAppointments}
//     setActiveAppointments={setActiveAppointments}
//     selectedAppointment={selectedAppointment}
//     setSelectedAppointment={setSelectedAppointment}
//   />

//   <View style={[styles.mealContainer]} >
//     {/* <Text style={styles.title}>What were your meals like?</Text> */}
//     <MealsLikeInHome />

//   </View>


//   <MoreForYou />
//   <OnOffFunctionality />

//   <HydratedStay />


//   <OnOffFunctionality />

//   <PhysicalActivity />

// </ScrollView>
//           )}
//         </View>
//       )}

//       <Modal
//         transparent={true}
//         visible={modalVisible}
//         animationType="fade"
//         onRequestClose={() => setModalVisible(false)}>
//         <Pressable
//           style={styles.modalOverlay}
//           onPress={() => navigation.navigate('messages', { data: userData })}>
//           <View style={styles.centeredView}>
//             <View style={styles.modalView}>
//               <View style={styles.leftBorder} />
//               <View style={styles.contentContainer}>
//                 <Text style={styles.subtitleText}>{userData?.fullName}</Text>
//                 <Text style={styles.messageText}>{receivedMessage}</Text>
//               </View>
//             </View>
//           </View>
//         </Pressable>
//       </Modal>
//     </SafeAreaView>
//   );
// };

// export default HomeScreen;

// const styles = StyleSheet.create({
//   title: {
//     fontSize: verticalScale(14),
//     fontWeight: '500',
//     color: Color.black,
//     // marginHorizontal: scale(16),
//     // marginVertical: verticalScale(10),
//     // marginTop: verticalScale(20),
//   },

//   logText: {
//     fontSize: verticalScale(12),
//     color: Color.txt,
//     fontWeight: '500',
//     marginRight: scale(10),
//   },
//   modalOverlay: {
//     flex: 1,
//     backgroundColor: 'rgba(0, 0, 0, 0.5)',
//     alignItems: 'center',
//   },
//   centeredView: {
//     justifyContent: 'center',
//     alignItems: 'center',
//     marginTop: verticalScale(15),
//     marginHorizontal: scale(16),
//   },
//   modalView: {
//     flexDirection: 'row',
//     backgroundColor: Color.white,
//     borderRadius: scale(15),
//     shadowColor: Color.black,
//     shadowOffset: {
//       width: 0,
//       height: 2,
//     },
//     shadowOpacity: 0.25,
//     shadowRadius: 4,
//     elevation: 5,
//     overflow: 'hidden',
//   },
//   leftBorder: {
//     width: scale(6),
//     backgroundColor: Color.primaryGreen,
//   },
//   contentContainer: {
//     padding: scale(10),
//     flex: 1,
//   },
//   messageText: {
//     fontSize: scale(15),
//     fontWeight: '600',
//     color: Color.black,
//     marginBottom: 4,
//   },
//   subtitleText: {
//     fontSize: 14,
//     color: '#8E8E93',
//     marginRight: 5,
//   },
//   // waterText: {
//   //   marginLeft: scale(15),
//   //   fontSize: verticalScale(12),
//   //   color: Color.txt,
//   //   fontWeight: '500',
//   //   marginRight: scale(10),
//   //   marginVertical: verticalScale(10),
//   // },
//   // waterView: {
//   //   backgroundColor: '#d3e5ff',
//   //   flexDirection: 'row',
//   //   alignItems: 'center',
//   //   marginTop: verticalScale(-1),
//   // },
//   mealContainer: {
//     padding: scale(10),
//     marginTop: verticalScale(10),
//     alignSelf: 'center',
//     width: '95%',
//     backgroundColor: Color?.white,
//     borderRadius: scale(10),
//     // borderWidth: scale(0.5),
//     // borderColor: Color?.primaryColor,
//     elevation: 7,
//     shadowColor: Color?.primaryColor,
//     shadowOpacity: 0.8,
//     shadowRadius: 8,
//     shadowOffset: {
//       width: 5,
//       height: 5,
//     },

//   }
// });



import React, { useCallback, useEffect, useState } from 'react';
import { View, Text, StyleSheet, SafeAreaView, ScrollView, RefreshControl, ActivityIndicator } from 'react-native';
import { Shadow } from 'react-native-shadow-2';
import Color from '../../../assets/colors/Colors';
import PhysicalActivity from '../../../Components/PhysicalActivity';
import { scale, verticalScale } from 'react-native-size-matters';
import Header from '../../../Components/Header';
import AppointmentCard from '../../../Components/AppointmentCard';
import MealsLikeInHome from '../../../Components/MealsLikeInHome';
import MoreForYou from '../../../Components/MoreForYou';
import { useFocusEffect, useNavigation } from '@react-navigation/native';
import { useSelector } from 'react-redux';
import { GetUserApi } from '../../../Apis/ClientApis/ProfileApi';
import { GetAppointmentByClientId } from '../../../Apis/ClientApis/ClientAppointmentApi';
import { connectSocket, joinRoom } from '../../../Components/SocketService';
import OnOffFunctionality from '../../../Components/OnOffFunctionality';
import HydratedStay from '../../../Components/HydratedStay';

const HomeScreen = () => {

  const navigation = useNavigation();
  const [loading, setLoading] = useState(false);
  const [userData, setUserData] = useState(null);
  const [modalVisible, setModalVisible] = useState(false);
  const [receivedMessage, setReceivedMessage] = useState(null);

  const [activeAppointments, setActiveAppointments] = useState([]);
  const [selectedAppointment, setSelectedAppointment] = useState(null);

  const isGuest = useSelector(state => state.user?.guestMode);

  const tokenId = useSelector(state => state?.user?.token);
  const token = tokenId?.token;
  const id = tokenId?.id;

  const [refreshing, setRefreshing] = useState(false);

  const GetUserApiData = async () => {
    try {
      const response = await GetUserApi(token);
      setUserData(response?.data);
    } catch (error) {
      console.error('Error fetching user data', error);
    }
  };

  const FetchAppointmentData = async () => {
    try {
      setLoading(true);
      const response = await GetAppointmentByClientId(token, id);

      if (response && response.length > 0) {
        const active = response
          ?.filter(app => app?.status !== 'canceled')
          ?.sort((a, b) => new Date(a?.start) - new Date(b?.start));

        setActiveAppointments(active);

        if (active.length > 0) {
          setSelectedAppointment(active[0]);
        }
      } else {
        setActiveAppointments([]);
        setSelectedAppointment(null);
      }

      setLoading(false);
    } catch (error) {
      console.error('Error fetching appointments:', error);

      setActiveAppointments([]);
      setSelectedAppointment(null);
      setLoading(false);
    }
  };

  useEffect(() => {
    if (isGuest) {
      return;
    } else {
      FetchAppointmentData();
    }
  }, [token, id]);

  const onRefresh = useCallback(() => {
    setRefreshing(true);
    GetUserApiData();
    FetchAppointmentData()
      .then(() => {
        setRefreshing(false);
      })
      .catch(() => {
        setRefreshing(false);
      });
  }, []);

  useFocusEffect(
    useCallback(() => {
      const fetchSocket = async () => {
        await connectSocket();
      };
      fetchSocket();
    }, []),
  );

  useEffect(() => {
    if (!userData?._id) {
      console.warn('⚠️ UserData not available, exiting effect');
      return;
    }

    console.log('🔗 Connecting to Socket...');
    const socket = connectSocket();
    joinRoom(id, userData?._id);

    const handleMessage = message => {
      console.log('📩 Received Message:', message);
      setReceivedMessage(message?.message);
      setModalVisible(true);

      setTimeout(() => {
        setModalVisible(false);
      }, 2000);
    };

    socket.on('receiveMessage', handleMessage);
    console.log('🛠️ Listener for receiveMessage set');

    return () => {
      console.log('🔄 Cleaning up listener...');
      socket.off('receiveMessage', handleMessage);
    };
  }, [userData, id]);


  return (
    <SafeAreaView style={{ flex: 1, backgroundColor: Color.white }}>
      <Header logoHeader={true} />

      {isGuest ? (
        <ScrollView style={{ backgroundColor: Color.white, paddingHorizontal: scale(8) }}>
          <View style={{ paddingHorizontal: scale(10) }} >
            <View style={{ marginVertical: scale(10) }} >

              <Shadow distance={6} startColor={Color?.shadowColor} style={{ width: "100%" }} >
                <View style={{
                  borderRadius: scale(10),
                  // padding: scale(10),
                  backgroundColor: Color?.white,
                }}>
                  <MealsLikeInHome />
                </View>
              </Shadow>
            </View>

            <MoreForYou />
            <View style={{ marginVertical: scale(10) }} >
              <Shadow distance={6} startColor={Color?.shadowColor} style={{ width: "100%" }} >
                <View style={{
                  borderRadius: scale(10),
                  // padding: scale(10),
                  backgroundColor: Color?.white,
                }}>
                  <HydratedStay />
                </View>
              </Shadow>
            </View>
          </View>
        </ScrollView>
      ) : (
        <View>
          {loading ? (
            <View
              style={{
                justifyContent: 'center',
                alignItems: 'center',
                marginTop: verticalScale(20),
              }}>
              <ActivityIndicator size="large" color={Color.primaryColor} />
            </View>
          ) : (
            <ScrollView
              refreshControl={
                <RefreshControl refreshing={refreshing} onRefresh={onRefresh} />

              }
              style={{ backgroundColor: Color.white, paddingHorizontal: scale(5), marginTop: verticalScale(10)}}
              showsVerticalScrollIndicator={false}>
               <AppointmentCard
                refreshAppointments={FetchAppointmentData}
                activeAppointments={activeAppointments}
                setActiveAppointments={setActiveAppointments}
                selectedAppointment={selectedAppointment}
                setSelectedAppointment={setSelectedAppointment}
              /> 
              <View style={{ paddingHorizontal: scale(10),marginTop:scale(15) }} >
                <View style={{ }} >

                  <Shadow distance={6} startColor={Color?.shadowColor} style={{ width: "100%" }} >
                    <View style={{
                      borderRadius: scale(10),
                      // padding: scale(10),
                      backgroundColor: Color?.white,
                    }}>
                      <MealsLikeInHome />
                    </View>
                  </Shadow>
                </View>


                <MoreForYou />
                <OnOffFunctionality />

                <View style={{ marginVertical: scale(10) }} >
                  <Shadow distance={6} startColor={Color?.shadowColor} style={{ width: "100%" }} >
                    <View style={{
                      borderRadius: scale(10),
                      // padding: scale(10),
                      backgroundColor: Color?.white,
                    }}>
                      <HydratedStay />
                    </View>
                  </Shadow>
                </View>


                <OnOffFunctionality />

                <View style={{ marginVertical: scale(10),marginBottom:scale(100) }} >
                  <Shadow distance={6} startColor={Color?.shadowColor} style={{ width: "100%" }} >
                    <View style={{
                      borderRadius: scale(10),
                      // padding: scale(10),
                      backgroundColor: Color?.white,
                    }}>
                      <PhysicalActivity />
                    </View>
                  </Shadow>
                </View>
              </View>
            </ScrollView>
          )}
        </View>
      )}
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: '#f8f8f8',
  },
  box: {
    width: 150,
    height: 100,
    backgroundColor: 'white',
    justifyContent: 'center',
    alignItems: 'center',
    borderRadius: 10,
  },
  text: {
    fontSize: 16,
    fontWeight: 'bold',
  },
});

export default HomeScreen;