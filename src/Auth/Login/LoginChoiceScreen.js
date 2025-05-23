import {
  Animated,
  SafeAreaView,
  StyleSheet,
  Text,
  TouchableOpacity,
} from 'react-native';
import React, {useEffect, useRef, useState} from 'react';
import HeaderImage from '../../assets/Images/loginChoiceHeader.svg';
import NutriumLogo from '../../assets/Images/logoGreen.svg';
import {Color} from '../../assets/styles/Colors';
import {scale, verticalScale} from 'react-native-size-matters';
import {useNavigation} from '@react-navigation/native';
import {Font} from '../../assets/styles/Fonts';
import AnimatedText from '../../assets/animations/AnimatedTyping';
import {Easing} from 'react-native-reanimated';

const LoginChoiceScreen = () => {
  const navigation = useNavigation();
  const headerImageAnim = useRef(new Animated.Value(-200)).current;
  const logoAnim = useRef(new Animated.Value(0)).current;
  const buttonAnim = useRef(new Animated.Value(100)).current;
  const buttonOpacity = useRef(new Animated.Value(0)).current;
  const [isAnimating, setIsAnimating] = useState(true);
  const [startTextAnimation, setStartTextAnimation] = useState(false);

  useEffect(() => {
    const animationSequence = Animated.sequence([
      Animated.timing(headerImageAnim, {
        toValue: 0,
        duration: 1200,
        easing: Easing.out(Easing.cubic),
        useNativeDriver: true,
      }),
      Animated.spring(logoAnim, {
        toValue: 1,
        tension: 100,
        friction: 8,
        useNativeDriver: true,
      }),
    ]);

    animationSequence.start(() => {
      setStartTextAnimation(true);
    });

    return () => {
      animationSequence.stop();
    };
  }, [headerImageAnim, logoAnim]);

  const handleTextAnimationComplete = () => {
    Animated.parallel([
      Animated.timing(buttonAnim, {
        toValue: 0,
        duration: 500,
        easing: Easing.out(Easing.quad),
        useNativeDriver: true,
      }),
      Animated.timing(buttonOpacity, {
        toValue: 1,
        duration: 500,
        useNativeDriver: true,
      }),
    ]).start(() => {
      setIsAnimating(false);
    });
  };

  return (
    <SafeAreaView style={styles.container}>
      <Animated.View
        style={[
          styles.headerImageContainer,
          {
            transform: [{translateY: headerImageAnim}],
          },
        ]}>
        <HeaderImage
          width="100%"
          height={verticalScale(360)}
          preserveAspectRatio="xMidYMax slice"
        />
      </Animated.View>

      <Animated.View
        style={[
          styles.logoContainer,
          {
            transform: [
              {
                scale: logoAnim.interpolate({
                  inputRange: [0, 1],
                  outputRange: [0.8, 1],
                }),
              },
            ],
            opacity: logoAnim,
          },
        ]}>
        <NutriumLogo
          width="100%"
          height={verticalScale(30)}
          style={styles.logo}
        />
      </Animated.View>

      <AnimatedText
        startAnimation={startTextAnimation}
        onAnimationComplete={handleTextAnimationComplete}
      />

      <Animated.View
        style={[
          styles.fixedButtonContainer,
          {
            transform: [{translateY: buttonAnim}],
            opacity: buttonOpacity,
          },
        ]}>
        <TouchableOpacity
          onPress={() => navigation.navigate('loginScreen')}
          style={[styles.button, styles.loginButton]}
          accessibilityLabel="Log in to your account"
          disabled={isAnimating}>
          <Text style={[styles.buttonText, styles.loginButtonText]}>Login</Text>
        </TouchableOpacity>

        <TouchableOpacity
          onPress={() => navigation.navigate('GuestLogin')}
          style={[styles.button, styles.guestButton]}
          accessibilityLabel="Continue as a guest without logging in"
          disabled={isAnimating}>
          <Text style={[styles.buttonText, styles.guestButtonText]}>
            Continue As Guest
          </Text>
        </TouchableOpacity>
      </Animated.View>
    </SafeAreaView>
  );
};

export default LoginChoiceScreen;

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: Color.white,
  },
  headerImageContainer: {
    overflow: 'hidden',
  },
  logoContainer: {
    height: verticalScale(31),
    width: scale(155),
    alignSelf: 'center',
    marginTop: verticalScale(30),
    marginBottom: verticalScale(20),
  },
  logo: {
    alignSelf: 'center',
  },
  fixedButtonContainer: {
    width: '100%',
    position: 'absolute',
    bottom: 0,
    left: 0,
    right: 0,
    paddingHorizontal: scale(8),
    paddingBottom: verticalScale(15),
    paddingTop: verticalScale(10),
    backgroundColor: Color.white,
  },
  button: {
    borderRadius: scale(8),
    height: verticalScale(35),
    alignItems: 'center',
    justifyContent: 'center',
  },
  loginButton: {
    backgroundColor: Color.primaryColor,
  },
  guestButton: {
    backgroundColor: Color.white,
    borderWidth: 2,
    borderColor: Color.primaryColor,
    marginTop: verticalScale(8),
    flexDirection: 'row',
    alignItems: 'center',
  },
  buttonText: {
    fontSize: scale(14),
    fontFamily: Font.PoppinsMedium,
    textAlign: 'center',
    letterSpacing: 1,
    marginTop: verticalScale(2),
  },
  loginButtonText: {
    color: Color.white,
  },
  guestButtonText: {
    color: Color.primaryColor,
    marginHorizontal: scale(8),
  },
});
