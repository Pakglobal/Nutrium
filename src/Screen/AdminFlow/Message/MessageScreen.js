import React, {useCallback, useState} from 'react';
import {
  Text,
  StyleSheet,
  TouchableOpacity,
  Image,
  FlatList,
  RefreshControl,
  SafeAreaView,
  ActivityIndicator,
} from 'react-native';
import {scale, verticalScale} from 'react-native-size-matters';
import {Color} from '../../../assets/styles/Colors';
import {useNavigation} from '@react-navigation/native';
import {useSelector} from 'react-redux';
import {GetClientData} from '../../../Apis/AdminScreenApi/ClientApi';
import Animated, {FadeInDown} from 'react-native-reanimated';
import {
  SafeAreaProvider,
  useSafeAreaInsets,
} from 'react-native-safe-area-context';
import CustomLoader from '../../../Components/CustomLoader';

const MessageScreen = ({
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
  const token = tokenId?.token;

  const handleClientNavigate = useCallback(
    async item => {
      if (!token || !item?._id) {
        setError('Invalid token or client data');
        return;
      }
      try {
        setError(null);
        const response = await GetClientData(token, item._id);
        if (!response?.[0]) {
          throw new Error('No client data found');
        }

        navigation.navigate('Messages', {response: response});
      } catch (error) {
        console.error('Error navigating to client messages:', error);
        setError('Failed to load client messages. Please try again.');
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
        accessibilityLabel={`View messages with ${item?.fullName || 'client'}`}
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
        <Text style={styles.clientName}>{item?.fullName || 'Unknown'}</Text>
      </TouchableOpacity>
    </Animated.View>
  );

  return (
    <SafeAreaProvider>
      <SafeAreaView style={[styles.container, {paddingTop: insets.top}]}>
        {error && <Text style={styles.errorText}>{error}</Text>}
        {loading ? (
          <CustomLoader style={styles.loader} />
        ) : (
          <FlatList
            data={clientData}
            renderItem={renderClient}
            keyExtractor={item => item?._id || `client-${Math.random()}`}
            refreshControl={
              <RefreshControl refreshing={refreshing} onRefresh={onRefresh} />
            }
            showsVerticalScrollIndicator={false}
            ListEmptyComponent={
              <Text style={styles.noDataText}>No Clients Available</Text>
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
  flatListContent: {
    paddingTop: verticalScale(10),
    paddingHorizontal: scale(10),
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

export default MessageScreen;
