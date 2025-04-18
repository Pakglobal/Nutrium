import { SafeAreaView, StyleSheet, Text, View } from 'react-native';
import React from 'react';
import BackHeader from '../../../../Components/BackHeader';
import { Color } from '../../../../assets/styles/Colors';
import { scale } from 'react-native-size-matters';
import { useNavigation } from '@react-navigation/native';
import Header from '../../../../Components/Header';

const ShoppingList = () => {
  const navigation = useNavigation();
  return (
    <SafeAreaView style={{ flex: 1, backgroundColor: Color.white }}>
      {/* <BackHeader
        titleName={'Shopping lists'}
        onPressBack={() => navigation.goBack()}
        onPress={() => navigation.navigate('newShoppingLists')}
      /> */}
      <Header
        screenheader={true}
        screenName={'Shopping lists'}
        plus={true}
        handlePlus={() => navigation.navigate('newShoppingLists')}
      />
      <View style={{ marginHorizontal: scale(16) }}>
        <Text style={{ textAlign: 'center', padding: scale(20) }}>
          Create a shopping list to get started
        </Text>
      </View>
    </SafeAreaView>
  );
};

export default ShoppingList;

const styles = StyleSheet.create({});
