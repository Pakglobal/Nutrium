import {
  SafeAreaView,
  StyleSheet,
  Text,
  TouchableOpacity,
  View,
} from 'react-native';
import React, {useState} from 'react';
import AntDesign from 'react-native-vector-icons/AntDesign';
import {useNavigation} from '@react-navigation/native';
import ChallangeSwiper from './ChallangeSwiper';
import Header from '../../../Components/Header';
import {moderateScale, scale, verticalScale} from 'react-native-size-matters';
import {Color} from '../../../assets/styles/Colors';
import {Font} from '../../../assets/styles/Fonts';

const ChallengesScreen = () => {
  const navigation = useNavigation();
  const [selectedTitle, setSelectedTitle] = useState('All Challenges');

  return (
    <SafeAreaView style={{flex: 1, backgroundColor: Color.white}}>
      <Header screenheader={true} screenName={selectedTitle} />
      <View
        style={{
          flex: 1,
          backgroundColor: Color.white,
          paddingHorizontal: scale(8),
        }}>
        <TouchableOpacity
          style={styles.categoryCard}
          onPress={() => navigation.navigate('CreateChallenge')}>
          <View
            style={{
              flexDirection: 'row',
              alignItems: 'center',
            }}>
            <AntDesign
              name="plus"
              color={Color.primaryColor}
              size={18}
              style={{marginRight: scale(6)}}
            />
            <Text style={[styles.btnText, {color: Color.primaryColor}]}>
              Create Challenge
            </Text>
          </View>
        </TouchableOpacity>
        <ChallangeSwiper onTabChange={setSelectedTitle} />
      </View>
    </SafeAreaView>
  );
};

export default ChallengesScreen;
const styles = StyleSheet.create({
  btnText: {
    color: Color.white,
    fontSize: moderateScale(13),
    fontWeight: '500',
    fontFamily: Font?.Poppins,
    marginTop: verticalScale(2),
  },
  categoryCard: {
    backgroundColor: Color.white,
    borderRadius: moderateScale(6),
    marginBottom: verticalScale(5),
    marginTop: verticalScale(10),
    paddingVertical: verticalScale(8),
    paddingHorizontal: scale(8),
    alignItems: 'center',
    borderWidth: 1,
    borderColor: Color.primaryColor,
    alignSelf: 'flex-end',
  },
});
