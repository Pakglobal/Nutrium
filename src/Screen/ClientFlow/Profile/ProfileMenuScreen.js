import React from 'react';
import {View, Text, StyleSheet, Dimensions} from 'react-native';
import * as Animatable from 'react-native-animatable';
import Icon from 'react-native-vector-icons/MaterialIcons';
import {Color} from '../../../assets/styles/Colors';
import {Font} from '../../../assets/styles/Fonts';

const {width, height} = Dimensions.get('window');

const UnderDevelopment = () => {
  return (
    <View style={styles.container}>
      <Animatable.View
        animation="zoomIn"
        duration={1500}
        style={styles.iconContainer}>
        <Icon name="laptop" size={80} color="#4CAF50" />
      </Animatable.View>
      <Animatable.Text
        animation="pulse"
        easing="ease-out"
        iterationCount="infinite"
        style={styles.title}>
        Under Development
      </Animatable.Text>
      <Animatable.Text animation="fadeInUp" delay={500} style={styles.subtitle}>
        Our team is coding something amazing for you!
      </Animatable.Text>
      <Animatable.View
        animation="fadeIn"
        delay={1000}
        style={styles.progressContainer}>
        <Text style={styles.progressText}>Progress...</Text>
      </Animatable.View>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: '#E8F0FE',
    padding: 20,
  },
  iconContainer: {
    marginBottom: 20,
  },
  title: {
    fontSize: 30,
    fontFamily: Font.PoppinsMedium,
    color: Color.primaryColor,
    textAlign: 'center',
  },
  subtitle: {
    fontSize: 16,
    color: '#4B5563',
    textAlign: 'center',
    marginTop: 10,
    marginBottom: 20,
    fontFamily: Font.Poppins,
  },
  progressContainer: {
    padding: 10,
    borderRadius: 5,
    backgroundColor: Color.primaryLight,
  },
  progressText: {
    fontSize: 14,
    color: Color.primaryColor,
    fontFamily: Font.PoppinsMedium,
  },
});

export default UnderDevelopment;
