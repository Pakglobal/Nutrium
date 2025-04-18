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
import { Color } from '../assets/styles/Colors';
import { useNavigation } from '@react-navigation/native';
import { useSelector } from 'react-redux';
import Entypo from 'react-native-vector-icons/Entypo';
import { Shadow } from 'react-native-shadow-2';
import { Font } from '../assets/styles/Fonts';
import { ShadowValues } from '../assets/styles/Shadow';
import CustomShadow from './CustomShadow';

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
      Linking.openURL(
        'https://play.google.com/store/apps/details?id=co.healthium.nutrium',
      ).catch(() =>
        Linking.openURL('market://details?id=com.nutrium.nutriumapp'),
      );
    }
  };

  return (
    <View style={styles.cardContainer}>
      <LinearGradient
        colors={['#21972B', '#6BCB77']}
        start={{ x: 0, y: 0 }}
        end={{ x: 1, y: 1 }}
        style={styles.gradientBox}>
        <Text style={styles.description}>{data?.text}</Text>
        <CustomShadow
          distance={1}
          startColor={ShadowValues.blackShadow}
          style={{ width: '100%' }}>
          <TouchableOpacity
            style={styles.txtIcon}
            onPress={handlePress}
            activeOpacity={0.9}>
            <Text style={styles.txt}>{data?.buttonText} </Text>
            <Entypo name="plus" size={24} color={Color.primaryColor} />
          </TouchableOpacity>
        </CustomShadow>
      </LinearGradient>
    </View>
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
    }, 5000);

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
        inactiveSlideScale={0.95}
        inactiveSlideOpacity={0.7}
        activeSlideAlignment="start"
        autoplay={false}
        loop={false}
        enableMomentum={false}
        decelerationRate="fast"
        useScrollView={true}
        animationOptions={{
          friction: 4,
          tension: 40,
        }}
      />

      <View style={styles.pagination}>
        {carouselData.map((_, index) => (
          <View
            key={index}
            style={[
              styles.dot,
              activeIndex === index ? styles.activeDot : styles.inactiveDot,
            ]}
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
    justifyContent: 'center',
  },
  container: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
  pagination: {
    flexDirection: 'row',
    marginVertical: scale(10),
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
    fontFamily: Font?.Poppins,
    marginBottom: verticalScale(10),
  },
  txtIcon: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: Color?.white,
    padding: scale(7),
    borderRadius: scale(5),
    justifyContent: 'space-between',
  },
  txt: {
    fontSize: verticalScale(12),
    fontWeight: '500',
    color: Color.primaryColor,
    fontFamily: Font?.Poppins,
    marginLeft: scale(5),
    marginTop: scale(2),
  },
});

export default MoreForYou;
