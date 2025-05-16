import {Modal, StyleSheet, Text, TouchableOpacity, View} from 'react-native';
import React, {useState} from 'react';
import {scale, verticalScale} from 'react-native-size-matters';
import {Font} from '../assets/styles/Fonts';
import {Color} from '../assets/styles/Colors';
import CustomShadow from './CustomShadow';

const ModalComponent = ({
  visible,
  setModalVisible,
  handleEdit,
  handleDelete,
  modalstyle,
  highlightEdit,
  highlightCancel,
  handleCancel,
  cancelmodalstyle,
}) => {
  const [confirmDeleteVisible, setConfirmDeleteVisible] = useState(false);

  const handleDeletePress = () => setConfirmDeleteVisible(true);
  const confirmDelete = () => {
    handleDelete();
    setConfirmDeleteVisible(false);
    setModalVisible();
  };
  const cancelDelete = () => {
    setConfirmDeleteVisible(false);
    setModalVisible();
  };

  const modalOptions = [
    {
      key: 'edit',
      label: 'Edit',
      onPress: handleEdit,
      highlight: highlightEdit,
    },
    {
      key: 'delete',
      label: 'Delete',
      onPress: handleDeletePress,
      highlight: false,
    },
    {
      key: 'cancel',
      label: 'Cancel',
      onPress: handleCancel,
      highlight: highlightCancel,
    },
  ];

  return (
    <View>
      <Modal
        transparent
        visible={visible}
        animationType="none"
        onRequestClose={setModalVisible}>
        <TouchableOpacity
          style={styles.modalOverlay}
          activeOpacity={1}
          onPress={setModalVisible}>
          <View style={[styles.modalContent, modalstyle]}>
            {modalOptions.map(({key, label, onPress, highlight}) => (
              <TouchableOpacity
                key={key}
                style={styles.modalOption}
                onPress={onPress}>
                <View
                  style={[
                    {width: scale(100), height: 25, alignItems: 'center'},
                    highlight && {backgroundColor: Color.primaryLight},
                  ]}>
                  <Text
                    style={[
                      styles.modalText,
                      highlight && {color: Color.primaryColor},
                    ]}>
                    {label}
                  </Text>
                </View>
              </TouchableOpacity>
            ))}
          </View>
        </TouchableOpacity>
      </Modal>

      <Modal
        transparent
        visible={confirmDeleteVisible}
        animationType="fade"
        onRequestClose={cancelDelete}>
        <TouchableOpacity
          style={styles.modalOverlay}
          activeOpacity={1}
          onPress={cancelDelete}>
          <View
            style={[
              styles.modalContent,
              cancelmodalstyle,
              {width: scale(170)},
            ]}>
            <Text
              style={[styles.modalText, {marginVertical: verticalScale(10)}]}>
              Are you sure you want to delete?
            </Text>

            <View>
              <TouchableOpacity
                style={styles.confirmButton}
                onPress={confirmDelete}>
                <Text style={styles.modalText}>Yes</Text>
              </TouchableOpacity>

              <TouchableOpacity
                style={[
                  styles.confirmButton,
                  {backgroundColor: Color.primaryLight},
                ]}
                onPress={cancelDelete}>
                <Text style={styles.modalText}>No</Text>
              </TouchableOpacity>
            </View>
          </View>
        </TouchableOpacity>
      </Modal>
    </View>
  );
};

export default ModalComponent;

const styles = StyleSheet.create({
  modalOverlay: {
    flex: 1,
    backgroundColor: 'rgba(0, 0, 0, 0.3)',
    justifyContent: 'flex-end',
    alignItems: 'flex-end',
    paddingRight: scale(10),
    paddingBottom: verticalScale(120),
  },
  modalContent: {
    backgroundColor: Color.white,
    borderRadius: scale(10),
    width: scale(120),
    overflow: 'hidden',
    position: 'absolute',
    right: 5,
  },
  modalOption: {
    paddingVertical: verticalScale(5),
    alignItems: 'center',
    justifyContent: 'center',
    alignSelf: 'center',
  },
  modalText: {
    fontSize: scale(14),
    color: Color.textColor,
    fontWeight: '400',
    fontFamily: Font?.PoppinsMedium,
    textAlign: 'center',
    marginTop: 2,
  },
  confirmButton: {
    paddingVertical: verticalScale(5),
    alignItems: 'center',
    justifyContent: 'center',
    alignSelf: 'center',
    backgroundColor: Color.primaryLight,
    borderRadius: scale(5),
    borderBottomWidth: 0,
    paddingHorizontal: scale(20),
    width: scale(120),
    marginVertical: 2,
  },
});
