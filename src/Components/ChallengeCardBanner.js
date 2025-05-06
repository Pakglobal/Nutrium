import React, {memo} from 'react';
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
const CARD_WIDTH = width * 0.9;

const ChallengeCardBanner = memo(({challenge, btnType, onJoin}) => {
  const formattedDate = new Date(challenge.endDate).toLocaleDateString(
    'en-US',
    {
      month: 'short',
      day: 'numeric',
      year: 'numeric',
    },
  );

  return (
    <LinearGradient
      colors={['#21972B', '#6BCB77']}
      start={{x: 0, y: 0}}
      end={{x: 1, y: 1}}
      style={styles.card}>
      <View style={styles.badge}>
        <Text style={styles.badgeText}>Featured</Text>
      </View>

      <Text style={styles.title} numberOfLines={1}>
        {challenge.name}
      </Text>
      <Text style={styles.description} numberOfLines={1}>
        Complete {challenge.targetValue} {challenge.type?.unitLabel || 'units'}{' '}
        by {formattedDate}
      </Text>

      <View style={styles.footer}>
        <View style={styles.participants}>
          {challenge.participants.slice(0, 3).map((participant, index) => (
            <Image
              key={participant.clientId._id || index.toString()}
              source={{uri: participant.clientId.image}}
              style={[styles.avatar, {marginLeft: index === 0 ? 0 : -10}]}
            />
          ))}
          <Text style={styles.participantText}>
            +{challenge.participants.length} participants
          </Text>
        </View>

        <TouchableOpacity
          style={styles.joinButton}
          onPress={() => onJoin(challenge)}
          activeOpacity={0.7}>
          {btnType === 'Join' && <Text style={styles.joinText}>Join now</Text>}

          {btnType === 'View' && <Text style={styles.joinText}>View now</Text>}
        </TouchableOpacity>
      </View>
    </LinearGradient>
  );
});

export default ChallengeCardBanner;

const styles = StyleSheet.create({
  card: {
    borderRadius: 16,
    padding: 12,
    height: 150,
    width: CARD_WIDTH,
    justifyContent: 'space-between',
    alignSelf: 'center',
  },
  badge: {
    backgroundColor: 'rgba(255, 255, 255, 0.2)',
    paddingHorizontal: 10,
    paddingVertical: 4,
    borderRadius: 12,
    alignSelf: 'flex-start',
  },
  badgeText: {
    color: '#fff',
    fontSize: 12,
    fontWeight: '400',
    fontFamily: Font?.Poppins,
  },
  title: {
    color: Color?.white,
    fontSize: 16,
    fontWeight: 'bold',
    marginTop: 8,
    marginBottom: 4,
    fontFamily: Font?.Poppins,
  },
  description: {
    color: '#f0f0f0',
    fontSize: 12,
    fontFamily: Font?.Poppins,
    lineHeight: 16,
  },
  footer: {
    marginTop: 8,
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  participants: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  avatar: {
    width: 24,
    height: 24,
    borderRadius: 12,
    borderWidth: 2,
    borderColor: Color?.white,
  },
  participantText: {
    color: Color?.white,
    marginLeft: 6,
    fontSize: 12,
    fontFamily: Font?.Poppins,
  },
  joinButton: {
    borderColor: Color?.white,
    borderWidth: 1,
    borderRadius: 8,
    paddingVertical: 4,
    paddingHorizontal: 12,
  },
  joinText: {
    color: '#fff',
    fontSize: 12,
    fontFamily: Font?.Poppins,
    textTransform: 'uppercase',
  },
});
