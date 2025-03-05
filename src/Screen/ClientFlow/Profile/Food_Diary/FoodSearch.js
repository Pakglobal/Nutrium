import React, {useState} from 'react';
import {
  Pressable,
  StyleSheet,
  Text,
  TextInput,
  TouchableOpacity,
  View,
} from 'react-native';
import {scale, verticalScale} from 'react-native-size-matters';
import {useNavigation} from '@react-navigation/native';
import Color from '../../../../assets/colors/Colors';
import BackHeader from '../../../../Components/BackHeader';
import AntDesign from 'react-native-vector-icons/AntDesign';

const FoodSearch = () => {
  const navigation = useNavigation();
  const [searchFood, setSeachFood] = useState('');
  const [input, setInput] = useState(false);

  const handleSave = () => {
    console.log('save');
  };

  const handleSearch = () => {
    setInput(false)
    console.log('search');
  };

  console.log(searchFood);
  

  return (
    <View style={{flex: 1, backgroundColor: Color.primary}}>
      <BackHeader
        onPressBack={() => navigation.goBack()}
        titleName="Food search"
        backText="Swap a food"
        onSave={true}
        onPress={() => handleSave()}
      />
      <View style={{marginHorizontal: scale(16)}}>
        <View style={styles.searchContainer}>
          <TextInput
            placeholder="Search foods..."
            placeholderTextColor={Color.gray}
            value={searchFood}
            onChangeText={txt => setSeachFood(txt)}
            style={styles.inputView}
          />
          <Pressable
            style={{marginEnd: scale(10)}}
            onPress={() => setSeachFood('')}>
            <AntDesign
              name="closecircle"
              size={verticalScale(22)}
              color={Color.primaryGreen}
            />
          </Pressable>
        </View>

        {searchFood && (
            <TouchableOpacity
            style={styles.displaySearchContainer}
            activeOpacity={0.5}
            onPress={() => handleSearch()}>
            <Text
              style={{
                  color: Color.primary,
                  fontSize: scale(14),
                  fontWeight: '500',
                  textAlign: 'center',
                }}>
              Click here to search for "{searchFood}"
            </Text>
          </TouchableOpacity>
        )}
      </View>
    </View>
  );
};

export default FoodSearch;

const styles = StyleSheet.create({
  searchContainer: {
    paddingVertical: verticalScale(2),
    width: '100%',
    borderRadius: scale(20),
    backgroundColor: Color.headerBG,
    marginTop: verticalScale(20),
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  inputView: {
    marginStart: scale(10),
    fontSize: scale(13),
    fontWeight: '600',
    color: Color.txt,
    width: '85%'
  },
  displaySearchContainer: {
    paddingVertical: verticalScale(10),
    backgroundColor: Color.secondary,
    borderRadius: scale(20),
    marginTop: verticalScale(15),
    alignItems: 'center',
    width: '100%',
  },
});
