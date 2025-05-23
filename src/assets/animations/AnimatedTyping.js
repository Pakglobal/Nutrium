import React, {useState, useEffect, useRef} from 'react';
import {View, Text, Animated, StyleSheet} from 'react-native';
import {Color} from '../styles/Colors';
import {scale} from 'react-native-size-matters';
import {Font} from '../styles/Fonts';

const TextAnimationComponent = ({startAnimation, onAnimationComplete}) => {
  const [welcomeText, setWelcomeText] = useState('');
  const [showWelcome, setShowWelcome] = useState(true);
  const [showFinalText, setShowFinalText] = useState(false);
  const bounceAnim = useRef(new Animated.Value(0)).current;
  const showIntervalRef = useRef(null);
  const removeIntervalRef = useRef(null);

  const finalText =
    'Nutrium provides personalized meal plans and diet tracking for a healthier lifestyle.';
  const welcome = 'Welcome To Nutrium';

  useEffect(() => {
    if (startAnimation) {
      animateWelcome();
    }

    // Cleanup function to stop animations and reset state when component unmounts or startAnimation changes
    return () => {
      if (showIntervalRef.current) {
        clearInterval(showIntervalRef.current);
      }
      if (removeIntervalRef.current) {
        clearInterval(removeIntervalRef.current);
      }
      setWelcomeText('');
      setShowWelcome(true);
      setShowFinalText(false);
      bounceAnim.setValue(0);
    };
  }, [startAnimation]);

  const animateWelcome = () => {
    let index = 0;
    showIntervalRef.current = setInterval(() => {
      if (index < welcome.length) {
        setWelcomeText(welcome.substring(0, index + 1));
        index++;
      } else {
        clearInterval(showIntervalRef.current);
        showIntervalRef.current = null;
        setTimeout(() => {
          removeWelcomeText();
        }, 1000);
      }
    }, 150);
  };

  const removeWelcomeText = () => {
    let currentText = welcome;
    removeIntervalRef.current = setInterval(() => {
      if (currentText.length > 0) {
        currentText = currentText.substring(0, currentText.length - 1);
        setWelcomeText(currentText);
      } else {
        clearInterval(removeIntervalRef.current);
        removeIntervalRef.current = null;
        setShowWelcome(false);
        setTimeout(() => {
          showFinalTextWithBounce();
        }, 300);
      }
    }, 100);
  };

  const showFinalTextWithBounce = () => {
    setShowFinalText(true);

    Animated.sequence([
      Animated.timing(bounceAnim, {
        toValue: 1,
        duration: 700,
        useNativeDriver: true,
      }),
      Animated.spring(bounceAnim, {
        toValue: 1,
        friction: 4,
        tension: 100,
        useNativeDriver: true,
      }),
    ]).start(() => {
      if (onAnimationComplete) {
        onAnimationComplete();
      }
    });
  };

  const bounceTransform = {
    transform: [
      {
        scale: bounceAnim.interpolate({
          inputRange: [0, 0.5, 1],
          outputRange: [0, 1.2, 1],
        }),
      },
    ],
    opacity: bounceAnim,
  };

  return (
    <View style={styles.container}>
      {showWelcome && (
        <View style={styles.welcomeContainer}>
          <Text style={styles.welcomeText}>{welcomeText}</Text>
          <Text style={styles.cursor}>|</Text>
        </View>
      )}

      {showFinalText && (
        <Animated.View style={[styles.finalTextContainer, bounceTransform]}>
          <Text style={styles.finalText}>{finalText}</Text>
        </Animated.View>
      )}
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    justifyContent: 'center',
    alignItems: 'center',
    padding: scale(16),
    backgroundColor: Color.white,
  },
  welcomeContainer: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  welcomeText: {
    fontSize: scale(22),
    letterSpacing: 1,
    color: Color.textColor,
    fontFamily: Font.PoppinsSemiBold,
    textAlign: 'center',
  },
  cursor: {
    fontSize: scale(18),
    letterSpacing: 1,
    color: Color.textColor,
    fontFamily: Font.PoppinsSemiBold,
    opacity: 0.7,
  },
  finalTextContainer: {
    alignItems: 'center',
    justifyContent: 'center',
    paddingHorizontal: scale(16),
  },
  finalText: {
    fontSize: scale(14),
    letterSpacing: 1,
    color: Color.textColor,
    fontFamily: Font.PoppinsMedium,
    textAlign: 'center',
    lineHeight: scale(25),
  },
});

export default TextAnimationComponent;
