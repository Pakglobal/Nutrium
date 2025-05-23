import React, {useEffect, useRef} from 'react';
import {StyleSheet, View, Animated} from 'react-native';
import {Color} from '../assets/styles/Colors';
import {verticalScale} from 'react-native-size-matters';

const GuestFlowHeader = ({currentStep}) => {
  const steps = [
    'selectGender',
    'selectProfession',
    'selectCountry',
    'guestLogin',
  ];

  const currentIndex = steps.indexOf(currentStep);
  const progressPercent =
    currentIndex === -1 ? 0 : ((currentIndex + 1) / steps.length) * 101;

  const animatedWidth = useRef(new Animated.Value(0)).current;

  useEffect(() => {
    Animated.timing(animatedWidth, {
      toValue: progressPercent,
      duration: 500,
      useNativeDriver: false,
    }).start();
  }, [progressPercent]);

  const widthInterpolate = animatedWidth.interpolate({
    inputRange: [0, 100],
    outputRange: ['0%', '100%'],
  });

  return (
    <View style={styles.container}>
      <View style={styles.backgroundBar}>
        <Animated.View
          style={[styles.progressBar, {width: widthInterpolate}]}
        />
      </View>
    </View>
  );
};

export default GuestFlowHeader;

const styles = StyleSheet.create({
  container: {
    width: '100%',
  },
  backgroundBar: {
    width: '100%',
    height: verticalScale(10),
    backgroundColor: Color.primaryLight,
    overflow: 'hidden',
  },
  progressBar: {
    height: '100%',
    backgroundColor: Color.primaryColor,
    borderTopRightRadius: 10,
    borderBottomRightRadius: 10,
  },
});
