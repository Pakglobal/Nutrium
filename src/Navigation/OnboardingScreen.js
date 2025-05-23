import React, {useState, useRef} from 'react';
import {
  View,
  Text,
  StyleSheet,
  TouchableOpacity,
  Dimensions,
} from 'react-native';
import {Color} from '../assets/styles/Colors';
import {scale, verticalScale} from 'react-native-size-matters';
import AntDesign from 'react-native-vector-icons/AntDesign';
import Onboarding1 from '../assets/Images/onBoarding1.svg';
import Onboarding2 from '../assets/Images/onBoarding2.svg';
import Onboarding3 from '../assets/Images/onBoarding3.svg';
import {completeOnboarding} from '../redux/user';
import {useDispatch} from 'react-redux';
import {Font} from '../assets/styles/Fonts';

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
  const dispatch = useDispatch();
  const [currentIndex, setCurrentIndex] = useState(0);

  const handleNext = async () => {
    if (currentIndex < onboardingData.length - 1) {
      setCurrentIndex(currentIndex + 1);
    } else {
      dispatch(completeOnboarding());
      navigation.replace('loginChoice');
    }
  };

  const handleSkip = async () => {
    dispatch(completeOnboarding());
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
                      : Color.primaryLight,
                  width: index === currentIndex ? scale(20) : scale(12),
                },
              ]}
            />
          ))}
        </View>
      </View>

      <TouchableOpacity style={styles.button} onPress={handleNext}>
        <AntDesign name="arrowright" color={Color.white} size={scale(24)} />
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
    justifyContent: 'center',
    alignItems: 'flex-end',
    marginHorizontal: scale(16),
    marginTop: verticalScale(8),
  },
  skipText: {
    fontSize: scale(16),
    color: Color.textColor,
    fontFamily: Font.PoppinsMedium,
    padding: scale(10),
  },
  content: {
    justifyContent: 'center',
    alignItems: 'center',
    paddingHorizontal: scale(22),
  },
  svg: {
    marginBottom: verticalScale(20),
  },
  title: {
    fontSize: scale(22),
    color: Color.textColor,
    fontWeight: '600',
    textAlign: 'center',
    fontFamily: Font.PoppinsMedium,
    letterSpacing: -0.24,
  },
  description: {
    fontSize: scale(14),
    color: 'rgba(0,0,0,0.45)',
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
    alignSelf: 'flex-end',
    position: 'absolute',
    bottom: scale(16),
    right: scale(16),
    height: scale(34),
    width: scale(34),
    alignItems: 'center',
    justifyContent: 'center',
  },
});

export default OnboardingScreen;
