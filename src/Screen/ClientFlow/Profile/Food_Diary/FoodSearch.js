import React, {useEffect, useState} from 'react';
import {
  FlatList,
  Pressable,
  StyleSheet,
  Text,
  TextInput,
  TouchableOpacity,
  View,
} from 'react-native';
import {scale, verticalScale} from 'react-native-size-matters';
import {useNavigation} from '@react-navigation/native';
import {Color} from '../../../../assets/styles/Colors';
import AntDesign from 'react-native-vector-icons/AntDesign';
import {SearchFoodApi} from '../../../../Apis/ClientApis/FoodDiaryApi';
import {useSelector} from 'react-redux';

const FoodSearch = () => {
  const navigation = useNavigation();
  const [searchFood, setSearchFood] = useState('');
  const [searchFoodData, setSearchFoodData] = useState([]);
  const [filteredData, setFilteredData] = useState([]);

  const tokenId = useSelector(state => state?.user?.token);
  const guestTokenId = useSelector(state => state?.user?.guestToken);
  const token = tokenId?.token || guestTokenId?.token;

  useEffect(() => {
    const fetchFoodData = async () => {
      const response = await SearchFoodApi(token);
      if (response?.success === true) {
        setSearchFoodData(response?.foods);
        setFilteredData(response?.foods);
      }
    };
    fetchFoodData();
  }, []);

  const handleSearch = text => {
    setSearchFood(text);
    if (text?.length > 0) {
      const filtered = searchFoodData.filter(item =>
        item?.name?.toLowerCase()?.includes(text?.toLowerCase()),
      );
      setFilteredData(filtered);
    } else {
      setFilteredData(searchFoodData);
    }
  };

  const handleSearchPress = name => {
    navigation.navigate('swapMeal', {data: name});
  };

  return (
    <View style={{flex: 1, backgroundColor: Color.white}}>
      <View style={{marginHorizontal: scale(16)}}>
        <View style={styles.searchContainer}>
          <TextInput
            placeholder="Search foods..."
            placeholderTextColor={Color.gray}
            value={searchFood}
            onChangeText={handleSearch}
            style={styles.inputView}
          />
          <Pressable
            style={{marginEnd: scale(10)}}
            onPress={() => handleSearch('')}>
            <AntDesign
              name="closecircle"
              size={verticalScale(22)}
              color={Color.primaryColor}
            />
          </Pressable>
        </View>

        {searchFood ? (
          <FlatList
            data={filteredData}
            keyExtractor={(item, index) =>
              item?.id?.toString() || `food-item-${index}`
            }
            renderItem={({item}) => (
              <TouchableOpacity
                style={styles.foodItem}
                onPress={() => handleSearchPress(item?.name)}>
                <Text style={{color: Color.black}}>{item?.name}</Text>
              </TouchableOpacity>
            )}
            ListEmptyComponent={() => (
              <View style={{padding: scale(20), alignItems: 'center'}}>
                <Text style={{color: Color.black}}>
                  {searchFood.trim()
                    ? 'No matching food found'
                    : 'No activities available'}
                </Text>
              </View>
            )}
          />
        ) : null}
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
    width: '85%',
  },
  foodItem: {
    paddingVertical: verticalScale(10),
    borderRadius: scale(10),
    paddingHorizontal: scale(10),
  },
});
