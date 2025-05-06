import {
  Alert,
  SafeAreaView,
  StyleSheet,
  Text,
  TouchableOpacity,
  View,
} from 'react-native';
import React, {useEffect, useState} from 'react';
import {GoogleSignin} from '@react-native-google-signin/google-signin';
import {scale, verticalScale} from 'react-native-size-matters';
import {Color} from '../assets/styles/Colors';
import Ionicons from 'react-native-vector-icons/Ionicons';
import {Font} from '../assets/styles/Fonts';
import CustomModal from './CustomModal';

const OnOffFunctionality = ({hydrate = false}) => {
  const [showRevoke, setShowRevoke] = useState(false);
  const [isTracking, setIsTracking] = useState(false);
  const [isAuthenticated, setIsAuthenticated] = useState(false);

  useEffect(() => {
    GoogleSignin.configure({
      webClientId:
        '737792334349-eefln2o4gd1ovb2vs0kdct1hgfg5raf9.apps.googleusercontent.com',
      iosClientId:
        '737792334349-qeadje2231rg3g49s78vo7mh8rsq613j.apps.googleusercontent.com',
      scopes: [
        'https://www.googleapis.com/auth/fitness.activity.read',
        'https://www.googleapis.com/auth/fitness.location.read',
        'https://www.googleapis.com/auth/fitness.nutrition.read',
      ],
    });
    console.log('Google Sign-In configured');
  }, []);

  const handleTrackingToggle = async () => {
    console.log('handleTrackingToggle called', {isTracking, isAuthenticated});

    if (isTracking) {
      console.log('Turning off tracking');
      setShowRevoke(true);
    } else {
      if (isAuthenticated) {
        console.log('Already authenticated, enabling tracking');
        setIsTracking(true);
      } else {
        console.log('Not authenticated, initiating Google Sign-In');
        try {
          await GoogleSignin.hasPlayServices();
          const userInfo = await GoogleSignin.signIn();
          console.log('Google Sign-In response:', userInfo);

          if (userInfo && userInfo?.data?.idToken) {
            console.log('Sign-In successful, enabling tracking');
            setIsTracking(true);
            setIsAuthenticated(true);
          } else {
            console.log('Sign-In failed: No idToken');
            setIsTracking(false);
            Alert.alert(
              'Sign-in Error',
              'Failed to sign in with Google. Please try again.',
              [{text: 'OK'}],
            );
          }
        } catch (error) {
          console.error('Google Sign-In error:', error);
          setIsTracking(false);
          Alert.alert(
            'Sign-in Error',
            'Failed to sign in with Google. Please try again.',
            [{text: 'OK'}],
          );
        }
      }
    }
  };

  const handleRevokeAccess = async () => {
    console.log('handleRevokeAccess called');
    try {
      await GoogleSignin.revokeAccess();
      console.log('Access revoked successfully');
      setIsTracking(false);
      setIsAuthenticated(false);
      setShowRevoke(false);
    } catch (error) {
      console.error('Error revoking access:', error);
      Alert.alert(
        'Revoke Error',
        'Failed to revoke access. Please try again.',
        [{text: 'OK'}],
      );
    }
  };

  const handleHydrateToggle = () => {
    console.log('handleHydrateToggle called', {isTracking});
    setIsTracking(!isTracking);
  };

  return (
    <SafeAreaView>
      <View style={styles.header}>
        <TouchableOpacity
          style={styles.buttonContainer}
          onPress={hydrate ? handleHydrateToggle : handleTrackingToggle}>
          <Text
            style={[
              styles.buttonText,
              {color: isTracking ? Color.primaryColor : Color.gray},
            ]}>
            {isTracking ? 'On' : 'Off'}
          </Text>
          <Ionicons
            name={isTracking ? 'notifications' : 'notifications-outline'}
            size={verticalScale(15)}
            color={isTracking ? Color.primaryColor : Color.gray}
          />
        </TouchableOpacity>
      </View>

      <CustomModal
        visible={showRevoke}
        onClose={() => {
          console.log('Revoke modal closed');
          setShowRevoke(false);
          setIsTracking(false);
        }}
        onConfirm={handleRevokeAccess}
        title="Revoke Access to Physical Activity Data"
        message="Revoke authorization for synchronizing activities through Google Fit."
        confirmText="CONTINUE"
        cancelText="NOT NOW"
      />
    </SafeAreaView>
  );
};

export default OnOffFunctionality;

const styles = StyleSheet.create({
  header: {
    alignSelf: 'flex-end',
    flexDirection: 'row',
  },
  buttonContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: scale(10),
    paddingVertical: verticalScale(3),
    borderRadius: scale(10),
    backgroundColor: Color.primaryLight,
  },
  buttonText: {
    color: Color.gray,
    fontWeight: '600',
    marginHorizontal: scale(5),
    fontSize: scale(12),
    fontFamily: Font.PoppinsMedium,
    marginTop: verticalScale(2),
  },
  titleTxt: {
    color: Color?.textColor,
    fontFamily: Font?.Poppins,
    fontWeight: '500',
    fontSize: scale(16),
  },
});
