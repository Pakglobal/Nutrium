import {
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
import Color, { Font } from '../assets/colors/Colors';
import Ionicons from 'react-native-vector-icons/Ionicons';

const OnOffFunctionality = ({ title, hydrate = false,style }) => {
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
        if (userInfo) {
          setIsTracking(true);
        }
      } catch (error) {
        console.error('Error in Google Sign-in:', error);
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
    <SafeAreaView style={style} >
      <View style={styles.header}>
        <View style={{}} >
        <Text style={styles.title}>{title}</Text>
        </View>
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
            name="notifications"
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
  title: {
    fontSize: scale(15),
    fontWeight: '500',
    color: Color.txt,
    // marginHorizontal: scale(16),
    // marginTop: verticalScale(10),
  },
  header: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    // marginTop: verticalScale(8),
    width:'95%',
    alignSelf:"center",
    // backgroundColor:"lightgray",
  },
  buttonContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingVertical: verticalScale(2.5),
    // marginHorizontal: scale(16),
    borderRadius: scale(9),
    backgroundColor: '#68A16C4D',
    justifyContent: 'space-evenly',
    width: '18%',
    // elevation: 1,
    marginVertical:scale(3)
  },
  buttonText: {
    color: Color.gray,
    fontWeight: '600',
    marginStart: scale(5),
    fontFamily:Font?.Nunito
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
    // backgroundColor: 'white',
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
    color: Color.primaryGreen,
    fontWeight: '600',
    marginHorizontal: scale(5),
  },
  description: {
    paddingVertical: verticalScale(5),
    color: Color.gray,
    fontSize: scale(13),
  },
});
