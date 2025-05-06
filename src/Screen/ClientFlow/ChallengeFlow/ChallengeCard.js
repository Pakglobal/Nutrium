


import React from 'react';
import { View, Text, StyleSheet, TouchableOpacity, Image } from 'react-native';
import moment from 'moment';
import { Font } from '../../../assets/styles/Fonts';
import { Color } from '../../../assets/styles/Colors';
import CustomShadow from '../../../Components/CustomShadow';

const ChallengeCard = ({ challenge, onJoin,handleJoinNow, btnType = 'Join' }) => {
    const { name, description, startDate, endDate, participants = [] } = challenge;
    const days = moment(endDate).diff(moment(startDate), 'days') + 1;

    return (
        <CustomShadow>
            <View style={styles.card}>
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
                        {participants.slice(0, 3).map((p, index) => (
                            <Image
                                key={index}
                                source={{ uri: p.avatar || `https://i.pravatar.cc/150?img=${index + 1}` }}
                                style={[styles.avatar, { marginLeft: index !== 0 ? -10 : 0 }]}
                            />
                        ))}
                        <Text style={[styles.description, { marginLeft: 8 }]}>
                            +{participants.length} joined
                        </Text>
                    </View>

                    <TouchableOpacity onPress={handleJoinNow} style={styles.joinButton}>
                        <Text style={styles.joinButtonText}>
                            {btnType === 'Join' ? 'Join Now' : 'View Now'}
                        </Text>
                    </TouchableOpacity>
                </View>
            </View>
        </CustomShadow>
    );
};

const styles = StyleSheet.create({
    card: {
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
        fontFamily: Font?.PoppinsSemiBold || 'System',
        color: Color?.primaryColor || '#2E7D32',
    },
    description: {
        color: '#575252',
        fontSize: 12,
        fontFamily: Font?.Poppins || 'System',
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
        fontFamily: Font?.Poppins || 'System',
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
        borderBottomWidth: 1,
        borderBottomColor: Color?.primaryColor || '#2E7D32',
    },
    joinButtonText: {
        color: Color?.primaryColor || '#2E7D32',
        fontWeight: '500',
        fontSize: 14,
        fontFamily: Font?.PoppinsSemiBold || 'System',
    },
});

export default ChallengeCard;