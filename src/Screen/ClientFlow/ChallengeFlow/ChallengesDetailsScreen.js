import React, { useState } from 'react';
import { StyleSheet, Text, View, TouchableOpacity, ActivityIndicator, Alert } from 'react-native';
import { useNavigation } from '@react-navigation/native';
import { verticalScale } from 'react-native-size-matters';
import AntDesign from 'react-native-vector-icons/AntDesign';
import { joinPublicChallenge } from '../../../Apis/ClientApis/ChallengesApi';
import { useSelector } from 'react-redux';

const ChallengesDetailsScreen = ({ route }) => {
    const navigation = useNavigation();
    const { challenge } = route.params;
    const userInfo = useSelector(state => state?.user?.userInfo);

    const [loading, setLoading] = useState(false);

    const totalParticipants = challenge?.participationLimit || 100;
    const joinedParticipants = challenge?.participants?.length || 0;
    const remainingParticipants = totalParticipants - joinedParticipants;
    const progress = joinedParticipants / totalParticipants;

    const handleJoinChllange = async () => {
        setLoading(true);
        try {
            const response = await joinPublicChallenge(userInfo?.token, userInfo?.userData?._id, challenge?._id);
            if (response?.message) {
                Alert.alert('Success', response.message, [
                    { text: 'OK', onPress: () => navigation.goBack() }
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
    return (
        <View style={styles.container}>
            {/* Back Button */}
            <TouchableOpacity style={styles.backButton} onPress={() => navigation.goBack()}>
                <AntDesign name="arrowleft" color={"#3F3F4E"} size={verticalScale(22)} />
            </TouchableOpacity>

            {/* Challenge Details */}
            <Text style={styles.title}>{challenge.name}</Text>
            <Text>Type: {challenge?.type?.unitLabel}</Text>
            <Text>Start Date: {challenge.startDate}</Text>
            <Text>End Date: {challenge.endDate}</Text>
            <Text>Goal: {challenge.goal}</Text>
            <Text>Privacy: {challenge.privacy}</Text>
            <Text>Reward: {challenge.coinReward} Coins</Text>

            {/* Progress Section */}
            <View style={styles.progressContainer}>
                <Text style={styles.progressText}>
                    Joined: {joinedParticipants} / {totalParticipants}
                </Text>

                {/* Progress Bar */}
                <View style={styles.progressBarBackground}>
                    <View style={[styles.progressBarFill, { width: `${progress * 100}%` }]} />
                </View>

                <Text style={styles.remainingText}>
                    Remaining: {remainingParticipants} people left
                </Text>
            </View>

            {/* Buttons */}
            <View style={styles.buttonContainer}>
                <TouchableOpacity style={styles.joinButton} onPress={handleJoinChllange} disabled={loading}>
                    {loading ? (
                        <ActivityIndicator color="white" />
                    ) : (
                        <Text style={styles.buttonText}>Join Challenge</Text>
                    )}
                </TouchableOpacity>

                <TouchableOpacity style={styles.cancelButton} onPress={() => navigation.goBack()}>
                    <Text style={styles.buttonText}>Cancel</Text>
                </TouchableOpacity>
            </View>
        </View>
    );
}

export default ChallengesDetailsScreen;

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
        fontSize: 20,
        fontWeight: 'bold',
        marginBottom: 10,
    },
    progressContainer: {
        marginVertical: 20,
        alignItems: 'center',
    },
    progressText: {
        fontSize: 16,
        marginBottom: 5,
        fontWeight: 'bold',
    },
    progressBarBackground: {
        width: '100%',
        height: 10,
        backgroundColor: '#ddd', 
        borderRadius: 5,
        overflow: 'hidden',
    },
    progressBarFill: {
        height: '100%',
        backgroundColor: '#4CAF50',
        borderRadius: 5,
    },
    remainingText: {
        fontSize: 14,
        marginTop: 5,
        color: 'gray',
    },
    buttonContainer: {
        position: 'absolute',
        bottom: 20,
        left: 20,
        right: 20,
    },
    joinButton: {
        backgroundColor: 'green',
        padding: 15,
        borderRadius: 5,
        marginBottom: 10,
        alignItems: 'center',
    },
    cancelButton: {
        backgroundColor: 'red',
        padding: 15,
        borderRadius: 5,
        alignItems: 'center',
    },
    buttonText: {
        color: 'white',
        fontSize: 16,
        fontWeight: 'bold',
    },
});