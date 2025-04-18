import React, {useCallback, useEffect, useState} from 'react';
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
import {Color} from '../../../assets/styles/Colors';
import {useFocusEffect, useNavigation} from '@react-navigation/native';
import {useDispatch, useSelector} from 'react-redux';
import Ionicons from 'react-native-vector-icons/Ionicons';
import Entypo from 'react-native-vector-icons/Entypo';
import {
  GetAllClientData,
  GetClientData,
} from '../../../Apis/AdminScreenApi/ClientApi';
import {clientInfoData} from '../../../redux/admin';
import {connectSocket} from '../../../Components/SocketService';
import CustomLoader from '../../../Components/CustomLoader';

const MessageScreen = () => {
  const navigation = useNavigation();
  const dispatch = useDispatch();

  const [refreshing, setRefreshing] = useState(false);
  const [loading, setLoading] = useState(false);

  const tokenId = useSelector(state => state?.user?.token);
  const guestTokenId = useSelector(state => state?.user?.guestToken);
  const token = tokenId?.token || guestTokenId?.token;
  const clientData = useSelector(state => state?.admin?.clientInfo);

  useEffect(() => {
    fetchData();
  }, []);

  useFocusEffect(
    useCallback(() => {
      const fetchSocket = async () => {
        await connectSocket();
      };
      fetchSocket();
    }, []),
  );

  const fetchData = async () => {
    try {
      setLoading(true);
      const response = await GetAllClientData(token);
      dispatch(clientInfoData(response || []));
      setLoading(false);
    } catch (error) {
      console.error('Error fetching clients:', error);
      setLoading(false);
    }
  };

  const handleClientNavigate = async item => {
    try {
      const response = await GetClientData(token, item?._id);
      navigation.navigate('Messages', {response});
    } catch (error) {
      console.error('Error navigating to client messages:', error);
    }
  };

  const onRefresh = useCallback(() => {
    setRefreshing(true);
    fetchData().finally(() => setRefreshing(false));
  }, []);

  return (
    <SafeAreaView>
      {loading ? (
       <CustomLoader style={{marginTop: verticalScale(10)}} />
      ) : (
        <View
          style={{
            height: '97%',
            marginTop: verticalScale(10),
          }}>
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
                  ) : (
                    <Image
                      source={
                        item?.gender === 'Female'
                          ? require('../../../assets/Images/woman.png')
                          : require('../../../assets/Images/man.png')
                      }
                      style={styles.avatar}
                    />
                  )}

                  <Text style={styles.clientName}>{item?.fullName}</Text>
                </View>
              </TouchableOpacity>
            )}
          />
        </View>
      )}
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
    marginBottom: scale(10),
    borderRadius: scale(5),
  },
  avatar: {
    width: scale(40),
    height: scale(40),
    borderRadius: 25,
    marginRight: 10,
    backgroundColor: Color.primaryColor,
  },
  clientName: {
    fontWeight: '500',
    fontSize: 16,
    color: Color.black,
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
