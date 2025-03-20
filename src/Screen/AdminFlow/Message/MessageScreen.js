import React, {useCallback, useState} from 'react';
import {
  View,
  Text,
  StyleSheet,
  TouchableOpacity,
  Image,
  SafeAreaView,
  FlatList,
  RefreshControl,
} from 'react-native';
import {scale, verticalScale} from 'react-native-size-matters';
import Color from '../../../assets/colors/Colors';
import {useNavigation} from '@react-navigation/native';
import {useDispatch, useSelector} from 'react-redux';
import Ionicons from 'react-native-vector-icons/Ionicons';
import Entypo from 'react-native-vector-icons/Entypo';
import {
  GetAllClientData,
  GetClientData,
} from '../../../Apis/AdminScreenApi/ClientApi';
import {clientInfoData} from '../../../redux/admin';

const MessageScreen = () => {
  const navigation = useNavigation();
  const dispatch = useDispatch();

  const [refreshing, setRefreshing] = useState(false);
  const [loading, setLoading] = useState(false);

  const getToken = useSelector(state => state?.user?.userInfo);
  const token = getToken?.token;
  const clientData = useSelector(state => state?.admin?.clientInfo);

  const handleClientNavigate = async item => {
    const response = await GetClientData(token, item?._id);
    navigation.navigate('Messages', {response: response});
  };

  const fetchData = async () => {
    try {
      setLoading(true);
      const response = await GetAllClientData(token);
      dispatch(clientInfoData(response));
      setLoading(false);
    } catch (error) {
      console.error('Error fetching clients:', error);
    } finally {
      setLoading(false);
    }
  };

  const onRefresh = useCallback(() => {
    setRefreshing(true);
    fetchData().then(() => {
      setRefreshing(false);
    });
  }, []);

  if (loading) {
    return (
      <View
        style={{
          flex: 1,
          justifyContent: 'center',
          alignItems: 'center',
        }}>
        <ActivityIndicator size="large" color={Color.primaryGreen} />
      </View>
    );
  }

  return (
    <SafeAreaView>
      <FlatList
        refreshControl={
          <RefreshControl refreshing={refreshing} onRefresh={onRefresh} />
        }
        data={clientData}
        renderItem={({item}) => (
          <TouchableOpacity
            style={styles.messageCard}
            onPress={() => handleClientNavigate(item)}
            key={item?._id}>
            <View style={styles.messageCardContainer}>
              {item?.image ? (
                <Image source={{uri: item?.image}} style={styles.avatar} />
              ) : item?.gender === 'Female' ? (
                <Image
                  source={require('../../../assets/Images/woman.png')}
                  style={styles.avatar}
                />
              ) : (
                <Image
                  source={require('../../../assets/Images/man.png')}
                  style={styles.avatar}
                />
              )}

              <Text style={styles.clientName}>{item?.fullName}</Text>
            </View>
          </TouchableOpacity>
        )}
      />
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  messageCardContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: scale(10),
    paddingVertical: verticalScale(8),
  },
  messageCard: {
    backgroundColor: '#fff',
    marginTop: scale(10),
    borderRadius: scale(5),
  },
  avatar: {
    width: scale(40),
    height: scale(40),
    borderRadius: 25,
    marginRight: 10,
    backgroundColor: Color.primaryGreen,
  },
  clientName: {
    fontWeight: '500',
    fontSize: 16,
    color: Color.black
  },
  noDataText: {
    textAlign: 'center',
    marginTop: scale(30),
    fontSize: scale(14),
    color: Color.gray,
  },
  locationIcon: {
    backgroundColor: Color.lightGreen,
    alignItems: 'center',
    justifyContent: 'center',
    height: scale(20),
    width: scale(20),
    borderRadius: scale(10),
  },
});

export default MessageScreen;
