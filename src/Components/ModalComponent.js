import { Modal, StyleSheet, Text, TouchableOpacity, View } from 'react-native'
import React, { useState } from 'react'
import { scale, verticalScale } from 'react-native-size-matters';
import { Font } from '../assets/styles/Fonts';
import { Color } from '../assets/styles/Colors';



const ModalComponent = ({
    visible,
    setModalVisible,
    handleEdit,
    handleDelete,
    modalstyle
}) => {
    return (
        <Modal
            transparent={true}
            visible={visible}
            animationType="fade"
            onRequestClose={setModalVisible}>
            <TouchableOpacity
                style={styles.modalOverlay}
                activeOpacity={1}
                onPress={setModalVisible}>
                <View
                    style={[
                        styles.modalContent,
                    modalstyle
                    ]}>
                    <TouchableOpacity
                        style={styles.modalOption}
                        onPress={handleEdit}>
                        <Text style={[styles.modalText,]}>Edit</Text>
                    </TouchableOpacity>

                    <TouchableOpacity
                        style={styles.modalOption}
                        onPress={handleDelete}>
                        <Text style={styles.modalText}>Delete</Text>
                    </TouchableOpacity>

                    <TouchableOpacity
                        style={styles.modalOption}
                        onPress={setModalVisible}>
                        <Text style={styles.modalText}>Cancel</Text>
                    </TouchableOpacity>
                </View>
            </TouchableOpacity>
        </Modal>
    )
}

export default ModalComponent

const styles = StyleSheet.create({

    modalOverlay: {
        flex: 1,
        backgroundColor: 'rgba(0, 0, 0, 0.1)',
    },
    modalContent: {
        backgroundColor: '#fff',
        borderRadius: scale(5),
        width: scale(100),
        shadowColor: "#000",
        shadowOffset: {
            width: 0,
            height: 2,
        },
        shadowOpacity: 0.25,
        shadowRadius: 3.84,
        elevation: 5,
        overflow: 'hidden',
    },
    modalOption: {
        paddingVertical: verticalScale(5),
        paddingHorizontal: scale(10),
        alignSelf: 'center'
    },
    modalText: {
        fontSize: scale(12),
        color: Color.textColor,
        fontWeight: "500",
        fontFamily: Font?.Poppins
    },
})