import {
  ActivityIndicator,
  Image,
  Platform,
  RefreshControl,
  SafeAreaView,
  ScrollView,
  StyleSheet,
  Text,
  TextInput,
  TouchableOpacity,
  View,
} from 'react-native';
import React, {useCallback, useEffect, useState} from 'react';
import Color from '../../../assets/colors/Colors';
import {scale, verticalScale} from 'react-native-size-matters';
import Ionicons from 'react-native-vector-icons/Ionicons';
import Entypo from 'react-native-vector-icons/Entypo';
import {useNavigation} from '@react-navigation/native';
import {useDispatch, useSelector} from 'react-redux';
import {
  GetAllClientData,
  GetClientData,
} from '../../../Apis/AdminScreenApi/ClientApi';
import {clientInfoData} from '../../../redux/admin';

const ClientScreen = () => {
  const [search, setSearch] = useState('');
  const [filteredClients, setFilteredClients] = useState([]);
  const [loading, setLoading] = useState(false);
  const [clientData, setClientData] = useState([]);
  const [refreshing, setRefreshing] = useState(false);
  const navigation = useNavigation();
  const dispatch = useDispatch();

  const tokenId = useSelector(state => state?.user?.token);
  const token = tokenId?.token;

  useEffect(() => {
    fetchData();
  }, []);

  useEffect(() => {
    if (!search.trim()) {
      setFilteredClients(clientData);
    } else {
      const filteredData = clientData?.filter(
        client =>
          client?.fullName?.toLowerCase().includes(search.toLowerCase()) ||
          client?.workplace?.toLowerCase().includes(search.toLowerCase()),
      );
      setFilteredClients(filteredData);
    }
  }, [search, clientData]);

  const fetchData = async () => {
    try {
      setLoading(true);
      const response = await GetAllClientData(token);
      setClientData(response || []);
      setFilteredClients(response || []);
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
      navigation.navigate('ClientProfile', {response});
    } catch (error) {
      console.error('Error navigating to client profile:', error);
    }
  };

  const onRefresh = useCallback(() => {
    setRefreshing(true);
    fetchData().finally(() => setRefreshing(false));
  }, []);

  return (
    <SafeAreaView>
      <View style={styles.searchContainer}>
        <View style={styles.inputContainer}>
          <Ionicons name="search" color={Color.gray} size={scale(18)} />
          <TextInput
            value={search}
            onChangeText={setSearch}
            placeholder="Search clients"
            style={{marginLeft: scale(10), color: Color.black}}
            placeholderTextColor={Color.black}
          />
        </View>
      </View>

      {loading ? (
        <View
          style={{
            justifyContent: 'center',
            alignItems: 'center',
            marginTop: verticalScale(10),
          }}>
          <ActivityIndicator size="large" color={Color.primaryGreen} />
        </View>
      ) : (
        <View
          style={{
            height: '89%',
            marginTop: verticalScale(10),
          }}>
          <ScrollView
            refreshControl={
              <RefreshControl refreshing={refreshing} onRefresh={onRefresh} />
            }>
            {filteredClients && filteredClients.length > 0 ? (
              filteredClients.map(item => (
                <TouchableOpacity
                  style={styles.messageCard}
                  onPress={() => handleClientNavigate(item)}
                  key={item?._id}>
                  <View style={styles.messageCardContainer}>
                    {item?.image ? (
                      <Image
                        source={{uri: item?.image}}
                        style={styles.avatar}
                      />
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
                    <View>
                      <Text style={styles.clientName}>{item?.fullName}</Text>
                      <View
                        style={{
                          flexDirection: 'row',
                          alignItems: 'center',
                          marginTop: verticalScale(3),
                        }}>
                        <View style={styles.locationIcon}>
                          <Entypo name="location" color={Color.primaryGreen} />
                        </View>
                        <Text style={styles.type}> {item?.workplace}</Text>
                      </View>
                    </View>
                  </View>
                </TouchableOpacity>
              ))
            ) : (
              <Text style={styles.noDataText}>No client found</Text>
            )}
          </ScrollView>
        </View>
      )}
    </SafeAreaView>
  );
};

export default ClientScreen;

const styles = StyleSheet.create({
  inputContainer: {
    alignItems: 'center',
    flexDirection: 'row',
    paddingHorizontal: scale(8),
  },
  searchContainer: {
    width: '100%',
    backgroundColor: Color.white,
    borderRadius: 5,
  },
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
    backgroundColor: Color.primaryGreen,
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
  type: {
    color: Color.gray,
  },
});
