// import React, {useEffect, useState} from 'react';
// import {
//   Image,
//   Text,
//   View,
//   StyleSheet,
//   TouchableOpacity,
//   Alert,
//   ActivityIndicator,
//   FlatList,
//   SafeAreaView,
// } from 'react-native';
// import {useDispatch, useSelector} from 'react-redux';
// import MaterialCommunityIcons from 'react-native-vector-icons/MaterialCommunityIcons';
// import Logo from '../assets/Images/logoGreen.svg';
// import {scale, verticalScale} from 'react-native-size-matters';
// import {Color} from '../assets/styles/Colors';
// import FontAwesome5 from 'react-native-vector-icons/FontAwesome5';
// import MaterialIcons from 'react-native-vector-icons/MaterialIcons';
// import Octicons from 'react-native-vector-icons/Octicons';
// import Ionicons from 'react-native-vector-icons/Ionicons';
// import {loginData} from '../redux/user';
// import {setImage} from '../redux/client';
// import {GetMeasurementData} from '../Apis/ClientApis/MeasurementApi';
// import {
//   GetPhysicalActivities,
//   GetPhysicalActivityDetails,
//   GetQuickAccess,
// } from '../Apis/ClientApis/PhysicalActivityApi';
// import {
//   GetFoodAvoidApiData,
//   GetGoalsApiData,
//   GetRecommendationApiData,
// } from '../Apis/ClientApis/RecommendationApi';
// import {GetUserApi} from '../Apis/ClientApis/ProfileApi';
// import IconStyle, {IconBg, IconPadding} from '../assets/styles/Icon';
// import {Font} from '../assets/styles/Fonts';

// const ClientDrawerContent = props => {
//   const {navigation} = props;
//   const dispatch = useDispatch();

//   const [asyncLoading, setAsyncLoading] = useState(false);
//   const [loading, setLoading] = useState(false);
//   const [userData, setUserData] = useState([]);
//   const [tempSelectedTab, setTempSelectedTab] = useState('');

//   const userInfo = useSelector(state => state.user?.userInfo);
//   const user = userInfo?.user || userInfo?.userData;
//   const userName = userInfo?.user?.fullName || userInfo?.userData?.fullName;
//   const userImage = userInfo?.user?.image || userInfo?.userData?.image;

//   const token = userInfo?.token;
//   const id = userInfo?.user?._id || userInfo?.userData?._id;
//   const practitionerName = userData?.fullName;
//   const practitionerImage = userData?.image
//     ? {uri: userData?.image}
//     : userData?.gender === 'Female'
//     ? require('../assets/Images/woman.png')
//     : require('../assets/Images/man.png');

//   const GetUserApiData = async () => {
//     try {
//       setLoading(true);
//       const response = await GetUserApi(token);
//       setUserData(response?.data);

//       setLoading(false);
//     } catch (error) {
//       setLoading(false);
//     }
//   };

//   useEffect(() => {
//     GetUserApiData();
//   }, []);

//   const handleSignOut = async () => {
//     props.navigation.closeDrawer();
//     Alert.alert('Sign Out', 'Are you sure you want to sign out?', [
//       {
//         text: 'Cancel',
//         style: 'cancel',
//       },
//       {
//         text: 'Sign Out',
//         style: 'destructive',
//         onPress: async () => {
//           const success = await dispatch(loginData());
//           dispatch(setImage(''));

//           if (success) {
//             navigation.reset({
//               index: 0,
//               routes: [{name: 'loginChoice'}],
//             });
//           } else {
//             Alert.alert('Error', 'Failed to sign out. Please try again.', [
//               {text: 'OK'},
//             ]);
//           }
//         },
//       },
//     ]);
//   };

//   const handleSyncInfo = async () => {
//     setAsyncLoading(true);

//     try {
//       await GetMeasurementData(token, id),
//         await GetPhysicalActivityDetails(token, id);
//       await GetPhysicalActivities();
//       await GetQuickAccess(token, id);
//       await GetRecommendationApiData(token, id);
//       await GetFoodAvoidApiData(token, id);
//       await GetGoalsApiData(token, id);
//       setAsyncLoading(false);
//     } catch (error) {
//       console.error('Sync Error:', error);
//       setAsyncLoading(false);
//     }

//     setAsyncLoading(false);
//   };

//   const mainMenuItems = [
//     {
//       id: 'foodDiary',
//       title: 'Food diary',
//       icon: (
//         <Octicons
//           name="note"
//           size={IconStyle.drawerIconSize}
//           color={IconStyle.drawerIconColor}
//         />
//       ),
//       onPress: () => {
//         props.navigation.closeDrawer();
//         navigation.navigate('foodDiary');
//       },
//     },
//     {
//       id: 'waterIntake',
//       title: 'Water intake',
//       icon: (
//         <Ionicons
//           name="water-sharp"
//           size={IconStyle.drawerIconSize}
//           color={IconStyle.drawerIconColor}
//         />
//       ),
//       onPress: () => {
//         props.navigation.closeDrawer();
//         navigation.navigate('waterIntake');
//       },
//     },
//     {
//       id: 'physicalActivity',
//       title: 'Physical activity',
//       icon: (
//         <FontAwesome5
//           name="running"
//           size={IconStyle.drawerIconSize}
//           color={IconStyle.drawerIconColor}
//         />
//       ),
//       onPress: () => {
//         props.navigation.closeDrawer();
//         navigation.navigate('physicalActivity');
//       },
//     },
//     {
//       id: 'measurements',
//       title: 'Measurements',
//       icon: (
//         <MaterialCommunityIcons
//           name="calendar-text"
//           size={IconStyle.drawerIconSize}
//           color={IconStyle.drawerIconColor}
//         />
//       ),
//       onPress: () => {
//         props.navigation.closeDrawer();
//         navigation.navigate('measurements');
//       },
//     },
//     {
//       id: 'shoppingLists',
//       title: 'Shopping lists',
//       icon: (
//         <MaterialIcons
//           name="shopping-cart"
//           size={IconStyle.drawerIconSize}
//           color={IconStyle.drawerIconColor}
//         />
//       ),
//       onPress: () => {
//         props.navigation.closeDrawer();
//         navigation.navigate('shoppingLists');
//       },
//     },
//   ];

//   const practitionerItems = [
//     {
//       id: 'practitioner',
//       title: practitionerName,
//       useAvatar: true,
//       onPress: () => {
//         props.navigation.closeDrawer();
//         navigation.navigate('practitioner', {data: userData});
//       },
//     },
//     {
//       id: 'messages',
//       title: 'Messages',
//       icon: (
//         <MaterialCommunityIcons
//           name="email"
//           size={IconStyle.drawerIconSize}
//           color={IconStyle.drawerIconColor}
//         />
//       ),
//       onPress: () => {
//         props.navigation.closeDrawer();
//         navigation.navigate('messages', {data: user});
//       },
//     },
//   ];

//   const otherItems = [
//     {
//       id: 'syncInfo',
//       title: 'Sync all info',
//       icon: (
//         <Octicons
//           name="sync"
//           size={IconStyle.drawerIconSize}
//           color={IconStyle.drawerIconColor}
//         />
//       ),
//       onPress: handleSyncInfo,
//       loading: asyncLoading,
//     },
//     {
//       id: 'signOut',
//       title: 'Sign out',
//       icon: (
//         <MaterialIcons
//           name="logout"
//           color={IconStyle.drawerIconColor}
//           size={IconStyle.drawerIconSize}
//         />
//       ),
//       onPress: handleSignOut,
//     },
//   ];

//   const sections = [
//     {title: null, data: mainMenuItems},
//     {title: 'Practitioner', data: practitionerItems},
//     {title: 'Other', data: otherItems},
//   ];

//   // const renderMenuItem = ({item}) => {
//   //   return (
//   //     <TouchableOpacity style={styles.drawerItem} onPress={item?.onPress}>
//   //       {item?.useAvatar ? (
//   //         <Image source={practitionerImage} style={styles.avatar} />
//   //       ) : (
//   //         <View style={IconBg}>{item?.icon}</View>
//   //       )}
//   //       <Text style={styles.drawerItemText}>{item?.title}</Text>
//   //       {item?.loading && (
//   //         <View style={{position: 'absolute', right: 0}}>
//   //           <ActivityIndicator color={Color.primaryColor} />
//   //         </View>
//   //       )}
//   //     </TouchableOpacity>
//   //   );
//   // };

//   const renderSectionHeader = title => {
//     if (!title) return null;

//     return (
//       <View style={styles.sectionHeader}>
//         <Text style={styles.sectionTitle}>{title}</Text>
//       </View>
//     );
//   };

//   const menuItems = [
//     {
//       id: 'profile',
//       icon: 'person-outline',
//       label: userName,
//       type: 'profile',
//       route: 'mainProfile',
//     },
//     {
//       id: 'food',
//       icon: 'document-text-outline',
//       label: 'Food diary',
//       type: 'menu',
//       route: 'foodDiary',
//     },
//     {
//       id: 'water',
//       icon: 'water-outline',
//       label: 'Water intake',
//       type: 'menu',
//       route: 'waterIntake',
//     },
//     {
//       id: 'activity',
//       icon: 'walk-outline',
//       label: 'Physical activity',
//       type: 'menu',
//       route: 'physicalActivity',
//     },
//     {
//       id: 'measurements',
//       icon: 'clipboard-outline',
//       label: 'Measurements',
//       type: 'menu',
//       route: 'measurements',
//     },
//     {
//       id: 'shopping',
//       icon: 'cart-outline',
//       label: 'Shopping lists',
//       type: 'menu',
//       route: 'shoppingLists',
//     },
//     {
//       id: 'practitioner-header',
//       label: 'Practitioner',
//       type: 'header',
//     },
//     {
//       id: 'practitioner',
//       icon: 'medical-outline',
//       label: userData?.fullName,
//       type: 'profile',
//       route: 'practitioner',
//     },
//     {
//       id: 'messages',
//       icon: 'mail-outline',
//       label: 'Messages',
//       type: 'menu',
//       onPress: () => navigation.navigate('messages', {data: userData}),
//     },
//     {
//       id: 'other-header',
//       label: 'Other',
//       type: 'header',
//     },
//     {
//       id: 'sync',
//       icon: 'sync-outline',
//       label: 'Sync all info',
//       type: 'menu',
//       onPress: () => handleSyncInfo(),
//     },
//     {
//       id: 'signout',
//       icon: 'log-out-outline',
//       label: 'Sign out',
//       type: 'menu',
//       onPress: () => handleSignOut(),
//     },
//   ];

//   const renderMenuItem = item => {
//     if (item.type === 'header') {
//       return (
//         <View key={item?.id} style={styles.headerContainer}>
//           <Text style={styles.headerText}>{item?.label}</Text>
//         </View>
//       );
//     }

//     if (item?.type === 'profile') {
//       if (item?.id === 'profile') {
//         let profileImgSource;
//         if (updateProfileImage && typeof updateProfileImage === 'string') {
//           profileImgSource = {uri: updateProfileImage};
//         } else if (profileImage && typeof profileImage === 'string') {
//           profileImgSource = {uri: profileImage};
//         } else {
//           profileImgSource =
//             profileData?.gender === 'Female'
//               ? require('../assets/Images/woman.png')
//               : require('../assets/Images/man.png');
//         }
//         return (
//           <View key={item?.id} style={styles.profileTopContainer}>
//             <TouchableOpacity
//               style={styles.profileInfo}
//               onPress={() =>
//                 navigation.navigate(item?.route, {data: profileData})
//               }>
//               <Image source={profileImgSource} style={styles.profileImage} />
//               <Text style={styles.profileName}>{item?.label}</Text>
//             </TouchableOpacity>
//             <TouchableOpacity
//               style={styles.settingsButton}
//               onPress={() => navigation.navigate('settings')}>
//               <Ionicons name="settings-outline" size={22} color="#666" />
//             </TouchableOpacity>
//           </View>
//         );
//       } else {
//         return (
//           <TouchableOpacity
//             key={item?.id}
//             style={styles.profileContainer}
//             onPress={() => navigation.navigate(item?.route, {data: userData})}>
//             <Image source={userImage} style={styles.profileImage} />
//             <Text style={styles.profileName}>{item?.label}</Text>
//           </TouchableOpacity>
//         );
//       }
//     } else if (item?.id === 'sync') {
//       return (
//         <View key={item?.id}>
//           <TouchableOpacity
//             onPress={() => item?.onPress()}
//             style={{
//               flexDirection: 'row',
//               justifyContent: 'space-between',
//               alignItems: 'center',
//               paddingVertical: verticalScale(8),
//             }}>
//             <View style={{flexDirection: 'row', alignItems: 'center'}}>
//               <Ionicons name={item?.icon} size={22} color="#666" />
//               <Text style={styles.menuText}>{item?.label}</Text>
//             </View>

//             {asyncLoading && (
//               <View style={{alignSelf: 'flex-end'}}>
//                 <ActivityIndicator />
//               </View>
//             )}
//           </TouchableOpacity>
//         </View>
//       );
//     }

//     return (
//       <TouchableOpacity
//         key={item?.id}
//         style={styles.menuItem}
//         onPress={() =>
//           item?.onPress ? item?.onPress() : navigation.navigate(item?.route)
//         }>
//         <View style={styles.iconContainer}>
//           <Ionicons name={item?.icon} size={22} color="#666" />
//         </View>
//         <Text style={styles.menuText}>{item?.label}</Text>
//       </TouchableOpacity>
//     );
//   };

//   return (
//     // <View style={styles.drawerContainer}>
//     //   <View style={styles.logoContainer}>
//     //     <Logo />
//     //     <TouchableOpacity onPress={() => props.navigation.closeDrawer()}>
//     //       <Ionicons
//     //         style={IconPadding}
//     //         name="close"
//     //         size={26}
//     //         color={Color.black}
//     //       />
//     //     </TouchableOpacity>
//     //   </View>

//     //   <View style={styles.drawerHeader}>
//     //     <TouchableOpacity
//     //       style={{flexDirection: 'row', alignItems: 'center'}}
//     //       onPress={() => {
//     //         props.navigation.closeDrawer();
//     //         navigation.navigate('mainProfile', {data: user});
//     //       }}>
//     //       <Image source={{uri: userImage}} style={styles.avatar} />
//     //       <Text style={styles.userName}>{userName}</Text>
//     //     </TouchableOpacity>

//     //     <TouchableOpacity
//     //       onPress={() => {
//     //         props.navigation.closeDrawer();
//     //         navigation.navigate('settings');
//     //       }}>
//     //       <Ionicons
//     //         style={IconPadding}
//     //         name="settings-sharp"
//     //         size={26}
//     //         color={Color.black}
//     //       />
//     //     </TouchableOpacity>
//     //   </View>

//     //   <FlatList
//     //     data={sections}
//     //     keyExtractor={(section, index) => `section-${index}`}
//     //     renderItem={({item: section}) => (
//     //       <>
//     //         {renderSectionHeader(section.title)}
//     //         <FlatList
//     //           data={section?.data}
//     //           keyExtractor={item => item?.id}
//     //           renderItem={renderMenuItem}
//     //           scrollEnabled={false}
//     //         />
//     //       </>
//     //     )}
//     //     scrollEnabled={true}
//     //     showsVerticalScrollIndicator={false}
//     //   />
//     // </View>

//     <SafeAreaView style={styles.container}>
//       <View>
//         {loading ? (
//           <View
//             style={{
//               // flex: 1,
//               justifyContent: 'center',
//               alignItems: 'center',
//             }}>
//             <ActivityIndicator size="large" color={Color.primaryColor} />
//           </View>
//         ) : (
//           <View style={styles.scrollView}>
//             {menuItems.map(item => renderMenuItem(item))}
//           </View>
//         )}
//       </View>
//     </SafeAreaView>
//   );
// };

// const styles = StyleSheet.create({
//   drawerContainer: {
//     flex: 1,
//     backgroundColor: Color.white,
//     paddingVertical: verticalScale(15),
//     paddingHorizontal: scale(16),
//   },
//   logoContainer: {
//     flexDirection: 'row',
//     justifyContent: 'space-between',
//     alignItems: 'center',
//   },
//   drawerHeader: {
//     flexDirection: 'row',
//     alignItems: 'center',
//     justifyContent: 'space-between',
//     paddingTop: verticalScale(20),
//     paddingBottom: verticalScale(10),
//   },
//   avatar: {
//     width: scale(37),
//     height: scale(37),
//     borderRadius: scale(20),
//   },
//   userName: {
//     fontSize: scale(14),
//     fontWeight: '500',
//     color: Color.textColor,
//     fontFamily: Font.Poppins,
//     marginLeft: scale(8),
//   },
//   settingsButton: {
//     padding: scale(5),
//   },
//   drawerItem: {
//     flexDirection: 'row',
//     alignItems: 'center',
//     paddingVertical: verticalScale(7),
//     paddingHorizontal: scale(10),
//   },
//   drawerItemText: {
//     marginLeft: 15,
//     fontSize: scale(14),
//     color: Color.textColor,
//     fontWeight: '500',
//     fontFamily: Font.Poppins,
//   },
//   sectionHeader: {
//     paddingTop: verticalScale(14),
//     paddingBottom: verticalScale(5),
//   },
//   sectionTitle: {
//     fontSize: scale(16),
//     fontWeight: '500',
//     color: Color.textColor,
//     fontFamily: Font.Poppins,
//   },
// });

// export default ClientDrawerContent;

import {StyleSheet, Text, View} from 'react-native';
import React from 'react';

const ClientDrawer = () => {
  return (
    <View>
      <Text>ClientDrawer</Text>
    </View>
  );
};

export default ClientDrawer;

const styles = StyleSheet.create({});
