import React, {useEffect, useState, useRef} from 'react';
import {
  View,
  Text,
  FlatList,
  TextInput,
  TouchableOpacity,
  StyleSheet,
  Image,
  Modal,
  Animated,
  PanResponder,
  SafeAreaView,
  ImageBackground,
  ActivityIndicator,
  AppState,
  BackHandler,
} from 'react-native';
import DocumentPicker from 'react-native-document-picker';
import {
  connectSocket,
  joinRoom,
  getChatHistory,
  sendMessage,
  markMessagesAsSeen,
  leaveRoom,
} from '../Components/SocketService';
import {useNavigation} from '@react-navigation/native';
import AntDesign from 'react-native-vector-icons/AntDesign';
import Ionicons from 'react-native-vector-icons/Ionicons';
import Feather from 'react-native-vector-icons/Feather';
import {
  scale,
  scale as scaleSize,
  verticalScale,
} from 'react-native-size-matters';
import moment from 'moment';
import uuid from 'react-native-uuid';
import {Color} from '../assets/styles/Colors';
import {useDispatch, useSelector} from 'react-redux';
import {chatList} from '../redux/user';
import useAndroidBack from '../Navigation/useAndroidBack';
import AsyncStorage from '@react-native-async-storage/async-storage';
import {Font} from '../assets/styles/Fonts';
import { BASE_URL } from '../Apis/AllAPI/API';

const MessageComponent = ({
  userId,
  otherUserId,
  showHeader = true,
  containerStyle,
  image,
  gender,
  userName,
}) => {
  const navigation = useNavigation();
  const dispatch = useDispatch();
  const lastMSG = useSelector(state => state?.user?.chat);
  const [messages, setMessages] = useState([]);
  const [text, setText] = useState('');
  const [selectedFile, setSelectedFile] = useState(null);
  const [loading, setLoading] = useState(false);
  const [fileUploading, setFileUploading] = useState(false);
  const [imageViewerVisible, setImageViewerVisible] = useState(false);
  const [selectedImage, setSelectedImage] = useState(null);
  const [uploadingFiles, setUploadingFiles] = useState({});
  const [appState, setAppState] = useState(AppState.currentState);
  const [expandedMessages, setExpandedMessages] = useState({});
  const profileInfo = useSelector(state => state?.user?.profileInfo);
  const profileName = userName;
  const scale = useRef(new Animated.Value(1)).current;
  const lastScale = useRef(1);
  const offsetX = useRef(new Animated.Value(0)).current;
  const offsetY = useRef(new Animated.Value(0)).current;
  const lastX = useRef(0);
  const lastY = useRef(0);

  const userImage = image
    ? {uri: image}
    : gender === 'Female'
    ? require('../assets/Images/woman.png')
    : require('../assets/Images/man.png');

  const panResponder = useRef(
    PanResponder.create({
      onStartShouldSetPanResponder: () => true,
      onMoveShouldSetPanResponder: () => true,
      onPanResponderGrant: () => {
        lastX.current = offsetX._value;
        lastY.current = offsetY._value;
      },
      onPanResponderMove: (event, gestureState) => {
        if (event.nativeEvent.changedTouches.length === 2) {
          const touch1 = event.nativeEvent.changedTouches[0];
          const touch2 = event.nativeEvent.changedTouches[1];
          const distance = Math.sqrt(
            Math.pow(touch2.pageX - touch1.pageX, 2) +
              Math.pow(touch2.pageY - touch1.pageY, 2),
          );
          const newScale = Math.max(1, Math.min(5, distance / 100));
          scale.setValue(newScale);
        } else if (lastScale.current > 1) {
          offsetX.setValue(lastX.current + gestureState.dx);
          offsetY.setValue(lastY.current + gestureState.dy);
        }
      },
      onPanResponderRelease: () => {
        lastScale.current = scale._value;
        if (scale._value <= 1) {
          Animated.parallel([
            Animated.spring(scale, {toValue: 1, useNativeDriver: true}),
            Animated.spring(offsetX, {toValue: 0, useNativeDriver: true}),
            Animated.spring(offsetY, {toValue: 0, useNativeDriver: true}),
          ]).start();
          lastScale.current = 1;
          lastX.current = 0;
          lastY.current = 0;
        }
      },
    }),
  ).current;

  useEffect(() => {
    const backHandler = BackHandler.addEventListener(
      'hardwareBackPress',
      () => {
        if (navigation.canGoBack()) {
          navigation.goBack();
        }
        return true;
      },
    );
    return () => backHandler.remove();
  }, [navigation, dispatch]);

  const fetchChatHistory = () => {
    setLoading(true);
    getChatHistory(userId, otherUserId, history => {
      if (!history) {
        setMessages([]);
        setLoading(false);
        return;
      }
      const updatedHistory = history.reverse().map(msg => ({
        ...msg,
        seen: msg.seen || false,
        tempId: msg.tempId || null,
      }));
      setMessages(prevMessages => {
        const mergedMessages = [...updatedHistory];
        prevMessages.forEach(msg => {
          const existingMsg = mergedMessages.find(
            m => m._id === msg._id || (m.tempId && m.tempId === msg.tempId),
          );
          if (existingMsg) {
            existingMsg.seen = msg.seen;
          } else {
            mergedMessages.push(msg);
          }
        });
        return mergedMessages.sort(
          (a, b) => new Date(b?.createdAt) - new Date(a?.createdAt),
        );
      });
      setLoading(false);
      markUnseenMessages();
    });
  };

  const markUnseenMessages = () => {
    if (appState !== 'active') return;
    const unseenMessages = messages.filter(
      msg =>
        !msg?.seen &&
        msg.senderId !== userId &&
        msg.receiverId === userId &&
        msg._id,
    );
    if (unseenMessages.length > 0) {
      const messageIds = unseenMessages.map(msg => msg._id).filter(Boolean);
      markMessagesAsSeen(messageIds, otherUserId, userId);
    }
  };

  const messageHandler = newMessage => {
    if (!newMessage?._id || !newMessage?.senderId || !newMessage?.receiverId) {
      console.error('Invalid message received:', newMessage);
      return;
    }
    setMessages(prevMessages => {
      const safeNewMessage = {
        ...newMessage,
        tempId: newMessage.tempId || null,
        seen: newMessage.seen || false,
      };
      const messageExists = prevMessages.some(
        msg =>
          (msg._id && msg._id === safeNewMessage._id) ||
          (msg.tempId &&
            safeNewMessage.tempId &&
            msg.tempId === safeNewMessage.tempId),
      );
      if (messageExists) {
        return prevMessages.map(msg =>
          (msg._id && msg._id === safeNewMessage._id) ||
          (msg.tempId &&
            safeNewMessage.tempId &&
            msg.tempId === safeNewMessage.tempId)
            ? {
                ...safeNewMessage,
                tempId: msg.tempId || safeNewMessage.tempId,
                seen: msg.seen,
              }
            : msg,
        );
      }
      return [safeNewMessage, ...prevMessages];
    });
    if (
      newMessage?.senderId !== userId &&
      newMessage?.receiverId === userId &&
      !newMessage?.seen &&
      appState === 'active'
    ) {
      markMessagesAsSeen([newMessage._id], otherUserId, userId);
    }
  };

  const messagesSeenHandler = data => {
    if (
      data?.messageIds &&
      data?.senderId === userId &&
      data?.receiverId === otherUserId
    ) {
      setMessages(prevMessages =>
        prevMessages.map(msg =>
          data.messageIds.includes(msg._id) ? {...msg, seen: true} : msg,
        ),
      );
    }
  };

  useEffect(() => {
    const socket = connectSocket();
    if (socket.connected) {
      joinRoom(userId, otherUserId);
      fetchChatHistory();
    } else {
      socket.on('connect', () => {
        joinRoom(userId, otherUserId);
        fetchChatHistory();
      });
    }
    socket.on('receiveMessage', messageHandler);
    socket.on('messagesSeen', messagesSeenHandler);

    const handleAppStateChange = nextAppState => {
      setAppState(nextAppState);
      if (nextAppState === 'active') {
        if (socket.connected) {
          joinRoom(userId, otherUserId);
          fetchChatHistory();
          markUnseenMessages();
        } else {
          socket.on('connect', () => {
            joinRoom(userId, otherUserId);
            fetchChatHistory();
            markUnseenMessages();
          });
        }
      } else if (nextAppState === 'background') {
        leaveRoom(userId, otherUserId);
      }
    };

    const subscription = AppState.addEventListener(
      'change',
      handleAppStateChange,
    );
    return () => {
      socket.off('receiveMessage', messageHandler);
      socket.off('messagesSeen', messagesSeenHandler);
      socket.off('connect');
      leaveRoom(userId, otherUserId);
      subscription.remove();
    };
  }, [userId, otherUserId]);

  const formatTime = isoString => moment(isoString).format('h:mm A');

  const handleSendMessage = async (isFilePicker = false) => {
    removeSelectedFile('');
    setText('');
    if (isFilePicker) {
      try {
        setFileUploading(true);
        const result = await DocumentPicker.pick({
          type: [DocumentPicker.types.allFiles],
        });

        if (!result[0]?.uri) {
          setFileUploading(false);
          return;
        }

        setSelectedFile({
          uri: result[0].uri,
          name: result[0].name,
          type: result[0].type,
        });
      } catch (err) {
        if (DocumentPicker.isCancel(err)) {
          console.warn('User cancelled file picker');
        } else {
          console.error('Error picking file:', err);
        }
      } finally {
        setFileUploading(false);
      }
      return;
    }

    if (!text?.trim() && !selectedFile) return;

    const tempId = uuid.v4();
    const now = new Date().toISOString();
    let fileUrl = null;

    try {
      if (selectedFile) {
        setFileUploading(true);
        setUploadingFiles(prev => ({...prev, [tempId]: true}));

        setMessages(prevMessages => [
          {
            _id: tempId,
            tempId,
            senderId: userId,
            receiverId: otherUserId,
            file: selectedFile.uri,
            message: text?.trim() || '',
            createdAt: now,
            isTemp: true,
            seen: false,
          },
          ...prevMessages,
        ]);

        const uploadedFile = await uploadFileAndGetUrl(selectedFile);
        fileUrl = uploadedFile.url;

        setMessages(prevMessages =>
          prevMessages.map(msg =>
            msg._id === tempId
              ? {
                  ...msg,
                  file: fileUrl,
                  message: text?.trim() || '',
                  isTemp: false,
                }
              : msg,
          ),
        );
      } else {
        const tempMessage = {
          _id: tempId,
          tempId,
          senderId: userId,
          receiverId: otherUserId,
          message: text?.trim(),
          file: null,
          createdAt: now,
          seen: false,
        };
        setMessages(prevMessages => [tempMessage, ...prevMessages]);
      }

      await sendMessage(
        userId,
        otherUserId,
        text?.trim() || '',
        fileUrl || null,
        tempId,
      );
    } catch (err) {
      console.error('Error in handleSendMessage:', err);
      setMessages(prevMessages =>
        prevMessages.filter(msg => msg._id !== tempId),
      );
    } finally {
      setText('');
      setSelectedFile(null);
      setFileUploading(false);
      setUploadingFiles(prev => {
        const newState = {...prev};
        delete newState[tempId];
        return newState;
      });
    }
  };

  const removeSelectedFile = () => {
    setSelectedFile(null);
  };

  const uploadFileAndGetUrl = async file => {
    const formData = new FormData();
    formData.append('file', {
      uri: file?.uri,
      name: file?.name,
      type: file?.type,
    });
    const response = await fetch(`${BASE_URL}/upload`, {
      method: 'POST',
      body: formData,
      headers: {'Content-Type': 'multipart/form-data'},
    });
    if (!response.ok) {
      console.error('Upload failed with status:', response.status);
      throw new Error('Upload failed');
    }
    const json = await response.json();
    console.log('Upload response:', json);
    return json;
  };

  const groupMessagesByDate = messages => {
    const groups = {};
    messages?.forEach(message => {
      const date = moment(message?.createdAt)?.format('YYYY-MM-DD');
      if (!groups[date]) {
        groups[date] = [];
      }
      groups[date]?.push(message);
    });
    return groups;
  };

  const createFlatListData = messages => {
    if (!messages?.length) return [];
    const groupedMessages = groupMessagesByDate(messages);
    const flatListData = [];
    Object.keys(groupedMessages)
      .sort((a, b) => new Date(b) - new Date(a))
      .forEach(date => {
        const messagesForDate = groupedMessages[date].sort(
          (a, b) => new Date(b?.createdAt) - new Date(a?.createdAt),
        );
        messagesForDate.forEach(message => {
          flatListData.push({...message, type: 'message'});
        });
        flatListData.push({id: `date-${date}`, type: 'date', date});
      });
    return flatListData;
  };

  const formatDateForSeparator = dateString => {
    const messageDate = moment(dateString);
    const today = moment().startOf('day');
    const yesterday = moment().subtract(1, 'day').startOf('day');
    if (messageDate?.isSame(today, 'day')) return 'Today';
    if (messageDate?.isSame(yesterday, 'day')) return 'Yesterday';
    if (messageDate?.isAfter(today.clone().subtract(7, 'days')))
      return messageDate?.format('dddd');
    return messageDate?.format('MMM D');
  };

  const sortedMessages = [...messages].sort(
    (a, b) => new Date(b?.createdAt) - new Date(a?.createdAt),
  );
  const flatListData = createFlatListData(sortedMessages);

  const openImageViewer = fileUrl => {
    setSelectedImage(fileUrl);
    setImageViewerVisible(true);
    scale.setValue(1);
    offsetX.setValue(0);
    offsetY.setValue(0);
    lastScale.current = 1;
    lastX.current = 0;
    lastY.current = 0;
  };

  const closeImageViewer = () => {
    setImageViewerVisible(false);
    setSelectedImage(null);
  };

  const resetImageZoom = () => {
    Animated.parallel([
      Animated.spring(scale, {toValue: 1, useNativeDriver: true}),
      Animated.spring(offsetX, {toValue: 0, useNativeDriver: true}),
      Animated.spring(offsetY, {toValue: 0, useNativeDriver: true}),
    ]).start();
    lastScale.current = 1;
    lastX.current = 0;
    lastY.current = 0;
  };

  const CHARACTER_LIMIT = 200;

  const renderMessage = ({item}) => {
    const isSender = item?.senderId === userId;
    const fileUrl = item?.file || item?.fileUrl;
    const time = formatTime(item?.createdAt || item?.timestamp);
    const isUploading = item.isTemp || uploadingFiles[item._id];
    const isSeen = item?.seen;
    const isTemp = item._id?.startsWith('temp-');
    const isLongMessage = item?.message?.length > CHARACTER_LIMIT;
    const isExpanded = expandedMessages[item._id] || false;

    const toggleReadMore = () => {
      setExpandedMessages(prev => ({
        ...prev,
        [item._id]: !isExpanded,
      }));
    };

    const displayedText =
      isLongMessage && !isExpanded
        ? `${item?.message.substring(0, CHARACTER_LIMIT)}...`
        : item?.message;

    return (
      <View
        style={[
          styles.messageContainer,
          isSender ? styles.sent : styles.received,
        ]}>
        <View style={styles.messageWrapper}>
          {fileUrl && (
            <View style={styles.imageContainer}>
              {isUploading ? (
                <ActivityIndicator color={Color.primaryColor} />
              ) : (
                <TouchableOpacity onPress={() => openImageViewer(fileUrl)}>
                  <Image source={{uri: fileUrl}} style={styles.image} />
                </TouchableOpacity>
              )}
            </View>
          )}
          {item?.message && (
            <View style={styles.textContainer}>
              <Text style={styles.messageText}>{displayedText}</Text>
              {isLongMessage && (
                <TouchableOpacity onPress={toggleReadMore}>
                  <Text style={styles.readMoreText}>
                    {isExpanded ? 'Read Less' : 'Read More'}
                  </Text>
                </TouchableOpacity>
              )}
            </View>
          )}
          <View style={styles.messageContent}>
            <Text style={styles.timestampText}>{time}</Text>
            {isSender && (
              <View style={styles.messageFooter}>
                {isTemp ? (
                  <Ionicons
                    name="time-outline"
                    size={16}
                    color={Color.gray}
                    style={styles.readStatus}
                  />
                ) : (
                  <Ionicons
                    name={isSeen ? 'checkmark-done' : 'checkmark'}
                    size={16}
                    color={isSeen ? Color.primaryColor : Color.gray}
                    style={styles.readStatus}
                  />
                )}
              </View>
            )}
          </View>
        </View>
      </View>
    );
  };

  const renderItem = ({item}) => {
    if (item.type === 'date') {
      return (
        <View style={styles.dateSeparator}>
          <Text style={styles.dateSeparatorText}>
            {formatDateForSeparator(item?.date)}
          </Text>
        </View>
      );
    }
    return renderMessage({item});
  };

  const renderHeader = () => {
    if (!showHeader) return null;
    return (
      <View style={styles.headerContainer}>
        <View style={styles.headerLeft}>
          <TouchableOpacity onPress={() => navigation.goBack()}>
            <AntDesign name="arrowleft" color={Color.black} size={18} />
          </TouchableOpacity>
          <Image style={styles.profileImage} source={userImage} />
          <Text style={styles.backTxt}>{profileName}</Text>
        </View>
        <TouchableOpacity style={{marginHorizontal: 16}}>
          <Feather name="info" color={Color.primaryColor} size={22} />
        </TouchableOpacity>
      </View>
    );
  };

  return (
    <SafeAreaView style={[styles.container, containerStyle]}>
      {renderHeader()}
      <ImageBackground
        style={{flex: 1}}
        source={require('../assets/Images/chatBackground.jpg')}>
        {loading ? (
          <ActivityIndicator
            color={Color.primaryColor}
            size="large"
            style={{flex: 1, justifyContent: 'center', alignSelf: 'center'}}
          />
        ) : (
          <FlatList
            data={flatListData}
            keyExtractor={item =>
              item?.type === 'date'
                ? item?.id
                : item?._id?.toString() || `msg-${item?.tempId}`
            }
            renderItem={renderItem}
            inverted
          />
        )}
        <View style={styles.inputContainer}>
          {selectedFile && (
            <View style={styles.filePreviewContainer}>
              <Text style={styles.filePreviewText}>{selectedFile.name}</Text>
              <TouchableOpacity onPress={removeSelectedFile}>
                <Ionicons name="close" size={20} color={Color.gray} />
              </TouchableOpacity>
            </View>
          )}
          <View style={styles.inputWrapper}>
            <TouchableOpacity
              style={styles.attachButton}
              onPress={() => handleSendMessage(true)}
              disabled={fileUploading}>
              <Ionicons
                name="attach"
                size={24}
                color={fileUploading ? Color.lightgray : Color.gray}
              />
            </TouchableOpacity>
            <TextInput
              style={styles.input}
              value={text}
              onChangeText={setText}
              placeholder="Type a message..."
              multiline
              placeholderTextColor={Color.black}
            />
            <TouchableOpacity
              style={styles.sendButton}
              onPress={() => handleSendMessage(false)}
              disabled={(!text.trim() && !selectedFile) || fileUploading}>
              <Ionicons
                name="send"
                size={20}
                color={
                  text.trim() || (selectedFile && !fileUploading)
                    ? Color.primaryColor
                    : Color.gray
                }
              />
            </TouchableOpacity>
          </View>
        </View>
      </ImageBackground>
      <Modal
        visible={imageViewerVisible}
        transparent={true}
        animationType="fade"
        onRequestClose={closeImageViewer}>
        <View style={styles.modalContainer}>
          <View style={styles.modalHeader}>
            <TouchableOpacity
              style={styles.closeButton}
              onPress={closeImageViewer}>
              <AntDesign name="close" size={24} color="#fff" />
            </TouchableOpacity>
          </View>
          <TouchableOpacity
            activeOpacity={1}
            style={styles.imageViewerContainer}
            onPress={closeImageViewer}
            onLongPress={resetImageZoom}
            delayLongPress={200}>
            <Animated.View
              {...panResponder.panHandlers}
              style={[
                styles.imageViewerWrapper,
                {
                  transform: [
                    {scale: scale},
                    {translateX: offsetX},
                    {translateY: offsetY},
                  ],
                },
              ]}>
              <TouchableOpacity
                activeOpacity={1}
                onPress={e => e.stopPropagation()}
                onLongPress={e => {
                  e.stopPropagation();
                  resetImageZoom();
                }}
                delayLongPress={200}>
                <Animated.Image
                  source={{uri: selectedImage}}
                  style={styles.fullScreenImage}
                  resizeMode="contain"
                />
              </TouchableOpacity>
            </Animated.View>
          </TouchableOpacity>
        </View>
      </Modal>
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: Color.white,
  },
  headerContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    padding: 16,
    borderBottomWidth: 1,
    backgroundColor: Color?.white,
    borderBottomColor: '#e0e0e0',
  },
  headerLeft: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  backTxt: {
    fontSize: 18,
    color: Color.black,
    marginLeft: scale(5),
  },
  inputContainer: {
    backgroundColor: 'transparent',
    paddingTop: 5,
    padding: 10,
  },
  filePreviewContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: Color?.lightgray,
    justifyContent: 'space-between',
    padding: 5,
    marginBottom: 5,
    borderRadius: 10,
  },
  filePreviewText: {
    color: Color.black,
    fontSize: 14,
  },
  inputWrapper: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: Color?.white,
    borderRadius: 25,
    paddingHorizontal: 10,
    paddingVertical: 5,
  },
  input: {
    flex: 1,
    fontSize: 16,
    color: Color.black,
    paddingVertical: 8,
    paddingHorizontal: 10,
  },
  attachButton: {
    padding: 8,
    alignSelf: 'flex-end',
  },
  sendButton: {
    padding: 8,
    alignSelf: 'flex-end',
  },
  messageContainer: {
    marginVertical: 4,
    marginHorizontal: 10,
    maxWidth: '80%',
  },
  sent: {
    alignSelf: 'flex-end',
    borderRadius: 12,
    padding: 8,
    backgroundColor: Color?.lightGreen,
  },
  received: {
    alignSelf: 'flex-start',
    borderRadius: 12,
    padding: 8,
    backgroundColor: Color?.white,
  },
  messageWrapper: {},
  textContainer: {
    paddingVertical: 4,
  },
  messageText: {
    fontSize: 16,
    color: Color.black,
    fontFamily: Font?.Poppins,
  },
  readMoreText: {
    fontSize: 14,
    color: Color.primaryColor,
    marginTop: 4,
    fontFamily: Font?.Poppins,
  },
  imageContainer: {
    marginBottom: 4,
  },
  image: {
    width: 200,
    height: 200,
    borderRadius: 8,
  },
  messageContent: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'flex-end',
    marginTop: 4,
  },
  timestampText: {
    fontSize: 12,
    color: Color.gray,
    marginRight: 4,
  },
  messageFooter: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  readStatus: {
    marginLeft: 4,
  },
  dateSeparator: {
    alignItems: 'center',
    marginVertical: 10,
  },
  dateSeparatorText: {
    fontSize: 14,
    color: Color.gray,
    backgroundColor: '#f0f0f0',
    paddingHorizontal: 12,
    paddingVertical: 4,
    borderRadius: 12,
  },
  modalContainer: {
    flex: 1,
    backgroundColor: 'rgba(0, 0, 0, 0.9)',
  },
  modalHeader: {
    position: 'absolute',
    top: 40,
    left: 0,
    right: 0,
    zIndex: 10,
    flexDirection: 'row',
    justifyContent: 'flex-end',
    padding: 16,
  },
  closeButton: {
    padding: 8,
  },
  imageViewerContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
  imageViewerWrapper: {
    justifyContent: 'center',
    alignItems: 'center',
  },
  fullScreenImage: {
    width: 300,
    height: 300,
  },
  profileImage: {
    width: 35,
    height: 35,
    borderRadius: 20,
    backgroundColor: Color.white,
    marginHorizontal: 7,
  },
});

export default MessageComponent;
