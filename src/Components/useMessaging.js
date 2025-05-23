import React, { useEffect, useState, useRef, useCallback, useMemo } from 'react';
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
import { useNavigation } from '@react-navigation/native';
import AntDesign from 'react-native-vector-icons/AntDesign';
import Ionicons from 'react-native-vector-icons/Ionicons';
import Feather from 'react-native-vector-icons/Feather';
import {
  scale,
} from 'react-native-size-matters';
import moment from 'moment';
import uuid from 'react-native-uuid';
import { Color } from '../assets/styles/Colors';
import { useDispatch, useSelector } from 'react-redux';
import { Font } from '../assets/styles/Fonts';
import { BASE_URL } from '../Apis/AllAPI/API';
import { chatList } from '../redux/user';
import AsyncStorage from '@react-native-async-storage/async-storage';

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
  const chatId = [userId, otherUserId].sort().join('_');
  const lastMSG = useSelector((state) => state?.user?.chat[chatId]) || [];
  const profileInfo = useSelector((state) => state?.user?.profileInfo);
  const profileName = userName || profileInfo?.fullName;
  const [messages, setMessages] = useState(lastMSG);
  const [text, setText] = useState('');
  const [selectedFile, setSelectedFile] = useState(null);
  const [loading, setLoading] = useState(false);
  const [fileUploading, setFileUploading] = useState(false);
  const [imageViewerVisible, setImageViewerVisible] = useState(false);
  const [selectedImage, setSelectedImage] = useState(null);
  const [uploadingFiles, setUploadingFiles] = useState({});
  const [appState, setAppState] = useState(AppState.currentState);
  const [expandedMessages, setExpandedMessages] = useState({});

  const scale = useRef(new Animated.Value(1)).current;
  const lastScale = useRef(1);
  const offsetX = useRef(new Animated.Value(0)).current;
  const offsetY = useRef(new Animated.Value(0)).current;
  const lastX = useRef(0);
  const lastY = useRef(0);

  const userImage = image
    ? { uri: image }
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
            Animated.spring(scale, { toValue: 1, useNativeDriver: true }),
            Animated.spring(offsetX, { toValue: 0, useNativeDriver: true }),
            Animated.spring(offsetY, { toValue: 0, useNativeDriver: true }),
          ]).start();
          lastScale.current = 1;
          lastX.current = 0;
          lastY.current = 0;
        }
      },
    }),
  ).current;

  useEffect(() => {
    const loadMessages = async () => {
      try {
        const storedMessages = await AsyncStorage.getItem(`chat_${chatId}`);
        if (storedMessages) {
          setMessages(JSON.parse(storedMessages));
        }
      } catch (error) {
        console.error('Error loading messages from storage:', error);
      }
    };
    loadMessages();
  }, [chatId]);

  const saveMessages = useCallback(async (updatedMessages) => {
    try {
      await AsyncStorage.setItem(`chat_${chatId}`, JSON.stringify(updatedMessages));
      dispatch(chatList({ chatId, messages: updatedMessages.slice(0, 10) }));
    } catch (error) {
      console.error('Error saving messages to storage:', error);
    }
  }, [chatId, dispatch]);

  const fetchChatHistory = useCallback((isManualRefresh = false) => {
    if (isManualRefresh) setLoading(true);
    getChatHistory(userId, otherUserId, (history) => {
      if (!history) {
        setMessages([]);
        saveMessages([]);
        if (isManualRefresh) setLoading(false);
        return;
      }
      const updatedHistory = history.reverse().map((msg) => ({
        ...msg,
        seen: msg.seen || false,
        tempId: msg.tempId || null,
      }));
      setMessages((prevMessages) => {
        const mergedMessages = [...updatedHistory];
        prevMessages.forEach((msg) => {
          const existingMsg = mergedMessages.find(
            (m) => m._id === msg._id || (m.tempId && m.tempId === msg.tempId),
          );
          if (!existingMsg) {
            mergedMessages.push(msg);
          } else {
            existingMsg.seen = msg.seen;
          }
        });
        const sortedMessages = mergedMessages.sort(
          (a, b) => new Date(b?.createdAt) - new Date(a?.createdAt),
        );
        saveMessages(sortedMessages);
        return sortedMessages;
      });
      if (isManualRefresh) setLoading(false);
    });
  }, [userId, otherUserId, saveMessages]);

  const markUnseenMessages = useCallback(() => {
    if (appState !== 'active') return;
    const unseenMessages = messages.filter(
      (msg) =>
        !msg?.seen &&
        msg.senderId !== userId &&
        msg.receiverId === userId &&
        msg._id,
    );
    if (unseenMessages.length > 0) {
      const messageIds = unseenMessages.map((msg) => msg._id).filter(Boolean);
      markMessagesAsSeen(messageIds, otherUserId, userId);
    }
  }, [messages, userId, otherUserId, appState]);

  const messageHandler = useCallback((newMessage) => {
    if (!newMessage?._id || !newMessage?.senderId || !newMessage?.receiverId) {
      console.error('Invalid message received:', newMessage);
      return;
    }
    setMessages((prevMessages) => {
      const safeNewMessage = {
        ...newMessage,
        tempId: newMessage.tempId || null,
        seen: newMessage.seen || false,
      };
      const messageExists = prevMessages.some(
        (msg) =>
          (msg._id && msg._id === safeNewMessage._id) ||
          (msg.tempId &&
            safeNewMessage.tempId &&
            msg.tempId === safeNewMessage.tempId),
      );
      if (messageExists) {
        return prevMessages.map((msg) =>
          (msg._id && msg._id === safeNewMessage._id) ||
            (msg.tempId &&
              safeNewMessage.tempId &&
              msg.tempId === safeNewMessage.tempId)
            ? { ...safeNewMessage, tempId: msg.tempId || safeNewMessage.tempId, seen: msg.seen }
            : msg,
        );
      }
      const updatedMessages = [safeNewMessage, ...prevMessages];
      saveMessages(updatedMessages);
      return updatedMessages;
    });
    if (
      newMessage?.senderId !== userId &&
      newMessage?.receiverId === userId &&
      !newMessage?.seen &&
      appState === 'active'
    ) {
      markMessagesAsSeen([newMessage._id], otherUserId, userId);
    }
  }, [userId, otherUserId, appState, saveMessages]);

  const messagesSeenHandler = useCallback((data) => {
    if (
      data?.messageIds &&
      data?.senderId === userId &&
      data?.receiverId === otherUserId
    ) {
      setMessages((prevMessages) => {
        const updatedMessages = prevMessages.map((msg) =>
          data.messageIds.includes(msg._id) ? { ...msg, seen: true } : msg,
        );
        saveMessages(updatedMessages);
        return updatedMessages;
      });
    }
  }, [userId, otherUserId, saveMessages]);

  useEffect(() => {
    const socket = connectSocket();
    const initializeSocket = () => {
      joinRoom(userId, otherUserId);
      fetchChatHistory(false);
    };

    if (socket.connected) {
      initializeSocket();
    } else {
      socket.on('connect', initializeSocket);
    }

    socket.on('receiveMessage', messageHandler);
    socket.on('messagesSeen', messagesSeenHandler);

    const handleAppStateChange = (nextAppState) => {
      setAppState(nextAppState);
      if (nextAppState === 'active') {
        if (socket.connected) {
          joinRoom(userId, otherUserId);
          fetchChatHistory(false);
          markUnseenMessages();
        } else {
          socket.on('connect', () => {
            joinRoom(userId, otherUserId);
            fetchChatHistory(false);
            markUnseenMessages();
          });
        }
      } else if (nextAppState === 'background') {
        leaveRoom(userId, otherUserId);
        saveMessages(messages);
      }
    };

    const subscription = AppState.addEventListener('change', handleAppStateChange);
    return () => {
      socket.off('receiveMessage', messageHandler);
      socket.off('messagesSeen', messagesSeenHandler);
      socket.off('connect');
      leaveRoom(userId, otherUserId);
      saveMessages(messages);
      subscription.remove();
    };
  }, [userId, otherUserId, fetchChatHistory, messageHandler, messagesSeenHandler, saveMessages, markUnseenMessages]);

  const formatTime = (isoString) => moment(isoString).format('h:mm A');

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
        setUploadingFiles((prev) => ({ ...prev, [tempId]: true }));

        setMessages((prevMessages) => {
          const newMessage = {
            _id: tempId,
            tempId,
            senderId: userId,
            receiverId: otherUserId,
            file: selectedFile.uri,
            message: text?.trim() || '',
            createdAt: now,
            isTemp: true,
            seen: false,
          };
          const updatedMessages = [newMessage, ...prevMessages];
          saveMessages(updatedMessages);
          return updatedMessages;
        });

        const uploadedFile = await uploadFileAndGetUrl(selectedFile);
        fileUrl = uploadedFile.url;

        setMessages((prevMessages) => {
          const updatedMessages = prevMessages.map((msg) =>
            msg._id === tempId
              ? { ...msg, file: fileUrl, message: text?.trim() || '', isTemp: false }
              : msg,
          );
          saveMessages(updatedMessages);
          return updatedMessages;
        });
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
        setMessages((prevMessages) => {
          const updatedMessages = [tempMessage, ...prevMessages];
          saveMessages(updatedMessages);
          return updatedMessages;
        });
      }

      await sendMessage(userId, otherUserId, text?.trim() || '', fileUrl || null, tempId);
    } catch (err) {
      console.error('Error in handleSendMessage:', err);
      setMessages((prevMessages) => {
        const updatedMessages = prevMessages.filter((msg) => msg._id !== tempId);
        saveMessages(updatedMessages);
        return updatedMessages;
      });
    } finally {
      setText('');
      setSelectedFile(null);
      setFileUploading(false);
      setUploadingFiles((prev) => {
        const newState = { ...prev };
        delete newState[tempId];
        return newState;
      });
    }
  };

  const removeSelectedFile = () => {
    setSelectedFile(null);
  };

  const uploadFileAndGetUrl = async (file) => {
    const formData = new FormData();
    formData.append('file', {
      uri: file?.uri,
      name: file?.name,
      type: file?.type,
    });
    const response = await fetch(`${BASE_URL}/upload`, {
      method: 'POST',
      body: formData,
      headers: { 'Content-Type': 'multipart/form-data' },
    });
    if (!response.ok) {
      console.error('Upload failed with status:', response.status);
      throw new Error('Upload failed');
    }
    return await response.json();
  };

  const groupMessagesByDate = useCallback((messages) => {
    const groups = {};
    messages?.forEach((message) => {
      const date = moment(message?.createdAt)?.format('YYYY-MM-DD');
      if (!groups[date]) groups[date] = [];
      groups[date]?.push(message);
    });
    return groups;
  }, []);

  const createFlatListData = useCallback((messages) => {
    if (!messages?.length) return [];
    const groupedMessages = groupMessagesByDate(messages);
    const flatListData = [];
    Object.keys(groupedMessages)
      .sort((a, b) => new Date(b) - new Date(a))
      .forEach((date) => {
        const messagesForDate = groupedMessages[date].sort(
          (a, b) => new Date(b?.createdAt) - new Date(a?.createdAt),
        );
        messagesForDate.forEach((message) => {
          flatListData.push({ ...message, type: 'message' });
        });
        flatListData.push({ id: `date-${date}`, type: 'date', date });
      });
    return flatListData;
  }, [groupMessagesByDate]);

  const formatDateForSeparator = (dateString) => {
    const messageDate = moment(dateString);
    const today = moment().startOf('day');
    const yesterday = moment().subtract(1, 'day').startOf('day');
    if (messageDate?.isSame(today, 'day')) return 'Today';
    if (messageDate?.isSame(yesterday, 'day')) return 'Yesterday';
    if (messageDate?.isAfter(today.clone().subtract(7, 'days')))
      return messageDate?.format('dddd');
    return messageDate?.format('MMM D');
  };

  const flatListData = useMemo(() => {
    const sortedMessages = [...messages].sort(
      (a, b) => new Date(b?.createdAt) - new Date(a?.createdAt),
    );
    return createFlatListData(sortedMessages);
  }, [messages, createFlatListData]);

  const openImageViewer = (fileUrl) => {
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
      Animated.spring(scale, { toValue: 1, useNativeDriver: true }),
      Animated.spring(offsetX, { toValue: 0, useNativeDriver: true }),
      Animated.spring(offsetY, { toValue: 0, useNativeDriver: true }),
    ]).start();
    lastScale.current = 1;
    lastX.current = 0;
    lastY.current = 0;
  };

  const CHARACTER_LIMIT = 200;

  const renderMessage = useCallback(
    ({ item }) => {
      const isSender = item?.senderId === userId;
      const fileUrl = item?.file || item?.fileUrl;
      const time = formatTime(item?.createdAt || item?.timestamp);
      const isUploading = item.isTemp || uploadingFiles[item._id];
      const isSeen = item?.seen;
      const isTemp = item._id?.startsWith('temp-');
      const isLongMessage = item?.message?.length > CHARACTER_LIMIT;
      const isExpanded = expandedMessages[item._id] || false;

      const toggleReadMore = () => {
        setExpandedMessages((prev) => ({
          ...prev,
          [item._id]: !isExpanded,
        }));
      };

      const displayedText =
        isLongMessage && !isExpanded
          ? `${item?.message.substring(0, CHARACTER_LIMIT)}...`
          : item?.message;

      return (
        <View style={[styles.messageContainer, isSender ? styles.sent : styles.received]}>
          {fileUrl && (
            <View style={styles.imageContainer}>
              {isUploading ? (
                <ActivityIndicator size="large" color={Color.primaryColor} />
              ) : (
                <TouchableOpacity onPress={() => openImageViewer(fileUrl)}>
                  <Image source={{ uri: fileUrl }} style={styles.image} />
                </TouchableOpacity>
              )}
            </View>
          )}
          {item?.message && (
            <View style={styles.messageWrapper}>
              <View style={styles.messageContentWithTime}>
                <View style={styles.textContainer}>
                  <Text style={styles.messageText}>{displayedText}</Text>
                  <View style={styles.timeAndStatusContainer}>
                    <Text style={styles.timestampText}>{time}</Text>
                    {isSender && (
                      <View style={styles.statusContainer}>
                        {isTemp ? (
                          <ActivityIndicator size="small" color={Color.gray} />
                        ) : (
                          <Ionicons
                            name={isSeen ? 'checkmark-done' : 'checkmark'}
                            size={16}
                            color={isSeen ? Color?.primaryColor : Color?.gray}
                          />
                        )}
                      </View>
                    )}
                  </View>
                </View>
                {isLongMessage && (
                  <TouchableOpacity onPress={toggleReadMore}>
                    <Text style={styles.readMoreText}>
                      {isExpanded ? 'Read Less' : 'Read More'}
                    </Text>
                  </TouchableOpacity>
                )}
              </View>
            </View>
          )}
        </View>
      );
    },
    [userId, uploadingFiles, expandedMessages]
  );

  const renderItem = useCallback(
    ({ item }) => {
      if (item.type === 'date') {
        return (
          <View style={styles.dateSeparator}>
            <Text style={styles.dateSeparatorText}>
              {formatDateForSeparator(item?.date)}
            </Text>
          </View>
        );
      }
      return renderMessage({ item });
    },
    [renderMessage],
  );

  const renderHeader = useCallback(() => {
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
        <TouchableOpacity style={{ marginHorizontal: 16 }}>
          <Feather name="info" color={Color.primaryColor} size={22} />
        </TouchableOpacity>
      </View>
    );
  }, [navigation, userImage, profileName, showHeader]);

  return (
    <SafeAreaView style={[styles.container, containerStyle]}>
      {renderHeader()}
      <ImageBackground
        style={{ flex: 1 }}
        source={require('../assets/Images/chatBackground.jpg')}>
        <FlatList
          data={flatListData}
          keyExtractor={(item) =>
            item?.type === 'date'
              ? item?.id
              : item?._id?.toString() || `msg-${item?.tempId}`
          }
          renderItem={renderItem}
          inverted
          initialNumToRender={20}
          maxToRenderPerBatch={10}
          windowSize={5}
        />
        {loading && (
          <View style={styles.loaderOverlay}>
            <ActivityIndicator
              color={Color.primaryColor}
              size="large"
              style={{ justifyContent: 'center', alignSelf: 'center' }}
            />
          </View>
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
                    { scale: scale },
                    { translateX: offsetX },
                    { translateY: offsetY },
                  ],
                },
              ]}>
              <TouchableOpacity
                activeOpacity={1}
                onPress={(e) => e.stopPropagation()}
                onLongPress={(e) => {
                  e.stopPropagation();
                  resetImageZoom();
                }}
                delayLongPress={200}>
                <Animated.Image
                  source={{ uri: selectedImage }}
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
  messageContentWithTime: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    alignItems: 'flex-end',
    minWidth: 80,
  },
  textContainer: {
    flexDirection: 'row',
    alignItems: 'flex-end',
    flexWrap: 'wrap',
  },
  messageText: {
    fontSize: 16,
    color: '#000',
    lineHeight: 20,
    flexShrink: 1,
  },
  timeAndStatusContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    marginLeft: 8,
  },
  timestampText: {
    fontSize: 12,
    color: '#8696A0',
    marginRight: 4,
  },
  statusContainer: {
    marginLeft: 2,
  },
  readMoreText: {
    fontSize: 14,
    color: Color.primaryColor,
    fontFamily: Font?.Poppins,
    marginTop: 4,
  },

  statusContainer: {
    marginLeft: 2,
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
    backgroundColor: "red",
    width: "30%"
  },
  timestampText: {
    fontSize: 12,
    color: Color.gray,
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
  messageContentWithTime: {
    position: 'relative',
    minWidth: 80,
  },
});

export default MessageComponent;


