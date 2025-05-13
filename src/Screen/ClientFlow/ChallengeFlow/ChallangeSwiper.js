import React, {useState, useEffect, useCallback} from 'react';
import {
  View,
  Dimensions,
  TouchableOpacity,
  Text,
  ActivityIndicator,
} from 'react-native';
import {TabView, SceneMap} from 'react-native-tab-view';
import {useFocusEffect, useNavigation} from '@react-navigation/native';
import {useSelector} from 'react-redux';
import {
  getAllChallenge,
  getAllChallengeJoinDatawithId,
  getAllChallengePendingRequest,
} from '../../../Apis/ClientApis/ChallengesApi';
import {Color} from '../../../assets/styles/Colors';
import {moderateScale, scale, verticalScale} from 'react-native-size-matters';
import {Font} from '../../../assets/styles/Fonts';
import AllChallenges from './AllChallenges';
import JoinChallenges from './JoinChallenges';
import InvitationScreen from './InvitationScreen';

const ChallengeSwiper = ({onTabChange}) => {
  const [index, setIndex] = useState(0);
  const navigation = useNavigation();
  const [allChallengeData, setAllChallengeData] = useState([]);
  const [allChallengeJoinData, setAllChallengeJoinData] = useState([]);
  const [requests, setRequests] = useState([]);
  const [loading, setLoading] = useState(false);

  const tokenId = useSelector(state => state?.user?.token);
  const guestTokenId = useSelector(state => state?.user?.guestToken);
  const token = tokenId?.token || guestTokenId?.token;
  const id = tokenId?.id || guestTokenId?.id;

  const fetchChallangeDetails = useCallback(async () => {
    setLoading(true);
    try {
      const response = await getAllChallenge(token, id);
      setAllChallengeData(response?.challenges || response?.challenge || []);
    } catch (error) {
      console.error('Error fetching challenges:', error);
      setAllChallengeData([]);
    } finally {
      setLoading(false);
    }
  }, []);

  const fetchChallangeJoinData = useCallback(async () => {
    setLoading(true);
    try {
      const response = await getAllChallengeJoinDatawithId(token, id);
      setAllChallengeJoinData(
        response?.success && Array.isArray(response?.challenges)
          ? response.challenges
          : [],
      );
    } catch (error) {
      console.error('Error fetching joined challenges:', error);
      setAllChallengeJoinData([]);
    } finally {
      setLoading(false);
    }
  }, []);

  const getJoiningRequest = useCallback(async () => {
    setLoading(true);
    try {
      const response = await getAllChallengePendingRequest(token, id);
      if (response?.success) {
        setRequests(response?.challenges || []);
      }
    } catch (error) {
      console.error('Error fetching pending requests:', error);
      setRequests([]);
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    if (index === 0) {
      fetchChallangeDetails();
    } else if (index === 1) {
      fetchChallangeJoinData();
    } else if (index === 2) {
      getJoiningRequest();
    }
  }, [index, fetchChallangeDetails, fetchChallangeJoinData, getJoiningRequest]);

  const routes = [
    {key: 'all', title: 'All Challenges'},
    {key: 'join', title: 'Joined Challenges'},
    {key: 'invitation', title: 'Invitations'},
  ];

  const renderScene = SceneMap({
    all: () =>
      loading ? (
        <ActivityIndicator
          size="large"
          color={Color.primaryColor}
          style={{marginTop: verticalScale(20)}}
        />
      ) : (
        <AllChallenges challenges={allChallengeData} onJoin={handleJoin} />
      ),
    join: () =>
      loading ? (
        <ActivityIndicator
          size="large"
          color={Color.primaryColor}
          style={{marginTop: verticalScale(20)}}
        />
      ) : (
        <JoinChallenges
          challenges={allChallengeJoinData}
          onJoin={viewHandleJoinChallenge}
        />
      ),
    invitation: () =>
      loading ? (
        <ActivityIndicator
          size="large"
          color={Color.primaryColor}
          style={{marginTop: verticalScale(20)}}
        />
      ) : (
        <InvitationScreen challenges={requests} setRequests={setRequests} />
      ),
  });

  const handleJoin = challenge => {
    navigation.navigate('ChallengesDetailsScreen', {challenge});
  };

  const viewHandleJoinChallenge = challenge => {
    navigation.navigate('ViewChallengDetailsScreen', {challenge});
  };

  useEffect(() => {
    if (onTabChange) {
      onTabChange(routes[index].title);
    }
  }, [index, onTabChange]);

  const renderTabBar = props => (
    <View
      style={{
        flexDirection: 'row',
        backgroundColor: Color.challengeBg,
        borderRadius: moderateScale(12),
        overflow: 'hidden',
        justifyContent: 'space-around',
        padding: scale(6),
        marginVertical: verticalScale(5),
      }}>
      {props.navigationState.routes.map((route, i) => {
        const isSelected = index === i;
        return (
          <TouchableOpacity
            key={route.key}
            onPress={() => setIndex(i)}
            style={{
              padding: scale(8),
              borderRadius: scale(6),
              backgroundColor: isSelected ? Color.primaryColor : 'transparent',
            }}>
            <Text
              style={{
                color: isSelected ? Color.white : Color.primaryColor,
                fontWeight: '500',
                fontSize: moderateScale(13),
                fontFamily: Font.Poppins,
              }}>
              {route.title}
            </Text>
          </TouchableOpacity>
        );
      })}
    </View>
  );

  return (
    <TabView
      navigationState={{index, routes}}
      renderScene={renderScene}
      onIndexChange={setIndex}
      initialLayout={{width: Dimensions.get('window').width}}
      renderTabBar={renderTabBar}
      lazy={false}
    />
  );
};

export default ChallengeSwiper;
