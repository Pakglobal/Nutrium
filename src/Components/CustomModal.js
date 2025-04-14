import React from 'react';
import {
  Modal,
  View,
  Text,
  TouchableOpacity,
  Pressable,
  StyleSheet,
} from 'react-native';
import {scale, verticalScale} from 'react-native-size-matters';
import {Color} from '../assets/styles/Colors';

const CustomModal = ({
  visible,
  onClose,
  onConfirm,
  title,
  message,
  confirmText = 'CONTINUE',
  cancelText = 'NOT NOW',
}) => {
  return (
    <Modal
      transparent={true}
      animationType="slide"
      visible={visible}
      onRequestClose={onClose}>
      <Pressable onPress={onClose} style={styles.modalView}>
        <View style={styles.modalContainer}>
          <View style={{marginHorizontal: scale(20)}}>
            <Text style={styles.modalTitle}>
              Revoke Access to Physical Activity Data
            </Text>
            <Text style={styles.description}>
              Revoke authorization for synchronizing activities through Google
              Fit.
            </Text>
          </View>
          <View style={styles.modalBtnView}>
            <TouchableOpacity onPress={onClose}>
              <Text style={styles.modalBtnTxt}>NOT NOW</Text>
            </TouchableOpacity>
            <TouchableOpacity onPress={onConfirm}>
              <Text style={styles.modalBtnTxt}>CONTINUE</Text>
            </TouchableOpacity>
          </View>
        </View>
      </Pressable>
    </Modal>
  );
};

const styles = StyleSheet.create({
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
});

export default CustomModal;
