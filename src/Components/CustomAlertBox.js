import React from 'react';
import {Modal, View, Text, TouchableOpacity, StyleSheet} from 'react-native';
import {Font} from '../assets/styles/Fonts';
import AntDesign from 'react-native-vector-icons/AntDesign';
import {moderateScale, scale, verticalScale} from 'react-native-size-matters';
import {Color} from '../assets/styles/Colors';

const CustomAlertBox = ({visible, type, message, onClose, closeAlert}) => {
  const getColors = () => {
    switch (type) {
      case 'success':
        return {
          iconName: 'checkcircleo',
          title: 'Success!',
          borderColor: 'rgba(107, 203, 119, 0.2)',
          backgroundColor: 'rgba(107, 203, 119, 0.5)',
          iconColor: Color.primaryColor,
          textColor: Color.black,
          buttonColor: 'rgba(107, 203, 119, 1)',
        };
      case 'error':
        return {
          iconName: 'close',
          title: 'Error!',
          borderColor: 'rgba(224, 65, 65, 0.3)',
          backgroundColor: 'rgba(224, 65, 65, 0.8)',
          iconColor: Color.white,
          textColor: Color.black,
          buttonColor: 'rgba(224, 65, 65, 1)',
        };
      case 'warning':
        return {
          iconName: 'warning',
          title: 'Warning!',
          borderColor: 'rgba(224, 65, 65, 0.3)',
          backgroundColor: 'rgba(224, 65, 65, 0.8)',
          iconColor: Color.white,
          textColor: Color.black,
          buttonColor: 'rgba(224, 65, 65, 1)',
        };
      default:
        return {
          iconName: 'infocirlceo',
          title: 'Information',
          borderColor: 'rgba(0, 123, 255, 0.2)',
          backgroundColor: 'rgba(0, 123, 255, 0.5)',
          iconColor: Color.white,
          textColor: Color.black,
          buttonColor: 'rgba(0, 123, 255, 1)',
        };
    }
  };

  const colors = getColors();

  return (
    <Modal transparent animationType="fade" visible={visible}>
      <View style={styles.modalBackground}>
        <View style={styles.alertBox}>
          <TouchableOpacity
            onPress={closeAlert}
            style={{alignSelf: 'flex-end'}}>
            <AntDesign name="close" size={scale(25)} color={Color.black} />
          </TouchableOpacity>

          <View
            style={[
              styles.iconContainer,
              {
                borderColor: colors.borderColor,
                backgroundColor: colors.backgroundColor,
              },
            ]}>
            <AntDesign
              name={colors.iconName}
              size={scale(25)}
              color={colors.iconColor}
            />
          </View>

          <Text style={[styles.title, {color: colors.textColor}]}>
            {colors.title}
          </Text>

          <Text style={styles.message}>{message}</Text>

          <TouchableOpacity
            style={[styles.button, {borderColor: colors.buttonColor}]}
            onPress={onClose}>
            <Text style={[styles.buttonText, {color: colors.buttonColor}]}>
              OK
            </Text>
          </TouchableOpacity>
        </View>
      </View>
    </Modal>
  );
};

const styles = StyleSheet.create({
  modalBackground: {
    flex: 1,
    backgroundColor: 'rgba(0,0,0,0.5)',
    justifyContent: 'center',
    alignItems: 'center',
  },
  alertBox: {
    width: '80%',
    backgroundColor: Color.white,
    borderRadius: moderateScale(15),
    padding: moderateScale(20),
    alignItems: 'center',
    elevation: 10,
  },
  iconContainer: {
    width: scale(50),
    height: scale(50),
    borderRadius: scale(25),
    justifyContent: 'center',
    alignItems: 'center',
    marginBottom: verticalScale(15),
    borderWidth: scale(5),
    padding: scale(5),
  },
  title: {
    fontSize: moderateScale(20),
    marginBottom: verticalScale(5),
    fontFamily: Font.PoppinsSemiBold,
  },
  message: {
    fontSize: moderateScale(16),
    textAlign: 'center',
    marginBottom: verticalScale(20),
    color: Color.gray,
    fontFamily: Font.Poppins,
  },
  button: {
    width: '90%',
    padding: verticalScale(12),
    borderRadius: moderateScale(30),
    alignItems: 'center',
    backgroundColor: 'white',
    borderWidth: scale(1),
  },
  buttonText: {
    fontSize: moderateScale(16),
    fontFamily: Font.PoppinsSemiBold,
  },
});

export default CustomAlertBox;
