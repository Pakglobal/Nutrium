import { View, Text, StyleSheet, Button } from 'react-native';
import React from 'react';
import { SafeAreaView } from 'react-native-safe-area-context';
import Color from '../../assets/colors/Colors';
import SighnUpHeader from '../../Components/SighnUpHeader';
import { useNavigation } from '@react-navigation/native';
import { scale, verticalScale } from 'react-native-size-matters';


const GetAccess = () => {
  const navigation = useNavigation();
  const accessTextInfo = {
    title: "Get access to Nutrium Through your practitioner",
    subTitle: "Your practitioner can give you access after you're registered as their client.",
    subTitle1: "If you didn't recieve your sign in credentials from your practitioner, make sure to contact them and ask for acces to the Nutrium app.",
    endText: "If you already have credentials, Sign in to start using Nutrium"
  }
  return (
    <SafeAreaView style={{ flex: 1, backgroundColor: Color.primary }}>
      <SighnUpHeader onPressBack={() => navigation.goBack()} />
      <View style={{ marginHorizontal: scale(20) }}>
        <Text style={styles.titleFont}>{accessTextInfo?.title}</Text>
        <Text style={styles.subTitleFont}>{accessTextInfo?.subTitle}</Text>
        <Text style={styles.discriptionFont}>{accessTextInfo?.subTitle1}</Text>
        <Text style={[styles.subTitleFont, { marginTop: verticalScale(180) }]}>{accessTextInfo?.endText}</Text>
        <Button
          onPress={() => navigation.navigate("loginScreen")}
          // disabled={!selectedOption ? true : false}
          backgroundColor={Color.secondary}
          txtColor={Color.primary}
          iconColor={Color.primary}
          marginTop={verticalScale(20)}
          text={'Go to Sign in'}
        />
      </View>

    </SafeAreaView>
  );
};

export default GetAccess;
const styles = StyleSheet.create({
  titleFont: {
    color: Color.black,
    fontWeight: "700",
    fontSize: verticalScale(18),
    marginTop: verticalScale(35),
    marginVertical: verticalScale(25)
  },
  subTitleFont: {
    color: Color.black,
    fontWeight: "500",
    fontSize: verticalScale(16),
    marginBottom: verticalScale(5)
  },
  discriptionFont: {
    color: "#616161",
    fontWeight: "600",
    fontSize: verticalScale(16),
    marginTop: verticalScale(20)
  }
});
