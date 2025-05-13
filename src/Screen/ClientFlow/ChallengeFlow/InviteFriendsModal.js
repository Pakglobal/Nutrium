import React, {useEffect, useState} from 'react';
import {
  View,
  Text,
  Modal,
  TextInput,
  FlatList,
  TouchableOpacity,
  Image,
  StyleSheet,
  TouchableWithoutFeedback,
  Keyboard,
  ActivityIndicator,
  KeyboardAvoidingView,
  Platform,
} from 'react-native';
import Ionicons from 'react-native-vector-icons/Ionicons';
import {useSelector} from 'react-redux';
import {getAllUser} from '../../../Apis/ClientApis/ChallengesApi';
import {Color} from '../../../assets/styles/Colors';
import {scale, verticalScale} from 'react-native-size-matters';
import {Font} from '../../../assets/styles/Fonts';
import CustomShadow from '../../../Components/CustomShadow';
import {shadowStyle} from '../../../assets/styles/Shadow';
import CustomAlertBox from '../../../Components/CustomAlertBox';

const InviteFriendsModal = ({isInviteModalVisible, onClose, onInvite}) => {
  const tokenId = useSelector(state => state?.user?.token);
  const guestTokenId = useSelector(state => state?.user?.guestToken);
  const token = tokenId?.token || guestTokenId?.token;

  const [friends, setFriends] = useState([]);
  const [selectedFriends, setSelectedFriends] = useState([]);
  const [searchQuery, setSearchQuery] = useState('');
  const [page, setPage] = useState(1);
  const [hasMore, setHasMore] = useState(true);
  const [loading, setLoading] = useState(false);
  const [alertVisible, setAlertVisible] = useState(false);
  const [alertMessage, setAlertMessage] = useState('');
  const [alertType, setAlertType] = useState('error');
  const [hasError, setHasError] = useState(false);

  const LIMIT = 25;

  const fetchFriends = async (search = '', pageNo = 1) => {
    if (loading || hasError) return;
    setLoading(true);
    try {
      const res = await getAllUser(token, pageNo, LIMIT, search);
      const newFriends = res?.data || [];

      if (pageNo === 1) {
        setFriends(newFriends);
      } else {
        setFriends(prev => [...prev, ...newFriends]);
      }
      setHasMore(newFriends.length === LIMIT);
    } catch (error) {
      setHasError(true);
      setFriends([]);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    if (isInviteModalVisible) {
      setPage(1);
      setHasError(false);
      fetchFriends('', 1);
    }
  }, [isInviteModalVisible]);

  useEffect(() => {
    if (hasError) {
      setFriends([]);
      return;
    }

    const delayDebounce = setTimeout(() => {
      setPage(1);
      fetchFriends(searchQuery, 1);
    }, 400);
    return () => clearTimeout(delayDebounce);
  }, [searchQuery, hasError]);

  const loadMore = () => {
    if (hasMore && !loading && !hasError) {
      const nextPage = page + 1;
      setPage(nextPage);
      fetchFriends(searchQuery, nextPage);
    }
  };

  const toggleSelection = id => {
    setSelectedFriends(prevSelected =>
      prevSelected.includes(id)
        ? prevSelected.filter(selectedId => selectedId !== id)
        : [...prevSelected, id],
    );
  };

  const renderItem = ({item, index}) => (
    <TouchableOpacity
      style={styles.friendItem}
      onPress={() => toggleSelection(item._id)}>
      <Image
        source={{
          uri: item.image || `https://i.pravatar.cc/150?img=${index + 1}`,
        }}
        style={styles.avatar}
      />
      <View style={styles.friendInfo}>
        <Text style={styles.friendName}>{item.fullName || 'Unnamed'}</Text>
        <Text style={styles.friendPhone}>{item.gender || 'N/A'}</Text>
      </View>
      <Ionicons
        name={
          selectedFriends.includes(item._id)
            ? 'checkmark-circle'
            : 'add-circle-outline'
        }
        size={24}
        color={
          selectedFriends.includes(item._id) ? Color?.primaryColor : 'gray'
        }
      />
    </TouchableOpacity>
  );

  return (
    <View>
      <CustomAlertBox
        visible={alertVisible}
        type={alertType}
        message={alertMessage}
        closeAlert={() => setAlertVisible(false)}
        onClose={() => setAlertVisible(false)}
      />
      <Modal
        animationType="slide"
        transparent={true}
        visible={isInviteModalVisible}
        onRequestClose={onClose}>
        <TouchableWithoutFeedback onPress={onClose}>
          <View style={styles.modalContainer}>
            <TouchableWithoutFeedback onPress={Keyboard.dismiss}>
              <KeyboardAvoidingView
                behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
                style={styles.modalContent}>
                <View style={styles.header}>
                  <View style={{flex: 1}}>
                    <Text style={styles.title}>Invite</Text>
                  </View>
                  <TouchableOpacity onPress={onClose}>
                    <Ionicons name="close" size={24} color={Color?.white} />
                  </TouchableOpacity>
                </View>
                <CustomShadow
                  style={shadowStyle}
                  radius={1}
                  color={Color?.blackShadow}>
                  <View style={styles.searchContainer}>
                    <Ionicons
                      name="search"
                      size={20}
                      color={Color.primaryColor}
                      style={styles.searchIcon}
                    />
                    <TextInput
                      style={styles.searchInput}
                      placeholder="Search"
                      value={searchQuery}
                      onChangeText={setSearchQuery}
                      placeholderTextColor="gray"
                    />
                  </View>
                </CustomShadow>

                <FlatList
                  data={friends}
                  keyExtractor={item => item._id}
                  renderItem={renderItem}
                  contentContainerStyle={{flexGrow: 1}}
                  showsVerticalScrollIndicator={false}
                  onEndReached={loadMore}
                  onEndReachedThreshold={0.5}
                  ListEmptyComponent={
                    !loading ? (
                      <View style={styles.emptyContainer}>
                        <Text style={styles.emptyText}>No friends found</Text>
                      </View>
                    ) : null
                  }
                  ListFooterComponent={
                    loading ? (
                      <ActivityIndicator
                        size="small"
                        color={Color?.primaryColor}
                      />
                    ) : null
                  }
                />

                <TouchableOpacity
                  style={styles.inviteButton}
                  onPress={() => {
                    if (hasError || selectedFriends.length === 0) {
                      setAlertMessage(
                        'Please select at least one friend to invite.',
                      );
                      setAlertType('error');
                      setAlertVisible(true);

                      return;
                    }
                    onInvite(selectedFriends);
                  }}
                  disabled={hasError}>
                  <Text style={styles.inviteButtonText}>
                    Invite{' '}
                    {selectedFriends.length > 0
                      ? `(${selectedFriends.length})`
                      : ''}
                  </Text>
                </TouchableOpacity>
              </KeyboardAvoidingView>
            </TouchableWithoutFeedback>
          </View>
        </TouchableWithoutFeedback>
      </Modal>
    </View>
  );
};

const styles = StyleSheet.create({
  modalContainer: {
    flex: 1,
    backgroundColor: 'rgba(0,0,0,0.5)',
    justifyContent: 'center',
    alignItems: 'center',
  },
  modalContent: {
    backgroundColor: Color.white,
    width: '90%',
    height: scale(500),
    borderRadius: scale(15),
    elevation: 5,
  },
  header: {
    flexDirection: 'row',
    paddingVertical: verticalScale(10),
    backgroundColor: Color?.primaryColor,
    borderTopRightRadius: scale(15),
    borderTopLeftRadius: scale(15),
    justifyContent: 'space-between',
    paddingHorizontal: scale(15),
  },
  title: {
    fontSize: scale(16),
    color: Color?.white,
    fontFamily: Font?.PoppinsMedium,
  },
  searchContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: Color.white,
    borderRadius: scale(10),
    paddingHorizontal: scale(10),
    margin: scale(10),
  },
  searchIcon: {
    marginRight: scale(8),
  },
  searchInput: {
    flex: 1,
    height: scale(40),
    fontSize: scale(14),
    color: Color.black,
  },
  friendItem: {
    flexDirection: 'row',
    alignItems: 'center',
    padding: 10,
    borderBottomWidth: 1,
    borderColor: '#ddd',
  },
  avatar: {
    width: 40,
    height: 40,
    borderRadius: 20,
    marginRight: 10,
    backgroundColor: Color?.grayshadow,
  },
  friendInfo: {
    flex: 1,
  },
  friendName: {
    fontSize: 16,
    color: Color?.textColor,
  },
  friendPhone: {
    fontSize: 14,
    color: Color?.gray,
  },
  inviteButton: {
    marginVertical: scale(12),
    backgroundColor: Color?.primaryColor,
    padding: scale(12),
    borderRadius: 5,
    alignItems: 'center',
    width: '90%',
    alignSelf: 'center',
  },
  inviteButtonText: {
    color: 'white',
    fontSize: 16,
    fontWeight: 'bold',
  },
  emptyContainer: {
    justifyContent: 'center',
    alignItems: 'center',
    padding: scale(20),
  },
  emptyText: {
    fontSize: scale(16),
    color: Color?.gray,
    fontFamily: Font?.Poppins,
    textAlign: 'center',
  },
});

export default InviteFriendsModal;
