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
import CustomShadow from '../../../../Components/CustomShadow';
import {Font} from '../../../../assets/styles/Fonts';

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
      <Header
        screenheader={true}
        screenName={'New shopping lists'}
        rightHeaderButton={false}
      />

      <View style={{marginHorizontal: scale(16)}}>
        <CustomShadow>
          <TouchableOpacity
            activeOpacity={1}
            onPress={() => navigation.navigate('myLists')}>
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
                  <CustomShadow radius={1} color={Color?.gray}>
                    <View style={styles.numerContainer}>
                      <Text>{item?.title}</Text>
                    </View>
                  </CustomShadow>
                )}
              />
            </View>
          </TouchableOpacity>
        </CustomShadow>

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
    </SafeAreaView>
  );
};

export default NewShoppingList;

const styles = StyleSheet.create({
  cardContainer: {
    backgroundColor: Color.white,
    marginTop: verticalScale(20),
    borderRadius: scale(15),
    padding: scale(10),
  },
  title: {
    color: Color.black,
    fontSize: scale(15),
    marginVertical: verticalScale(5),
    fontFamily: Font?.PoppinsMedium,
  },
  text: {
    color: Color.gray,
    fontSize: scale(14),
  },
  numerContainer: {
    padding: scale(16),
    backgroundColor: Color?.white,
    borderRadius: scale(10),
    marginHorizontal: scale(8),
    marginVertical: verticalScale(10),
  },
});
