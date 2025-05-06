import React, {useEffect, useState} from 'react';
import {
  StyleSheet,
  Text,
  View,
  TouchableOpacity,
  ActivityIndicator,
  Alert,
  SafeAreaView,
  ScrollView,
} from 'react-native';
import {useNavigation} from '@react-navigation/native';
import {scale, verticalScale} from 'react-native-size-matters';
import AntDesign from 'react-native-vector-icons/AntDesign';
import {joinPublicChallenge} from '../../../Apis/ClientApis/ChallengesApi';
import {useSelector} from 'react-redux';
import {Color} from '../../../assets/styles/Colors';
import {Font} from '../../../assets/styles/Fonts';
import Ionicons from 'react-native-vector-icons/Ionicons';
import CustomShadow from '../../../Components/CustomShadow';
import MaterialCommunityIcons from 'react-native-vector-icons/MaterialCommunityIcons';
import {shadowStyle} from '../../../assets/styles/Shadow';

const ChallengesDetailsScreen = ({route}) => {
  const navigation = useNavigation();
  const {challenge} = route.params;
  const userInfo = useSelector(state => state?.user?.userInfo);

  const [loading, setLoading] = useState(false);
  const [isPublic, setIsPublic] = useState(true);

  const formatDate = dateString => {
    const date = new Date(dateString);
    const day = date.getDate();
    const month = date.getMonth() + 1;
    const year = date.getFullYear();
    return `${day}-${month}-${year}`;
  };

  const formattedStartDate = formatDate(challenge?.startDate);
  const formattedEndDate = formatDate(challenge?.endDate);

  const handleJoinChllange = async () => {
    setLoading(true);
    try {
      const response = await joinPublicChallenge(
        userInfo?.token,
        userInfo?.userData?._id,
        challenge?._id,
      );
      if (response?.message) {
        Alert.alert('Success', response.message, [
          {text: 'OK', onPress: () => navigation.goBack()},
        ]);
      }
    } catch (error) {
      console.error('Join Challenge Error:', error);

      if (error?.response) {
        const statusCode = error.response.status;
        const message = error.response.data?.message || 'Something went wrong';

        Alert.alert(`Opps`, message);
      } else {
        Alert.alert('Error', 'Network error or server not responding');
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
          <View style={styles.row}>
            <CustomShadow radius={1} style={shadowStyle} color={Color?.gray}>
              <View style={styles.card}>
                <View style={{flexDirection: 'row'}}>
                  <MaterialCommunityIcons
                    name="calendar"
                    size={20}
                    color={Color.textColor}
                    style={{alignSelf: 'center'}}
                  />
                  <Text style={styles.cardText}>Start Date</Text>
                </View>
                <Text style={styles.cardSubText}>{formattedStartDate}</Text>
              </View>
            </CustomShadow>
            <CustomShadow radius={1} style={shadowStyle} color={Color?.gray}>
              <View style={styles.card}>
                <View style={{flexDirection: 'row'}}>
                  <MaterialCommunityIcons
                    name="calendar"
                    size={20}
                    color={Color.textColor}
                    style={{alignSelf: 'center'}}
                  />
                  <Text style={styles.cardText}>End Date</Text>
                </View>
                <Text style={styles.cardSubText}>{formattedEndDate}</Text>
              </View>
            </CustomShadow>
          </View>

          <CustomShadow radius={1} style={shadowStyle} color={Color?.gray}>
            <View style={styles.goalCard}>
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
              <View>
                <Text style={styles.goalTitle}>Goal</Text>
                <Text style={styles.goalSubtitle}>
                  {challenge?.targetValue}
                </Text>
              </View>
            </View>
          </CustomShadow>

          <CustomShadow radius={1} style={shadowStyle} color={Color?.gray}>
            <View style={styles.goalCard}>
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
              <View>
                <Text style={styles.goalTitle}>Reward</Text>
                <Text style={styles.goalSubtitle}>{challenge?.coinReward}</Text>
              </View>
            </View>
          </CustomShadow>
          <View style={styles.radioGroup}>
            <Text style={styles.nameText}>Privacy :</Text>
            <TouchableOpacity style={styles.radioContainer}>
              <View
                style={[
                  styles.radioCircle,
                  {borderColor: isPublic ? Color.primaryColor : Color.gray},
                ]}>
                {isPublic && (
                  <View
                    style={[
                      styles.selectedRb,
                      {backgroundColor: Color.primaryColor},
                    ]}
                  />
                )}
              </View>
              <Text style={styles.nameText}>Public</Text>
            </TouchableOpacity>

            <TouchableOpacity style={styles.radioContainer}>
              <View
                style={[
                  styles.radioCircle,
                  {borderColor: !isPublic ? Color.primaryColor : Color.gray},
                ]}>
                {!isPublic && (
                  <View
                    style={[
                      styles.selectedRb,
                      {backgroundColor: Color.primaryColor},
                    ]}
                  />
                )}
              </View>
              <Text style={styles.nameText}>Private</Text>
            </TouchableOpacity>
          </View>

          <View style={{marginTop: scale(20)}}>
            <Text style={styles.progresText}>
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

            <Text style={styles.progresText}>
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
              style={styles.cancelButton}
              onPress={() => navigation.goBack()}>
              <Text style={styles.cancelText}>Cancel</Text>
            </TouchableOpacity>
            <TouchableOpacity
              style={styles.joinButton}
              onPress={handleJoinChllange}
              disabled={loading}>
              {loading ? (
                <ActivityIndicator color="white" />
              ) : (
                <Text style={styles.buttonText}>Join Challenge</Text>
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
    height: scale(25),
    width: scale(25),
    margin: scale(10),
    justifyContent: 'center',
  },
  headerContent: {
    alignItems: 'center',
    // marginTop: scale(5),
  },
  headerTitle: {
    color: Color.white,
    fontSize: scale(20),
    marginTop: scale(8),
    fontFamily: Font?.PoppinsMedium,
  },
  bottomContainer: {
    backgroundColor: Color.white,
    flex: 1,
    borderTopEndRadius: scale(40),
    borderTopStartRadius: scale(40),
    marginTop: scale(-40),
    overflow: 'hidden',
  },
  innerContainer: {
    padding: scale(15),
    marginTop: scale(15),
    flex: 1,
  },
  row: {
    flexDirection: 'row',
    justifyContent: 'space-between',
  },
  card: {
    backgroundColor: Color.white,
    width: scale(150),
    padding: scale(8),
    borderRadius: scale(8),
  },
  cardText: {
    fontSize: scale(12),
    color: Color.dateText,
    left: scale(5),
    fontFamily: Font?.Poppins,
  },
  cardSubText: {
    fontSize: scale(10),
    color: Color.gray,
    marginTop: scale(2),
    fontFamily: Font?.Poppins,
    fontSize: scale(12),
  },
  goalCard: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: Color.white,
    padding: scale(10),
    borderRadius: scale(8),
    marginTop: scale(15),
  },
  goalTitle: {
    fontSize: scale(14),
    marginLeft: scale(10),
    color: Color?.dateText,
    fontFamily: Font?.Poppins,
  },
  goalSubtitle: {
    fontSize: scale(12),
    color: Color.grey,
    marginLeft: scale(10),
    color: Color?.dateText,
    fontFamily: Font?.Poppins,
  },
  radioGroup: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: scale(8),
    marginTop: scale(15),
    paddingHorizontal: scale(4),
  },
  radioContainer: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  radioCircle: {
    height: 20,
    width: 20,
    borderRadius: 10,
    borderWidth: 2,
    borderColor: '#444',
    alignItems: 'center',
    justifyContent: 'center',
    marginRight: 8,
  },
  selectedRb: {
    width: 10,
    height: 10,
    borderRadius: 5,
    backgroundColor: Color?.primaryColor,
  },
  buttonContainer: {
    position: 'absolute',
    width: '100%',
    alignSelf: 'center',
    bottom: scale(30),
  },
  cancelButton: {
    borderWidth: 1,
    borderColor: Color.red,
    padding: scale(8),
    borderRadius: scale(6),
    alignItems: 'center',
  },
  cancelText: {
    color: Color.red,
    fontSize: scale(14),
    fontWeight: 'bold',
  },
  joinButton: {
    backgroundColor: Color.primaryColor,
    padding: scale(8),
    borderRadius: scale(6),
    alignItems: 'center',
    marginTop: scale(10),
  },
  joinText: {
    color: Color.white,
    fontSize: scale(14),
    fontWeight: 'bold',
  },
  nameText: {
    fontFamily: Font?.Poppins,
    color: Color?.textColor,
    alignSelf: 'center',
  },
  progresText: {
    color: Color?.dateText,
    fontFamily: Font?.Poppins,
  },
});
