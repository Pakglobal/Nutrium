import React from 'react';
import { View, Text, StyleSheet, TouchableOpacity, Image } from 'react-native';
import moment from 'moment';
import { Font } from '../../../assets/styles/Fonts';
import { Color } from '../../../assets/styles/Colors';
import { Scale } from 'lucide-react';
import { shadowStyle } from '../../../assets/styles/Shadow';
import CustomShadow from '../../../Components/CustomShadow';

const ChallengeCard = ({ challenge, onJoin }) => {
    const { name, description, startDate, endDate, participants = [] } = challenge;

    const days = moment(endDate).diff(moment(startDate), 'days') + 1;

    const avatars = [
        'https://randomuser.me/api/portraits/men/1.jpg',
        'https://randomuser.me/api/portraits/women/2.jpg',
        'https://randomuser.me/api/portraits/men/3.jpg'
    ];

    return (
        <CustomShadow>
            <View style={[styles.card]}>
                <View style={styles.row}>
                    <View style={styles.iconCircle}>
                        <Text style={styles.icon}>🔥</Text>
                    </View>
                    <View style={{ flex: 1 }}>
                        <Text style={styles.title}>{name}</Text>
                        <Text numberOfLines={1} style={styles.description}>{description}</Text>
                    </View>
                    <View style={styles.daysBox}>
                        <Text style={styles.daysText}>{days} days</Text>
                    </View>
                </View>

                <View style={styles.bottomRow}>
                    <View style={styles.avatarGroup}>
                        {avatars.map((url, index) => (
                            <Image
                                key={index}
                                source={{ uri: url }}
                                style={[styles.avatar, { marginLeft: index !== 0 ? -10 : 0 }]}
                            />
                        ))}
                        <Text style={[styles.description, { marginLeft: 8 }]}>+{participants.length || 42} joined</Text>
                    </View>

                    <TouchableOpacity onPress={() => onJoin(challenge)} style={styles.joinButton}>
                        <Text style={styles.joinButtonText}>Join Now</Text>
                    </TouchableOpacity>
                </View>
            </View>
        </CustomShadow>
    );
};

const styles = StyleSheet.create({
    card: {
        // borderWidth: 1,
        // borderColor: '#4CAF50',
        borderRadius: 12,
        padding: 15,
        margin: 10,
        backgroundColor: '#fff',
        shadowColor: '#ccc',
        shadowOpacity: 0.3,
        shadowRadius: 6,
        shadowOffset: { width: 0, height: 2 },
        elevation: 3,
    },
    row: {
        flexDirection: 'row',
        alignItems: 'center',
    },
    iconCircle: {
        width: 40,
        height: 40,
        borderRadius: 20,
        backgroundColor: '#E8F5E9',
        alignItems: 'center',
        justifyContent: 'center',
        marginRight: 12,
    },
    icon: {
        fontSize: 20,
    },
    title: {
        fontWeight: '600',
        fontSize: 14,
        // marginBottom: 1,
        fontFamily: Font?.PoppinsSemiBold,
        color: Color?.primaryColor,
    },
    description: {
        color: '#575252',
        fontSize: 12,
        fontFamily: Font?.Poppins,
        fontWeight: '400',
    },
    daysBox: {
        backgroundColor: '#E8F5E9',
        paddingVertical: 6,
        paddingHorizontal: 10,
        borderRadius: 20,
        marginTop: -15
    },
    daysText: {
        fontWeight: '600',
        color: '#2E7D32',
        fontSize: 12,
        fontFamily: Font?.Poppins
    },
    bottomRow: {
        marginTop: 14,
        flexDirection: 'row',
        justifyContent: 'space-between',
        alignItems: 'center',
    },
    avatarGroup: {
        flexDirection: 'row',
        alignItems: 'center',
    },
    avatar: {
        width: 24,
        height: 24,
        borderRadius: 12,
        borderWidth: 1,
        borderColor: '#fff',
    },
    joinButton: {
        // paddingHorizontal: 5,
        borderBottomWidth: 1,
        borderBottomColor: Color.primaryColor
    },
    joinButtonText: {
        color: Color?.primaryColor,
        fontWeight: '500',
        fontSize: 14,
        fontFamily: Font?.PoppinsSemiBold

    },
});

export default ChallengeCard;
