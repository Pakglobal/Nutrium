import React from 'react';
import {View, Text, StyleSheet, TouchableOpacity, Image} from 'react-native';
import moment from 'moment';
import {Font} from '../../../assets/styles/Fonts';
import {Color} from '../../../assets/styles/Colors';
import {shadowStyle} from '../../../assets/styles/Shadow';
import CustomShadow from '../../../Components/CustomShadow';
import {moderateScale, scale, verticalScale} from 'react-native-size-matters';

const ChallengeCard = ({challenge, onJoin, btnType}) => {
  const {name, description, startDate, endDate, participants = []} = challenge;

  const days = moment(endDate).diff(moment(startDate), 'days') + 1;

  return (
    <CustomShadow>
      <TouchableOpacity
        style={styles.card}
        onPress={() => onJoin(challenge)}
        activeOpacity={0.9}>
        <View style={styles.row}>
          <View style={styles.iconCircle}>
            <Text style={styles.icon}>🔥</Text>
          </View>
          <View style={{flex: 1}}>
            <Text style={styles.title}>{name}</Text>
            <Text numberOfLines={1} style={styles.description}>
              {description}
            </Text>
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
            onPress={() => onJoin(challenge)}
            style={styles.joinButton}>
            {btnType === 'Join' && (
              <Text style={styles.joinButtonText}>Join now</Text>
            )}

            {btnType === 'View' && (
              <Text style={styles.joinButtonText}>View now</Text>
            )}
          </TouchableOpacity>
        </View>
      </TouchableOpacity>
    </CustomShadow>
  );
};

const styles = StyleSheet.create({
  card: {
    borderRadius: moderateScale(11),
    padding: scale(12),
    marginHorizontal: scale(3),
    marginVertical: verticalScale(6),
    backgroundColor: Color.white,
  },
  row: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  iconCircle: {
    width: scale(40),
    height: scale(40),
    borderRadius: moderateScale(10),
    backgroundColor: Color.challengeBg,
    alignItems: 'center',
    justifyContent: 'center',
    marginRight: scale(12),
  },
  icon: {
    fontSize: moderateScale(19),
  },
  title: {
    fontWeight: '600',
    fontSize: moderateScale(14),
    fontFamily: Font?.PoppinsMedium,
    color: Color?.primaryColor,
  },
  description: {
    color: '#7D7979',
    fontSize: moderateScale(12),
    fontFamily: Font?.Poppins,
    fontWeight: '400',
  },
  daysBox: {
    backgroundColor: Color.challengeBg,
    paddingVertical: verticalScale(5),
    paddingHorizontal: scale(12),
    borderRadius: moderateScale(20),
    marginTop: verticalScale(-15),
  },
  daysText: {
    fontWeight: '600',
    color: '#2E7D32',
    fontSize: moderateScale(11),
    fontFamily: Font?.Poppins,
  },
  bottomRow: {
    marginTop: verticalScale(14),
    flexDirection: 'row',
    justifyContent: 'space-between',
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
  joinButton: {
    borderBottomWidth: 1,
    borderBottomColor: Color.primaryColor,
  },
  joinButtonText: {
    color: Color?.primaryColor,
    fontWeight: '500',
    fontSize: moderateScale(13),
    fontFamily: Font?.PoppinsSemiBold,
  },
});

export default ChallengeCard;
