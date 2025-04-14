import {
  Alert,
  SafeAreaView,
  StyleSheet,
  Text,
  TouchableOpacity,
  View,
} from 'react-native';
import React, {useState} from 'react';
import {GoogleSignin} from '@react-native-google-signin/google-signin';
import {scale, verticalScale} from 'react-native-size-matters';
import {Color} from '../assets/styles/Colors';
import Ionicons from 'react-native-vector-icons/Ionicons';
import {Font} from '../assets/styles/Fonts';
import CustomModal from './CustomModal';

const OnOffFunctionality = ({hydrate = false}) => {
  const [showRevoke, setShowRevoke] = useState(false);
  const [isTracking, setIsTracking] = useState(false);

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

  const handleTrackingToggle = async () => {
    if (isTracking) {
      setShowRevoke(true);
    } else {
      try {
        await GoogleSignin.hasPlayServices();
        const userInfo = await GoogleSignin.signIn();

        if (userInfo && userInfo?.data?.idToken) {
          setIsTracking(true);
        } else {
          console.log('Sign-in was cancelled');
          setIsTracking(false);
        }
      } catch (error) {
        console.error('Error in Google Sign-in:', error);
        setIsTracking(false);
        Alert.alert(
          'Sign-in Error',
          'Failed to sign in with Google. Please try again.',
          [{text: 'OK'}],
        );
      }
    }
  };

  const handleRevokeAccess = async () => {
    try {
      await GoogleSignin.revokeAccess();
      setIsTracking(false);
      setShowRevoke(false);
    } catch (error) {
      console.error('Error revoking access:', error);
    }
  };

  const handleHydrateToggle = () => {
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
        onClose={() => setShowRevoke(false)}
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
    marginVertical: verticalScale(12),
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
  },
  titleTxt: {
    color: Color?.textColor,
    fontFamily: Font?.Poppins,
    fontWeight: '500',
    fontSize: scale(16),
  },
});
