import React from 'react';
import {Modal, View, Text, TouchableOpacity, StyleSheet} from 'react-native';
import {Font} from '../assets/styles/Fonts';
import AntDesign from 'react-native-vector-icons/AntDesign';
import {scale} from 'react-native-size-matters';
import {Color} from '../assets/styles/Colors';

const CustomAlertBox = ({visible, type, message, onClose, closeAlert}) => {
  const getColors = () => {
    switch (type) {
      case 'success':
        return {
          borderColor: '#26B8872B',
          backgroundColor: '#26B88789',
          iconColor: '#21972b',
          textColor: Color?.black,
          buttonBorder: '#26B887',
          buttonText: '#26B887',
          iconName: 'check',
          title: 'Success!',
        };
      case 'warning':
        return {
          iconName: 'warning',
          title: 'Warning!',
          borderColor: '#F246462B',
          backgroundColor: '#F2464650',
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
    backgroundColor: '#fff',
    borderRadius: 15,
    padding: 20,
    alignItems: 'center',
    elevation: 10,
  },
  iconContainer: {
    width: 50,
    height: 50,
    borderRadius: 25,
    justifyContent: 'center',
    alignItems: 'center',
    marginBottom: 15,
    borderWidth: scale(5),
    borderRadius: scale(50),
    padding: scale(5),
  },
  title: {
    fontSize: 20,
    fontWeight: 'bold',
    marginBottom: 5,
    fontFamily: Font?.PoppinsMedium,
  },
  message: {
    fontSize: 16,
    textAlign: 'center',
    marginBottom: 20,
    color: Color?.gray,
    fontFamily: Font?.Poppins,
  },
  button: {
    width: '90%',
    padding: 12,
    borderRadius: 30,
    alignItems: 'center',
    backgroundColor: 'white',
    borderWidth: 1,
  },
  buttonText: {
    fontSize: 16,
    fontWeight: 'bold',
    fontFamily: Font?.PoppinsMedium,
  },
});

export default CustomAlertBox;
