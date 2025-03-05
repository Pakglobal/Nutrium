import {
  Platform,
  SafeAreaView,
  StyleSheet,
  Text,
  TextInput,
  TouchableOpacity,
  View,
} from 'react-native';
import React, {useEffect, useState} from 'react';
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
import { clientData } from '../../../redux/admin';


const ClientScreen = () => {
  const [search, setSearch] = useState('');
  const [filteredClients, setFilteredClients] = useState([]);
  const navigation = useNavigation();
  const dispatch = useDispatch();

  const getToken = useSelector(state => state?.user?.userInfo);
  const token = getToken?.token;

  const getAllClientData =
    useSelector(state => state?.admin?.clientInfo) || [];

  useEffect(() => {
    const fetchData = async () => {
      try {
        const response = await GetAllClientData(token);
        dispatch(clientData(response));
      } catch (error) {
        console.error('Error fetching clients:', error);
      }
    };
    fetchData();
  }, []);

  useEffect(() => {
    if (search.trim() === '') {
      setFilteredClients(getAllClientData);
    } else {
      const filteredData = getAllClientData.filter(
        client =>
          client?.fullName?.toLowerCase().includes(search.toLowerCase()) ||
          client?.workplace?.toLowerCase().includes(search.toLowerCase()),
      );
      setFilteredClients(filteredData);
    }
  }, [search, getAllClientData]);

  const handleClientNavigate = async item => {
    const response = await GetClientData(token, item?._id);
    navigation.navigate('ClientProfile', {response: response});
  };

  return (
    <SafeAreaView>
      <View style={styles.searchContainer}>
        <View style={styles.inputContainer}>
          <Ionicons name="search" color={Color.gray} size={scale(18)} />
          <TextInput
            value={search}
            onChangeText={setSearch}
            placeholder="Search clients"
            style={{marginLeft: scale(10)}}
          />
        </View>
      </View>

      <View>
        {filteredClients && filteredClients.length > 0 ? (
          filteredClients.map(item => (
            <TouchableOpacity
              style={styles.messageCard}
              onPress={() => handleClientNavigate(item)}
              key={item?._id}>
              <View style={styles.messageCardContainer}>
                <View style={styles.avatar}></View>
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
      </View>
    </SafeAreaView>
  );
};

export default ClientScreen;

const styles = StyleSheet.create({
  inputContainer: {
    alignItems: 'center',
    flexDirection: 'row',
    paddingHorizontal: scale(8),
    paddingVertical: Platform.OS === 'ios' ? verticalScale(12) : 0,
  },
  searchContainer: {
    width: '100%',
    backgroundColor: Color.primary,
    borderRadius: 5,
  },
  messageCardContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    padding: scale(5),
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
    fontWeight: 'bold',
    fontSize: 16,
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
