import React from 'react';
import {
  View,
  Text,
  Modal,
  Pressable,
  TouchableOpacity,
  StyleSheet,
} from 'react-native';
import {scale, verticalScale} from 'react-native-size-matters';
import Color from '../assets/colors/Colors';

const PickerModal = ({
  visible,
  onRequestClose,
  pressableClose,
  captureImagePress,
  chooseFilePress,
}) => {
  return (
    <Modal
      transparent={true}
      animationType="slide"
      visible={visible}
      onRequestClose={onRequestClose}>
      <Pressable onPress={pressableClose} style={styles.container}>
        <View style={styles.whiteContainer}>
          <Text style={styles.title}>Add profile photo</Text>
          <View style={styles.border} />
          <TouchableOpacity onPress={captureImagePress}>
            <Text style={styles.btnTxt}>Take Photo</Text>
          </TouchableOpacity>
          <TouchableOpacity onPress={chooseFilePress}>
            <Text style={[styles.btnTxt, {marginTop: verticalScale(15)}]}>
              Choose Photo
            </Text>
          </TouchableOpacity>
        </View>
      </Pressable>
    </Modal>
  );
};

export default PickerModal;

const styles = StyleSheet.create({
  container: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: 'rgba(100,100,100,0.5)',
  },
  whiteContainer: {
    width: '80%',
    backgroundColor: 'white',
    alignItems: 'center',
    borderRadius: scale(10),
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
