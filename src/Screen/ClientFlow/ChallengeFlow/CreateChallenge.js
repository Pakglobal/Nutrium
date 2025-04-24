import { useNavigation } from '@react-navigation/native';
import React, { useEffect, useState } from 'react';
import { StyleSheet, Text, View, TextInput, Button, Alert, Switch, ScrollView, TouchableOpacity, Modal, SafeAreaView, Keyboard } from 'react-native';
import DatePicker from 'react-native-date-picker';
import InviteFriendsModal from './InviteFriendsModal';
import { useSelector } from 'react-redux';
import CustomDropdown1 from './CustomDropdown1';
import { createChallenge, getChallengeRange, getChallengeType } from '../../../Apis/ClientApis/ChallengesApi';
import CustomAlertBox from '../../../Components/CustomAlertBox';
import { Color } from '../../../assets/styles/Colors';
import { Font } from '../../../assets/styles/Fonts';
import { scale, verticalScale } from 'react-native-size-matters';
import Header from '../../../Components/Header';
import CustomeDropDown from '../../../Components/CustomeDropDown';
import CustomShadow from '../../../Components/CustomShadow';
import { shadowStyle } from '../../../assets/styles/Shadow';
import MaterialIcons from 'react-native-vector-icons/MaterialIcons';
import MaterialCommunityIcons from 'react-native-vector-icons/MaterialCommunityIcons';
import ErrorModal from '../../../Components/CustomAlertBox';



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
    const [alertVisible, setAlertVisible] = useState(false);
    const [alertType, setAlertType] = useState('success'); // 'success' or 'error'
    const [alertMessage, setAlertMessage] = useState('');
    const [selected, setSelected] = useState('Private');

    console.log('selectedFriend', selectedFriend)
    const userInfo = useSelector(state => state?.user?.userInfo);
    useEffect(() => {
        FetchChallangeTypeData()
    }, [])

    const FetchChallangeTypeData = async () => {
        try {
            const response = await getChallengeType(userInfo?.token);
            if (response?.success) {
                setChallengeTypeOptions(response?.data)
                console.log('response?.data', response?.data)
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
            // Instead of using Alert.alert, use your custom alert component
            setAlertType('error');
            setAlertMessage('All fields are required!');
            setAlertVisible(true);
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
        setLoading(true); // Start loader

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
                setAlertType('success');
                setAlertMessage(response.message);
                setAlertVisible(true);
            } else {
                // Handle case where response exists but has no message
                setAlertType('success');
                setAlertMessage('Challenge created successfully');
                setAlertVisible(true);
            }

        } catch (error) {
            console.error('Create Challenge Error:', error);

            if (error?.response) {
                setAlertType('error');
                // Extract status code and message properly
                const statusCode = error.response.status || '';
                const message = error.response.data?.message || 'An error occurred';
                setAlertMessage(message); // Simplified message for better UX
                setAlertVisible(true);
            } else {
                setAlertType('error');
                setAlertMessage('Something went wrong!');
                setAlertVisible(true);
            }
        } finally {
            setLoading(false); // Stop loader regardless of success or failure
        }
    };
    const handleSlectChalangeType = async (item) => {
        if (!item || !item._id) {
            console.warn('Invalid challenge type selected:', item);
            return;
        }
        console.log('item', item)

        setChallengeType(item?.value);
        setChallengeTypeId(item?._id);

        try {
            const response = await getChallengeRange(userInfo?.token, item._id);
            if (response?.success) {
                setChallengeRangeOptions(response?.data);
            }
        } catch (error) {
            console.error('Error fetching challenge range:', error);
        }
    };


    // const handleSlectChalangeType = async (value) => {
    //     try {
    //         console.log('value==', value)

    //         setChallengeType(value)
    //         setChallengeTypeId(value?._id)
    //         console.log('userInfo?.token,value', userInfo?.token, value)
    //         const response = await getChallengeRange(userInfo?.token, value?._id);
    //         console.log('response', userInfo?.token, value)
    //         if (response?.success) {
    //             setChallengeRangeOptions(response?.data)
    //         } else {
    //         }
    //         //   setLoading(false);
    //     } catch (error) {
    //         console.error('Error fetching appointments1515:', error);
    //         //   setLoading(false);
    //     }
    // }
    const handleSlectChalangeRangeType = (value) => {
        setCoinReward(value?.coin)
        console.log('coinReward', coinReward)
        setselectChallengeRange(value)

    }
    console.log('challengeType', challengeTypeOptions)

    return (
        <SafeAreaView style={styles?.mainContainer} >
            <Header logoHeader={true} />
            <ScrollView style={styles.container}>
                <Text style={styles.header}>Create Challenge</Text>

                <Text style={styles.nameText} >Challenge Name</Text>
                <CustomShadow radius={1} style={shadowStyle} >
                    <TextInput
                        style={styles.input}
                        placeholder="Enter challenge name"
                        placeholderTextColor={Color?.gray}

                        fontFamily={Font?.Poppins}
                        value={challengeName}
                        onChangeText={setChallengeName} />
                </CustomShadow>

                <Text style={styles?.nameText}>Challenge Type</Text>
                {/* <CustomDropdown1
                    data={challengeTypeOptions}
                    onSelect={(e) => handleSlectChalangeType(e)}
                    value={challengeType} /> */}
                <CustomeDropDown
                    items={challengeTypeOptions}
                    selectedItem={challengeType || 'Select Challenge'}
                    onSelect={(e) => handleSlectChalangeType(e)}
                    textStyle={!challengeType ? { color: Color.textColor } : {}}
                />
                <Text style={styles?.nameText}>Challenge Range</Text>
                {/* <TextInput style={styles.input} value={challengeType} onChangeText={setChallengeType} /> */}
                {/* <CustomDropdown1
                    data={challengeRange}
                    onSelect={(e) => handleSlectChalangeRangeType(e)}
                    value={selectChallengeRange?.value} /> */}

                <CustomeDropDown
                    items={challengeRange}
                    selectedItem={selectChallengeRange?.value || 'Select Range'}
                    onSelect={(e) => handleSlectChalangeRangeType(e)}
                    textStyle={!selectChallengeRange?.value ? { color: Color.textColor } : {}}
                />

                <Text style={styles?.nameText}  >Coin Reward</Text>
                <CustomShadow radius={1} style={shadowStyle} >
                    <View style={[styles?.input, { justifyContent: "center" }]}>
                        <Text style={{ color: Color?.black }}>{coinReward}</Text>
                    </View>
                </CustomShadow>
                <View style={{ flexDirection: "row", justifyContent: 'space-between' }} >
                    <View style={{ width: '48%' }} >
                        <Text style={styles.nameText}>Select Start Date</Text>
                        <CustomShadow radius={1} style={shadowStyle}>
                            <TouchableOpacity
                                activeOpacity={0.7}
                                style={[styles.input, { flexDirection: 'row', alignItems: 'center', justifyContent: 'space-between' }]}
                                onPress={() => {
                                    setSelectedDateField('start');
                                    setIsDatePickerOpen(true);
                                }}
                            >
                                <Text style={{ color: Color.black, fontFamily: Font?.Poppins }}>
                                    {startDate ? startDate.toLocaleDateString() : 'Start Date'}
                                </Text>
                                <MaterialCommunityIcons
                                    name="calendar-month"
                                    color={Color?.primaryColor}
                                    size={20}
                                />
                            </TouchableOpacity>
                        </CustomShadow>
                    </View>
                    <View style={{ width: '48%' }}>
                        <Text style={styles.nameText}>Select End Date</Text>
                        <CustomShadow radius={1} style={shadowStyle}>
                            <TouchableOpacity
                                activeOpacity={0.7}
                                style={[styles.input, { flexDirection: 'row', alignItems: 'center', justifyContent: 'space-between' }]}
                                onPress={() => {
                                    setSelectedDateField('end');
                                    setIsDatePickerOpen(true);
                                }}
                            >
                                <Text style={{ color: Color.black, fontFamily: Font?.Poppins }}>
                                    {endDate ? endDate.toLocaleDateString() : 'End Date'}
                                </Text>
                                <MaterialCommunityIcons
                                    name="calendar-month"
                                    color={Color?.primaryColor}
                                    size={20}
                                />

                            </TouchableOpacity>
                        </CustomShadow>
                    </View>
                </View>
                <View>

                </View>

                <DatePicker
                    modal mode="date"
                    open={isDatePickerOpen}
                    date={selectedDateField === 'start' ? startDate : endDate}
                    onConfirm={handleDateConfirm}
                    onCancel={() => setIsDatePickerOpen(false)} />

                <Text style={styles?.nameText} >Challenge Description</Text>
                <CustomShadow style={shadowStyle} radius={1} >
                    <TextInput
                        style={styles.input}
                        placeholder="Enter description"
                        placeholderTextColor={Color?.gray}
                        fontFamily={Font?.Poppins}
                        value={description}
                        onChangeText={setDescription}
                        multiline />
                </CustomShadow>

                <Text style={styles?.nameText} >Target Goal ({challengeType})</Text>
                <CustomShadow style={shadowStyle} radius={1} >

                    <TextInput
                        style={styles.input}
                        placeholder={`Enter target goal for ${challengeType}`}
                        keyboardType="numeric"
                        placeholderTextColor={Color?.gray}
                        fontFamily={Font?.Poppins}
                        value={targetGoal}
                        onChangeText={setTargetGoal} />
                </CustomShadow>

                <Text style={styles?.nameText} >Participants Limit</Text>
                <CustomShadow style={shadowStyle} radius={1} >

                    <TextInput
                        style={styles.input}
                        placeholder="Enter participant limit"
                        keyboardType="numeric"
                        value={participantsLimit.toString()}
                        onChangeText={(val) => setParticipantsLimit(parseInt(val) || 0)} />

                </CustomShadow>
                {/* <View style={styles.switchContainer}>
                    <Text style={styles.nameText} >Public</Text>
                    <Switch value={isPublic} onValueChange={setIsPublic} />
                    <Text style={styles.nameText} >Private</Text>
                    </View> */}
                <View style={styles.radioGroup}>
                    <Text style={styles?.nameText} >Privacy</Text>
                    <TouchableOpacity
                        style={styles.radioContainer}
                        onPress={() => setIsPublic(true)}
                    >
                        <View
                            style={[
                                styles.radioCircle,
                                { borderColor: isPublic ? Color?.primaryColor : Color?.gray },
                            ]}
                        >
                            {isPublic && <View style={[styles.selectedRb, { backgroundColor: Color?.primaryColor }]} />}
                        </View>
                        <Text style={styles.nameText}>Public</Text>
                    </TouchableOpacity>

                    <TouchableOpacity
                        style={styles.radioContainer}
                        onPress={() => setIsPublic(false)}
                    >
                        <View
                            style={[
                                styles.radioCircle,
                                { borderColor: !isPublic ? Color?.primaryColor : Color?.gray },
                            ]}
                        >
                            {!isPublic && <View style={[styles.selectedRb, { backgroundColor: Color?.primaryColor }]} />}
                        </View>
                        <Text style={styles.nameText}>Private</Text>
                    </TouchableOpacity>
                </View>

                {/* Invite Friends Button (Only for Private Challenges) */}
                {isPublic && (
                    <TouchableOpacity style={[styles.inviteButton, {
                        backgroundColor: selectedFriend?.length > 0 ? Color?.primaryColor : Color?.white,

                    }]} onPress={() => setInviteModalVisible(true)}>
                        <Text style={[styles.inviteButtonText, {
                            color: selectedFriend?.length > 0 ? Color?.white : Color?.primaryColor
                        }]}>Invite </Text>
                    </TouchableOpacity>
                )}

                <TouchableOpacity
                    onPress={handleSubmit}
                    disabled={loading}
                    style={{
                        backgroundColor: Color?.primaryColor,
                        padding: scale(10),
                        borderRadius: scale(8),
                        width: '100%'
                    }}
                >
                    <Text style={{
                        color: Color?.white,
                        alignSelf: 'center',
                        fontFamily: Font?.Poppins,
                        fontWeight: '600'
                    }} >
                        {loading ? 'Creating...' : 'Create Challenge'}
                    </Text>
                </TouchableOpacity>

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
                <CustomAlertBox
                    visible={alertVisible}
                    type={alertType}
                    message={alertMessage}
                    closeAlert={()=> setAlertVisible(false)}
                    onClose={() => {
                        setAlertVisible(false);
                        if (alertType === 'success') {
                            navigation.goBack();
                        }
                    }}
                />

            </ScrollView>
        </SafeAreaView>
    );
};

const styles = StyleSheet.create({
    mainContainer: {

        backgroundColor: 'white',
        flex: 1,
    },
    container: {
        paddingHorizontal: scale(14)
    },
    dropdown: {
        borderRadius: scale(4),
        borderWidth: 1,
        borderColor: Color.borderColor,
        margin: scale(2),
        backgroundColor: Color.white,
        zIndex: 10,
        marginBottom: verticalScale(10),
    },
    titleText: {
        fontWeight: '500',
        letterSpacing: 1,
        fontFamily: Font.PoppinsMedium,
        color: Color.textColor,
    },
    dropdownItem: {
        paddingVertical: scale(8),
        paddingHorizontal: scale(12),
    },
    inputContainer: {
        borderRadius: 8,
        paddingHorizontal: scale(10),
        borderColor: Color.primaryColor,
        height: verticalScale(38),
        flexDirection: 'row',
        alignItems: 'center',
        justifyContent: 'space-between',
        backgroundColor: Color.white,
        marginVertical: verticalScale(6)
    },
    header: {
        fontSize: 20,
        fontWeight: '500',
        textAlign: 'center',
        marginTop: scale(18),
        color: Color?.textColor,
        fontFamily: Font?.PoppinsMedium
    },
    input: {
        height: scale(38),
        backgroundColor: Color?.white,
        // borderColor: '#ccc',
        // borderWidth: 1,
        // marginBottom: 10,
        paddingHorizontal: scale(10),
        fontSize: 16,
        fontFamily: Font?.Poppins,
        color: Color?.gray,
        width: "98%",
        alignSelf: "center",
        borderRadius: scale(6),
        color: Color?.black

    },
    switchContainer: {
        flexDirection: 'row',
        alignItems: 'center',
        marginBottom: 25,
    },
    inviteButton: {
        backgroundColor: Color?.white,
        padding: scale(10),
        borderRadius: scale(5),
        alignItems: 'center',
        marginBottom: 10,
        borderWidth: 1,
        borderColor: Color?.primaryColor
    },
    inviteButtonText: {
        color: Color?.primaryColor,
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
    nameText: {
        fontFamily: Font?.Poppins,
        color: Color?.textColor,
        paddingHorizontal: scale(4),
        paddingVertical: scale(5),
        marginTop: scale(9)
    },
    radioGroup: {
        flexDirection: 'row',
        alignItems: 'center',
        gap: 20,
        marginBottom: scale(10),
        paddingHorizontal: scale(4)
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
});

export default CreateChallenge;