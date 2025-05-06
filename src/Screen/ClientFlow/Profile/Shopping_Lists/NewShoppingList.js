import {
  FlatList,
  SafeAreaView,
  StyleSheet,
  Text,
  TouchableOpacity,
  View,
} from 'react-native';
import React from 'react';
import {scale, verticalScale} from 'react-native-size-matters';
import {Color} from '../../../../assets/styles/Colors';
import {useNavigation} from '@react-navigation/native';
import Header from '../../../../Components/Header';

const NewShoppingList = () => {
  const navigation = useNavigation();
  const number = [
    {
      id: 0,
      title: '1',
    },
    {
      id: 1,
      title: '2',
    },
    {
      id: 2,
      title: '3',
    },
    {
      id: 3,
      title: '4',
    },
    {
      id: 4,
      title: '5',
    },
  ];

  return (
    <SafeAreaView style={{flex: 1, backgroundColor: Color.white}}>
      <TouchableOpacity onPress={() => navigation.navigate('myLists')}>
        <Header
          screenheader={true}
          screenName={'New shopping lists'}
        />

        <View style={{marginHorizontal: scale(16)}}>
          <View style={styles.cardContainer}>
            <Text style={styles.title}>Create automatic list</Text>
            <Text style={styles.text}>
              Select the number of weeks to include in the shopping list
            </Text>

            <FlatList
              horizontal
              scrollEnabled={false}
              showsHorizontalScrollIndicator={false}
              data={number}
              renderItem={({item}) => (
                <View style={styles.numerContainer}>
                  <Text>{item?.title}</Text>
                </View>
              )}
            />
          </View>

          <View style={styles.cardContainer}>
            <Text
              style={{
                color: Color.black,
                fontSize: scale(15),
                fontWeight: '600',
                marginVertical: verticalScale(5),
              }}>
              Create manual list
            </Text>
            <Text style={{color: Color.gray, fontSize: scale(14)}}>
              A new empty list will be created so you can add new products
            </Text>
          </View>
        </View>
      </TouchableOpacity>
    </SafeAreaView>
  );
};

export default NewShoppingList;

const styles = StyleSheet.create({
  cardContainer: {
    backgroundColor: Color.common,
    marginTop: verticalScale(20),
    borderRadius: scale(15),
    padding: scale(15),
  },
  title: {
    color: Color.black,
    fontSize: scale(15),
    fontWeight: '600',
    marginVertical: verticalScale(5),
  },
  text: {
    color: Color.gray,
    fontSize: scale(14),
  },
  numerContainer: {
    padding: scale(16),
    backgroundColor: 'rgba(rgba(241,241,249,1)',
    borderRadius: scale(10),
    marginHorizontal: scale(8),
    marginVertical: verticalScale(10),
  },
});
