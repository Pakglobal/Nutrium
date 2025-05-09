import React, {useEffect, useState} from 'react';
import {
  StyleSheet,
  Text,
  View,
  TouchableOpacity,
  ActivityIndicator,
  SafeAreaView,
  ScrollView,
} from 'react-native';
import {useNavigation} from '@react-navigation/native';
import {moderateScale, scale, verticalScale} from 'react-native-size-matters';
import AntDesign from 'react-native-vector-icons/AntDesign';
import {joinPublicChallenge} from '../../../Apis/ClientApis/ChallengesApi';
import {useSelector} from 'react-redux';
import {Color} from '../../../assets/styles/Colors';
import {Font} from '../../../assets/styles/Fonts';
import Ionicons from 'react-native-vector-icons/Ionicons';
import CustomShadow from '../../../Components/CustomShadow';
import MaterialCommunityIcons from 'react-native-vector-icons/MaterialCommunityIcons';
import {shadowStyle} from '../../../assets/styles/Shadow';
import CustomAlertBox from '../../../Components/CustomAlertBox';

const ChallengesDetailsScreen = ({route}) => {
  const navigation = useNavigation();
  const {challenge} = route.params;

  const tokenId = useSelector(state => state?.user?.token);
  const guestTokenId = useSelector(state => state?.user?.guestToken);
  const token = tokenId?.token || guestTokenId?.token;
  const id = tokenId?.id || guestTokenId?.id;

  const [loading, setLoading] = useState(false);
  const [isPublic, setIsPublic] = useState(true);
  const [alertVisible, setAlertVisible] = useState(false);
  const [alertType, setAlertType] = useState('success');
  const [alertMessage, setAlertMessage] = useState('');

  const formatDate = dateString => {
    const date = new Date(dateString);
    const day = date.getDate();
    const month = date.getMonth() + 1;
    const year = date.getFullYear();
    return `${day}-${month}-${year}`;
  };

  const formattedStartDate = formatDate(challenge?.startDate);
  const formattedEndDate = formatDate(challenge?.endDate);
  console.log('challenge?._id', challenge?._id);

  const handleJoinChallenge = async () => {
    setLoading(true);
    try {
      const response = await joinPublicChallenge(token, id, challenge?._id);
      if (response?.message) {
        setAlertType('success');
        setAlertMessage(response.message);
        setAlertVisible(true);
      }
    } catch (error) {
      if (error?.response) {
        const message = error.response.data?.message || 'Something went wrong';
        setAlertType('error');
        setAlertMessage(message);
        setAlertVisible(true);
      } else {
        setAlertType('error');
        setAlertMessage('Network error or server not responding');
        setAlertVisible(true);
      }
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    if (challenge?.privacy) {
      setIsPublic(challenge?.privacy.toLowerCase() === 'public');
    }
  }, [challenge]);

  return (
    <SafeAreaView style={styles.container}>
      <CustomAlertBox
        visible={alertVisible}
        type={alertType}
        message={alertMessage}
        closeAlert={() => setAlertVisible(false)}
        onClose={() => {
          setAlertVisible(false);
          if (alertType === 'success') {
            navigation.goBack();
          }
        }}
      />
      <View style={styles.header}>
        <TouchableOpacity
          onPress={() => navigation.goBack()}
          style={styles.backButton}>
          <AntDesign
            name="arrowleft"
            size={24}
            color={Color.white}
            style={{alignSelf: 'center'}}
          />
        </TouchableOpacity>

        <View style={styles.headerContent}>
          <Ionicons
            name="footsteps-sharp"
            size={30}
            color={Color.primaryColor}
            style={{
              backgroundColor: Color?.white,
              borderRadius: scale(50),
              padding: scale(10),
            }}
          />
          <Text style={styles.headerTitle}>Step Challenge</Text>
        </View>
      </View>

      <View style={styles.bottomContainer}>
        <ScrollView contentContainerStyle={styles.innerContainer}>
          <View
            style={{
              flexDirection: 'row',
              justifyContent: 'space-between',
              alignItems: 'center',
              marginVertical: verticalScale(7),
            }}>
            <View style={{width: '48%'}}>
              <CustomShadow radius={1} style={shadowStyle} color={Color?.gray}>
                <View
                  style={{
                    backgroundColor: Color.white,
                    padding: scale(5),
                    borderRadius: scale(6),
                  }}>
                  <View
                    style={{
                      backgroundColor: Color?.white,
                      borderRadius: scale(5),
                      flexDirection: 'row',
                      alignItems: 'center',
                      marginLeft: scale(5),
                    }}>
                    <MaterialCommunityIcons
                      name="calendar"
                      size={20}
                      color={Color.textColor}
                      style={{alignSelf: 'center', marginRight: scale(5)}}
                    />
                    <Text style={styles.boxText}>Start Date</Text>
                  </View>
                  <Text style={[styles.boxText, {marginLeft: scale(5)}]}>
                    {formattedStartDate}
                  </Text>
                </View>
              </CustomShadow>
            </View>

            <View style={{width: '48%'}}>
              <CustomShadow radius={1} style={shadowStyle} color={Color?.gray}>
                <View
                  style={{
                    backgroundColor: Color.white,
                    padding: scale(5),
                    borderRadius: scale(6),
                  }}>
                  <View
                    style={{
                      backgroundColor: Color?.white,
                      borderRadius: scale(5),
                      flexDirection: 'row',
                      alignItems: 'center',
                      marginLeft: scale(5),
                    }}>
                    <MaterialCommunityIcons
                      name="calendar"
                      size={20}
                      color={Color.textColor}
                      style={{alignSelf: 'center', marginRight: scale(5)}}
                    />
                    <Text style={styles.boxText}>End Date</Text>
                  </View>
                  <Text style={[styles.boxText, {marginLeft: scale(5)}]}>
                    {formattedEndDate}
                  </Text>
                </View>
              </CustomShadow>
            </View>
          </View>

          <CustomShadow radius={1} style={shadowStyle} color={Color?.gray}>
            <View style={styles.cardContainer}>
              <CustomShadow radius={1} style={shadowStyle} color={Color?.gray}>
                <View
                  style={{
                    backgroundColor: Color?.white,
                    padding: scale(8),
                    borderRadius: scale(5),
                  }}>
                  <MaterialCommunityIcons
                    name="flag-checkered"
                    size={20}
                    color={Color.primaryColor}
                  />
                </View>
              </CustomShadow>
              <View style={{marginLeft: scale(10)}}>
                <Text style={styles.boxText}>Goal</Text>
                <Text style={styles.boxText}>{challenge?.targetValue}</Text>
              </View>
            </View>
          </CustomShadow>

          <CustomShadow radius={1} style={shadowStyle} color={Color?.gray}>
            <View style={styles.cardContainer}>
              <CustomShadow radius={1} style={shadowStyle} color={Color?.gray}>
                <View
                  style={{
                    backgroundColor: Color?.white,
                    padding: scale(8),
                    borderRadius: scale(5),
                  }}>
                  <MaterialCommunityIcons
                    name="trophy"
                    size={20}
                    color={Color.primaryColor}
                  />
                </View>
              </CustomShadow>
              <View style={{marginLeft: scale(10)}}>
                <Text style={styles.boxText}>Reward</Text>
                <Text style={styles.boxText}>{challenge?.coinReward}</Text>
              </View>
            </View>
          </CustomShadow>

          <View style={styles.radioGroup}>
            <Text style={styles.radioText}>Privacy :</Text>
            <View style={styles.radioContainer}>
              <MaterialCommunityIcons
                name={isPublic ? 'radiobox-marked' : 'radiobox-blank'}
                color={isPublic ? Color.primaryColor : Color.gray}
                size={scale(20)}
                style={{marginHorizontal: scale(5)}}
              />
              <Text style={styles.radioText}>Public</Text>
            </View>

            <View style={styles.radioContainer}>
              <MaterialCommunityIcons
                name={!isPublic ? 'radiobox-marked' : 'radiobox-blank'}
                color={!isPublic ? Color.primaryColor : Color.gray}
                size={scale(20)}
                style={{marginHorizontal: scale(5)}}
              />
              <Text style={styles.radioText}>Private</Text>
            </View>
          </View>

          <View>
            <Text style={styles.boxText}>
              Joined: {challenge?.participants?.length || 0} /{' '}
              {challenge?.participationLimit || 0}
            </Text>

            <View
              style={{
                backgroundColor: Color.lightgray,
                width: '100%',
                borderRadius: scale(5),
                height: scale(8),
                overflow: 'hidden',
                marginVertical: scale(8),
              }}>
              <View
                style={{
                  backgroundColor: Color.primaryColor,
                  width: `${
                    (challenge?.participants?.length /
                      challenge?.participationLimit) *
                      100 || 0
                  }%`,
                  height: '100%',
                  borderRadius: scale(5),
                }}
              />
            </View>

            <Text style={styles.boxText}>
              Remaining:{' '}
              {Math.max(
                (challenge?.participationLimit || 0) -
                  (challenge?.participants?.length || 0),
                0,
              )}{' '}
              people left
            </Text>
          </View>

          <View style={styles.buttonContainer}>
            <TouchableOpacity
              style={[styles.button, {borderWidth: 1, height: 41}]}
              onPress={() => navigation.goBack()}>
              <Text style={styles.buttonText}>Cancel</Text>
            </TouchableOpacity>
            <TouchableOpacity
              style={[
                styles.button,
                {backgroundColor: Color.primaryColor, marginTop: scale(10)},
              ]}
              onPress={handleJoinChallenge}>
              {loading ? (
                <ActivityIndicator color="white" />
              ) : (
                <Text style={[styles.buttonText, {color: Color.white}]}>
                  Join Challenge
                </Text>
              )}
            </TouchableOpacity>
          </View>
        </ScrollView>
      </View>
    </SafeAreaView>
  );
};

export default ChallengesDetailsScreen;

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: Color.white,
  },
  header: {
    backgroundColor: Color?.primaryColor,
    height: '30%',
  },
  backButton: {
    padding: scale(5),
    margin: scale(10),
    justifyContent: 'center',
    alignSelf: 'flex-start',
  },
  headerContent: {
    alignItems: 'center',
  },
  headerTitle: {
    color: Color.white,
    fontSize: moderateScale(20),
    marginTop: verticalScale(8),
    fontFamily: Font?.PoppinsMedium,
  },
  bottomContainer: {
    backgroundColor: Color.white,
    flex: 1,
    borderTopEndRadius: scale(40),
    borderTopStartRadius: scale(40),
    marginTop: verticalScale(-40),
    overflow: 'hidden',
  },
  innerContainer: {
    paddingHorizontal: scale(8),
    marginTop: verticalScale(20),
    flex: 1,
  },
  cardContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: Color.white,
    padding: scale(8),
    borderRadius: scale(8),
    marginVertical: verticalScale(7),
  },
  boxText: {
    fontSize: moderateScale(13),
    color: Color?.dateText,
    fontFamily: Font?.Poppins,
  },
  radioGroup: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: scale(10),
    paddingHorizontal: scale(4),
    marginTop: verticalScale(10),
    gap: scale(20),
  },
  radioContainer: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  radioText: {
    fontFamily: Font?.Poppins,
    color: Color.textColor,
    fontSize: moderateScale(14),
    marginTop: verticalScale(2),
  },
  buttonContainer: {
    position: 'absolute',
    width: '100%',
    alignSelf: 'center',
    bottom: verticalScale(20),
  },
  button: {
    borderColor: Color.red,
    borderRadius: scale(6),
    alignItems: 'center',
    justifyContent: 'center',
    height: scale(43),
  },
  buttonText: {
    color: Color.red,
    fontSize: moderateScale(14),
    fontFamily: Font?.Poppins,
  },
});
