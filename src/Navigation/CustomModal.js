import React, {useState} from 'react';
import {View, Text, Modal, TouchableOpacity} from 'react-native';

const CustomModal = () => {
  const [isModalVisible, setModalVisible] = useState(false);

  const openModal = () => {
    setModalVisible(true);
  };

  const closeModal = () => {
    setModalVisible(false);
  };
  return (
    <Modal visible={isModalVisible} onRequestClose={closeModal}>
      <View
        style={{
          flex: 1,
          alignItems: 'center',
          justifyContent: 'center',
          backgroundColor: 'rgba(200,200,200,0.8)',
        }}>
        <Text>This is your modal content</Text>
        <TouchableOpacity onPress={closeModal}>
          <Text>Close Modal</Text>
        </TouchableOpacity>
      </View>
    </Modal>
  );
};

export default CustomModal;
