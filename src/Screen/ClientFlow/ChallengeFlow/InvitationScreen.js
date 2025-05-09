import React, {useState} from 'react';
import {
  StyleSheet,
  Text,
  View,
  FlatList,
  TouchableOpacity,
  Alert,
  Animated,
  Dimensions,
} from 'react-native';
import moment from 'moment';
import {GestureHandlerRootView, Swipeable} from 'react-native-gesture-handler';
import {useSelector} from 'react-redux';
import {challengeAcceptAndRejectedApi} from '../../../Apis/ClientApis/ChallengesApi';
import {Color} from '../../../assets/styles/Colors';
import {moderateScale, scale, verticalScale} from 'react-native-size-matters';
import {Font} from '../../../assets/styles/Fonts';
import CustomShadow from '../../../Components/CustomShadow';
import CustomAlertBox from '../../../Components/CustomAlertBox';

const InvitationScreen = ({challenges, setRequests}) => {
  const tokenId = useSelector(state => state?.user?.token);
  const guestTokenId = useSelector(state => state?.user?.guestToken);
  const token = tokenId?.token || guestTokenId?.token;
  const id = tokenId?.id || guestTokenId?.id;

  const [loading, setLoading] = useState(false);
  const [alertVisible, setAlertVisible] = useState(false);
  const [alertType, setAlertType] = useState('success');
  const [alertMessage, setAlertMessage] = useState('');
  const [selectedChallengeId, setSelectedChallengeId] = useState(null);

  const handleAccept = async challengeId => {
    try {
      setLoading(true);
      const response = await challengeAcceptAndRejectedApi(
        token,
        id,
        challengeId,
        {
          action: 'accepted',
        },
      );
      if (response?.success) {
        setAlertType('success');
        setAlertMessage(response.message);
        setAlertVisible(true);
        setSelectedChallengeId(challengeId);
      }
    } catch (error) {
      const message =
        error.response?.data?.message || 'Failed to accept challenge';
      setAlertType('error');
      setAlertMessage(message);
      setAlertVisible(true);
    } finally {
      setLoading(false);
    }
  };

  const handleReject = async challengeId => {
    try {
      setLoading(true);
      const response = await challengeAcceptAndRejectedApi(
        token,
        id,
        challengeId,
        {
          action: 'rejected',
        },
      );
      if (response?.success) {
        setAlertType('error');
        setAlertMessage(response.message);
        setAlertVisible(true);
        setSelectedChallengeId(challengeId);
      }
    } catch (error) {
      const message =
        error.response?.data?.message || 'Failed to reject challenge';
      setAlertType('error');
      setAlertMessage(message);
      setAlertVisible(true);
    } finally {
      setLoading(false);
    }
  };

  const screenWidth = Dimensions.get('window').width;

  const renderRightActions = progress => {
    const opacity = progress.interpolate({
      inputRange: [0, 0.3, 0.4],
      outputRange: [0, 0, 1],
      extrapolate: 'clamp',
    });

    return (
      <Animated.View
        style={[styles.actionButton, {opacity, backgroundColor: Color.red}]}>
        <Text style={styles.actionText}>Reject</Text>
      </Animated.View>
    );
  };

  const renderLeftActions = progress => {
    const opacity = progress.interpolate({
      inputRange: [0, 0.3, 0.4],
      outputRange: [0, 0, 1],
      extrapolate: 'clamp',
    });

    return (
      <Animated.View
        style={[
          styles.actionButton,
          {opacity, backgroundColor: Color.primaryColor},
        ]}>
        <Text style={styles.actionText}>Accept</Text>
      </Animated.View>
    );
  };

  const renderRequest = ({item}) => (
    <CustomShadow color={Color.lightgray}>
      <Swipeable
        renderRightActions={renderRightActions}
        renderLeftActions={renderLeftActions}
        onSwipeableRightOpen={() => handleReject(item?._id)}
        onSwipeableLeftOpen={() => handleAccept(item?._id)}
        friction={2}
        overshootLeft={false}
        overshootRight={false}
        leftThreshold={screenWidth * 0.3}
        rightThreshold={screenWidth * 0.3}>
        <View style={styles.card}>
          <View style={styles.row}>
            <View style={{width: '55%'}}>
              <Text style={styles.title} numberOfLines={2}>
                {item?.name}
              </Text>
              <Text style={styles.detail}>
                From: {item?.createdBy?.fullName || 'Unknown'}
              </Text>
              <Text style={styles.detail}>
                {moment(item.startDate).format('DD MMM YYYY')}
              </Text>
            </View>
            <View style={styles.buttonRow}>
              <TouchableOpacity
                style={[styles.button, {backgroundColor: Color.primaryColor}]}
                onPress={() => handleAccept(item?._id)}
                accessibilityRole="button"
                accessibilityLabel="Accept challenge"
                disabled={loading}>
                <Text style={styles.btnText}>Accept</Text>
              </TouchableOpacity>
              <TouchableOpacity
                style={[styles.button, {backgroundColor: Color.red}]}
                onPress={() => handleReject(item?._id)}
                accessibilityRole="button"
                accessibilityLabel="Reject challenge"
                disabled={loading}>
                <Text style={styles.btnText}>Reject</Text>
              </TouchableOpacity>
            </View>
          </View>
        </View>
      </Swipeable>
    </CustomShadow>
  );

  return (
    <GestureHandlerRootView style={{flex: 1}}>
      <View style={styles.container}>
        <CustomAlertBox
          visible={alertVisible}
          type={alertType}
          message={alertMessage}
          closeAlert={() => setAlertVisible(false)}
          onClose={() => {
            setAlertVisible(false);
            setRequests(prev =>
              prev.filter(item => item._id !== selectedChallengeId),
            );
            setSelectedChallengeId(null);
          }}
        />
        <FlatList
          style={{marginVertical: verticalScale(10)}}
          data={challenges}
          keyExtractor={item => item._id}
          renderItem={renderRequest}
          ListEmptyComponent={
            <Text style={styles.emptyText}>No requests available</Text>
          }
          initialNumToRender={5}
          maxToRenderPerBatch={5}
          windowSize={11}
        />
      </View>
    </GestureHandlerRootView>
  );
};

export default InvitationScreen;

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: Color.white,
  },
  title: {
    fontSize: moderateScale(16),
    color: Color.textColor,
    fontFamily: Font.PoppinsMedium,
  },
  detail: {
    fontSize: moderateScale(14),
    color: Color.gray,
    fontFamily: Font.PoppinsRegular,
  },
  buttonRow: {
    flexDirection: 'row',
    justifyContent: 'flex-end',
    width: '30%',
  },
  button: {
    paddingHorizontal: scale(10),
    borderRadius: moderateScale(8),
    marginLeft: scale(8),
    height: verticalScale(28),
    alignItems: 'center',
    justifyContent: 'center',
  },
  btnText: {
    color: Color.white,
    fontWeight: '600',
    fontSize: moderateScale(14),
    fontFamily: Font.PoppinsMedium,
  },
  emptyText: {
    marginTop: verticalScale(20),
    textAlign: 'center',
    color: Color.gray,
    fontSize: moderateScale(16),
    fontFamily: Font.Poppins,
  },
  actionButton: {
    flex: 1,
    borderRadius: moderateScale(11),
    padding: scale(12),
    marginHorizontal: scale(3),
    marginVertical: verticalScale(6),
    justifyContent: 'center',
  },
  actionText: {
    color: Color.white,
    fontWeight: '600',
    fontSize: moderateScale(16),
    fontFamily: Font.PoppinsMedium,
  },
  card: {
    borderRadius: moderateScale(11),
    padding: scale(8),
    marginHorizontal: scale(3),
    marginVertical: verticalScale(6),
    backgroundColor: Color.white,
  },
  row: {
    flexDirection: 'row',
    justifyContent: 'space-between',
  },
});
