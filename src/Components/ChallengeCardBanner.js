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
import {scale, verticalScale, moderateScale} from 'react-native-size-matters';
import {Font} from '../assets/styles/Fonts';

const {width} = Dimensions.get('window');
const CARD_WIDTH = width * 0.95;

const ChallengeCardBanner = memo(({challenge, btnType, onJoin}) => {
  const {name, endDate, targetValue, type, participants = []} = challenge;

  const formattedDate = new Date(endDate).toLocaleDateString('en-US', {
    month: 'short',
    day: 'numeric',
    year: 'numeric',
  });

  return (
    <LinearGradient
      colors={[Color.primaryColor, Color.primaryLight]}
      start={{x: 0, y: 0}}
      end={{x: 1, y: 1}}
      style={styles.card}>
      <View style={styles.badge}>
        <Text style={styles.badgeText}>Featured</Text>
      </View>

      <Text style={styles.title} numberOfLines={1}>
        {name}
      </Text>
      <Text style={styles.description} numberOfLines={1}>
        Complete {targetValue} {type?.unitLabel || 'units'} by {formattedDate}
      </Text>

      <View style={styles.footer}>
        <View style={styles.avatarGroup}>
          {participants.slice(0, 3).map((p, index) => (
            <Image
              key={index}
              source={{
                uri: p.avatar || `https://i.pravatar.cc/150?img=${index + 1}`,
              }}
              style={[styles.avatar, {marginLeft: index !== 0 ? -10 : 0}]}
            />
          ))}

          <Text
            style={[
              styles.description,
              {marginLeft: participants.length === 0 ? 0 : 8},
            ]}>
            {participants.length} joined
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
    borderRadius: moderateScale(15),
    padding: scale(15),
    width: CARD_WIDTH,
    justifyContent: 'space-between',
    alignSelf: 'center',
  },
  badge: {
    backgroundColor: 'rgba(255, 255, 255, 0.2)',
    paddingHorizontal: scale(9),
    paddingVertical: verticalScale(3),
    borderRadius: moderateScale(11),
    alignSelf: 'flex-start',
    marginBottom: verticalScale(12),
  },
  badgeText: {
    color: Color.white,
    fontSize: moderateScale(11),
    fontFamily: Font?.Poppins,
  },
  title: {
    color: Color?.white,
    fontSize: moderateScale(16),
    fontFamily: Font?.PoppinsSemiBold,
    marginTop: verticalScale(4),
  },
  description: {
    color: Color.white,
    fontSize: moderateScale(12),
    fontFamily: Font?.Poppins,
  },
  footer: {
    marginTop: verticalScale(13),
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  participants: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  avatarGroup: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  avatar: {
    width: scale(24),
    height: scale(24),
    borderRadius: moderateScale(12),
    borderWidth: 1,
    borderColor: Color.white,
  },
  participantText: {
    color: Color?.white,
    marginLeft: scale(5),
    fontSize: moderateScale(11),
    fontFamily: Font?.Poppins,
  },
  joinButton: {
    borderColor: Color?.white,
    borderWidth: 1,
    borderRadius: moderateScale(7),
    paddingVertical: verticalScale(3),
    paddingHorizontal: scale(11),
  },
  joinText: {
    color: Color.white,
    fontSize: moderateScale(13),
    fontFamily: Font?.PoppinsMedium,
  },
});
