import React from 'react';
import {
  View,
  Text,
  StyleSheet,
  TouchableOpacity,
  Image,
  Dimensions,
} from 'react-native';
import LinearGradient from 'react-native-linear-gradient';
import {Color} from '../assets/styles/Colors';
import {scale} from 'react-native-size-matters';
import {Font} from '../assets/styles/Fonts';

const {width} = Dimensions.get('window');
const CARD_WIDTH = width * 0.85;
const SPACING = (width - CARD_WIDTH) / 2;
const ChallengeCardBanner = ({ challenge, onJoin, btnType = 'Join' }) => {
  const buttonText = btnType === 'View' ? 'View Now' : 'Join Now';
  return (
 
    <LinearGradient
      colors={['#21972B', '#6BCB77']}
      start={{x: 0, y: 0}}
      end={{x: 1, y: 1}}
      style={styles.card}>
      <View style={styles.badge}>
        <Text style={styles.badgeText}>Featured</Text>
      </View>


      <Text style={[styles.title, {marginTop: 20}]}>{challenge.name}</Text>
      <Text style={styles.description}>
        Complete {challenge.targetValue} {challenge.type?.unitLabel || 'units'}{' '}
        by {new Date(challenge.endDate).toDateString()}
      </Text>


            <View style={styles.footer}>
                <View style={styles.participants}>
                    {challenge.participants.slice(0, 3).map((participant, index) => (
                        <Image
                            key={participant.clientId._id}
                            source={{ uri: participant.clientId.image }}
                            style={[styles.avatar, { marginLeft: index === 0 ? 0 : -10 }]}
                        />
                    ))}
                    <Text style={styles.participantText}>
                        +{challenge.participants.length} participants
                    </Text>
                </View>


                <TouchableOpacity style={styles.joinButton} onPress={() => onJoin(challenge)}>
                    <Text style={styles.joinText}>
                        {buttonText}
                    </Text>
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
    marginVertical: scale(5),
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
    fontFamily: Font?.Poppins,
  },
  title: {
    color: '#fff',
    fontSize: 16,
    fontWeight: 'bold',
    marginVertical: 8,
    fontFamily: Font?.Poppins,
  },
  description: {
    color: '#f0f0f0',
    fontSize: 13,
    fontFamily: Font?.Poppins,
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
    fontFamily: Font?.Poppins,
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
    fontFamily: Font?.Poppins,
  },
});
