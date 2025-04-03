import {
  View,
  Text,
  SafeAreaView,
  Image,
  StyleSheet,
  ScrollView,
} from 'react-native';
import React from 'react';
import SighnUpHeader from '../../Components/SighnUpHeader';
import Color from '../../assets/colors/Colors';
import {useNavigation} from '@react-navigation/native';
import {scale, verticalScale} from 'react-native-size-matters';

const UnlockAccess = () => {
  const navigation = useNavigation();
  const gymTextData = {
    title: 'You need to unlock your Nutrium Care access',
    subTitle:
      'You just need to completed a few step before you can start your nutrition journey:',
    step1: '1. Open your Gympass app',
    step2: "2. Go to 'all Apps'",
    step3: '3. Click on Nutrium and then Activate',
    step4:
      "4. You'll be redirected to this app and you\n      just have to created a new account",
    endText:
      'Just follow these steps and start enjoying all your Nutrium care perks, including appointments with experts.',
  };
  return (
    <SafeAreaView style={{flex: 1, backgroundColor: Color.white}}>
      <SighnUpHeader onPressBack={() => navigation.goBack()} />
      <ScrollView showsVerticalScrollIndicator={false}>
        <View style={{marginHorizontal: scale(20)}}>
          {/* <Image
            source={require('../../assets/Images/temGym.jpeg')}
            style={styles.image}
          /> */}
          <Text style={styles.titleFont}>{gymTextData?.title}</Text>
          <Text style={styles.subTitleFont}>{gymTextData?.subTitle}</Text>
          <View style={{marginLeft: verticalScale(5), marginTop: scale(10)}}>
            <Text style={styles.subTitleFont}>{gymTextData?.step1}</Text>
            <Text style={styles.subTitleFont}>{gymTextData?.step2}</Text>
            <Text style={styles.subTitleFont}>{gymTextData?.step3}</Text>
            <Text style={styles.subTitleFont}>{gymTextData?.step4}</Text>
            <Text style={[styles.subTitleFont, {marginTop: verticalScale(5)}]}>
              {gymTextData?.endText}
            </Text>
          </View>
        </View>
      </ScrollView>
    </SafeAreaView>
  );
};

export default UnlockAccess;
const styles = StyleSheet.create({
  image: {
    width: verticalScale(250),
    height: verticalScale(250),
    alignSelf: 'center',
  },
  titleFont: {
    color: Color.black,
    fontWeight: '500',
    fontSize: verticalScale(22),
    marginVertical: verticalScale(15),
  },
  subTitleFont: {
    color: '#616161',
    fontWeight: '600',
    fontSize: verticalScale(14),
    marginBottom: verticalScale(5),
  },
});
