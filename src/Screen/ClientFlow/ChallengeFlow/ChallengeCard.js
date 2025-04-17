import React from 'react';
import { View, Text, StyleSheet, TouchableOpacity, Image } from 'react-native';
import moment from 'moment';
import { Font } from '../../../assets/styles/Fonts';

const ChallengeCard = ({ challenge, onJoin }) => {
    const { name, description, startDate, endDate, participants = [] } = challenge;

    const days = moment(endDate).diff(moment(startDate), 'days') + 1;

    const avatars = [
        'https://randomuser.me/api/portraits/men/1.jpg',
        'https://randomuser.me/api/portraits/women/2.jpg',
        'https://randomuser.me/api/portraits/men/3.jpg'
    ];

    return (
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
                    {avatars.map((url, index) => (
                        <Image
                            key={index}
                            source={{ uri: url }}
                            style={[styles.avatar, { marginLeft: index !== 0 ? -10 : 0 }]}
                        />
                    ))}
                    <Text style={styles.joinedText}>+{participants.length || 42} joined</Text>
                </View>

                <TouchableOpacity onPress={() => onJoin(challenge)} style={styles.joinButton}>
                    <Text style={styles.joinButtonText}>Join Now</Text>
                </TouchableOpacity>
            </View>
        </View>
    );
};

const styles = StyleSheet.create({
    card: {
        borderWidth: 1,
        borderColor: '#4CAF50',
        borderRadius: 12,
        padding: 16,
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
        fontWeight: '700',
        fontSize: 16,
        marginBottom: 4,
        fontFamily: Font?.Poppins
    },
    description: {
        color: '#555',
        fontSize: 13,
        fontFamily: Font?.Poppins
    },
    daysBox: {
        backgroundColor: '#E8F5E9',
        paddingVertical: 6,
        paddingHorizontal: 10,
        borderRadius: 20,
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
    joinedText: {
        marginLeft: 8,
        fontSize: 12,
        color: '#777',
        fontFamily: Font?.Poppins
    },
    joinButton: {
        backgroundColor: '#4CAF50',
        paddingVertical: 6,
        paddingHorizontal: 14,
        borderRadius: 20,
    },
    joinButtonText: {
        color: '#fff',
        fontWeight: '600',
        fontSize: 13,
        fontFamily: Font?.Poppins
    },
});

export default ChallengeCard;
