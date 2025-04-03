// import React, {useEffect, useRef, useState} from 'react';
// import {
//   View,
//   Text,
//   ImageBackground,
//   StyleSheet,
//   TouchableOpacity,
//   FlatList,
//   Dimensions,
//   Linking,
// } from 'react-native';
// import {scale, verticalScale} from 'react-native-size-matters';
// import Carousel from 'react-native-snap-carousel';
// import AntDesign from 'react-native-vector-icons/AntDesign';
// import Color from '../assets/colors/Colors';
// import {useNavigation} from '@react-navigation/native';
// import {useSelector} from 'react-redux';

// const {width} = Dimensions.get('window');

// const carouselData = [
//   {
//     id: '1',
//     items: [
//       {
//         text: "It's time to smile and \nsay 'Nutrium!'",
//         buttonText: 'Add profile photo',
//         bgColor: 'rgba(173,162,255,0.6)',
//       },
//     ],
//   },
//   {
//     id: '2',
//     items: [
//       {
//         text: 'Your feedback makes a \ndifference',
//         buttonText: 'Rate our app',
//         bgColor: 'rgba(202,161,52,0.6)',
//       },
//     ],
//   },
// ];

// const MoreFor = ({data}) => {
//   const navigation = useNavigation();

//   const getToken = useSelector(state => state?.user?.userInfo);
//   const profileData = getToken?.user || getToken?.userData;

//   const handlePress = () => {
//     if (data?.buttonText === 'Add profile photo') {
//       navigation.navigate('mainProfile', {data: profileData});
//     } else if (data?.buttonText === 'Rate our app') {
//       Linking.openURL(
//         'https://play.google.com/store/apps/details?id=co.healthium.nutrium',
//       ).catch(() => {
//         Linking.openURL('market://details?id=com.nutrium.nutriumapp');
//       });
//     }
//   };

//   return (
//     <TouchableOpacity style={styles.cardContainer} onPress={handlePress}>
//       <ImageBackground
//         style={styles.bgImage}
//         source={require('../assets/Images/smilecard.jpg')}
//         resizeMode="cover"
//         imageStyle={{borderRadius: 20}}
//       />
//       <View style={[styles.cardOverlay, {backgroundColor: data.bgColor}]}>
//         <Text style={styles.description}>{data.text}</Text>
//         <View style={styles.txtIcon}>
//           <Text style={styles.txt}>
//             {data.buttonText}
//             {'  '}
//           </Text>
//           <AntDesign name="arrowright" size={18} color={Color.white} />
//         </View>
//       </View>
//     </TouchableOpacity>
//   );
// };

// const MoreForYou = () => {
//   const carouselRef = useRef(null);
//   const [activeIndex, setActiveIndex] = useState(0);
//   const [scrollingForward, setScrollingForward] = useState(true);

//   useEffect(() => {
//     const interval = setInterval(() => {
//       if (scrollingForward) {
//         if (activeIndex < carouselData.length - 1) {
//           carouselRef.current?.snapToNext();
//         } else {
//           setScrollingForward(false);
//           carouselRef.current?.snapToPrev();
//         }
//       } else {
//         if (activeIndex > 0) {
//           carouselRef.current?.snapToPrev();
//         } else {
//           setScrollingForward(true);
//           carouselRef.current?.snapToNext();
//         }
//       }
//     }, 7000);

//     return () => clearInterval(interval);
//   }, [activeIndex, scrollingForward]);

//   const renderCarouselItem = ({item}) => {
//     return (
//       <FlatList
//         data={item.items}
//         renderItem={({item: flatListItem}) => <MoreFor data={flatListItem} />}
//         keyExtractor={(_, index) => index.toString()}
//         showsVerticalScrollIndicator={false}
//       />
//     );
//   };

//   return (
//     <View style={styles.container}>
//       <Carousel
//         ref={carouselRef}
//         data={carouselData}
//         renderItem={renderCarouselItem}
//         sliderWidth={width}
//         itemWidth={width}
//         onSnapToItem={index => setActiveIndex(index)}
//         enableSnap={true}
//         inactiveSlideScale={1}
//         inactiveSlideOpacity={1}
//         activeSlideAlignment={'center'}
//         autoplay={false}
//         loop={false}
//       />

//       <View style={styles.pagination}>
//         {carouselData.map((_, index) => (
//           <View
//             key={index}
//             style={[
//               styles.dot,
//               activeIndex === index ? styles.activeDot : styles.inactiveDot,
//             ]}
//           />
//         ))}
//       </View>
//     </View>
//   );
// };

// const styles = StyleSheet.create({
//   container: {
//     flex: 1,
//     justifyContent: 'center',
//     alignItems: 'center',
//   },
//   pagination: {
//     flexDirection: 'row',
//     marginTop: scale(10),
//     alignItems: 'center',
//   },
//   dot: {
//     width: scale(8),
//     height: scale(8),
//     borderRadius: scale(4),
//     marginHorizontal: scale(3),
//     alignItems: 'center',
//   },
//   activeDot: {
//     backgroundColor: '#aaaa',
//     width: scale(20),
//     height: scale(8),
//   },
//   inactiveDot: {
//     backgroundColor: '#dddd',
//   },
//   cardContainer: {
//     borderRadius: scale(20),
//     alignSelf: 'center',
//     width: '90%',
//     height: verticalScale(120),
//   },
//   cardOverlay: {
//     height: '100%',
//     width: '100%',
//     borderRadius: scale(20),
//     position: 'absolute',
//     paddingLeft: scale(20),
//     justifyContent: 'center',
//   },
//   description: {
//     color: Color.white,
//     fontSize: verticalScale(14),
//     fontWeight: '700',
//   },
//   txtIcon: {
//     flexDirection: 'row',
//     alignItems: 'center',
//     marginTop: verticalScale(10),
//   },
//   txt: {
//     fontSize: verticalScale(12),
//     fontWeight: '600',
//     color: Color.white,
//   },
//   bgImage: {
//     height: verticalScale(120),
//     width: '100%',
//   },
// });

// export default MoreForYou;



import React, { useEffect, useRef, useState } from 'react';
import LinearGradient from 'react-native-linear-gradient';
import {
  View,
  Text,
  StyleSheet,
  TouchableOpacity,
  FlatList,
  Dimensions,
  Linking,
} from 'react-native';
import { scale, verticalScale } from 'react-native-size-matters';
import Carousel from 'react-native-snap-carousel';
import AntDesign from 'react-native-vector-icons/AntDesign';
import Color, { Font } from '../assets/colors/Colors';
import { useNavigation } from '@react-navigation/native';
import { useSelector } from 'react-redux';

const { width } = Dimensions.get('window');

const carouselData = [
  {
    id: '1',
    items: [
      {
        text: "It's time to smile and say 'Nutrium!'",
        buttonText: 'Add Profile Photo',
      },
    ],
  },
  {
    id: '2',
    items: [
      {
        text: 'Your feedback makes a difference',
        buttonText: 'Rate Our App',
      },
    ],
  },
];

const MoreFor = ({ data }) => {
  const navigation = useNavigation();
  const userInfo = useSelector(state => state?.user?.userInfo);
  const profileData = userInfo?.user || userInfo?.userData;

  const handlePress = () => {
    if (data?.buttonText === 'Add Profile Photo') {
      navigation.navigate('mainProfile', { data: profileData });
    } else if (data?.buttonText === 'Rate Our App') {
      Linking.openURL('https://play.google.com/store/apps/details?id=co.healthium.nutrium')
        .catch(() => Linking.openURL('market://details?id=com.nutrium.nutriumapp'));
    }
  };

  return (
    <TouchableOpacity style={styles.cardContainer} onPress={handlePress}>
      <LinearGradient colors={['#21972B', '#6BCB77']}
        start={{ x: 0, y: 0 }}
        end={{ x: 1, y: 1 }}
        style={styles.gradientBox}
      >
        <Text style={styles.description}>{data.text}</Text>
        <View style={styles.txtIcon}>
          <Text style={styles.txt}>{data.buttonText} </Text>
          <AntDesign name="plus" size={16} color={Color.primaryColor} />
        </View>
      </LinearGradient>
    </TouchableOpacity>
  );
};

const MoreForYou = () => {
  const carouselRef = useRef(null);
  const [activeIndex, setActiveIndex] = useState(0);
  const [scrollingForward, setScrollingForward] = useState(true);

  useEffect(() => {
    const interval = setInterval(() => {
      if (scrollingForward) {
        if (activeIndex < carouselData.length - 1) {
          carouselRef.current?.snapToNext();
        } else {
          setScrollingForward(false);
          carouselRef.current?.snapToPrev();
        }
      } else {
        if (activeIndex > 0) {
          carouselRef.current?.snapToPrev();
        } else {
          setScrollingForward(true);
          carouselRef.current?.snapToNext();
        }
      }
    }, 7000);

    return () => clearInterval(interval);
  }, [activeIndex, scrollingForward]);

  const renderCarouselItem = ({ item }) => (
    <FlatList
      data={item.items}
      renderItem={({ item: flatListItem }) => <MoreFor data={flatListItem} />}
      keyExtractor={(_, index) => index.toString()}
      showsVerticalScrollIndicator={false}
    />
  );

  return (
    <View style={styles.container}>
      <Carousel
        ref={carouselRef}
        data={carouselData}
        renderItem={renderCarouselItem}
        sliderWidth={width}
        itemWidth={width}
        onSnapToItem={setActiveIndex}
        inactiveSlideScale={1}
        inactiveSlideOpacity={1}
        activeSlideAlignment={'center'}
        autoplay={false}
        loop={false}
      />
      <View style={styles.pagination}>
        {carouselData.map((_, index) => (
          <View
            key={index}
            style={[styles.dot, activeIndex === index ? styles.activeDot : styles.inactiveDot]}
          />
        ))}
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  gradientBox: {
    borderRadius: scale(10),
    padding: scale(15),
    width: '92%',
    alignSelf: 'center',
    height: scale(110),
    justifyContent: "center"
  },
  container: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
  pagination: {
    flexDirection: 'row',
    marginTop: scale(10),
    alignItems: 'center',
  },
  dot: {
    width: scale(8),
    height: scale(8),
    borderRadius: scale(4),
    marginHorizontal: scale(3),
  },
  activeDot: {
    backgroundColor: Color?.primaryColor,
    width: scale(20),
  },
  inactiveDot: {
    backgroundColor: Color?.lightgray,
  },
  cardContainer: {
    marginTop: scale(20),
    borderRadius: scale(15),
    overflow: 'hidden',
  },
  description: {
    color: Color.white,
    fontSize: verticalScale(14),
    fontWeight: '600',
    fontFamily: Font?.Poppins

  },
  txtIcon: {
    flexDirection: 'row',
    alignItems: 'center',
    marginTop: verticalScale(10),
    backgroundColor: Color?.white,
    padding: scale(7),
    borderRadius: scale(5),
    justifyContent: "space-between"
  },
  txt: {
    fontSize: verticalScale(12),
    fontWeight: '500',
    color: Color.primaryColor,
    fontFamily: Font?.Poppins

  },
});

export default MoreForYou;
