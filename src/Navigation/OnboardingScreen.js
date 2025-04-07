import React, {useState} from 'react';
import {
  View,
  Text,
  StyleSheet,
  TouchableOpacity,
  Dimensions,
} from 'react-native';
import AsyncStorage from '@react-native-async-storage/async-storage';
import Color, {Font} from '../assets/colors/Colors';
import {scale, verticalScale} from 'react-native-size-matters';
import AntDesign from 'react-native-vector-icons/AntDesign';

import Onboarding1 from '../assets/Images/onBoarding1.svg';
import Onboarding2 from '../assets/Images/onBoarding2.svg';
import Onboarding3 from '../assets/Images/onBoarding3.svg';

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

  const handleNext = async () => {
    if (currentIndex < onboardingData.length - 1) {
      setCurrentIndex(currentIndex + 1);
    } else {
      await AsyncStorage.setItem('onboardingCompleted', 'true');
      navigation.replace('loginChoice');
    }
  };

  const handleSkip = async () => {
    await AsyncStorage.setItem('onboardingCompleted', 'true');
    navigation.replace('loginChoice');
  };

  const currentScreen = onboardingData[currentIndex];

  const renderSvg = () => {
    const SvgComponent = currentScreen.svgComponent;
    return <SvgComponent width={'100%'} height={'50%'} style={styles.svg} />;
  };

  return (
    <View style={styles.container}>
      <TouchableOpacity style={styles.skipButton} onPress={handleSkip}>
        <Text style={styles.skipText}>Skip</Text>
      </TouchableOpacity>

      <View style={styles.content}>
        {renderSvg()}
        <Text style={styles.title}>{currentScreen.title}</Text>
        <Text style={styles.description}>{currentScreen.description}</Text>
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
                      : Color.shadowColor,
                  width: index === currentIndex ? scale(20) : scale(12),
                },
              ]}
            />
          ))}
        </View>
      </View>

      <TouchableOpacity style={styles.button} onPress={handleNext}>
        <AntDesign name="arrowright" color={Color.white} size={scale(14)} />
      </TouchableOpacity>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: Color.white,
  },
  skipButton: {
    height: '10%',
    justifyContent: 'center',
    alignItems: 'flex-end',
    marginHorizontal: scale(16),
  },
  skipText: {
    fontSize: scale(18),
    color: Color.textColor,
    fontFamily: Font.Poppins,
    fontWeight: '500',
    padding: scale(10),
  },
  content: {
    justifyContent: 'center',
    alignItems: 'center',
    paddingHorizontal: scale(16),
  },
  svg: {
    marginBottom: verticalScale(20),
  },
  title: {
    fontSize: scale(25),
    color: Color.textColor,
    fontWeight: '600',
    textAlign: 'center',
    fontFamily: Font.Poppins,
    letterSpacing: -0.24,
  },
  description: {
    fontSize: scale(17),
    color: Color.textColor,
    textAlign: 'center',
    fontWeight: '400',
    fontFamily: Font.Poppins,
    letterSpacing: -0.24,
    marginBottom: verticalScale(20),
  },
  footer: {
    paddingVertical: scale(16),
    paddingHorizontal: scale(16),
    alignItems: 'center',
  },
  dotsContainer: {
    flexDirection: 'row',
    alignSelf: 'center',
  },
  dot: {
    width: scale(8),
    height: scale(8),
    borderRadius: scale(4),
    marginHorizontal: scale(5),
  },
  button: {
    backgroundColor: Color.primaryColor,
    borderRadius: scale(25),
    padding: scale(12),
    alignSelf: 'flex-end',
    position: 'absolute',
    bottom: scale(16),
    right: scale(16),
  },
});

export default OnboardingScreen;
