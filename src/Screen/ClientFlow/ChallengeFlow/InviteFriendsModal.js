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
} from 'react-native';
import Ionicons from 'react-native-vector-icons/Ionicons';
import {useSelector} from 'react-redux';
import {getAllUser} from '../../../Apis/ClientApis/ChallengesApi';
import {Color} from '../../../assets/styles/Colors';
import {scale} from 'react-native-size-matters';
import {Font} from '../../../assets/styles/Fonts';
import CustomShadow from '../../../Components/CustomShadow';
import {shadowStyle} from '../../../assets/styles/Shadow';

const InviteFriendsModal = ({isInviteModalVisible, onClose, onInvite}) => {
  const getToken = useSelector(state => state?.user?.userInfo);
  const token = getToken?.token;
  const [friends, setFriends] = useState([]);
  const [selectedFriends, setSelectedFriends] = useState([]);
  const [searchQuery, setSearchQuery] = useState('');
  const [page, setPage] = useState(1);
  const [hasMore, setHasMore] = useState(true);
  const [loading, setLoading] = useState(false);

  const LIMIT = 25;
  const fetchFriends = async (search = '', pageNo = 1) => {
    if (loading) return;
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
    } catch (err) {
      console.log('Error fetching friends:', err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    const delayDebounce = setTimeout(() => {
      setPage(1);
      fetchFriends(searchQuery, 1);
    }, 400);
    return () => clearTimeout(delayDebounce);
  }, [searchQuery]);

  useEffect(() => {
    if (isInviteModalVisible) {
      setPage(1);
      fetchFriends('', 1);
    }
  }, [isInviteModalVisible]);

  const loadMore = () => {
    if (hasMore && !loading) {
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

  const renderItem = ({item}) => (
    <TouchableOpacity
      style={styles.friendItem}
      onPress={() => toggleSelection(item._id)}>
      <Image
        source={{uri: item.image || 'https://via.placeholder.com/100'}}
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
    <Modal
      animationType="slide"
      transparent={true}
      visible={isInviteModalVisible}
      onRequestClose={onClose}>
      <TouchableWithoutFeedback onPress={onClose}>
        <View style={styles.modalContainer}>
          <TouchableWithoutFeedback onPress={Keyboard.dismiss}>
            <View style={styles.modalContent}>
              <View style={styles.header}>
                <View style={{flex: 1}}>
                  <Text style={styles.title}>Invite</Text>
                </View>
                <TouchableOpacity onPress={onClose}>
                  <Ionicons name="close" size={24} color={Color?.white} />
                </TouchableOpacity>
              </View>
              {/* <CustomShadow style={shadowStyle} >
                                <View>
                                    <Ionicons name='search' />
                                    <TextInput
                                        style={styles.searchInput}
                                        placeholder="Search "
                                        value={searchQuery}
                                        onChangeText={setSearchQuery}
                                        fontFamily={Font?.Poppins}
                                    />
                                </View>
                            </CustomShadow> */}
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
                  onInvite(selectedFriends);
                }}>
                <Text style={styles.inviteButtonText}>
                  Invite{' '}
                  {selectedFriends.length > 0
                    ? `(${selectedFriends.length})`
                    : ''}
                </Text>
              </TouchableOpacity>
            </View>
          </TouchableWithoutFeedback>
        </View>
      </TouchableWithoutFeedback>
    </Modal>
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
    backgroundColor: '#fff',
    width: '90%',
    height: '70%',
    borderRadius: scale(15),
    // padding: 10,
    elevation: 5,
  },
  header: {
    flexDirection: 'row',
    paddingVertical: 10,
    backgroundColor: Color?.primaryColor,
    borderTopRightRadius: scale(15),
    borderTopLeftRadius: scale(15),
    justifyContent: 'space-between',
    flexDirection: 'row',
    paddingHorizontal: scale(15),
  },
  title: {
    fontSize: scale(16),
    color: Color?.white,
    fontFamily: Font?.PoppinsMedium,
  },
  searchInput: {
    backgroundColor: Color?.gray,
    borderRadius: 5,
    marginBottom: 10,
    width: '90%',
    alignSelf: 'center',
    padding: scale(5),
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
  searchContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#fff',
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
    color: '#000',
  },
});

export default InviteFriendsModal;
