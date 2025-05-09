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
          borderColor: 'rgba(107, 203, 119, 0.2)',
          backgroundColor: 'rgba(107, 203, 119, 0.5)',
          iconColor: Color.primaryColor,
          textColor: Color?.black,
          buttonBorder: Color?.primaryColor,
          buttonText: Color?.primaryColor,
          iconName: 'check',
          title: 'Success!',
        };
      case 'warning':
        return {
          iconName: 'warning',
          title: 'Warning!',
          borderColor: '#F246462B',
          backgroundColor: 'rgba(242, 70, 70, 1)',
          iconColor: '#F24646',
          textColor: Color?.textColor,
          buttonBorder: '#F24646',
          buttonText: '#F24646',
        };
      default:
        return {
          borderColor: '#F246462B',
          backgroundColor: '#F2464650',
          iconColor: '#F24646',
          textColor: Color?.textColor,
          buttonBorder: '#F24646',
          buttonText: '#F24646',
          iconName: 'close',
          title: 'Error!',
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
            <AntDesign name="close" size={25} color={Color?.black} />
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
              size={25}
              color={colors.iconColor}
            />
          </View>

          <Text style={[styles.title, {color: colors.textColor}]}>
            {colors.title}
          </Text>

          <Text style={styles.message}>{message}</Text>

          <TouchableOpacity
            style={[styles.button, {borderColor: colors.buttonBorder}]}
            onPress={onClose}>
            <Text style={[styles.buttonText, {color: colors.buttonText}]}>
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
    height: verticalScale(50),
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
    fontFamily: Font?.PoppinsSemiBold,
  },
  message: {
    fontSize: moderateScale(16),
    textAlign: 'center',
    marginBottom: verticalScale(20),
    color: Color?.gray,
    fontFamily: Font?.Poppins,
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
    fontFamily: Font?.PoppinsSemiBold,
  },
});

export default CustomAlertBox;
