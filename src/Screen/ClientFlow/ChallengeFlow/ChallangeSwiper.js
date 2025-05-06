import React, {useState, useEffect, useCallback} from 'react';
import {
  View,
  Dimensions,
  TouchableOpacity,
  Text,
  ActivityIndicator,
} from 'react-native';
import {TabView, SceneMap} from 'react-native-tab-view';
import Icon from 'react-native-vector-icons/FontAwesome';
import AllChallenges from './AllChallenges';
import JoinChallenges from './JoinChallenges';
import {
  useFocusEffect,
  useIsFocused,
  useNavigation,
} from '@react-navigation/native';
import {useSelector} from 'react-redux';
import {
  getAllChallenge,
  getAllChallengeJoinDatawithId,
} from '../../../Apis/ClientApis/ChallengesApi';
import {Color} from '../../../assets/styles/Colors';
import {scale} from 'react-native-size-matters';
import {Font} from '../../../assets/styles/Fonts';
import InvitationScreen from './InvitationScreen';

const ChallangeSwiper = () => {
  const [index, setIndex] = useState(0);
  const navigation = useNavigation();
  const [allChallengeData, setAllChallengeData] = useState([]);
  const [allChallengeJoinData, setAllChallengeJoinData] = useState([]);
  const [loadingAll, setLoadingAll] = useState(false);
  const [loadingJoin, setLoadingJoin] = useState(false);
  
  useEffect(() => {
    if (index === 0 && allChallengeData.length === 0) {
      fetchChallangeDetails();
    } else if (index === 1 && allChallengeJoinData.length === 0) {
      fetchChallangeJoinData();
    }
  }, [index]);

  const userInfo = useSelector(state => state?.user?.userInfo);

  const [routes] = useState([
    {key: 'all', title: 'All Challenge'},
    {key: 'join', title: 'Join Challenge'},
    {key: 'invitation', title: 'Invitation'},
  ]);

  const fetchChallangeDetails = async () => {
    setLoadingAll(true);
    const response = await getAllChallenge(userInfo?.token);
    setAllChallengeData(response?.success ? response?.challenges : []);
    setLoadingAll(false);
  };

  const fetchChallangeJoinData = async () => {
    setLoadingJoin(true);
    const response = await getAllChallengeJoinDatawithId(
      userInfo?.token,
      userInfo?.userData?._id,
    );
    setAllChallengeJoinData(response?.success ? response?.challenges : []);
    setLoadingJoin(false);
  };

  const renderScene = SceneMap({
    all: () =>
      loadingAll ? (
        <ActivityIndicator
          size="large"
          color={Color.primaryColor}
          style={{marginTop: 20}}
        />
      ) : (
        <AllChallenges challenges={allChallengeData} onJoin={handleJoin} />
      ),
    join: () =>
      loadingJoin ? (
        <ActivityIndicator
          size="large"
          color={Color.primaryColor}
          style={{marginTop: 20}}
        />
      ) : (
        <JoinChallenges
          challenges={allChallengeJoinData}
          onJoin={viewHandleJoinChallenge}
        />
      ),
    invitation: () => <InvitationScreen />,
  });

  const handleJoin = challenge => {
    navigation.navigate('ChallengesDetailsScreen', {challenge});
  };

  const viewHandleJoinChallenge = challenge => {
    navigation.navigate('ViewChallengDetailsScreen', {challenge});
  };

  const renderTabBar = props => (
    <View style={{}}>
      <View
        style={{
          flexDirection: 'row',
          backgroundColor: '#e1f3e1',
          borderRadius: 12,
          overflow: 'hidden',
          justifyContent: 'space-around',
          padding: scale(6),
        }}>
        {props.navigationState.routes.map((route, i) => {
          const isSelected = index === i;
          return (
            <TouchableOpacity
              key={route.key}
              onPress={() => setIndex(i)}
              style={{
                paddingVertical: 8,
                paddingHorizontal: 16,
                borderRadius: scale(6),
                backgroundColor: isSelected
                  ? Color?.primaryColor
                  : 'transparent',
              }}>
              <Text
                style={{
                  color: isSelected ? Color.white : Color.primaryColor,
                  fontWeight: '500',
                  fontSize: 14,
                  fontFamily: Font?.Poppins,
                }}>
                {route.title}
              </Text>
            </TouchableOpacity>
          );
        })}
      </View>
    </View>
  );

  return (
    <TabView
      navigationState={{index, routes}}
      renderScene={renderScene}
      onIndexChange={setIndex}
      initialLayout={{width: Dimensions.get('window').width}}
      renderTabBar={renderTabBar}
      lazy
    />
  );
};

export default ChallangeSwiper;
