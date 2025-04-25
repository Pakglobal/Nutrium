import React, { useState } from 'react'
import { SafeAreaView, StyleSheet, Text, View, TouchableOpacity, FlatList, Image } from 'react-native'
import { Color } from '../../../assets/styles/Colors'
import LeaderboardBackground from '../../../assets/Images/leaderBoardImg.svg'
import { scale } from 'react-native-size-matters'
import CustomShadow from '../../../Components/CustomShadow'
import { shadowStyle } from '../../../assets/styles/Shadow'
import AntDesign from 'react-native-vector-icons/AntDesign';
import { Font } from '../../../assets/styles/Fonts'
import { useNavigation } from '@react-navigation/native'

// const leaderboardData = [
//   { id: '4', name: 'Nina', points: 1250 },
//   { id: '5', name: 'Nina', points: 1220 },
//   { id: '6', name: 'Nina', points: 124578 },
//   { id: '7', name: 'Nina', points: 1050 },
//   { id: '8', name: 'Nina', points: 1200 },
//   { id: '8', name: 'Nina', points: 112457 },
//   { id: '8', name: 'Nina', points: 1010 },
// ]



const LeaderboardScreen = ({ route }) => {
  const navigation = useNavigation()
  const [activeTab, setActiveTab] = useState('Day');

  const participantData = route?.params?.item?.participants
  console.log('participantData', participantData)


  const renderItem = ({ item }) => {
    return (
      <CustomShadow radius={2} style={shadowStyle} color={Color?.lightgray} >
        <View style={styles?.userData} >
          <View style={{ flexDirection: 'row', width: '65%' }} >
            <Text style={styles.text}>{index + 1}.{'  '}</Text>
            <Image style={styles?.avatar} source={{ uri: item?.clientId?.image }} />
            <Text style={styles.text}>{item?.clientId?.fullName}</Text>
          </View>
          <View style={{ flexDirection: 'row', width: '32%', alignSelf: 'center' }} >
            <Text style={styles.pointText} >Points : <Text style={{ color: Color?.primaryColor }} >{item?.earnedCoins}</Text></Text>
          </View>
        </View>


      </CustomShadow>
    );
  };

  return (
    <SafeAreaView style={styles.container}>
      <View style={styles.headerBackground}>
        <LeaderboardBackground width="100%" height={scale(400)} style={{ top: -30 }} preserveAspectRatio="xMidYMid slice" />

        {/* Top Content */}
        <View style={styles.headerContent}>
          <View style={{
            flexDirection: 'row',
            width: '100%',
            justifyContent: 'space-between',
            paddingHorizontal: scale(10)
          }}>
            <TouchableOpacity style={{ alignSelf: "center", padding: scale(5) }} onPress={() => navigation.goBack()} >


              <AntDesign
                name="arrowleft"
                size={20}
                color={Color.white}
              />
            </TouchableOpacity>
            <Text style={styles.title}>Leaderboard</Text>
            <TouchableOpacity style={{ alignSelf: "center", padding: scale(5) }} >

              <AntDesign
                name="share"
                size={20}
                color={Color.white}
              />
            </TouchableOpacity>
          </View>


          <View style={styles.tabsContainer}>
            {['Day', 'Week', 'Month'].map((tab) => (
              <TouchableOpacity
                key={tab}
                style={[
                  styles.tabButton,
                  activeTab === tab && styles.tabButtonActive,
                ]}
                onPress={() => setActiveTab(tab)}
              >
                <Text
                  style={[
                    styles.tabText,
                    activeTab === tab && styles.tabTextActive,
                  ]}
                >
                  {tab}
                </Text>
              </TouchableOpacity>
            ))}
          </View>

          <Text style={styles.subtitle}>Burn 500 calories daily to climb the leaderboard.</Text>

          {/* Top 3 users (just sample placeholders) */}
          <View style={styles.topUsers}>
            <View style={styles.userCircle}>
              {/* <Image source={require('../../../assets/Images/user1.png')} style={styles.userImage} /> */}
              <Text style={styles.points}>1250</Text>
              <Text style={styles.rank}>3</Text>
            </View>

            <View style={[styles.userCircle, { marginTop: -20 }]}>
              {/* <Image source={require('../../../assets/Images/user2.png')} style={styles.userImage} /> */}
              <Text style={styles.points}>1280</Text>
              <Text style={styles.rank}>1</Text>
            </View>

            <View style={styles.userCircle}>
              {/* <Image source={require('../../../assets/Images/user3.png')} style={styles.userImage} /> */}
              <Text style={styles.points}>1260</Text>
              <Text style={styles.rank}>2</Text>
            </View>
          </View>
        </View>
      </View>

      <View style={styles.bottomContainer}>
        <FlatList
          showsVerticalScrollIndicator={false}
          data={participantData}
          keyExtractor={(item) => item}
          renderItem={({ item, index }) => (
            <CustomShadow radius={2} style={shadowStyle} color={Color?.lightgray}>
              <View style={styles?.userData}>
                <View style={{ flexDirection: 'row', width: '65%' }}>
                  <Text style={styles.text}>{index + 1}.{'  '}</Text>
                  <Image style={styles?.avatar} source={{ uri: item?.clientId?.image }} />
                  <Text style={styles.text}>{item?.clientId?.fullName}</Text>
                </View>
                <View style={{ flexDirection: 'row', width: '32%', alignSelf: 'center' }}>
                  <Text style={styles.pointText}>
                    Points : <Text style={{ color: Color?.primaryColor }}>{item?.earnedCoins}</Text>
                  </Text>
                </View>
              </View>
            </CustomShadow>
          )}
        />
      </View>
    </SafeAreaView>
  )
}

export default LeaderboardScreen

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
    borderRadius: scale(4)

  },
  tabButton: {
    paddingVertical: scale(8),
    paddingHorizontal: 20,
    borderRadius: scale(4)
  },
  tabButtonActive: {
    backgroundColor: Color?.white,
  },
  tabText: {
    color: Color?.white,
    fontFamily: Font?.PoppinsMedium,
    fontSize: scale(15)
  },
  tabTextActive: {
    color: Color?.primaryColor,
  },
  pointText: {
    textAlign: 'center',
    width: '100%',
    fontFamily: Font?.PoppinsMedium,
    color: Color?.textColor,
    fontSize: scale(15)
  },
  subtitle: {
    color: Color?.white,
    fontSize: 14,
    textAlign: 'center',
    marginVertical: 10,
  },
  topUsers: {
    flexDirection: 'row',
    justifyContent: 'space-evenly',
    marginTop: 10,
    width: '100%',
  },
  userCircle: {
    alignItems: 'center',
  },
  userImage: {
    width: 60,
    height: 60,
    borderRadius: 30,
    marginBottom: 5,
  },
  points: {
    color: Color?.white,
    fontWeight: 'bold',
  },
  rank: {
    color: Color?.white,
    backgroundColor: Color?.primary,
    borderRadius: 10,
    paddingHorizontal: 6,
    marginTop: 2,
  },
  bottomContainer: {
    backgroundColor: Color?.white,
    flex: 1,
    borderTopColor: Color?.primary,
    borderRadius: scale(20),
    paddingTop: 10,
    paddingHorizontal: 10,
  },
  listItem: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingVertical: 12,
    paddingHorizontal: 10,
  },
  userInfoContainer: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  rankContainer: {
    marginRight: 10,
  },
  rankNumber: {
    fontSize: 16,
    fontWeight: 'bold',
    color: Color?.primary,
  },
  avatar: {
    width: scale(38),
    height: scale(38),
    borderRadius: scale(24),
    marginRight: scale(12),
    alignSelf: 'center'
  },
  userName: {
    fontSize: 16,
    fontWeight: '500',
  },
  pointsContainer: {},
  pointsText: {
    fontSize: 16,
    fontWeight: '500',
    color: Color?.primary,
  },
  separator: {
    height: 1,
    backgroundColor: Color?.gray || '#EEEEEE',
  },
  userData: {
    backgroundColor: Color?.white,
    marginVertical: scale(5),
    flexDirection: 'row',
    width: "95%",
    alignSelf: 'center',
    borderRadius: scale(5),
    padding: scale(10),
    justifyContent: 'space-between'
  },
  text: {
    alignSelf: 'center',
    fontFamily: Font?.PoppinsMedium,
    color: Color?.textColor,
    fontSize: scale(15)

  }
})
