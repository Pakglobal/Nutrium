// import React from 'react';
// import {
//   View,
//   StyleSheet,
//   Dimensions,
//   Animated,
//   Text,
//   FlatList,
//   ScrollView,
//   TouchableOpacity,
// } from 'react-native';
// import {SwiperFlatList} from 'react-native-swiper-flatlist';
// import ChallengeCardBanner from '../../../Components/ChallengeCardBanner';
// import {scale} from 'react-native-size-matters';
// import {Font} from '../../../assets/styles/Fonts';
// import ChallengeCard from './ChallengeCard';
// import FontAwesome5 from 'react-native-vector-icons/FontAwesome5';
// import {Color} from '../../../assets/styles/Colors';
// import {useNavigation} from '@react-navigation/native';

// const {width} = Dimensions.get('window');
// const CARD_WIDTH = width * 0.92;
// const SPACING = (width - CARD_WIDTH) / 2;

// const CustomPagination = ({paginationIndex, data}) => {
//   return (
//     <View style={styles.pagination}>
//       {data.map((_, index) => {
//         const isActive = index === paginationIndex;
//         return (
//           <View
//             key={index}
//             style={[
//               styles.dot,
//               isActive ? styles.activeDot : styles.inactiveDot,
//             ]}
//           />
//         );
//       })}
//     </View>
//   );
// };

// const AllChallenges = ({challenges, onJoin}) => {
//   const cardioChallenges = challenges.filter(
//     (challenge) => challenge.type.unitLabel === "Cardio"
//   );

//   const nutritionChallenges = challenges.filter(
//     (challenge) => challenge.type.unitLabel === "Nutrition"
//   );
  
//   const topChallenges = challenges.slice(0, 4);
//   const remainingChallenges = challenges.slice(4);
//   const navigation = useNavigation();

//   const handleNavigateCardio = () => {
//     navigation.navigate('CardioDetailsScreen', {challenges: cardioChallenges, onJoin: onJoin});
//   };

//   const handleNavigateNutrition = () => {
//     navigation.navigate('NutritionDetailsScreen', {challenges: nutritionChallenges, onJoin, onJoin});
//   };

//   return (
//     <View style={styles.container}>
//       <ScrollView showsVerticalScrollIndicator={false}>
//         <View style={styles.containerText}>
//           <Text style={styles.text}>All Challenges</Text>
//         </View>

//         <SwiperFlatList
//           data={topChallenges}
//           renderItem={({item}) => (
//             <View style={{width: CARD_WIDTH, marginHorizontal: SPACING / 2}}>
//               {/* <ChallengeCardBanner challenge={item} onJoin={onJoin} /> */}
//               <ChallengeCardBanner
//                 challenge={item}
//                 onJoin={onJoin}
//                 btnType="Join"
//               />
//             </View>
//           )}
//           keyExtractor={item => item._id}
//           showPagination
//           PaginationComponent={props => (
//             <CustomPagination {...props} data={topChallenges} />
//           )}
//           snapToAlignment="center"
//         />

//         <View style={styles.categoriesContainer}>
//           <TouchableOpacity
//             style={styles.categoryCard}
//             onPress={handleNavigateCardio}>
//             <View style={styles.iconWrapper}>
//               <FontAwesome5
//                 name="running"
//                 size={20}
//                 color={Color?.primaryColor}
//               />
//             </View>
//             <Text style={styles.categoryTitle}>Cardio</Text>
//             <Text style={styles.categoryCount}>{cardioChallenges.length} challenges</Text>
//           </TouchableOpacity>

//           <TouchableOpacity
//             style={styles.categoryCard}
//             onPress={handleNavigateNutrition}>
//             <View style={styles.iconWrapper}>
//               <Text style={styles.iconText}>🥗</Text>
//             </View>
//             <Text style={styles.categoryTitle}>Nutrition</Text>
//             <Text style={styles.categoryCount}>{nutritionChallenges.length} challenges</Text>
//           </TouchableOpacity>
//         </View>

//         {remainingChallenges.length > 0 && (
//           <>
//             <View
//               style={[
//                 styles.containerText,
//                 {paddingVertical: 20, },
//               ]}>
//               <Text style={styles.text}>Popular Challenges</Text>
//             </View>
//             <FlatList
//             style={{marginBottom: 10}}
//               data={remainingChallenges}
//               keyExtractor={(item, index) =>
//                 item?._id?.toString() || index.toString()
//               }
//               renderItem={({item}) => (
//                 <ChallengeCard challenge={item} onJoin={onJoin} />
//               )}
//             />
//           </>
//         )}
//       </ScrollView>
//     </View>
//   );
// };

// export default AllChallenges;

// const styles = StyleSheet.create({
//   container: {
//     marginTop: 10,
//   },
//   containerText: {
//     backgroundColor: 'white',
//     padding: 12,
//   },
//   text: {
//     fontSize: 18,
//     color: Color?.textColor,
//     fontFamily: Font?.PoppinsMedium,
//   },
//   pagination: {
//     flexDirection: 'row',
//     justifyContent: 'center',
//     marginTop: 12,
//   },
//   dot: {
//     height: 8,
//     borderRadius: 4,
//     marginHorizontal: 4,
//   },
//   activeDot: {
//     width: 20,
//     backgroundColor: '#21972B',
//   },
//   inactiveDot: {
//     width: 8,
//     backgroundColor: '#C4C4C4',
//   },
//   categoriesContainer: {
//     flexDirection: 'row',
//     justifyContent: 'space-between',
//     paddingHorizontal: scale(10),
//     marginTop: 24,
//   },
//   categoryCard: {
//     backgroundColor: '#AEF5B4',
//     borderRadius: 12,
//     paddingVertical: 20,
//     alignItems: 'center',
//     width: scale(148),
//   },
//   iconWrapper: {
//     width: 40,
//     height: 40,
//     borderRadius: 20,
//     backgroundColor: '#CEF9D1',
//     alignItems: 'center',
//     justifyContent: 'center',
//     marginBottom: 8,
//   },
//   iconText: {
//     fontSize: 20,
//   },
//   categoryTitle: {
//     fontSize: 16,
//     fontWeight: '600',
//     color: '#1A3E1A',
//     fontFamily: Font?.Poppins,
//   },
//   categoryCount: {
//     fontSize: 12,
//     color: '#1A3E1A',
//     marginTop: 4,
//     fontFamily: Font?.Poppins,
//   },
// });



// import React, { useRef, useState, useCallback } from 'react';
// import {
//   View,
//   StyleSheet,
//   Dimensions,
//   Text,
//   FlatList,
//   ScrollView,
//   TouchableOpacity,
//   Animated,
// } from 'react-native';
// import { SwiperFlatList } from 'react-native-swiper-flatlist';
// import ChallengeCardBanner from '../../../Components/ChallengeCardBanner';
// import { scale } from 'react-native-size-matters';
// import { Font } from '../../../assets/styles/Fonts';
// import ChallengeCard from './ChallengeCard';
// import FontAwesome5 from 'react-native-vector-icons/FontAwesome5';
// import { Color } from '../../../assets/styles/Colors';
// import { useNavigation } from '@react-navigation/native';

// const { width, height } = Dimensions.get('window');
// const CARD_WIDTH = width; // 90% of screen width for the card
// const CARD_HEIGHT = 150; // Height to match screenshot

// // Only animate FlatList if needed
// const AnimatedFlatList = Animated.createAnimatedComponent(FlatList);

// const CustomPagination = ({ paginationIndex, data }) => {
//   return (
//     <View style={styles.pagination}>
//       {data.map((_, index) => {
//         const isActive = index === paginationIndex;
//         return (
//           <View
//             key={index}
//             style={[
//               styles.dot,
//               isActive ? styles.activeDot : styles.inactiveDot,
//             ]}
//           />
//         );
//       })}
//     </View>
//   );
// };

// const AllChallenges = ({ challenges, onJoin }) => {
//   const swiperRef = useRef(null);
//   const [currentIndex, setCurrentIndex] = useState(0);
//   const navigation = useNavigation();

//   const viewabilityConfigCallbackPairs = useRef([
//     {
//       viewabilityConfig: {
//         itemVisiblePercentThreshold: 50,
//       },
//       onViewableItemsChanged: ({ viewableItems }) => {
//         if (viewableItems.length > 0) {
//           setCurrentIndex(viewableItems[0].index);
//         }
//       },
//     },
//   ]).current;

//   const cardioChallenges = challenges.filter(
//     (challenge) => challenge.type.unitLabel === 'Cardio'
//   );

//   const nutritionChallenges = challenges.filter(
//     (challenge) => challenge.type.unitLabel === 'Nutrition'
//   );

//   const topChallenges = challenges.slice(0, 4);
//   const remainingChallenges = challenges.slice(4);

//   const handleNavigateCardio = () => {
//     navigation.navigate('CardioDetailsScreen', { challenges: cardioChallenges, onJoin });
//   };

//   const handleNavigateNutrition = () => {
//     navigation.navigate('NutritionDetailsScreen', { challenges: nutritionChallenges, onJoin });
//   };

//   const renderItem = useCallback(
//     ({ item }) => {
//       return (
//         <View style={styles.swiperItem}>
//           <ChallengeCardBanner challenge={item} onJoin={onJoin} btnType="Join" />
//         </View>
//       );
//     },
//     [onJoin]
//   );

//   const renderChallengeCard = useCallback(
//     ({ item }) => <ChallengeCard challenge={item} onJoin={onJoin} />,
//     [onJoin]
//   );

//   return (
//     <View style={styles.container}>
//       <ScrollView
//         showsVerticalScrollIndicator={false}
//         removeClippedSubviews={true}
//         contentContainerStyle={styles.scrollContent}
//       >
//         <View style={styles.containerText}>
//           <Text style={styles.text}>All Challenges</Text>
//         </View>

//         <View style={styles.swiperWrapper}>
//           <SwiperFlatList
//             ref={swiperRef}
//             data={topChallenges}
//             renderItem={renderItem}
//             keyExtractor={(item) => item._id}
//             showPagination
//             PaginationComponent={(props) => <CustomPagination {...props} data={topChallenges} />}
//             snapToInterval={width} // Snap to full screen width
//             snapToAlignment="center"
//             decelerationRate="fast"
//             bounces={false}
//             contentContainerStyle={styles.swiperContainer}
//             showsHorizontalScrollIndicator={false}
//             horizontal
//             viewabilityConfigCallbackPairs={viewabilityConfigCallbackPairs}
//             initialNumToRender={1}
//             maxToRenderPerBatch={1} // Render only one card at a time
//             removeClippedSubviews={true}
//             windowSize={1} // Limit the visible window to one card
//           />
//         </View>

//         <View style={styles.categoriesContainer}>
//           <TouchableOpacity
//             style={styles.categoryCard}
//             onPress={handleNavigateCardio}
//             activeOpacity={0.7}
//           >
//             <View style={styles.iconWrapper}>
//               <FontAwesome5 name="running" size={20} color={Color?.primaryColor} />
//             </View>
//             <Text style={styles.categoryTitle}>Cardio</Text>
//             <Text style={styles.categoryCount}>{cardioChallenges.length} challenges</Text>
//           </TouchableOpacity>

//           <TouchableOpacity
//             style={styles.categoryCard}
//             onPress={handleNavigateNutrition}
//             activeOpacity={0.7}
//           >
//             <View style={styles.iconWrapper}>
//               <Text style={styles.iconText}>🥗</Text>
//             </View>
//             <Text style={styles.categoryTitle}>Nutrition</Text>
//             <Text style={styles.categoryCount}>{nutritionChallenges.length} challenges</Text>
//           </TouchableOpacity>
//         </View>

//         {remainingChallenges.length > 0 && (
//           <>
//             <View style={styles.containerText}>
//               <Text style={styles.text}>Popular Challenges</Text>
//             </View>
//             <AnimatedFlatList
//               data={remainingChallenges}
//               keyExtractor={(item) => item?._id?.toString()}
//               renderItem={renderChallengeCard}
//               removeClippedSubviews={true}
//               initialNumToRender={3}
//               maxToRenderPerBatch={3}
//               windowSize={5}
//               showsVerticalScrollIndicator={false}
//               contentContainerStyle={styles.flatListContent}
//             />
//           </>
//         )}
//       </ScrollView>
//     </View>
//   );
// };

// export default AllChallenges;

// const styles = StyleSheet.create({
//   container: {
//     flex: 1,
//     marginTop: 10,
//   },
//   scrollContent: {
//     paddingBottom: 20,
//   },
//   containerText: {
//     backgroundColor: 'white',
//     padding: 12,
//     marginBottom: 8,
//   },
//   text: {
//     fontSize: 18,
//     color: Color?.textColor,
//     fontFamily: Font?.PoppinsMedium,
//   },
//   swiperWrapper: {
//     height: CARD_HEIGHT + 40,
//     justifyContent: 'center',
//     alignItems: 'center',
//   },
//   swiperItem: {
//     width: CARD_WIDTH,
//     height: CARD_HEIGHT,
//     justifyContent: 'center',

//   },
//   swiperContainer: {
//     paddingVertical: 0,
//     alignItems: 'center',
//   },
//   pagination: {
//     flexDirection: 'row',
//     justifyContent: 'center',
//     alignItems: 'center',
//     marginVertical: 10,
//     height: 10,
//   },
//   dot: {
//     height: 8,
//     width: 8,
//     borderRadius: 4,
//     marginHorizontal: 4,
//     backgroundColor: '#C4C4C4',
//   },
//   activeDot: {
//     width: 20,
//     backgroundColor: '#21972B',
//   },
//   inactiveDot: {
//     width: 8,
//     backgroundColor: '#C4C4C4',
//   },
//   categoriesContainer: {
//     flexDirection: 'row',
//     justifyContent: 'space-between',
//     paddingHorizontal: scale(10),
//     marginTop: 16,
//     marginBottom: 16,
//   },
//   categoryCard: {
//     backgroundColor: '#AEF5B4',
//     borderRadius: 12,
//     paddingVertical: 20,
//     alignItems: 'center',
//     width: scale(148),
//   },
//   iconWrapper: {
//     width: 40,
//     height: 40,
//     borderRadius: 20,
//     backgroundColor: '#CEF9D1',
//     alignItems: 'center',
//     justifyContent: 'center',
//     marginBottom: 8,
//   },
//   iconText: {
//     fontSize: 20,
//   },
//   categoryTitle: {
//     fontSize: 16,
//     fontWeight: '600',
//     color: '#1A3E1A',
//     fontFamily: Font?.Poppins,
//   },
//   categoryCount: {
//     fontSize: 12,
//     color: '#1A3E1A',
//     marginTop: 4,
//     fontFamily: Font?.Poppins,
//   },
//   flatListContent: {
//     paddingHorizontal: 10,
//   },
// });



import React, { useRef, useState, useCallback, useEffect } from 'react';
import {
  View,
  StyleSheet,
  Dimensions,
  Text,
  FlatList,
  ScrollView,
  TouchableOpacity,
  Animated,
} from 'react-native';
import { SwiperFlatList } from 'react-native-swiper-flatlist';
import ChallengeCardBanner from '../../../Components/ChallengeCardBanner';
import { scale } from 'react-native-size-matters';
import { Font } from '../../../assets/styles/Fonts';
import ChallengeCard from './ChallengeCard';
import FontAwesome5 from 'react-native-vector-icons/FontAwesome5';
import { Color } from '../../../assets/styles/Colors';
import { useNavigation } from '@react-navigation/native';

const { width, height } = Dimensions.get('window');
const CARD_WIDTH = width * 0.9; // Match the card width in ChallengeCardBanner
const CARD_HEIGHT = 150;

// Only animate FlatList if needed
const AnimatedFlatList = Animated.createAnimatedComponent(FlatList);

const CustomPagination = ({ paginationIndex, data }) => {
  return (
    <View style={styles.pagination}>
      {data.map((_, index) => {
        const isActive = index === paginationIndex;
        return (
          <View
            key={index}
            style={[
              styles.dot,
              isActive ? styles.activeDot : styles.inactiveDot,
            ]}
          />
        );
      })}
    </View>
  );
};

const AllChallenges = ({ challenges, onJoin }) => {
  const swiperRef = useRef(null);
  const [currentIndex, setCurrentIndex] = useState(0);
  const navigation = useNavigation();

  const viewabilityConfigCallbackPairs = useRef([
    {
      viewabilityConfig: {
        itemVisiblePercentThreshold: 50,
      },
      onViewableItemsChanged: ({ viewableItems }) => {
        if (viewableItems.length > 0) {
          setCurrentIndex(viewableItems[0].index);
        }
      },
    },
  ]).current;

  const cardioChallenges = challenges.filter(
    (challenge) => challenge.type.unitLabel === 'Cardio'
  );

  const nutritionChallenges = challenges.filter(
    (challenge) => challenge.type.unitLabel === 'Nutrition'
  );

  const topChallenges = challenges.slice(0, 4);
  const remainingChallenges = challenges.slice(4);

  // Center the first card on initial render
  useEffect(() => {
    if (swiperRef.current && topChallenges.length > 0) {
      swiperRef.current.scrollToIndex({ index: 0, animated: false });
    }
  }, [topChallenges]);

  const handleNavigateCardio = () => {
    navigation.navigate('CardioDetailsScreen', { challenges: cardioChallenges, onJoin });
  };

  const handleNavigateNutrition = () => {
    navigation.navigate('NutritionDetailsScreen', { challenges: nutritionChallenges, onJoin });
  };

  const renderItem = useCallback(
    ({ item }) => {
      return (
        <View style={styles.swiperItem}>
          <ChallengeCardBanner challenge={item} onJoin={onJoin} btnType="Join" />
        </View>
      );
    },
    [onJoin]
  );

  const renderChallengeCard = useCallback(
    ({ item }) => <ChallengeCard challenge={item} onJoin={onJoin} />,
    [onJoin]
  );

  return (
    <View style={styles.container}>
      <ScrollView
        showsVerticalScrollIndicator={false}
        removeClippedSubviews={true}
        contentContainerStyle={styles.scrollContent}
      >
        <View style={styles.containerText}>
          <Text style={styles.text}>All Challenges</Text>
        </View>

        <View style={styles.swiperWrapper}>
          <SwiperFlatList
            ref={swiperRef}
            data={topChallenges}
            renderItem={renderItem}
            keyExtractor={(item) => item._id}
            showPagination
            PaginationComponent={(props) => <CustomPagination {...props} data={topChallenges} />}
            snapToInterval={width} // Snap to full screen width
            snapToAlignment="center"
            decelerationRate="fast"
            bounces={false}
            contentContainerStyle={styles.swiperContainer}
            showsHorizontalScrollIndicator={false}
            horizontal
            viewabilityConfigCallbackPairs={viewabilityConfigCallbackPairs}
            initialNumToRender={1}
            maxToRenderPerBatch={1}
            removeClippedSubviews={true}
            windowSize={1}
            contentInset={{ left: (width - CARD_WIDTH) / 2, right: (width - CARD_WIDTH) / 2 }} // Center the cards
            initialScrollIndex={0} // Ensure the first item is initially selected
          />
        </View>

        <View style={styles.categoriesContainer}>
          <TouchableOpacity
            style={styles.categoryCard}
            onPress={handleNavigateCardio}
            activeOpacity={0.7}
          >
            <View style={styles.iconWrapper}>
              <FontAwesome5 name="running" size={20} color={Color?.primaryColor} />
            </View>
            <Text style={styles.categoryTitle}>Cardio</Text>
            <Text style={styles.categoryCount}>{cardioChallenges.length} challenges</Text>
          </TouchableOpacity>

          <TouchableOpacity
            style={styles.categoryCard}
            onPress={handleNavigateNutrition}
            activeOpacity={0.7}
          >
            <View style={styles.iconWrapper}>
              <Text style={styles.iconText}>🥗</Text>
            </View>
            <Text style={styles.categoryTitle}>Nutrition</Text>
            <Text style={styles.categoryCount}>{nutritionChallenges.length} challenges</Text>
          </TouchableOpacity>
        </View>

        {remainingChallenges.length > 0 && (
          <>
            <View style={styles.containerText}>
              <Text style={styles.text}>Popular Challenges</Text>
            </View>
            <AnimatedFlatList
              data={remainingChallenges}
              keyExtractor={(item) => item?._id?.toString()}
              renderItem={renderChallengeCard}
              removeClippedSubviews={true}
              initialNumToRender={3}
              maxToRenderPerBatch={3}
              windowSize={5}
              showsVerticalScrollIndicator={false}
              contentContainerStyle={styles.flatListContent}
            />
          </>
        )}
      </ScrollView>
    </View>
  );
};

export default AllChallenges;

const styles = StyleSheet.create({
  container: {
    flex: 1,
    marginTop: 10,
  },
  scrollContent: {
    paddingBottom: 20,
  },
  containerText: {
    backgroundColor: 'white',
    padding: 12,
    marginBottom: 8,
  },
  text: {
    fontSize: 18,
    color: Color?.textColor,
    fontFamily: Font?.PoppinsMedium,
  },
  swiperWrapper: {
    height: CARD_HEIGHT + 40,
    justifyContent: 'center',
    alignItems: 'center',
  },
  swiperItem: {
    width: width, // Full width to allow centering via contentInset
    height: CARD_HEIGHT,
    justifyContent: 'center',
    alignItems: 'center', // Center the card horizontally within the item
  },
  swiperContainer: {
    paddingVertical: 0,
    alignItems: 'center',
  },
  pagination: {
    flexDirection: 'row',
    justifyContent: 'center',
    alignItems: 'center',
    marginVertical: 10,
    height: 10,
  },
  dot: {
    height: 8,
    width: 8,
    borderRadius: 4,
    marginHorizontal: 4,
    backgroundColor: '#C4C4C4',
  },
  activeDot: {
    width: 20,
    backgroundColor: '#21972B',
  },
  inactiveDot: {
    width: 8,
    backgroundColor: '#C4C4C4',
  },
  categoriesContainer: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    paddingHorizontal: scale(10),
    marginTop: 16,
    marginBottom: 16,
  },
  categoryCard: {
    backgroundColor: '#AEF5B4',
    borderRadius: 12,
    paddingVertical: 20,
    alignItems: 'center',
    width: scale(148),
  },
  iconWrapper: {
    width: 40,
    height: 40,
    borderRadius: 20,
    backgroundColor: '#CEF9D1',
    alignItems: 'center',
    justifyContent: 'center',
    marginBottom: 8,
  },
  iconText: {
    fontSize: 20,
  },
  categoryTitle: {
    fontSize: 16,
    fontWeight: '600',
    color: '#1A3E1A',
    fontFamily: Font?.Poppins,
  },
  categoryCount: {
    fontSize: 12,
    color: '#1A3E1A',
    marginTop: 4,
    fontFamily: Font?.Poppins,
  },
  flatListContent: {
    paddingHorizontal: 10,
  },
});