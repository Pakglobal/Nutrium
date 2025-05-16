import React, { useState } from 'react';
import {
  View,
  Text,
  Pressable,
  TextInput,
  StyleSheet,
  Modal,
  TouchableWithoutFeedback,
  TouchableOpacity,
} from 'react-native';
import { scale, verticalScale } from 'react-native-size-matters';
import { useNavigation } from '@react-navigation/native';
import { Color } from '../../../../assets/styles/Colors';
import { useDispatch } from 'react-redux';
import Header from '../../../../Components/Header';
import { Font } from '../../../../assets/styles/Fonts';

const SwapMeal = ({ route }) => {
  const foodName = route?.params?.data;

  const dispatch = useDispatch();

  const navigation = useNavigation();
  const [quantity, setQuantity] = useState('1');
  const [selectedSize, setSelectedSize] = useState('portion');
  const [modalVisible, setModalVisible] = useState(false);

  const data = {
    name: foodName,
    size: selectedSize,
    quantity: quantity,
  };

  const handleSave = () => {
    navigation.navigate('logMeal');
  };

  const sizeOption = [
    { id: 0, title: 'Grams' },
    { id: 1, title: 'Portion' },
  ];

  const selectSize = size => {
    setSelectedSize(size);
    setModalVisible(false);
  };

  const handleAddFood = () => {
    const foodData = {
      mealType: route.params.type,
      mealTime: route.params.time,
      quantity: quantity,
      size: selectedSize,
      name: foodName || 'Food Item',
    };

    navigation.navigate('logMeal', {
      type: route.params.type,
      time: route.params.time,
      id: route.params.mealId,
    });
  };

  return (
    <View style={{ flex: 1, backgroundColor: Color.white }}>
      <Header
        screenheader={true}
        screenName={'Log your meal'}
        // screenName={'Swap a food'}
        plus={false}
        handleSave={() => handleSave()}
      />
      <View style={{ marginHorizontal: scale(16) }}>
        <Text style={styles.title}>Add food</Text>

        {foodName ? (
          <View>
            <Pressable
              onPress={() => navigation.navigate('foodSearch')}
              style={styles.borderview}>
              <Text style={styles.optionTxt}>Food</Text>
              <Text style={styles.fieldTxt}>{foodName}</Text>
            </Pressable>
            <View style={styles.borderview}>
              <Text style={styles.optionTxt}>Serving size</Text>
              <Pressable onPress={() => setModalVisible(true)}>
                <Text style={styles.fieldTxt}>{selectedSize}</Text>
              </Pressable>
            </View>
            <View style={styles.borderview}>
              <Text style={styles.optionTxt}>Quantity</Text>
              <TextInput
                onChangeText={txt => setQuantity(txt)}
                value={quantity}
                maxLength={6}
                style={styles.fieldTxt}
                placeholder="quantity  "
                placeholderTextColor={Color.black}
                keyboardType="numeric"
              />
            </View>
          </View>
        ) : (
          <View>
            <Pressable
              onPress={() => navigation.navigate('foodSearch')}
              style={styles.border}>
              <Text style={styles.optionTxt}>Choose a food</Text>
            </Pressable>
            <View style={styles.border}>
              <Text style={styles.optionTxt}>Choose serving size</Text>
            </View>
            <View style={styles.border}>
              <Text style={styles.optionTxt}>Quantity</Text>
            </View>
          </View>
        )}
      </View>

      <Modal
        visible={modalVisible}
        transparent={true}
        onRequestClose={() => setModalVisible(false)}>
        <TouchableWithoutFeedback onPress={() => setModalVisible(false)}>
          <View style={styles.modalOverlay}>
            <View style={styles.modalContent}>
              <Text style={styles.modalTitle}>Choose serving size</Text>

              {sizeOption.map((size, index) => (
                <TouchableOpacity
                  key={index}
                  onPress={() => selectSize(size.title)}
                  style={styles.optionButton}>
                  <Text style={styles.optionText}>{size.title}</Text>
                </TouchableOpacity>
              ))}
            </View>
          </View>
        </TouchableWithoutFeedback>
      </Modal>
    </View>
  );
};

export default SwapMeal;
const styles = StyleSheet.create({
  title: {
    fontSize: scale(14),
    color: Color.textColor,
    marginTop: verticalScale(20),
    fontFamily: Font?.PoppinsMedium,
  },
  optionTxt: {
    fontSize: scale(14),
    color: Color.txt,
    marginVertical: verticalScale(15),
    fontFamily: Font?.Poppins,
  },
  borderview: {
    borderBottomColor: Color.borderColor,
    borderBottomWidth: 1,
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  fieldTxt: {
    fontSize: scale(13),
    fontWeight: '500',
    color: Color.black,
    fontFamily: Font?.Poppins,
    // width:'50%'
  },
  border: {
    borderBottomColor: Color.borderColor,
    borderBottomWidth: 1,
  },
  modalOverlay: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: 'rgba(0,0,0,0.5)',
  },
  modalContent: {
    backgroundColor: '#fff',
    padding: 20,
    borderRadius: 10,
    width: '80%',
  },
  modalTitle: {
    fontSize: 16,
    fontWeight: 'bold',
    marginBottom: 10,
    color: '#000',
  },
  optionButton: {
    padding: 10,
    borderColor: '#ddd',
  },
  optionText: {
    fontSize: 14,
    color: '#000',
  },
});
