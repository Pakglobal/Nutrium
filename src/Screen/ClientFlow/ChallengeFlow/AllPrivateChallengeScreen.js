// import React from 'react';
// import {
//   StyleSheet,
//   View,
//   Dimensions,
//   FlatList,
//   Image,
//   Text,
//   TouchableOpacity,
// } from 'react-native';
// import {Color} from '../../../assets/styles/Colors';
// import {Font} from '../../../assets/styles/Fonts';
// import {moderateScale, scale, verticalScale} from 'react-native-size-matters';
// import LinearGradient from 'react-native-linear-gradient';
// import Header from '../../../Components/Header';

// const {width} = Dimensions.get('window');
// const CARD_WIDTH = width * 0.95;
// const SPACING = (width - CARD_WIDTH) / 2;

// const AllPrivateChallengeScreen = ({route}) => {
//   const {challenges = [], onJoin} = route.params || {};

//   return (
//     <View style={styles.container}>
//       <Header screenName={'Private Challenges'} screenheader={true} />
//       <FlatList
//         showsVerticalScrollIndicator={false}
//         data={challenges}
//         keyExtractor={(item, index) => `${item?.id || index}`}
//         renderItem={({item}) => (
//           <LinearGradient
//             colors={[Color.primaryColor, Color.primaryLight]}
//             start={{x: 0, y: 0}}
//             end={{x: 1, y: 1}}
//             style={styles.card}>
//             <View style={styles.badge}>
//               <Text style={styles.badgeText}>Featured</Text>
//             </View>

//             <Text style={styles.title} numberOfLines={1}>
//               {item?.name || 'Unnamed Challenge'}
//             </Text>
//             <Text style={styles.description} numberOfLines={1}>
//               Complete {item?.targetValue || 'N/A'}{' '}
//               {item?.type?.unitLabel || 'units'} by{' '}
//               {item?.formattedDate || 'N/A'}
//             </Text>

//             <View style={styles.footer}>
//               <View style={styles.avatarGroup}>
//                 {(item?.participants || []).slice(0, 3).map((p, index) => (
//                   <Image
//                     key={index}
//                     source={{
//                       uri:
//                         p.avatar ||
//                         `https://i.pravatar.cc/150?img=${index + 1}`,
//                     }}
//                     style={[styles.avatar, {marginLeft: index !== 0 ? -10 : 0}]}
//                   />
//                 ))}
//                 <Text style={[styles.description, {marginLeft: 8}]}>
//                   {(item?.participants || []).length} joined
//                 </Text>
//               </View>

//               <TouchableOpacity
//                 style={styles.joinButton}
//                 onPress={() => onJoin?.(item)}
//                 activeOpacity={0.7}>
//                 <Text style={styles.joinText}>View now</Text>
//               </TouchableOpacity>
//             </View>
//           </LinearGradient>
//         )}
//       />
//     </View>
//   );
// };

// const styles = StyleSheet.create({
//   container: {
//     flex: 1,
//     backgroundColor: Color.white,
//   },
//   card: {
//     borderRadius: moderateScale(15),
//     padding: scale(15),
//     width: CARD_WIDTH,
//     justifyContent: 'space-between',
//     alignSelf: 'center',
//     marginVertical: scale(5),
//     marginHorizontal: SPACING,
//   },
//   badge: {
//     backgroundColor: 'rgba(255, 255, 255, 0.2)',
//     paddingHorizontal: scale(9),
//     paddingVertical: verticalScale(3),
//     borderRadius: moderateScale(11),
//     alignSelf: 'flex-start',
//     marginBottom: verticalScale(12),
//   },
//   badgeText: {
//     color: Color.white,
//     fontSize: moderateScale(11),
//     fontWeight: '400',
//     fontFamily: Font?.Poppins,
//   },
//   title: {
//     color: Color.white,
//     fontSize: moderateScale(16),
//     fontFamily: Font?.PoppinsSemiBold,
//     marginTop: verticalScale(4),
//   },
//   description: {
//     color: Color.white,
//     fontSize: moderateScale(12),
//     fontFamily: Font?.Poppins,
//   },
//   footer: {
//     marginTop: verticalScale(13),
//     flexDirection: 'row',
//     justifyContent: 'space-between',
//     alignItems: 'center',
//   },
//   avatarGroup: {
//     flexDirection: 'row',
//     alignItems: 'center',
//   },
//   avatar: {
//     width: scale(24),
//     height: scale(24),
//     borderRadius: moderateScale(12),
//     borderWidth: 1,
//     borderColor: '#fff',
//   },
//   joinButton: {
//     borderColor: Color.white,
//     borderWidth: 1,
//     borderRadius: moderateScale(7),
//     paddingVertical: verticalScale(3),
//     paddingHorizontal: scale(11),
//   },
//   joinText: {
//     color: '#fff',
//     fontSize: moderateScale(11),
//     fontFamily: Font?.Poppins,
//     textTransform: 'uppercase',
//   },
// });

// export default AllPrivateChallengeScreen;

import React from 'react';
import {
  StyleSheet,
  View,
  Dimensions,
  FlatList,
  Image,
  Text,
  TouchableOpacity,
} from 'react-native';
import {Color} from '../../../assets/styles/Colors';
import {Font} from '../../../assets/styles/Fonts';
import {moderateScale, scale, verticalScale} from 'react-native-size-matters';
import LinearGradient from 'react-native-linear-gradient';
import Header from '../../../Components/Header';
import CustomShadow from '../../../Components/CustomShadow';
import {shadowStyle} from '../../../assets/styles/Shadow';

const {width} = Dimensions.get('window');
const CARD_WIDTH = width * 0.95;
const SPACING = (width - CARD_WIDTH) / 2;

const AllPrivateChallengeScreen = ({route}) => {
  const {challenges = [], onJoin} = route.params || {};

  return (
    <View style={styles.container}>
      <Header screenName={'Private Challenges'} screenheader={true} />
      <FlatList
        showsVerticalScrollIndicator={false}
        data={challenges}
        keyExtractor={(item, index) => `${item?.id || index}`}
        renderItem={({item}) => (
          <CustomShadow>
            <View
              style={{
                backgroundColor: Color.white,
                margin: scale(8),
                borderRadius: moderateScale(15),
                padding: scale(12),
              }}>
              <View style={styles.badge}>
                <Text style={styles.badgeText}>Featured</Text>
              </View>

              <Text style={styles.title} numberOfLines={1}>
                {item?.name || 'Unnamed Challenge'}
              </Text>
              <Text style={styles.description} numberOfLines={1}>
                Complete {item?.targetValue || 'N/A'}{' '}
                {item?.type?.unitLabel || 'units'} by{' '}
                {item?.formattedDate || 'N/A'}
              </Text>

              <View style={styles.footer}>
                <View style={styles.avatarGroup}>
                  {(item?.participants || []).slice(0, 3).map((p, index) => (
                    <Image
                      key={index}
                      source={{
                        uri:
                          p.avatar ||
                          `https://i.pravatar.cc/150?img=${index + 1}`,
                      }}
                      style={[
                        styles.avatar,
                        {marginLeft: index !== 0 ? -10 : 0},
                      ]}
                    />
                  ))}
                  <Text style={[styles.description, {marginLeft: 8}]}>
                    {(item?.participants || []).length} joined
                  </Text>
                </View>

                <TouchableOpacity
                  style={styles.joinButton}
                  onPress={() => onJoin?.(item)}
                  activeOpacity={0.7}>
                  <Text style={styles.joinText}>View now</Text>
                </TouchableOpacity>
              </View>
            </View>
          </CustomShadow>
        )}
      />
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: Color.white,
  },
  badge: {
    backgroundColor: Color.primaryLight,
    paddingHorizontal: scale(9),
    paddingVertical: verticalScale(3),
    borderRadius: moderateScale(11),
    alignSelf: 'flex-start',
    marginBottom: verticalScale(5),
  },
  badgeText: {
    color: Color.black,
    fontSize: moderateScale(11),
    fontWeight: '400',
    fontFamily: Font?.Poppins,
  },
  title: {
    color: Color.primaryColor,
    fontSize: moderateScale(16),
    fontFamily: Font?.PoppinsSemiBold,
    marginTop: verticalScale(4),
  },
  description: {
    color: Color.gray,
    fontSize: moderateScale(12),
    fontFamily: Font?.Poppins,
  },
  footer: {
    marginTop: verticalScale(8),
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  avatarGroup: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  avatar: {
    width: scale(24),
    height: scale(24),
    borderRadius: moderateScale(12),
    borderWidth: 1,
    borderColor: Color.black,
  },
  joinButton: {
    borderColor: Color.primaryColor,
    borderWidth: 1,
    borderRadius: moderateScale(7),
    paddingVertical: verticalScale(3),
    paddingHorizontal: scale(11),
  },
  joinText: {
    color: Color.primaryColor,
    fontSize: moderateScale(11),
    fontFamily: Font?.Poppins,
    textTransform: 'uppercase',
  },
});

export default AllPrivateChallengeScreen;
