import React, {useState} from 'react';
import {View, Text, Pressable, TextInput, StyleSheet} from 'react-native';
import {scale, verticalScale} from 'react-native-size-matters';
import {useNavigation} from '@react-navigation/native';
import Color from '../../../../assets/colors/Colors';
import BackHeader from '../../../../Components/BackHeader';

const SwapMeal = () => {
  const navigation = useNavigation();
  const [showData, setShowData] = useState(false);
  const [quantity, setQuantity] = useState('');

  const handleSave = () => {
    console.log('save');
  };
  return (
    <View style={{flex: 1, backgroundColor: Color.primary}}>
      <BackHeader
        onPressBack={() => navigation.goBack()}
        titleName="Swap a food"
        backText="Log your meal"
        onSave={true}
        onPress={() => handleSave()}
      />
      <View style={{marginHorizontal: scale(16)}}>
        <Text style={styles.title}>Add food</Text>
        {showData ? (
          <View>
            <Pressable
              onPress={() => navigation.navigate('foodSearch')}
              style={styles.borderview}>
              <Text style={styles.optionTxt}>Food</Text>
              <Text style={styles.fieldTxt}>Bread,chapati or roti....</Text>
            </Pressable>
            <View style={styles.borderview}>
              <Text style={styles.optionTxt}>Serving size</Text>
              <Pressable>
                <Text style={styles.fieldTxt}>Piece</Text>
              </Pressable>
            </View>
            <View style={styles.borderview}>
              <Text style={styles.optionTxt}>Quantity</Text>
              <TextInput
                onChangeText={txt => setQuantity(txt)}
                value={quantity}
                maxLength={6}
                style={styles.fieldTxt}
                placeholder="qua"
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
    </View>
  );
};

export default SwapMeal;
const styles = StyleSheet.create({
  title: {
    fontSize: scale(14),
    fontWeight: '600',
    color: Color.gray,
    marginTop: verticalScale(20),
  },
  optionTxt: {
    fontSize: scale(14),
    color: Color.txt,
    marginVertical: verticalScale(15),
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
  },
  border: {
    borderBottomColor: Color.borderColor,
    borderBottomWidth: 1,
  },
});
