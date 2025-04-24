import React, { useState, useEffect, useCallback } from 'react';
import { View, Dimensions, TouchableOpacity, Text, StyleSheet } from 'react-native';
import { TabView, SceneMap } from 'react-native-tab-view';
import Icon from 'react-native-vector-icons/FontAwesome';
import AllChallenges from './AllChallenges';
import JoinChallenges from './JoinChallenges';
import { useFocusEffect, useIsFocused, useNavigation } from '@react-navigation/native';
import { useSelector } from 'react-redux';
import { getAllChallenge, getAllChallengeJoinDatawithId } from '../../../Apis/ClientApis/ChallengesApi';
import { Color } from '../../../assets/styles/Colors';
import { scale } from 'react-native-size-matters';
import { Font } from '../../../assets/styles/Fonts';

const ChallangeSwiper = ({onTabChange}) => {
    const [index, setIndex] = useState(0);
    const navigation = useNavigation()
    const [allChallengeData, setAllChallengeData] = useState([])
    const [allChallengeJoinData, setAllChallengeJoinData] = useState([])

    const userInfo = useSelector(state => state?.user?.userInfo);


    const [routes] = useState([
        { key: 'all', title: 'All Challenge' },
        { key: 'join', title: 'Join Challenge' },
        { key: 'invitation', title: 'Invitation' },
    ]);


  useEffect(() => {
    if (onTabChange) {
      onTabChange(routes[index].title);
    }
  }, [index]);

    const InvitationScreen = () => (
        <View style={{ flex: 1, justifyContent: 'center', alignItems: 'center' }}>
            <Text style={styles.text} >No Invitations</Text>
        </View>
    );
    const [joinedChallenges, setJoinedChallenges] = useState([]);

    const isFocused = useIsFocused();
    useEffect(() => {
        if (isFocused) {
            fetchChallangeDetails();
            fetchChallangeJoinData()
        }
    }, [isFocused]);

    const fetchChallangeDetails = async () => {
        const response = await getAllChallenge(userInfo?.token)
        if (response?.success == true) {
            setAllChallengeData(response?.challenges)
        } else {
            setAllChallengeData([])
        }


    }
    const fetchChallangeJoinData = async () => {
        const response = await getAllChallengeJoinDatawithId(userInfo?.token, userInfo?.userData?._id)
        if (response?.success == true) {
            setAllChallengeJoinData(response?.challenges)
        } else {
            setAllChallengeData([])
        }
    }
    const renderScene = SceneMap({
        all: () => <AllChallenges challenges={allChallengeData} onJoin={handleJoin} />,
        join: () => <JoinChallenges challenges={allChallengeJoinData} onJoin={viewHandleJoinChallenge} />,
        invitation: InvitationScreen,
    });

    const handleJoin = (challenge) => {
        navigation.navigate('ChallengesDetailsScreen', { challenge });
    };
    const viewHandleJoinChallenge = (challenge) => {
        navigation.navigate('ViewChallengDetailsScreen', { challenge });
    };

    const renderTabBar = (props) => (
        <View style={{}}>
            <View style={{
                flexDirection: 'row',
                backgroundColor: '#e1f3e1',
                borderRadius: scale(6),
                overflow: 'hidden',
                justifyContent: 'space-around',
                padding: scale(6)
            }}>
                {props.navigationState.routes.map((route, i) => {
                    const isSelected = index === i;
                    return (
                        <TouchableOpacity
                            key={route.key}
                            onPress={() => setIndex(i)}
                            style={{
                                paddingVertical: scale(5),
                                paddingHorizontal: scale(15),
                                borderRadius: scale(6),
                                backgroundColor: isSelected ? Color?.primaryColor : 'transparent',
                            }}
                        >
                            <Text style={{
                                color: isSelected ? Color.white : Color.primaryColor,
                                fontWeight: '500',
                                fontSize: 14,
                                fontFamily: Font?.Poppins
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
            navigationState={{ index, routes }}
            renderScene={renderScene}
            onIndexChange={setIndex}
            initialLayout={{ width: Dimensions.get('window').width }}
            renderTabBar={renderTabBar}
        />
    );
};

export default ChallangeSwiper;

const styles=StyleSheet.create({
text:{
    color:Color.textColor,
    fontFamily:Font?.Poppins
}
})