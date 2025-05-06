import {
  StyleSheet,
  Text,
  View,
  FlatList,
  TouchableOpacity,
  Alert,
} from 'react-native';
import React, {useEffect, useState} from 'react';
import {
  challengeAcceptAndRejectedApi,
  getAllChallengePendingRequest,
} from '../../../Apis/ClientApis/ChallengesApi';
import {useSelector} from 'react-redux';
import {useNavigation} from '@react-navigation/native';
import moment from 'moment';
import CustomLoader from '../../../Components/CustomLoader';

const JoinRequestScreen = () => {
  const userInfo = useSelector(state => state?.user?.userInfo);
  const [requests, setRequests] = useState([]);
  const [loading, setLoading] = useState(true);
  const navigation = useNavigation();

  useEffect(() => {
    GetJoiningRequest();
  }, []);

  const GetJoiningRequest = async () => {
    try {
      setLoading(true);
      const response = await getAllChallengePendingRequest(
        userInfo?.token,
        userInfo?.userData?._id,
      );
      if (response?.success) {
        setRequests(response?.challenges || []);
      }
    } catch (error) {
      if (error?.response) {
        const statusCode = error.response.status;
        const message = error.response.data?.message || 'Something went wrong';
        Alert.alert(`Error ${statusCode}`, message);
      } else {
        Alert.alert('Error', 'Network error or server not responding');
      }
    } finally {
      setLoading(false);
    }
  };

  const renderRequest = ({item}) => {
    return (
      <View style={styles.card}>
        <Text style={styles.title}>{item.name}</Text>
        <Text style={styles.description}>{item.description}</Text>
        <Text style={styles.detail}>
          Start: {moment(item.startDate).format('MMM DD, YYYY')} - End:{' '}
          {moment(item.endDate).format('MMM DD, YYYY')}
        </Text>
        <Text style={styles.detail}>
          Target: {item.targetValue} {item.type.unitLabel}
        </Text>
        <Text style={styles.detail}>Reward: 🪙 {item.coinReward}</Text>
        <Text style={styles.detail}>Privacy: {item.privacy}</Text>

        <View style={styles.buttonRow}>
          <TouchableOpacity
            style={styles.acceptBtn}
            onPress={() => handleAccept(item._id)}>
            <Text style={styles.btnText}>Accept</Text>
          </TouchableOpacity>
          <TouchableOpacity
            style={styles.rejectBtn}
            onPress={() => handleReject(item._id)}>
            <Text style={styles.btnText}>Reject</Text>
          </TouchableOpacity>
        </View>
      </View>
    );
  };

  const handleAccept = id => {
    const action = {
      action: 'accepted',
    };
    aceeptAndRejectAnctionHandle(id, action);
  };

  const handleReject = id => {
    const action = {
      action: 'rejected',
    };
    aceeptAndRejectAnctionHandle(id);
  };

  const aceeptAndRejectAnctionHandle = async (id, action) => {
    try {
      setLoading(true);
      const response = await challengeAcceptAndRejectedApi(
        userInfo?.token,
        id,
        userInfo?.userData?._id,
        action,
      );
      if (response?.success) {
        Alert.alert('Success', response.message, [
          {text: 'OK', onPress: () => navigation.goBack()},
        ]);
      }
    } catch (error) {
      if (error?.response) {
        const statusCode = error.response.status;
        const message = error.response.data?.message || 'Something went wrong';
        Alert.alert(`Error ${statusCode}`, message);
      } else {
        Alert.alert('Error', 'Network error or server not responding');
      }
    } finally {
      setLoading(false);
    }
  };
  if (loading) {
    return <CustomLoader />;
  }

  return (
    <View style={styles.container}>
      <TouchableOpacity
        onPress={() => navigation.goBack()}
        style={styles.backButton}>
        <Text style={styles.backText}>← Back</Text>
      </TouchableOpacity>

      <FlatList
        data={requests}
        keyExtractor={item => item._id}
        renderItem={renderRequest}
        contentContainerStyle={{paddingBottom: 20}}
        ListEmptyComponent={
          <Text style={styles.emptyText}>No requests available</Text>
        }
      />
    </View>
  );
};

export default JoinRequestScreen;

const styles = StyleSheet.create({
  container: {
    flex: 1,
    padding: 16,
    backgroundColor: '#F7F7F7',
  },
  loaderContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
  backButton: {
    marginBottom: 10,
  },
  backText: {
    fontSize: 16,
    color: '#007BFF',
  },
  card: {
    backgroundColor: '#fff',
    borderRadius: 12,
    padding: 16,
    marginBottom: 12,
    shadowColor: '#000',
    shadowOpacity: 0.1,
    shadowOffset: {width: 0, height: 2},
    shadowRadius: 4,
    elevation: 3,
  },
  title: {
    fontSize: 18,
    fontWeight: 'bold',
    marginBottom: 4,
  },
  description: {
    fontSize: 14,
    color: '#555',
    marginBottom: 8,
  },
  detail: {
    fontSize: 14,
    marginBottom: 4,
  },
  buttonRow: {
    flexDirection: 'row',
    marginTop: 10,
    justifyContent: 'space-between',
  },
  acceptBtn: {
    flex: 1,
    backgroundColor: '#4CAF50',
    padding: 10,
    borderRadius: 8,
    marginRight: 8,
    alignItems: 'center',
  },
  rejectBtn: {
    flex: 1,
    backgroundColor: '#F44336',
    padding: 10,
    borderRadius: 8,
    alignItems: 'center',
  },
  btnText: {
    color: '#fff',
    fontWeight: 'bold',
  },
  emptyText: {
    marginTop: 20,
    textAlign: 'center',
    color: '#888',
    fontSize: 16,
  },
});
