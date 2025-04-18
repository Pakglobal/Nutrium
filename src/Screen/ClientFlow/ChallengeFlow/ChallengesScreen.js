import { SafeAreaView, StyleSheet, Text, TouchableOpacity, View } from 'react-native';
import React from 'react';
import AntDesign from 'react-native-vector-icons/AntDesign';
import { useNavigation } from '@react-navigation/native';
import ChallangeSwiper from './ChallangeSwiper';
import Header from '../../../Components/Header';
import { scale } from 'react-native-size-matters';
import { Color } from '../../../assets/styles/Colors';
import { IconPadding } from '../../../assets/styles/Icon';
import { Font } from '../../../assets/styles/Fonts';

const ChallengesScreen = () => {
  const navigation = useNavigation();

  return (
    <SafeAreaView style={{ flex: 1 }}>
      <Header logoHeader={true} />
      <View style={{ flex: 1, backgroundColor: Color.white, paddingHorizontal: scale(8) }}>
        <View style={{ flexDirection: "row", justifyContent: "space-between", paddingVertical: scale(10) }}>
          <TouchableOpacity style={{ backgroundColor: "green", padding: 10, borderRadius: 5 }}
            onPress={() => navigation.navigate('JoinRequestScreen')}>
            <Text style={{ color: Color?.white }}>Join Challenge request</Text>
          </TouchableOpacity>
          <TouchableOpacity style={styles.buttonStyle}
            onPress={() => navigation.navigate('CreateChallenge')}>
            <AntDesign
              name="plus"
              color={Color.primaryColor}
              size={18}
              style={{ marginRight: 6 }}
            />
            <Text style={styles.btnText}>
              Create Challenge
            </Text>
          </TouchableOpacity>
        </View>
        <ChallangeSwiper />
      </View>
    </SafeAreaView>
  );
};

export default ChallengesScreen;
const styles = StyleSheet.create({
  buttonStyle: {
    borderWidth: 1,
    borderColor: Color.primaryColor,
    paddingVertical: 6,
    paddingHorizontal: 12,
    borderRadius: 8,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: Color.white,
  },
  btnText: {
    color: Color.primaryColor,
    fontSize: 14,
    fontWeight: '500',
    fontFamily: Font?.Poppins
  }
});