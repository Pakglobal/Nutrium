import React, {useEffect, useState} from 'react';
import {
  SafeAreaView,
  StyleSheet,
  Text,
  View,
  TouchableOpacity,
  FlatList,
  Image,
  ActivityIndicator,
} from 'react-native';
import {Color} from '../../../assets/styles/Colors';
import LeaderboardBackground from '../../../assets/Images/leaderBoardImg.svg';
import {scale, verticalScale, moderateScale} from 'react-native-size-matters';
import CustomShadow from '../../../Components/CustomShadow';
import {shadowStyle} from '../../../assets/styles/Shadow';
import AntDesign from 'react-native-vector-icons/AntDesign';
import {Font} from '../../../assets/styles/Fonts';
import {useNavigation} from '@react-navigation/native';
import {getChallengeLederBoardData} from '../../../Apis/ClientApis/ChallengesApi';
import {useSelector} from 'react-redux';

const ViewChallengDetailsScreen = ({route}) => {
  const navigation = useNavigation();
  const [activeTab, setActiveTab] = useState('Day');
  const [lederbordData, setLeaderbordData] = useState([]);
  const [isLoading, setIsLoading] = useState(false);
  const tokenId = useSelector(state => state?.user?.token);
  const guestTokenId = useSelector(state => state?.user?.guestToken);
  const token = tokenId?.token || guestTokenId?.token;

  const {challenge} = route.params;

  useEffect(() => {
    fetchLeaderbordData(activeTab);
  }, [activeTab]);

  const fetchLeaderbordData = async timePeriod => {
    try {
      setIsLoading(true);
      const period = timePeriod.toLowerCase();
      const response = await getChallengeLederBoardData(
        token,
        challenge?._id,
        period,
      );
      console.log('API Response:', response);
      if (response?.leaderboard && Array.isArray(response.leaderboard)) {
        setLeaderbordData(
          response.leaderboard.map(item => ({
            ...item,
            image: item?.image,
          })),
        );
      } else {
        setLeaderbordData([]);
      }
    } catch (error) {
      console.error(
        `Error fetching leaderboard data for ${timePeriod}:`,
        error,
      );
      setLeaderbordData([]);
    } finally {
      setIsLoading(false);
    }
  };

  const sortedParticipants = [...lederbordData]
    .filter(item => item?.progress !== undefined)
    .sort((a, b) => (b?.progress || 0) - (a?.progress || 0));
  const topThree = sortedParticipants.slice(0, 3);
  const remainingParticipants = sortedParticipants.slice(3);

  const renderEmptyState = () => (
    <View>
      <Text style={styles.emptyText}>No more leaderboard data</Text>
    </View>
  );

  return (
    <SafeAreaView style={styles.container}>
      <View style={styles.headerBackground}>
        <LeaderboardBackground
          width="100%"
          height={scale(400)}
          style={{top: verticalScale(-30)}}
          preserveAspectRatio="xMidYMid slice"
        />

        <View style={styles.headerContent}>
          <View style={styles.headerRow}>
            <TouchableOpacity
              style={styles.button}
              onPress={() => navigation.goBack()}>
              <AntDesign
                name="arrowleft"
                size={moderateScale(20)}
                color={Color.white}
              />
            </TouchableOpacity>
            <Text style={styles.title}>Leaderboard</Text>
            <View style={{flexDirection: 'row', alignItems: 'center'}}>
              <TouchableOpacity style={styles.button}>
                <AntDesign
                  name="filter"
                  size={moderateScale(20)}
                  color={Color.white}
                />
              </TouchableOpacity>
              <TouchableOpacity style={styles.button}>
                <AntDesign
                  name="sharealt"
                  size={moderateScale(20)}
                  color={Color.white}
                />
              </TouchableOpacity>
            </View>
          </View>

          <View style={styles.tabsContainer}>
            {['Day', 'Week', 'Month'].map(tab => (
              <TouchableOpacity
                key={tab}
                style={[
                  styles.tabButton,
                  activeTab === tab && styles.tabButtonActive,
                ]}
                onPress={() => setActiveTab(tab)}>
                <Text
                  style={[
                    styles.tabText,
                    activeTab === tab && styles.tabTextActive,
                  ]}>
                  {tab}
                </Text>
              </TouchableOpacity>
            ))}
          </View>

          <Text style={styles.subtitle}>
            Burn 500 calories daily to climb{'\n'}the leaderboard.
          </Text>

          {!isLoading && topThree.length > 0 && (
            <View
              style={[
                styles.topUsers,
                topThree.length === 1 && styles.topUsersSingle,
                topThree.length === 2 && styles.topUsersDouble,
              ]}>
              {topThree.map((item, index) => (
                <View
                  key={item?.clientId || index}
                  style={[
                    styles.userCircle,
                    topThree.length === 1 && {marginTop: verticalScale(-35)},
                    topThree.length === 2 && {marginTop: 0},
                    topThree.length === 3 &&
                      index === 1 && {marginTop: verticalScale(-35)},
                  ]}>
                  <Text style={styles.points}>{item?.progress}</Text>
                  <Image
                    style={[
                      styles.userImage,
                      topThree.length === 1 && {
                        width: scale(100),
                        height: scale(100),
                        borderRadius: scale(50),
                      },
                      topThree.length === 2 && {
                        width: scale(80),
                        height: scale(80),
                        borderRadius: scale(40),
                      },
                      topThree.length === 3 &&
                        index === 1 && {
                          width: scale(90),
                          height: scale(90),
                          borderRadius: scale(45),
                        },
                    ]}
                    source={{
                      uri:
                        item?.image ||
                        `https://i.pravatar.cc/150?img=${index + 1}`,
                    }}
                  />
                  <Text
                    style={[
                      styles.rank,
                      topThree.length === 3 &&
                        index === 1 && {
                          bottom: verticalScale(15),
                        },
                    ]}>
                    {item?.rank}
                  </Text>
                </View>
              ))}
            </View>
          )}
        </View>
      </View>

      <View style={styles.bottomContainer}>
        {isLoading ? (
          <View style={styles.overlayLoader}>
            <View style={styles.loaderCard}>
              <ActivityIndicator size="large" color={Color.primaryColor} />
            </View>
          </View>
        ) : lederbordData?.length <= 3 ? (
          renderEmptyState()
        ) : (
          <FlatList
            showsVerticalScrollIndicator={false}
            data={remainingParticipants}
            keyExtractor={(item, index) =>
              item?.clientId?.toString() || index.toString()
            }
            renderItem={({item, index}) => (
              <CustomShadow
                radius={3}
                style={shadowStyle}
                color={Color?.lightgray}>
                <View style={styles.userData}>
                  <View style={styles.userInfo}>
                    <Text style={styles.text}>{item?.rank}. </Text>
                    <Image style={styles.avatar} source={{uri: item?.image}} />
                    <Text style={styles.text}>{item?.fullName}</Text>
                  </View>
                  <View style={styles.pointsContainer}>
                    <Text style={styles.pointText}>
                      Points:{' '}
                      <Text style={styles.progressText}>{item?.progress}</Text>
                    </Text>
                  </View>
                </View>
              </CustomShadow>
            )}
          />
        )}
      </View>
    </SafeAreaView>
  );
};

export default ViewChallengDetailsScreen;

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: Color.white,
  },
  headerBackground: {
    position: 'relative',
  },
  headerContent: {
    position: 'absolute',
    left: 0,
    right: 0,
    alignItems: 'center',
  },
  headerRow: {
    flexDirection: 'row',
    width: '100%',
    justifyContent: 'space-between',
    padding: scale(8),
    marginVertical: verticalScale(10),
    alignItems: 'center',
  },
  title: {
    fontSize: moderateScale(20),
    color: Color.white,
    fontFamily: Font.PoppinsMedium,
  },
  tabsContainer: {
    flexDirection: 'row',
    justifyContent: 'space-around',
    marginBottom: verticalScale(8),
    backgroundColor: '#6BCB77',
    borderRadius: moderateScale(4),
  },
  tabButton: {
    paddingVertical: verticalScale(5),
    paddingHorizontal: scale(20),
    borderRadius: moderateScale(4),
  },
  tabButtonActive: {
    backgroundColor: Color.white,
  },
  tabText: {
    color: Color.white,
    fontFamily: Font.PoppinsMedium,
    fontSize: moderateScale(15),
  },
  tabTextActive: {
    color: Color.primaryColor,
  },
  subtitle: {
    color: Color.white,
    fontSize: moderateScale(14),
    textAlign: 'center',
    marginVertical: verticalScale(10),
    fontFamily: Font.Poppins,
  },
  topUsers: {
    flexDirection: 'row',
    justifyContent: 'space-evenly',
    marginTop: verticalScale(40),
    width: '80%',
  },
  topUsersSingle: {
    alignItems: 'center',
    marginTop: verticalScale(30),
  },
  topUsersDouble: {
    flexDirection: 'row',
    justifyContent: 'space-evenly',
    width: '100%',
  },
  userCircle: {
    alignItems: 'center',
  },
  userImage: {
    marginBottom: verticalScale(5),
    borderColor: Color.white,
    borderWidth: scale(3),
    width: scale(70),
    height: scale(70),
    borderRadius: scale(35),
  },
  points: {
    color: Color.white,
    fontFamily: Font.PoppinsSemiBold,
    fontSize: moderateScale(16),
  },
  rank: {
    color: Color.primaryColor,
    backgroundColor: Color.white,
    borderRadius: scale(10),
    width: scale(20),
    height: scale(20),
    alignItems: 'center',
    justifyContent: 'center',
    textAlign: 'center',
    fontSize: moderateScale(12),
    position: 'absolute',
    bottom: 0,
  },
  bottomContainer: {
    backgroundColor: 'rgba(107, 203, 119, 0.3)',
    flex: 1,
    borderTopColor: Color.primaryColor,
    borderTopWidth: scale(5),
    borderTopRightRadius: scale(20),
    borderTopStartRadius: scale(20),
    paddingTop: verticalScale(10),
    paddingHorizontal: scale(10),
    borderWidth: 0.5,
  },
  userData: {
    backgroundColor: Color.white,
    marginVertical: verticalScale(5),
    flexDirection: 'row',
    width: '95%',
    alignSelf: 'center',
    borderRadius: moderateScale(5),
    padding: scale(10),
    justifyContent: 'space-between',
  },
  userInfo: {
    flexDirection: 'row',
    width: '65%',
    alignItems: 'center',
  },
  text: {
    alignSelf: 'center',
    fontFamily: Font.PoppinsMedium,
    color: Color.textColor,
    fontSize: moderateScale(15),
  },
  avatar: {
    width: scale(40),
    height: scale(40),
    borderRadius: scale(20),
    marginRight: scale(12),
    alignSelf: 'center',
    backgroundColor: Color.lightgray,
  },
  pointsContainer: {
    flexDirection: 'row',
    width: '32%',
    alignSelf: 'center',
  },
  pointText: {
    textAlign: 'center',
    width: '100%',
    fontFamily: Font.PoppinsMedium,
    color: Color.textColor,
    fontSize: moderateScale(14),
  },
  progressText: {
    color: Color.primaryColor,
  },
  emptyText: {
    marginTop: verticalScale(20),
    textAlign: 'center',
    color: Color.gray,
    fontSize: moderateScale(16),
    fontFamily: Font.Poppins,
  },
  button: {
    padding: scale(5),
  },
  loaderContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
  loaderText: {
    marginTop: verticalScale(10),
    fontFamily: Font.PoppinsMedium,
    fontSize: moderateScale(16),
    color: Color.textColor,
  },
  topLoaderContainer: {
    height: verticalScale(120),
    justifyContent: 'center',
    alignItems: 'center',
    marginTop: verticalScale(20),
  },
});
