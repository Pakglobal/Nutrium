import {Modal, StyleSheet, Text, TouchableOpacity, View} from 'react-native';
import React from 'react';
import Color from '../assets/colors/Colors';
import {scale, verticalScale} from 'react-native-size-matters';

const CustomAlert = ({
  visible,
  message,
  onClose,
  singleButton = false,
  doubleButton = false,
}) => {
  return (
    <Modal transparent={true} visible={visible} animationType="fade">
      <View style={styles.overlay}>
        <View style={styles.alertBox}>
          <View
            style={{
              alignItems: 'center',
              paddingTop: verticalScale(12),
              paddingBottom: verticalScale(5),
            }}>
            <Text
              style={{
                color: Color.black,
                fontSize: scale(16),
                fontWeight: '700',
              }}>
              Error
            </Text>
          </View>
          <View style={{padding: scale(10)}}>
            <Text style={styles.message}>{message}</Text>
          </View>

          {singleButton && (
            <View
              style={{
                width: '100%',
                borderTopColor: 'gray',
                borderTopWidth: 1,
              }}>
              <TouchableOpacity
                onPress={onClose}
                style={{
                  width: '100%',
                  padding: scale(10),
                }}>
                <Text style={{alignSelf: 'center', color: Color.black}}>
                  OK
                </Text>
              </TouchableOpacity>
            </View>
          )}
          {doubleButton && (
            <View
              style={{
                flexDirection: 'row',
                alignItems: 'center',
                justifyContent: 'space-between',
                width: '100%',
                borderTopColor: 'gray',
                borderTopWidth: 1,
              }}>
              <TouchableOpacity
                onPress={onClose}
                style={{
                  width: '50%',
                  padding: scale(10),
                  borderRightWidth: 1,
                  borderRightColor: 'gray',
                }}>
                <Text style={{alignSelf: 'center', color: Color.black}}>
                  CANCEL
                </Text>
              </TouchableOpacity>

              <TouchableOpacity
                onPress={onClose}
                style={{
                  width: '50%',
                  padding: scale(10),
                  borderLeftWidth: 1,
                  borderLeftColor: 'gray',
                }}>
                <Text style={{alignSelf: 'center', color: Color.black}}>
                  OK
                </Text>
              </TouchableOpacity>
            </View>
          )}
        </View>
      </View>
    </Modal>
  );
};
export default CustomAlert;

const styles = StyleSheet.create({
  container: {flex: 1, justifyContent: 'center', alignItems: 'center'},
  showButton: {
    padding: 10,
    backgroundColor: Color.primaryGreen,
    borderRadius: 5,
  },
  showButtonText: {color: 'white', fontSize: 16},
  overlay: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: 'rgba(0,0,0,0.5)',
  },
  alertBox: {
    width: '60%',
    backgroundColor: Color.primary,
    borderRadius: scale(10),
  },
  message: {
    fontSize: scale(14),
    textAlign: 'center',
    paddingBottom: verticalScale(10),
    color: Color.black,
  },
  button: {
    backgroundColor: Color.primaryGreen,
    padding: 10,
    borderRadius: 5,
    marginTop: 10,
  },
  buttonText: {color: 'white', fontSize: 16},
});
