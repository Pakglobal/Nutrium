import {
  Alert,
  Modal,
  Pressable,
  SafeAreaView,
  StyleSheet,
  Text,
  TouchableOpacity,
  View,
} from 'react-native';
import React, { useState } from 'react';
import { GoogleSignin } from '@react-native-google-signin/google-signin';
import { scale, verticalScale } from 'react-native-size-matters';
import { Color } from '../assets/styles/Colors';
import Ionicons from 'react-native-vector-icons/Ionicons';
import { Font } from '../assets/styles/Fonts';

const OnOffFunctionality = ({ title, ShowTitle, hydrate = false }) => {
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
          [{ text: 'OK' }],
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
      <View style={[styles.header,
      {
        alignSelf: ShowTitle ? 'auto' : 'flex-end',
        justifyContent: ShowTitle ? 'space-between' : 'space-between',
        borderBottomColor: ShowTitle ? Color?.gray : Color?.white,
        paddingBottom: ShowTitle ? scale(10) : 0,
        borderBottomWidth: ShowTitle ? scale(0.5) : 0
      }]}>
        {
          ShowTitle &&

          <View style={{ alignSelf: 'center' }} >

            <Text style={styles.titleTxt} >{title}</Text>
          </View>
        }
        <TouchableOpacity
          style={styles.buttonContainer}
          onPress={hydrate ? handleHydrateToggle : handleTrackingToggle}>
          <Text
            style={[
              styles.buttonText,
              { color: isTracking ? Color.primaryColor : Color.gray },
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

      {showRevoke && (
        <Modal
          transparent={true}
          animationType="slide"
          visible={showRevoke}
          onRequestClose={() => setShowRevoke(false)}>
          <Pressable
            onPress={() => setShowRevoke(false)}
            style={styles.modalView}>
            <View style={styles.modalContainer}>
              <View style={{ marginHorizontal: scale(20) }}>
                <Text style={styles.modalTitle}>
                  Revoke Access to Physical Activity Data
                </Text>
                <Text style={styles.description}>
                  Revoke authorization forsynchronizing activities through
                  Google Fit.
                </Text>
              </View>
              <View style={styles.modalBtnView}>
                <TouchableOpacity onPress={() => setShowRevoke(false)}>
                  <Text style={styles.modalBtnTxt}>NOT NOW</Text>
                </TouchableOpacity>
                <TouchableOpacity onPress={handleRevokeAccess}>
                  <Text style={styles.modalBtnTxt}>CONTINUE</Text>
                </TouchableOpacity>
              </View>
            </View>
          </Pressable>
        </Modal>
      )}
    </SafeAreaView>
  );
};

export default OnOffFunctionality;

const styles = StyleSheet.create({
  header: {
    // alignSelf: 'flex-end',
    marginVertical: verticalScale(7),
    flexDirection: 'row',
    // justifyContent:'space-between',
    // backgroundColor:'red',
    paddingHorizontal:scale(10)
  },
  buttonContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: scale(10),
    paddingVertical: verticalScale(5),
    borderRadius: scale(10),
    backgroundColor: 'rgba(104, 161, 108, 0.3)',
  },
  buttonText: {
    color: Color.gray,
    fontWeight: '600',
    marginHorizontal: scale(8),
    fontSize: scale(14),
    fontFamily: Font.Poppins,
  },
  modalView: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: 'rgba(100,100,100,0.5)',
  },
  modalContainer: {
    width: '80%',
    paddingVertical: verticalScale(20),
    backgroundColor: Color.white,
    borderRadius: 10,
  },
  modalTitle: {
    fontSize: scale(16),
    color: Color.black,
  },
  modalBtnView: {
    flexDirection: 'row',
    justifyContent: 'flex-end',
    marginTop: verticalScale(10),
    marginHorizontal: scale(15),
  },
  modalBtnTxt: {
    letterSpacing: 1,
    fontSize: scale(12),
    color: Color.primaryColor,
    fontWeight: '600',
    marginHorizontal: scale(5),
  },
  description: {
    paddingVertical: verticalScale(5),
    color: Color.gray,
    fontSize: scale(13),
  },
  titleTxt: {
    color: Color?.textColor,
    fontFamily: Font?.Poppins,
    fontWeight: '500',
    fontSize: scale(16)
  }
});

