import React, {useEffect, useState} from 'react';
import {StyleSheet, Text, TouchableOpacity, View, FlatList} from 'react-native';
import {useNavigation} from '@react-navigation/native';
import AntDesign from 'react-native-vector-icons/AntDesign';
import {verticalScale} from 'react-native-size-matters';
import {getChallengeLederBoardData} from '../../../Apis/ClientApis/ChallengesApi';
import {useSelector} from 'react-redux';

// Static JSON data

const ViewChallengDetailsScreen = ({route}) => {
  const navigation = useNavigation();
  const {challenge} = route.params;
  const userInfo = useSelector(state => state?.user?.userInfo);
  const [lederbordData, setLeaderbordData] = useState([]);
  useEffect(() => {
    fetchLeaderbordData();
  }, []);

  const fetchLeaderbordData = async () => {
    const responce = await getChallengeLederBoardData(
      userInfo?.token,
      challenge?._id,
    );

    if (responce?.leaderboard) {
      setLeaderbordData(responce?.leaderboard);
    } else {
      setLeaderbordData([]);
    }
  };

  const renderItem = ({item}) => {
    return (
      <View style={styles.card}>
        <Text style={styles.username}>
          #{item?.rank} - {item?.fullName}
        </Text>
        <Text>Total Score: {item.progress}</Text>
        <View style={styles.dateScoreBox}></View>
      </View>
    );
  };

  return (
    <View style={styles.container}>
      {/* Back Button */}
      <TouchableOpacity
        style={styles.backButton}
        onPress={() => navigation.goBack()}>
        <AntDesign
          name="arrowleft"
          color={'#3F3F4E'}
          size={verticalScale(22)}
        />
      </TouchableOpacity>

      <Text style={styles.title}>{challenge.name} - Leaderboard</Text>

      <FlatList
        data={lederbordData}
        keyExtractor={item => item?._id?.toString()}
        renderItem={renderItem}
        contentContainerStyle={{paddingBottom: 20}}
      />
    </View>
  );
};

export default ViewChallengDetailsScreen;

const styles = StyleSheet.create({
  container: {
    flex: 1,
    padding: 20,
    backgroundColor: '#fff',
  },
  backButton: {
    marginBottom: 15,
  },
  title: {
    fontSize: 18,
    fontWeight: 'bold',
    marginBottom: 10,
  },
  card: {
    padding: 15,
    backgroundColor: '#f0f0f0',
    borderRadius: 8,
    marginBottom: 15,
  },
  username: {
    fontWeight: 'bold',
    fontSize: 16,
    marginBottom: 5,
  },
  dateScoreBox: {
    marginTop: 5,
  },
});
