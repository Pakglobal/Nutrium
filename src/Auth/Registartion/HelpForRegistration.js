import {View, Text, SafeAreaView, StyleSheet, Button} from 'react-native';
import React from 'react';
import {Color} from '../../assets/styles/Colors';
import {useNavigation} from '@react-navigation/native';
import SighnUpHeader from '../../Components/SighnUpHeader';
import {scale, verticalScale} from 'react-native-size-matters';

const HelpForRegistration = () => {
  const navigation = useNavigation();
  const textInfoData = {
    title: "We'd love to help you become your healthiest self",
    subTitle:
      'Unfortrunately, access to the Nutrium app is currently exclusive to:',
    points: [
      'Nutrition and well-being practitioners with a valid subscription',
      'Clients of practitioners using Nutrium',
      'Members of an organization with access to Nutrium Care benefits',
    ],
    dontLike: "If you'd like to use Nutrium, you can...",
    share1:
      'Share Nutrium Care with people in your organization who handle employee benefits',
    share2: 'Share Nutrium with your practitioner',
  };
  return (
    <SafeAreaView style={{flex: 1, backgroundColor: Color.white}}>
      <SighnUpHeader onPressBack={() => navigation.goBack()} />
      <View style={{marginHorizontal: scale(20)}}>
        <Text style={styles.titleFont}>{textInfoData?.title}</Text>
        <Text style={styles.subTitleFont}>{textInfoData?.subTitle}</Text>
        <View
          style={{
            paddingHorizontal: verticalScale(3),
            marginTop: verticalScale(20),
          }}>
          {textInfoData?.points.map((point, index) => (
            <View
              key={index}
              style={{flexDirection: 'row', marginBottom: verticalScale(5)}}>
              <View style={styles.pointCircle} />
              {/* <Text style={styles.discriptionFont}>
                {point.includes("Nutrition and well-being practitioners" || "Clients" || "Nutrium Care")
                  ? <Text style={styles.boldText}>Nutrition and well-being practitioners</Text>
                  : point
                }
              </Text> */}
              <Text style={styles.discriptionFont}>{point}</Text>
            </View>
          ))}
        </View>
        <Text
          style={[
            styles.subTitleFont,
            {marginTop: verticalScale(40), fontWeight: '600'},
          ]}>
          {textInfoData?.dontLike}
        </Text>
        <Text
          style={[
            styles.subTitleFont,
            {marginTop: verticalScale(20), fontSize: 16},
          ]}>
          {textInfoData?.share1}
        </Text>
        <Button
          onPress={() => navigation.navigate('loginScreen')}
          // disabled={!selectedOption ? true : false}
          backgroundColor={'rgba(0,145,234,0.1)'}
          txtColor={'rgba(0,145,234,1)'}
          iconColor={'rgba(0,145,234,1)'}
          marginTop={verticalScale(15)}
          textSize={verticalScale(12)}
          text={'More about Nutrium Care'}
        />
        <Text
          style={[
            styles.subTitleFont,
            {marginTop: verticalScale(20), fontSize: 16},
          ]}>
          {textInfoData?.share2}
        </Text>
        <Button
          onPress={() => navigation.navigate('loginScreen')}
          // disabled={!selectedOption ? true : false}
          backgroundColor={'rgba(232, 150, 106,0.1)'}
          txtColor={Color.secondary}
          iconColor={Color.secondary}
          marginTop={verticalScale(15)}
          textSize={verticalScale(12)}
          text={'More about Nutrium software'}
        />
      </View>
    </SafeAreaView>
  );
};

export default HelpForRegistration;
const styles = StyleSheet.create({
  titleFont: {
    color: Color.black,
    fontWeight: '700',
    fontSize: scale(18),
    marginTop: verticalScale(35),
    marginVertical: verticalScale(25),
  },
  subTitleFont: {
    color: Color.txt,
    fontWeight: '500',
    fontSize: scale(16),
    marginBottom: verticalScale(5),
  },
  pointCircle: {
    width: verticalScale(5),
    height: verticalScale(5),
    borderRadius: verticalScale(5),
    backgroundColor: 'black',
    marginRight: verticalScale(5),
    marginTop: verticalScale(7),
  },
  discriptionFont: {
    color: '#616161',
    fontWeight: '500',
    fontSize: scale(14),
  },
  boldText: {
    fontWeight: 'bold',
  },
});
