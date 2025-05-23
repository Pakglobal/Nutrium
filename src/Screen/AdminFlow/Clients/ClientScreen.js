import React, {useCallback, useEffect, useState} from 'react';
import {
  Image,
  StyleSheet,
  Text,
  TextInput,
  TouchableOpacity,
  FlatList,
  RefreshControl,
  SafeAreaView,
  View,
} from 'react-native';
import {scale, verticalScale} from 'react-native-size-matters';
import {Color} from '../../../assets/styles/Colors';
import Ionicons from 'react-native-vector-icons/Ionicons';
import Entypo from 'react-native-vector-icons/Entypo';
import {useNavigation} from '@react-navigation/native';
import {useSelector} from 'react-redux';
import {
  GetAllClientData,
  GetClientData,
} from '../../../Apis/AdminScreenApi/ClientApi';
import CustomLoader from '../../../Components/CustomLoader';
import Animated, {FadeInDown} from 'react-native-reanimated';
import {
  SafeAreaProvider,
  useSafeAreaInsets,
} from 'react-native-safe-area-context';

const ClientScreen = ({
  clientData = [],
  loading,
  refreshing,
  onRefresh,
  setError,
  error,
}) => {
  const navigation = useNavigation();
  const insets = useSafeAreaInsets();
  const tokenId = useSelector(state => state?.user?.token);
  const guestTokenId = useSelector(state => state?.user?.guestToken);
  const token = tokenId?.token || guestTokenId?.token;

  const [search, setSearch] = useState('');
  const [filteredClients, setFilteredClients] = useState(clientData);

  useEffect(() => {
    if (!search.trim()) {
      setFilteredClients(clientData);
    } else {
      const filteredData =
        clientData?.filter(
          client =>
            client?.fullName?.toLowerCase()?.includes(search.toLowerCase()) ||
            client?.workplace?.toLowerCase()?.includes(search.toLowerCase()),
        ) || [];
      setFilteredClients(filteredData);
    }
  }, [search, clientData]);

  const handleClientNavigate = useCallback(
    async item => {
      if (!token || !item?._id) {
        setError('Invalid token or client data');
        return;
      }
      try {
        setError(null);
        const response = await GetClientData(token, item._id);
        if (!response) {
          throw new Error('No client data found');
        }
        navigation.navigate('ClientProfile', {response: response});
      } catch (error) {
        console.error('Error navigating to client profile:', error);
        setError('Failed to load client profile. Please try again.');
      }
    },
    [token, navigation],
  );

  const renderClient = ({item, index}) => (
    <Animated.View
      entering={FadeInDown.delay(Math.min(index * 100, 500))}
      style={styles.messageCard}>
      <TouchableOpacity
        onPress={() => handleClientNavigate(item)}
        style={styles.messageCardContainer}
        accessibilityLabel={`View profile of ${item?.fullName || 'client'}`}
        accessibilityRole="button">
        {item?.image ? (
          <Image source={{uri: item.image}} style={styles.avatar} />
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
          <Text style={styles.clientName}>{item?.fullName || 'Unknown'}</Text>
          <View style={styles.locationContainer}>
            <View style={styles.locationIcon}>
              <Entypo
                name="location"
                color={Color.primaryColor}
                size={scale(12)}
              />
            </View>
            <Text style={styles.type}>{item?.workplace || 'N/A'}</Text>
          </View>
        </View>
      </TouchableOpacity>
    </Animated.View>
  );

  return (
    <SafeAreaProvider>
      <SafeAreaView style={[styles.container, {paddingTop: insets.top}]}>
        <View style={styles.searchContainer}>
          <View style={styles.inputContainer}>
            <Ionicons name="search" color={Color.gray} size={scale(18)} />
            <TextInput
              value={search}
              onChangeText={setSearch}
              placeholder="Search clients"
              style={styles.searchInput}
              placeholderTextColor={Color.gray}
              keyboardType="default"
              accessibilityLabel="Search clients by name or workplace"
              accessibilityRole="search"
            />
          </View>
        </View>

        {error && <Text style={styles.errorText}>{error}</Text>}

        {loading ? (
          <CustomLoader style={styles.loader} />
        ) : (
          <FlatList
            data={filteredClients}
            renderItem={renderClient}
            keyExtractor={item => item?._id || `client-${Math.random()}`}
            refreshControl={
              <RefreshControl refreshing={refreshing} onRefresh={onRefresh} />
            }
            showsVerticalScrollIndicator={false}
            ListEmptyComponent={
              <Text style={styles.noDataText}>No clients found</Text>
            }
            contentContainerStyle={styles.flatListContent}
          />
        )}
      </SafeAreaView>
    </SafeAreaProvider>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: Color.white,
  },
  searchContainer: {
    backgroundColor: Color.white,
    borderRadius: scale(5),
    borderWidth: 1,
    borderColor: Color.gray,
    marginVertical: verticalScale(10),
    paddingHorizontal: scale(10),
    paddingVertical: verticalScale(5),
    marginHorizontal: scale(8),
  },
  inputContainer: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  searchInput: {
    flex: 1,
    marginLeft: scale(10),
    color: Color.black,
    fontSize: scale(14),
  },
  flatListContent: {
    paddingHorizontal: scale(10),
    paddingBottom: verticalScale(20),
  },
  messageCard: {
    backgroundColor: Color.white,
    marginBottom: verticalScale(10),
    borderRadius: scale(5),
    elevation: 2,
    shadowColor: Color.black,
    shadowOffset: {width: 0, height: 1},
    shadowOpacity: 0.1,
    shadowRadius: scale(2),
  },
  messageCardContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: scale(10),
    paddingVertical: verticalScale(8),
  },
  avatar: {
    width: scale(40),
    height: scale(40),
    borderRadius: scale(20),
    marginRight: scale(10),
    backgroundColor: Color.primaryColor,
  },
  clientName: {
    fontWeight: '500',
    fontSize: scale(16),
    color: Color.black,
  },
  locationContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    marginTop: verticalScale(3),
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
    fontSize: scale(12),
  },
  noDataText: {
    textAlign: 'center',
    marginTop: verticalScale(30),
    fontSize: scale(14),
    color: Color.gray,
  },
  errorText: {
    textAlign: 'center',
    marginVertical: verticalScale(10),
    fontSize: scale(14),
    color: Color.red,
  },
  loader: {
    marginTop: verticalScale(20),
  },
});

export default ClientScreen;
