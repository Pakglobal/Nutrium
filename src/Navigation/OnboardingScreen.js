// import React, {useState} from 'react';
// import {
//   View,
//   Text,
//   StyleSheet,
//   TouchableOpacity,
//   Dimensions,
// } from 'react-native';
// import AsyncStorage from '@react-native-async-storage/async-storage';
// import Color, {Font} from '../assets/colors/Colors';
// import {scale, verticalScale} from 'react-native-size-matters';
// import AntDesign from 'react-native-vector-icons/AntDesign';

// import Onboarding1 from '../assets/Images/onBoarding1.svg';
// import Onboarding2 from '../assets/Images/onBoarding2.svg';
// import Onboarding3 from '../assets/Images/onBoarding3.svg';

// const onboardingData = [
//   {
//     title: 'Eat Healthy',
//     description:
//       'Maintaining good health should be the primary focus of everyone.',
//     svgComponent: Onboarding1,
//   },
//   {
//     title: 'Healthy Recipes',
//     description: 'Browse thousands of healthy recipes from all over the world.',
//     svgComponent: Onboarding2,
//   },
//   {
//     title: 'Track Your Health',
//     description: 'With amazing inbuilt tools you can track your progress.',
//     svgComponent: Onboarding3,
//   },
// ];

// const OnboardingScreen = ({navigation}) => {
//   const [currentIndex, setCurrentIndex] = useState(0);

//   const handleNext = async () => {
//     if (currentIndex < onboardingData.length - 1) {
//       setCurrentIndex(currentIndex + 1);
//     } else {
//       await AsyncStorage.setItem('onboardingCompleted', 'true');
//       navigation.replace('loginChoice');
//     }
//   };

//   const handleSkip = async () => {
//     await AsyncStorage.setItem('onboardingCompleted', 'true');
//     navigation.replace('loginChoice');
//   };

//   const currentScreen = onboardingData[currentIndex];

//   const renderSvg = () => {
//     const SvgComponent = currentScreen.svgComponent;
//     return <SvgComponent width={'100%'} height={'50%'} style={styles.svg} />;
//   };

//   return (
// <View style={styles.container}>
//   <TouchableOpacity style={styles.skipButton} onPress={handleSkip}>
//     <Text style={styles.skipText}>Skip</Text>
//   </TouchableOpacity>

//   <View style={styles.content}>
//     {renderSvg()}
//     <Text style={styles.title}>{currentScreen.title}</Text>
//     <Text style={styles.description}>{currentScreen.description}</Text>
//     <View style={styles.dotsContainer}>
//       {onboardingData.map((_, index) => (
//         <View
//           key={index}
//           style={[
//             styles.dot,
//             {
//               backgroundColor:
//                 index === currentIndex
//                   ? Color.primaryColor
//                   : Color.primaryLight,
//               width: index === currentIndex ? scale(20) : scale(12),
//             },
//           ]}
//         />
//       ))}
//     </View>
//   </View>

//   <TouchableOpacity style={styles.button} onPress={handleNext}>
//     <AntDesign name="arrowright" color={Color.white} size={scale(14)} />
//   </TouchableOpacity>
// </View>
//   );
// };

// const styles = StyleSheet.create({
//   container: {
//     flex: 1,
//     backgroundColor: Color.white,
//   },
//   skipButton: {
//     height: '10%',
//     justifyContent: 'center',
//     alignItems: 'flex-end',
//     marginHorizontal: scale(16),
//   },
//   skipText: {
//     fontSize: scale(16),
//     color: Color.textColor,
//     fontFamily: Font.Poppins,
//     fontWeight: '600',
//     padding: scale(10),
//   },
//   content: {
//     justifyContent: 'center',
//     alignItems: 'center',
//     paddingHorizontal: scale(16),
//   },
//   svg: {
//     marginBottom: verticalScale(20),
//   },
//   title: {
//     fontSize: scale(22),
//     color: Color.textColor,
//     fontWeight: '600',
//     textAlign: 'center',
//     fontFamily: Font.Poppins,
//     letterSpacing: -0.24,
//   },
//   description: {
//     fontSize: scale(14),
//     color: Color.textColor,
//     textAlign: 'center',
//     fontWeight: '400',
//     fontFamily: Font.Poppins,
//     letterSpacing: -0.24,
//     marginBottom: verticalScale(20),
//   },
//   footer: {
//     paddingVertical: scale(16),
//     paddingHorizontal: scale(16),
//     alignItems: 'center',
//   },
//   dotsContainer: {
//     flexDirection: 'row',
//     alignSelf: 'center',
//   },
//   dot: {
//     width: scale(8),
//     height: scale(8),
//     borderRadius: scale(4),
//     marginHorizontal: scale(5),
//   },
//   button: {
//     backgroundColor: Color.primaryColor,
//     borderRadius: scale(25),
//     padding: scale(12),
//     alignSelf: 'flex-end',
//     position: 'absolute',
//     bottom: scale(16),
//     right: scale(16),
//   },
// });

// export default OnboardingScreen;

import React, {useState, useRef} from 'react';
import {
  View,
  Text,
  StyleSheet,
  TouchableOpacity,
  FlatList,
  Dimensions,
} from 'react-native';
import Color, {Font} from '../assets/colors/Colors';
import {scale, verticalScale} from 'react-native-size-matters';
import AntDesign from 'react-native-vector-icons/AntDesign';
import Onboarding1 from '../assets/Images/onBoarding1.svg';
import Onboarding2 from '../assets/Images/onBoarding2.svg';
import Onboarding3 from '../assets/Images/onBoarding3.svg';
import { completeOnboarding } from '../redux/user';
import { useDispatch } from 'react-redux';

const {width, height} = Dimensions.get('window');

const onboardingData = [
  {
    title: 'Eat Healthy',
    description:
      'Maintaining good health should be the primary focus of everyone.',
    svgComponent: Onboarding1,
  },
  {
    title: 'Healthy Recipes',
    description: 'Browse thousands of healthy recipes from all over the world.',
    svgComponent: Onboarding2,
  },
  {
    title: 'Track Your Health',
    description: 'With amazing inbuilt tools you can track your progress.',
    svgComponent: Onboarding3,
  },
];

const OnboardingScreen = ({navigation}) => {
  const [currentIndex, setCurrentIndex] = useState(0);
  const flatListRef = useRef(null);
  const dispatch = useDispatch()

  const handleNext = async () => {
    if (currentIndex < onboardingData.length - 1) {
      flatListRef.current.scrollToIndex({index: currentIndex + 1});
    } else {
      dispatch(completeOnboarding());
      navigation.navigate('loginChoice');
    }
  };

  const handleSkip = async () => {
    dispatch(completeOnboarding());
    navigation.navigate('loginChoice');
  };

  const onViewableItemsChanged = useRef(({viewableItems}) => {
    if (viewableItems.length > 0) {
      setCurrentIndex(viewableItems[0].index);
    }
  }).current;

  const renderItem = ({item}) => {
    const SvgComponent = item.svgComponent;
    return (
      <View style={styles.slide}>
        <SvgComponent
          width={width * 0.9}
          height={height * 0.4}
          style={styles.svg}
        />
        <Text style={styles.title}>{item.title}</Text>
        <Text style={styles.description}>{item.description}</Text>
      </View>
    );
  };

  return (
    <View style={styles.container}>
      <TouchableOpacity style={styles.skipButton} onPress={handleSkip}>
        <Text style={styles.skipText}>Skip</Text>
      </TouchableOpacity>

      <FlatList
        ref={flatListRef}
        data={onboardingData}
        renderItem={renderItem}
        horizontal
        pagingEnabled
        showsHorizontalScrollIndicator={false}
        keyExtractor={(_, index) => index.toString()}
        onViewableItemsChanged={onViewableItemsChanged}
        viewabilityConfig={{
          itemVisiblePercentThreshold: 50,
        }}
      />

      <View style={styles.footer}>
        <View style={styles.dotsContainer}>
          {onboardingData.map((_, index) => (
            <View
              key={index}
              style={[
                styles.dot,
                {
                  backgroundColor:
                    index === currentIndex
                      ? Color.primaryColor
                      : Color.primaryLight,
                  width: index === currentIndex ? scale(20) : scale(12),
                },
              ]}
            />
          ))}
        </View>
        <TouchableOpacity style={styles.button} onPress={handleNext}>
          <AntDesign name="arrowright" color={Color.white} size={scale(24)} />
        </TouchableOpacity>
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: Color.white,
  },
  slide: {
    width: width,
    alignItems: 'center',
  },
  skipButton: {
    alignSelf: 'flex-end',
    marginHorizontal: scale(16),
    marginVertical: verticalScale(16),
  },
  skipText: {
    fontSize: scale(16),
    color: Color.textColor,
    fontFamily: Font.Poppins,
    fontWeight: '600',
    padding: scale(10),
  },
  svg: {
    marginBottom: verticalScale(10),
  },
  title: {
    fontSize: scale(22),
    color: Color.textColor,
    fontWeight: '600',
    textAlign: 'center',
    fontFamily: Font.Poppins,
    letterSpacing: -0.24,
    marginBottom: verticalScale(5),
  },
  description: {
    fontSize: scale(14),
    color: Color.textColor,
    textAlign: 'center',
    fontWeight: '400',
    fontFamily: Font.Poppins,
    letterSpacing: -0.24,
    marginHorizontal: scale(16),
  },
  footer: {
    paddingHorizontal: scale(16),
    paddingVertical: verticalScale(10),
  },
  dotsContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    alignSelf: 'center',
    bottom: 150,
  },
  dot: {
    height: scale(8),
    borderRadius: scale(4),
    marginHorizontal: scale(5),
  },
  button: {
    backgroundColor: Color.primaryColor,
    borderRadius: scale(25),
    padding: scale(10),
    alignSelf: 'flex-end',
  },
});

export default OnboardingScreen;
