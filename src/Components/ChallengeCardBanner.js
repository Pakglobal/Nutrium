import React from 'react';
import { View, Text, StyleSheet, TouchableOpacity, Image, Dimensions } from 'react-native';
import LinearGradient from 'react-native-linear-gradient';
import { Color } from '../assets/styles/Colors';
import { scale } from 'react-native-size-matters';
import { Font } from '../assets/styles/Fonts';

const { width } = Dimensions.get('window');
const CARD_WIDTH = width * 0.85;
const SPACING = (width - CARD_WIDTH) / 2;
const ChallengeCardBanner = ({ challenge, onJoin }) => {
    return (
        <LinearGradient
            colors={[
                Color.primaryColor,
                Color.primaryColor,
                Color.primaryLight
            ]}
            locations={[0, 0.6, 1]}
            start={{ x: 0, y: 0 }}
            end={{ x: 1, y: 1 }}
            style={styles.card}
        >
            <View style={styles.badge}>
                <Text style={styles.badgeText}>Featured</Text>
            </View>

            <Text style={[styles.title, { marginTop: 20 }]}>{challenge.name}</Text>
            <Text style={styles.description}>
                Complete {challenge.targetValue} {challenge.type?.unitLabel || 'units'} by {new Date(challenge.endDate).toDateString()}
            </Text>

            <View style={styles.footer}>
                <View style={styles.participants}>
                    <Image source={{ uri: 'https://i.pravatar.cc/30?img=1' }} style={styles.avatar} />
                    <Image source={{ uri: 'https://i.pravatar.cc/30?img=2' }} style={[styles.avatar, { marginLeft: -10 }]} />
                    <Image source={{ uri: 'https://i.pravatar.cc/30?img=3' }} style={[styles.avatar, { marginLeft: -10 }]} />
                    <Text style={styles.participantText}>+{challenge.participants.length} participants</Text>
                </View>

                <TouchableOpacity style={styles.joinButton} onPress={() => onJoin(challenge)}>
                    <Text style={styles.joinText}>Join Now</Text>
                </TouchableOpacity>
            </View>
        </LinearGradient>
    );
};

export default ChallengeCardBanner;

const styles = StyleSheet.create({
    card: {
        borderRadius: 16,
        padding: 16,
        marginVertical: scale(5)
    },
    badge: {
        backgroundColor: '#4dac55', // 15% opacity
        paddingHorizontal: 15,
        paddingVertical: 8,
        borderRadius: 20,
        alignSelf: 'flex-start',
    },
    badgeText: {
        color: '#fff',
        fontSize: 13,
        fontWeight: '400',
        fontFamily: Font?.Poppins
    },
    title: {
        color: '#fff',
        fontSize: 16,
        fontWeight: 'bold',
        marginVertical: 8,
        fontFamily: Font?.Poppins
    },
    description: {
        color: '#f0f0f0',
        fontSize: 13,
        fontFamily: Font?.Poppins
    },
    footer: {
        marginTop: 12,
        flexDirection: 'row',
        justifyContent: 'space-between',
        alignItems: 'center',
    },
    participants: {
        flexDirection: 'row',
        alignItems: 'center',
    },
    avatar: {
        width: 28,
        height: 28,
        borderRadius: 14,
        borderWidth: 2,
        borderColor: '#fff',
    },
    participantText: {
        color: '#fff',
        marginLeft: 6,
        fontSize: 13,
        fontFamily: Font?.Poppins
    },
    joinButton: {
        borderColor: '#fff',
        borderWidth: 1,
        borderRadius: 8,
        paddingVertical: 5,
        paddingHorizontal: 10,
    },
    joinText: {
        color: '#fff',
        fontSize: 14,
        fontFamily: Font?.Poppins
    },
});
