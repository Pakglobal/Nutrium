import { useNavigation } from '@react-navigation/native';
import React, { useEffect, useState } from 'react';
import { StyleSheet, Text, View, TextInput, Button, Alert, Switch, ScrollView, TouchableOpacity, Modal } from 'react-native';
import DatePicker from 'react-native-date-picker';
import InviteFriendsModal from './InviteFriendsModal';
import { useSelector } from 'react-redux';
import CustomDropdown1 from './CustomDropdown1';
import { createChallenge, getChallengeRange, getChallengeType } from '../../../Apis/ClientApis/ChallengesApi';

const CreateChallenge = () => {
    const navigation = useNavigation();
    const [challengeName, setChallengeName] = useState('');
    const [challengeType, setChallengeType] = useState(null);
    const [challengeTypeId, setChallengeTypeId] = useState(null);
    const [startDate, setStartDate] = useState(new Date());
    const [endDate, setEndDate] = useState(new Date());
    const [description, setDescription] = useState('');
    const [targetGoal, setTargetGoal] = useState('');
    const [participantsLimit, setParticipantsLimit] = useState(100);
    const [coinReward, setCoinReward] = useState();
    const [isPublic, setIsPublic] = useState(false);
    const [inviteMethod, setInviteMethod] = useState('email');
    const [isDatePickerOpen, setIsDatePickerOpen] = useState(false);
    const [selectedDateField, setSelectedDateField] = useState('start');
    const [isInviteModalVisible, setInviteModalVisible] = useState(false);
    const [challengeTypeOptions, setChallengeTypeOptions] = useState([]);
    const [challengeRange, setChallengeRangeOptions] = useState([]);
    const [selectChallengeRange, setselectChallengeRange] = useState(null);
    const [loading, setLoading] = useState(false);
    const [selectedFriend, setSelectedFriend] = useState([])

    const userInfo = useSelector(state => state?.user?.userInfo);
    useEffect(() => {
        FetchChallangeTypeData()
    }, [])

    const FetchChallangeTypeData = async () => {
        try {
            const response = await getChallengeType(userInfo?.token);
            if (response?.success) {
                setChallengeTypeOptions(response?.data)
            } else {
            }
        } catch (error) {
            console.error('Error fetching appointments:', error);
            //   setLoading(false);
        }
    };

    const isValidEndDate = (startDate, endDate) => {
        const diffTime = endDate.getTime() - startDate.getTime();
        const diffDays = diffTime / (1000 * 3600 * 24);
        return diffDays >= 2;
    };

    const validateForm = () => {
        if (!challengeName || !startDate || !endDate || !description || !targetGoal || !participantsLimit || !coinReward) {
            Alert.alert('Error', 'All fields are required!');
            return false;
        }
        return true;
    };

    const handleDateConfirm = (date) => {
        setIsDatePickerOpen(false);
        if (selectedDateField === 'start') {
            setStartDate(date);
        } else {
            if (isValidEndDate(startDate, date)) {
                setEndDate(date);
            } else {
                Alert.alert('Error', 'End Date must be at least 2 days after the Start Date.');
            }
        }
    };

    const handleSubmit = async () => {
        if (!validateForm()) return;
        setLoading(true); // 👈 Start loader

        const challengeData = {
            name: challengeName,
            type: challengeTypeId,
            description,
            startDate: startDate.toISOString(),
            endDate: endDate.toISOString(),
            targetValue: parseInt(targetGoal),
            participationLimit: parseInt(participantsLimit),
            privacy: isPublic ? 'private' : 'public',
            rewardRange: selectChallengeRange?._id,
            selectedClients: selectedFriend,
        };

        try {
            const response = await createChallenge(
                userInfo?.token,
                userInfo?.userData?._id,
                challengeData
            );

            if (response?.message) {
                Alert.alert('Success', response.message, [
                    { text: 'OK', onPress: () => navigation.goBack() },
                ]);
            }
        } catch (error) {
            console.error('Create Challenge Error:', error);

            if (error?.response) {
                const statusCode = error.response.status;
                const message = error.response.data?.message || 'Something went wrong';
                Alert.alert(`Error ${statusCode}`, message);
            } else {
                Alert.alert('Error', 'Network error or server not responding');
            }
        } finally {
            setLoading(false);
        }

    };

    const handleSlectChalangeType = async (value) => {
        try {

            setChallengeType(value?.value)
            setChallengeTypeId(value?._id)
            const response = await getChallengeRange(userInfo?.token, value?._id);
            if (response?.success) {
                setChallengeRangeOptions(response?.data)
            } else {
            }
            //   setLoading(false);
        } catch (error) {
            console.error('Error fetching appointments1515:', error);
            //   setLoading(false);
        }
    }
    const handleSlectChalangeRangeType = (value) => {
        setCoinReward(value?.coin)
        setselectChallengeRange(value)

    }

    return (
        <ScrollView style={styles.container}>
            <Text style={styles.header}>Create Challenge</Text>

            <Text>Challenge Name</Text>
            <TextInput style={styles.input} placeholder="Enter challenge name" value={challengeName} onChangeText={setChallengeName} />

            <Text style={{ marginBottom: 10 }}>Challenge Type</Text>
            {/* <TextInput style={styles.input} value={challengeType} onChangeText={setChallengeType} /> */}
            <CustomDropdown1 data={challengeTypeOptions} onSelect={(e) => handleSlectChalangeType(e)} value={challengeType} />
            <Text style={{ marginBottom: 10 }}>Challenge Range</Text>
            {/* <TextInput style={styles.input} value={challengeType} onChangeText={setChallengeType} /> */}
            <CustomDropdown1 data={challengeRange} onSelect={(e) => handleSlectChalangeRangeType(e)} value={selectChallengeRange?.value} />

            <Text>Coin Reward</Text>
            <Text style={styles.input}>{coinReward}</Text>
            <Text>Select Start and End Dates</Text>
            <TouchableOpacity style={[styles.input, { justifyContent: 'center' }]} onPress={() => {
                setSelectedDateField('start');
                setIsDatePickerOpen(true);
            }}>
                <Text>{`Start Date: ${startDate?.toLocaleDateString()}`}</Text>
            </TouchableOpacity>

            <TouchableOpacity style={[styles.input, { justifyContent: 'center' }]} onPress={() => {
                setSelectedDateField('end');
                setIsDatePickerOpen(true);
            }}>
                <Text>{`End Date: ${endDate?.toLocaleDateString()}`}</Text>
            </TouchableOpacity>

            <DatePicker modal mode="date" open={isDatePickerOpen} date={selectedDateField === 'start' ? startDate : endDate} onConfirm={handleDateConfirm} onCancel={() => setIsDatePickerOpen(false)} />

            <Text>Challenge Description</Text>
            <TextInput style={styles.input} placeholder="Enter description" value={description} onChangeText={setDescription} multiline />

            <Text>Target Goal ({challengeType})</Text>
            <TextInput style={styles.input} placeholder={`Enter target goal for ${challengeType}`} keyboardType="numeric" value={targetGoal} onChangeText={setTargetGoal} />

            <Text>Participants Limit</Text>
            <TextInput style={styles.input} placeholder="Enter participant limit" keyboardType="numeric" value={participantsLimit.toString()} onChangeText={(val) => setParticipantsLimit(parseInt(val) || 0)} />


            <Text>Privacy</Text>
            <View style={styles.switchContainer}>
                <Text>Public</Text>
                <Switch value={isPublic} onValueChange={setIsPublic} />
                <Text>Private</Text>
            </View>

            {/* Invite Friends Button (Only for Private Challenges) */}
            {isPublic && (
                <TouchableOpacity style={styles.inviteButton} onPress={() => setInviteModalVisible(true)}>
                    <Text style={styles.inviteButtonText}>Invite Friends</Text>
                </TouchableOpacity>
            )}

            <Button title={loading ? 'Creating...' : 'Create Challenge'}
                onPress={handleSubmit}
                disabled={loading} />

            {/* Invite Friends Bottom Sheet Modal */}
            <InviteFriendsModal
                onClose={() => setInviteModalVisible(false)}
                isInviteModalVisible={isInviteModalVisible}
                setInviteModalVisible={setInviteModalVisible}
                onInvite={(selectedFriends) => {
                    setSelectedFriend(selectedFriends)
                    setInviteModalVisible(false);
                }}
            />
        </ScrollView>
    );
};

const styles = StyleSheet.create({
    container: {
        paddingHorizontal: 20,
        backgroundColor: 'white',
        flex: 1,
    },
    header: {
        fontSize: 24,
        fontWeight: 'bold',
        textAlign: 'center',
        marginBottom: 20,
    },
    input: {
        height: 40,
        borderColor: '#ccc',
        borderWidth: 1,
        marginBottom: 10,
        paddingLeft: 10,
        fontSize: 16,
    },
    switchContainer: {
        flexDirection: 'row',
        alignItems: 'center',
        marginBottom: 25,
    },
    inviteButton: {
        backgroundColor: '#4CAF50',
        padding: 10,
        borderRadius: 5,
        alignItems: 'center',
        marginBottom: 10,
    },
    inviteButtonText: {
        color: 'white',
        fontSize: 16,
        fontWeight: 'bold',
    },
    progressText: {
        marginTop: 10,
        fontSize: 16,
        fontWeight: 'bold',
    },
    progressBarContainer: {
        width: '100%',
        height: 10,
        backgroundColor: '#ccc',
        borderRadius: 5,
        overflow: 'hidden',
        marginBottom: 20,
    },
    progressBar: {
        height: '100%',
        backgroundColor: '#4CAF50',
    },
    modalContainer: {
        flex: 1,
        justifyContent: 'flex-end',
        backgroundColor: 'rgba(0,0,0,0.5)',
    },
    modalContent: {
        backgroundColor: 'white',
        padding: 20,
        borderTopLeftRadius: 20,
        borderTopRightRadius: 20,
    },
    modalTitle: {
        fontSize: 18,
        fontWeight: 'bold',
        marginBottom: 10,
    },
});

export default CreateChallenge;
