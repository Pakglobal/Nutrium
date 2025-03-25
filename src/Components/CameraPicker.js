import React, {useState} from 'react';
import {
  View,
  Modal,
  TouchableOpacity,
  Text,
  StyleSheet,
  Pressable,
  PermissionsAndroid,
  Platform,
} from 'react-native';
import {launchCamera, launchImageLibrary} from 'react-native-image-picker';
import {verticalScale, scale} from 'react-native-size-matters';
import Color from '../assets/colors/Colors';

const CameraPicker = ({visible, onClose, onImageSelect}) => {
  const requestCameraPermission = async () => {
    if (Platform.OS === 'android') {
      try {
        const granted = await PermissionsAndroid.request(
          PermissionsAndroid.PERMISSIONS.CAMERA,
          {
            title: 'Camera Permission',
            message: 'App needs camera permission',
          },
        );
        return granted === PermissionsAndroid.RESULTS.GRANTED;
      } catch (err) {
        console.warn(err);
        return false;
      }
    } else return true;
  };

  const requestStoragePermission = async () => {
    if (Platform.OS === 'android') {
      try {
        const granted = await PermissionsAndroid.request(
          PermissionsAndroid.PERMISSIONS.WRITE_EXTERNAL_STORAGE,
          {
            title: 'Storage Permission',
            message: 'App needs storage permission',
          },
        );
        return granted === PermissionsAndroid.RESULTS.GRANTED;
      } catch (err) {
        console.warn(err);
        return false;
      }
    } else return true;
  };

  const captureImage = async () => {
    onClose();
    let options = {
      mediaType: 'photo',
      maxWidth: 300,
      maxHeight: 550,
      quality: 1,
      saveToPhotos: true,
    };
    let isCameraPermitted = await requestCameraPermission();
    let isStoragePermitted = await requestStoragePermission();
    if (isCameraPermitted && isStoragePermitted) {
      launchCamera(options, response => {
        if (!response?.didCancel && !response?.errorCode) {
          onImageSelect(response?.assets[0]);
        }
      });
    }
  };

  const chooseFile = () => {
    onClose();
    let options = {
      mediaType: 'photo',
      maxWidth: 300,
      maxHeight: 550,
      quality: 1,
    };
    launchImageLibrary(options, response => {
      if (!response?.didCancel && !response?.errorCode) {
        onImageSelect(response?.assets[0]);
      }
    });
  };

  return (
    <Modal
      transparent={true}
      animationType="slide"
      visible={visible}
      onRequestClose={onClose}>
      <Pressable onPress={onClose} style={styles.container}>
        <View style={styles.whiteContainer}>
          <Text style={styles.title}>Add profile photo</Text>
          <View style={styles.border} />
          <TouchableOpacity onPress={captureImage}>
            <Text style={styles.btnTxt}>Take Photo</Text>
          </TouchableOpacity>
          <TouchableOpacity onPress={chooseFile}>
            <Text style={[styles.btnTxt, {marginTop: verticalScale(15)}]}>
              Choose Photo
            </Text>
          </TouchableOpacity>
        </View>
      </Pressable>
    </Modal>
  );
};

export default CameraPicker;

const styles = StyleSheet.create({
  container: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: 'rgba(100,100,100,0.7)',
  },
  whiteContainer: {
    width: '65%',
    backgroundColor: 'white',
    alignItems: 'center',
    paddingVertical: verticalScale(15),
  },
  title: {
    fontSize: verticalScale(14),
    fontWeight: '700',
    color: Color.txt,
    marginBottom: verticalScale(10),
  },
  border: {
    borderBottomColor: Color.borderColor,
    borderBottomWidth: 1,
    width: '100%',
    marginBottom: verticalScale(10),
  },
  btnTxt: {
    fontSize: verticalScale(14),
    fontWeight: '600',
    color: Color.gray,
  },
});
