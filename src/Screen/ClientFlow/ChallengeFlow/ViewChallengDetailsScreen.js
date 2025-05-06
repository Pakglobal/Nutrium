import React, {useEffect, useState} from 'react';
import {
  SafeAreaView,
  StyleSheet,
  Text,
  View,
  TouchableOpacity,
  FlatList,
  Image,
} from 'react-native';
import {Color} from '../../../assets/styles/Colors';
import LeaderboardBackground from '../../../assets/Images/leaderBoardImg.svg';
import {scale} from 'react-native-size-matters';
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
  const userInfo = useSelector(state => state?.user?.userInfo);
  const {challenge} = route.params;

  const fetchLeaderbordData = async timePeriod => {
    try {
      const period = timePeriod.toLowerCase();
      const response = await getChallengeLederBoardData(
        userInfo?.token,
        challenge?._id,
        period,
      );
      if (response?.leaderboard) {
        setLeaderbordData(response?.leaderboard);
      } else {
        setLeaderbordData([]);
      }
    } catch (error) {
      console.error(
        `Error fetching leaderboard data for ${timePeriod}:`,
        error,
      );
      setLeaderbordData([]);
    }
  };

  useEffect(() => {
    fetchLeaderbordData(activeTab);
  }, [activeTab]);

  const sortedParticipants = [...lederbordData].sort(
    (a, b) => b?.progress - a?.progress,
  );
  const topThree = sortedParticipants.slice(0, 3);
  const remainingParticipants = sortedParticipants.slice(3);

  return (
    <SafeAreaView style={styles.container}>
      <View style={styles.headerBackground}>
        <LeaderboardBackground
          width="100%"
          height={scale(400)}
          style={{top: -30}}
          preserveAspectRatio="xMidYMid slice"
        />

        <View style={styles.headerContent}>
          <View
            style={{
              flexDirection: 'row',
              width: '100%',
              justifyContent: 'space-between',
              paddingHorizontal: scale(10),
            }}>
            <TouchableOpacity
              style={{alignSelf: 'center', padding: scale(5)}}
              onPress={() => navigation.goBack()}>
              <AntDesign name="arrowleft" size={20} color={Color.white} />
            </TouchableOpacity>
            <Text style={styles.title}>Leaderboard</Text>
            <TouchableOpacity style={{alignSelf: 'center', padding: scale(5)}}>
              <AntDesign name="sharealt" size={20} color={Color.white} />
            </TouchableOpacity>
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

          <View style={styles.topUsers}>
            <View
              style={[
                topThree.length === 1
                  ? {alignItems: 'center', marginTop: scale(30)}
                  : topThree.length === 2
                  ? {
                      flexDirection: 'row',
                      justifyContent: 'space-evenly',
                      width: '100%',
                    }
                  : styles.topUsers,
              ]}>
              {topThree.map((item, index) => (
                <View
                  key={item?.clientId || index}
                  style={[
                    styles.userCircle,
                    topThree.length === 1 && {marginTop: scale(-35)},
                    topThree.length === 2 && {marginTop: 0},
                    topThree.length === 3 &&
                      (index === 1 ? {marginTop: -35} : {}),
                  ]}>
                  <Text style={styles.points}>{item?.progress}</Text>

                  <Image
                    style={[
                      styles.userImage,
                      topThree.length === 1 && {
                        width: scale(100),
                        height: scale(100),
                      },
                      topThree.length === 2 && {
                        width: scale(80),
                        height: scale(80),
                      },
                      topThree.length === 3 &&
                        index === 1 && {width: scale(90), height: scale(90)},
                    ]}
                    source={{uri: item?.image}}
                  />

                  <Text
                    style={[
                      styles.rank,
                      topThree.length === 1 && {bottom: scale(-5)},
                      topThree.length === 3 &&
                        index === 1 && {bottom: scale(7)},
                    ]}>
                    {item?.rank}
                  </Text>
                </View>
              ))}
            </View>
          </View>
        </View>
      </View>

      <View style={styles.bottomContainer}>
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
              <View style={styles?.userData}>
                <View style={{flexDirection: 'row', width: '65%'}}>
                  <Text style={styles.text}>
                    {item?.rank}.{'  '}
                  </Text>

                  <Image style={styles?.avatar} source={{uri: item?.image}} />
                  <Text style={styles.text}>{item?.fullName}</Text>
                </View>
                <View
                  style={{
                    flexDirection: 'row',
                    width: '32%',
                    alignSelf: 'center',
                  }}>
                  <Text style={styles.pointText}>
                    Points :{' '}
                    <Text style={{color: Color?.primaryColor}}>
                      {item?.progress}
                    </Text>
                  </Text>
                </View>
              </View>
            </CustomShadow>
          )}
        />
      </View>
    </SafeAreaView>
  );
};

export default ViewChallengDetailsScreen;

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: Color?.white,
  },
  headerBackground: {
    position: 'relative',
  },
  headerContent: {
    position: 'absolute',
    top: 10,
    left: 0,
    right: 0,
    alignItems: 'center',
  },
  title: {
    fontSize: scale(20),
    color: Color?.white,
    fontFamily: Font?.PoppinsMedium,
  },
  tabsContainer: {
    flexDirection: 'row',
    justifyContent: 'space-around',
    marginVertical: scale(8),
    backgroundColor: '#6BCB77',
    borderRadius: scale(4),
  },
  tabButton: {
    paddingVertical: scale(5),
    paddingHorizontal: 20,
    borderRadius: scale(4),
  },
  tabButtonActive: {
    backgroundColor: Color?.white,
  },
  tabText: {
    color: Color?.white,
    fontFamily: Font?.PoppinsMedium,
    fontSize: scale(15),
  },
  tabTextActive: {
    color: Color?.primaryColor,
  },
  pointText: {
    textAlign: 'center',
    width: '100%',
    fontFamily: Font?.PoppinsMedium,
    color: Color?.textColor,
    fontSize: scale(14),
  },
  subtitle: {
    color: Color?.white,
    fontSize: scale(14),
    textAlign: 'center',
    marginVertical: 10,
    fontFamily: Font?.Poppins,
  },
  topUsers: {
    flexDirection: 'row',
    justifyContent: 'space-evenly',
    marginTop: scale(40),
    width: '80%',
  },
  userCircle: {
    alignItems: 'center',
  },
  userImage: {
    width: scale(70),
    height: scale(70),
    borderRadius: scale(50),
    marginBottom: 5,
    borderColor: Color?.white,
    borderWidth: scale(3),
  },
  points: {
    color: Color?.white,
    fontFamily: Font?.PoppinsSemiBold,
  },
  rank: {
    color: Color?.primaryColor,
    backgroundColor: Color?.white,
    borderRadius: scale(50),
    width: scale(20),
    height: scale(20),
    textAlign: 'center',
    position: 'absolute',
    bottom: scale(-3),
  },
  bottomContainer: {
    backgroundColor: 'rgba(107, 203, 119, 0.3)',
    flex: 1,
    borderTopColor: Color?.primaryColor,
    borderTopWidth: 5,
    borderWidth: 0.1,
    borderTopEndRadius: scale(20),
    borderTopStartRadius: scale(20),
    paddingTop: 10,
    paddingHorizontal: 10,
  },
  userData: {
    backgroundColor: Color?.white,
    marginVertical: scale(5),
    flexDirection: 'row',
    width: '95%',
    alignSelf: 'center',
    borderRadius: scale(5),
    padding: scale(10),
    justifyContent: 'space-between',
  },
  text: {
    alignSelf: 'center',
    fontFamily: Font?.PoppinsMedium,
    color: Color?.textColor,
    fontSize: scale(15),
  },
  avatar: {
    width: scale(38),
    height: scale(38),
    borderRadius: scale(24),
    marginRight: scale(12),
    alignSelf: 'center',
  },
});
