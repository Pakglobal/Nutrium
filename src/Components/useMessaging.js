import React, { useEffect, useState, useRef, useCallback } from 'react';
import {
  View,
  Text,
  FlatList,
  TextInput,
  TouchableOpacity,
  StyleSheet,
  Image,
  ActivityIndicator,
  Modal,
  Animated,
  PanResponder,
  RefreshControl,
  SafeAreaView,
  ImageBackground,
  AppState,
} from 'react-native';
import DocumentPicker from 'react-native-document-picker';
import {
  connectSocket,
  joinRoom,
  getChatHistory,
  onReceiveMessage,
  sendMessage,
  onMessagesSeen,
} from '../Components/SocketService';

import { useNavigation } from '@react-navigation/native';
import AntDesign from 'react-native-vector-icons/AntDesign';
import Ionicons from 'react-native-vector-icons/Ionicons';
import MaterialIcons from 'react-native-vector-icons/MaterialIcons';
import Feather from 'react-native-vector-icons/Feather';
import { scale as scaleSize, verticalScale } from 'react-native-size-matters';
import moment from 'moment';

import uuid from 'react-native-uuid';
import { Color } from '../assets/styles/Colors';

const MessageComponent = ({
  userId,
  otherUserId,
  userName,
  image,
  showHeader = true,
  containerStyle,
  gender,
}) => {
  const navigation = useNavigation();

  const userImage = image
    ? { uri: image }
    : gender === 'Female'
      ? require('../assets/Images/woman.png')
      : require('../assets/Images/man.png');

  const [messages, setMessages] = useState([]);
  const [text, setText] = useState('');
  const [selectedFile, setSelectedFile] = useState(null);
  const [loading, setLoading] = useState(false);
  const [fileUploading, setFileUploading] = useState(false);

  const [imageViewerVisible, setImageViewerVisible] = useState(false);
  const [selectedImage, setSelectedImage] = useState(null);
  const [uploadingFiles, setUploadingFiles] = useState({});

  const scale = useRef(new Animated.Value(1)).current;
  const lastScale = useRef(1);
  const offsetX = useRef(new Animated.Value(0)).current;
  const offsetY = useRef(new Animated.Value(0)).current;
  const lastX = useRef(0);
  const lastY = useRef(0);

  const sortedMessages = [...messages]?.sort(
    (a, b) => new Date(b?.createdAt) - new Date(a?.createdAt),
  );

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
            Animated.spring(scale, {
              toValue: 1,
              useNativeDriver: true,
            }),
            Animated.spring(offsetX, {
              toValue: 0,
              useNativeDriver: true,
            }),
            Animated.spring(offsetY, {
              toValue: 0,
              useNativeDriver: true,
            }),
          ]).start();
          lastScale.current = 1;
          lastX.current = 0;
          lastY.current = 0;
        }
      },
    }),
  ).current;

  useEffect(() => {
    const socket = connectSocket();
    if (socket) {
      setLoading(true);
    }
    joinRoom(userId, otherUserId);

    getChatHistory(userId, otherUserId, history => {
      setMessages(history?.reverse());
      setLoading(false);

      const unseenMessagesFromOther = history?.filter(
        msg => !msg?.seen && msg.senderId !== userId && msg.receiverId === userId
      );

      if (unseenMessagesFromOther?.length > 0) {
        const messageIds = unseenMessagesFromOther.map(msg => msg?._id).filter(Boolean);
        socket.emit('messageSeen', { userId, otherUserId, messageIds });
      }
    });

    const messageHandler = newMessage => {
      console.log('newMessage', newMessage);

      setMessages(prevMessages => {
        const messageExists = prevMessages.some(msg =>
          (msg._id && msg._id === newMessage._id) ||
          (msg.tempId && msg.tempId === newMessage.tempId)
        );

        if (messageExists) {
          return prevMessages.map(msg =>
            ((msg._id && msg._id === newMessage._id) ||
              (msg.tempId && msg.tempId === newMessage.tempId))
              ? { ...newMessage, tempId: msg.tempId || newMessage.tempId }
              : msg
          );
        }

        return [newMessage, ...prevMessages];
      });

      if (newMessage?.senderId !== userId && newMessage?.receiverId === userId) {
        markMessagesAsSeen([newMessage._id]);
      }
    };

    onReceiveMessage(messageHandler);

    const messagesSeenHandler = (data) => {
      console.log('Messages seen by other user:', data);
      if (data?.messageIds && data?.senderId === userId && data?.receiverId === otherUserId) {
        console.log('Updating seen status for our messages:', data.messageIds);
        setMessages(prevMessages =>
          prevMessages.map(msg =>
            data.messageIds.includes(msg._id) ? { ...msg, seen: true } : msg
          )
        );
      }
    };

    onMessagesSeen(messagesSeenHandler);

    const markMessagesAsSeen = (specificIds = null) => {
      const unseenMessages = specificIds
        ? messages.filter(msg => specificIds.includes(msg._id) && !msg?.seen && msg.receiverId === userId)
        : messages.filter(msg => !msg?.seen && msg.senderId !== userId && msg.receiverId === userId);

      if (unseenMessages.length > 0) {
        const messageIds = unseenMessages.map(msg => msg?._id).filter(Boolean);
        if (messageIds.length > 0) {
          console.log('Marking messages as seen:', messageIds);
          socket.emit('messageSeen', { userId, otherUserId, messageIds });
        }
      }
    };

    markMessagesAsSeen();

    return () => {
      socket.off('receiveMessage', messageHandler);
      socket.off('messagesSeen', messagesSeenHandler);
      socket.disconnect();
    };
  }, [userId, otherUserId]);




  const formatTime = isoString => {
    return moment(isoString).format('h.mm A');
  };

  const handleSend = () => {
    if (text?.trim() || selectedFile) {
      const tempId = uuid.v4();
      const now = new Date().toISOString();

      const tempMessage = {

        tempId: tempId,
        senderId: userId,
        receiverId: otherUserId,
        message: text,
        file: selectedFile?.url,
        seen: false,
        createdAt: now,
      };

      setMessages((prevMessages) => [tempMessage, ...prevMessages]);

      sendMessage(userId, otherUserId, text, selectedFile?.url, tempId)



      setText('');
      setSelectedFile(null);
    }
  };
  const closeImageViewer = () => {
    setImageViewerVisible(false);
    setSelectedImage(null);
  };

  const resetImageZoom = () => {
    Animated.parallel([
      Animated.spring(scale, {
        toValue: 1,
        useNativeDriver: true,
      }),
      Animated.spring(offsetX, {
        toValue: 0,
        useNativeDriver: true,
      }),
      Animated.spring(offsetY, {
        toValue: 0,
        useNativeDriver: true,
      }),
    ]).start();
    lastScale.current = 1;
    lastX.current = 0;
    lastY.current = 0;
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
          flatListData.push({
            ...message,
            type: 'message',
          });
        });

        flatListData.push({
          id: `date-${date}`,
          type: 'date',
          date,
        });
      });

    return flatListData;
  };

  const formatDateForSeparator = dateString => {
    const messageDate = moment(dateString);
    const today = moment().startOf('day');
    const yesterday = moment().subtract(1, 'day').startOf('day');

    if (messageDate?.isSame(today, 'day')) {
      return 'Today';
    } else if (messageDate?.isSame(yesterday, 'day')) {
      return 'Yesterday';
    } else if (messageDate?.isAfter(today.clone().subtract(7, 'days'))) {
      return messageDate?.format('dddd');
    } else {
      return messageDate?.format('MMM D');
    }
  };

  const flatListData = createFlatListData(sortedMessages);

  const renderItem = ({ item }) => {
    if (item.type === 'date') {
      return (
        <View style={styles.dateSeparator}>
          <Text style={styles.dateSeparatorText}>
            {formatDateForSeparator(item?.date)}
          </Text>
        </View>
      );
    } else {
      return renderMessage({ item });
    }
  };

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

  const handleSendFile = async () => {
    try {
      const result = await DocumentPicker.pick({
        type: [DocumentPicker.types.allFiles],
      });

      if (result && result[0]) {
        const fileId = `temp-${Date.now()}`;

        setUploadingFiles(prev => ({
          ...prev,
          [fileId]: true,
        }));

        const tempMessage = {
          _id: fileId,
          senderId: userId,
          receiverId: otherUserId,
          file: result[0].uri,
          createdAt: new Date().toISOString(),
          isTemp: true,
        };

        setMessages(prevMessages => [tempMessage, ...prevMessages]);

        try {
          const uploadedFile = await uploadFileAndGetUrl(result[0]);

          sendMessage(userId, otherUserId, '', uploadedFile.url);

          setMessages(prevMessages =>
            prevMessages.filter(msg => msg._id !== fileId),
          );
        } catch (error) {
          console.error('Upload failed:', error);
        } finally {
          setUploadingFiles(prev => {
            const newState = { ...prev };
            delete newState[fileId];
            return newState;
          });
        }
      }
    } catch (err) {
      if (DocumentPicker.isCancel(err)) {
        console.error('User cancelled file picker');
      } else {
        console.error('DocumentPicker Error: ', err);
      }
    }
  };

  const uploadFileAndGetUrl = async file => {
    const formData = new FormData();
    formData.append('file', {
      uri: file?.uri,
      name: file?.name,
      type: file?.type,
    });

    const response = await fetch(
      '${BASE_URL}upload',
      {
        method: 'POST',
        body: formData,
        headers: {
          'Content-Type': 'multipart/form-data',
        },
      },
    );

    if (!response.ok) {
      throw new Error('Upload failed');
    }

    return await response.json();
  };

  const renderMessage = ({ item }) => {
    const isSender = item?.senderId === userId;
    const fileUrl = item?.file || item?.fileUrl;
    const time = formatTime(item?.createdAt || item?.timestamp);
    const isUploading = item.isTemp || uploadingFiles[item._id];
    const isSeen = item?.seen;
    const isTemp = item._id?.startsWith('temp-');

    return (
      <View
        style={[
          styles.messageContainer,
          isSender ? styles.sent : styles.received,
        ]}>
        {fileUrl && (
          <View style={styles.imageContainer}>
            {isUploading ? (
              <View style={styles.loadingImageContainer}>
                <ActivityIndicator size="large" color={Color.primaryColor} />
              </View>
            ) : (
              <TouchableOpacity onPress={() => openImageViewer(fileUrl)}>
                <Image source={{ uri: fileUrl }} style={styles.image} />
                <View style={styles.messageContent}>
                  <Text style={styles.timestampText}>{time}</Text>
                  <View style={styles.messageFooter}>
                    {isSender && (
                      <Ionicons
                        name={isSeen ? 'checkmark-done' : 'checkmark'}
                        size={16}
                        color={isSeen ? Color.primaryColor : Color.gray}

                        style={styles.readStatus}
                      />
                    )}
                  </View>
                </View>
              </TouchableOpacity>
            )}
          </View>
        )}

        {item?.message && (
          <View>
            <Text style={styles.messageText}>{item?.message}</Text>
            <View style={styles.messageContent}>
              <Text style={styles.timestampText}>{time}</Text>
              <View style={styles.messageFooter}>
                {isSender && !isTemp && (
                  <Ionicons
                    name={isSeen ? 'checkmark-done' : 'checkmark'}
                    size={16}
                    color={isSeen ? Color.primaryColor : Color.gray}
                    style={styles.readStatus}
                  />
                )}
                {isSender && isTemp && (
                  <Ionicons
                    name="time-outline"
                    size={16}
                    color={Color.gray}
                    style={styles.readStatus}
                  />
                )}
              </View>
            </View>
          </View>
        )}
      </View>
    );
  };

  const renderHeader = () => {
    if (!showHeader) return null;

    return (
      <View
        style={{
          paddingVertical: verticalScale(12),
          backgroundColor: Color.common,
          flexDirection: 'row',
          justifyContent: 'space-between',
          alignItems: 'center',
        }}>
        <View
          style={{
            flexDirection: 'row',
            alignItems: 'center',
            marginHorizontal: scaleSize(16),
          }}>
          <TouchableOpacity onPress={() => navigation.goBack()}>
            <AntDesign
              name="arrowleft"
              color={Color.black}
              size={verticalScale(18)}
            />
          </TouchableOpacity>
          <Image style={styles.profileImage} source={userImage} />
          <Text style={styles.backTxt}>{userName}</Text>
        </View>

        <TouchableOpacity style={{ marginHorizontal: scaleSize(16) }}>
          <Feather
            name="info"
            color={Color.primaryColor}
            size={verticalScale(22)}
          />
        </TouchableOpacity>
      </View>
    );
  };

  return (
    <SafeAreaView style={[styles.container, containerStyle]}>
      {renderHeader()}

      <ImageBackground
        style={{ flex: 1 }}
        source={require('../assets/Images/chatBackground.jpg')}>
        {loading ? (
          <View style={{ flex: 1, justifyContent: 'center', alignItems: 'center' }}>
            <ActivityIndicator size="large" color={Color.primaryColor} />
          </View>
        ) : (
          <FlatList
            data={flatListData}
            keyExtractor={item =>
              item?.type === 'date' ? item?.id : (item?._id?.toString() || `msg-${item?.tempId}`)
            }
            renderItem={renderItem}
            inverted
          />
        )}

        <View style={styles.inputContainer}>
          <TouchableOpacity
            style={styles.attachButton}
            onPress={handleSendFile}
            disabled={fileUploading}>
            <Ionicons
              name="attach"
              size={24}
              color={fileUploading ? Color.lightGray : Color.gray}
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
            onPress={handleSend}
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
                onPress={e => {
                  e.stopPropagation();
                }}
                onLongPress={e => {
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

export default MessageComponent;

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#f0f0f0',
  },
  loadingImageContainer: {
    width: scaleSize(200),
    height: scaleSize(200),
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: 'rgba(0,0,0,0.05)',
    borderRadius: scaleSize(8),
    overflow: 'hidden',
  },
  messageContainer: {
    paddingVertical: verticalScale(5),
    paddingHorizontal: scaleSize(5),
    marginVertical: scaleSize(2),
    marginHorizontal: scaleSize(10),
    borderRadius: scaleSize(8),
    maxWidth: '75%',
  },
  sent: {
    backgroundColor: Color.lightGreen,
    alignSelf: 'flex-end',
    borderBottomRightRadius: 0,
  },
  received: {
    backgroundColor: Color.primaryColor,
    alignSelf: 'flex-start',
    borderBottomLeftRadius: 0,
  },
  imageContainer: {
    backgroundColor: 'rgba(255,255,255,0.1)',
    borderRadius: scaleSize(8),
    padding: scaleSize(5),
  },
  image: {
    width: scaleSize(200),
    height: scaleSize(200),
    borderRadius: scaleSize(8),
  },
  fileContainer: {
    backgroundColor: 'rgba(255,255,255,0.1)',
    padding: scaleSize(5),
    borderRadius: scaleSize(6),
    marginVertical: verticalScale(5),
  },
  fileText: {
    color: Color.black,
    fontWeight: '500',
  },
  messageContent: {
    flexDirection: 'row',
    justifyContent: 'space-between',
  },
  messageText: {
    color: Color.black,
    fontSize: scaleSize(14),
    paddingVertical: verticalScale(5),
    paddingHorizontal: scaleSize(5),
    marginRight: 10,
  },
  timestampText: {
    color: Color.gray,
    fontSize: scaleSize(10),
    alignSelf: 'flex-end',
  },
  previewContainer: {
    padding: verticalScale(10),
    backgroundColor: '#e6e6e6',
    alignItems: 'center',
  },
  uploadingContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    marginVertical: verticalScale(5),
  },
  uploadingText: {
    color: Color.black,
    fontWeight: '500',
    marginHorizontal: scaleSize(5),
  },
  cancelButton: {
    backgroundColor: '#ffeeee',
    paddingHorizontal: scaleSize(15),
    paddingVertical: verticalScale(6),
    borderRadius: scaleSize(20),
  },
  cancelText: {
    color: 'red',
  },
  inputContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#fff',
    borderRadius: scaleSize(25),
    paddingHorizontal: scaleSize(10),
    marginHorizontal: scaleSize(10),
    marginBottom: verticalScale(8),
    marginTop: verticalScale(3),
  },
  attachButton: {
    padding: scaleSize(5),
  },
  input: {
    flex: 1,
    fontSize: scaleSize(14),
    color: Color.black,
  },
  sendButton: {
    padding: scaleSize(5),
  },
  backTxt: {
    fontSize: scaleSize(14),
    color: Color.black,
    marginLeft: scaleSize(5),
  },
  lightGray: {
    color: '#D3D3D3',
  },
  modalContainer: {
    flex: 1,
    backgroundColor: 'rgba(0, 0, 0, 0.9)',
    justifyContent: 'center',
  },
  modalHeader: {
    position: 'absolute',
    top: 0,
    left: 0,
    right: 0,
    height: 60,
    flexDirection: 'row',
    justifyContent: 'flex-end',
    alignItems: 'center',
    zIndex: 10,
    paddingHorizontal: 15,
  },
  closeButton: {
    padding: 10,
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
    width: scaleSize(300),
    height: verticalScale(300),
  },
  zoomInstructions: {
    position: 'absolute',
    bottom: 20,
    left: 0,
    right: 0,
    backgroundColor: 'rgba(0, 0, 0, 0.5)',
    padding: 10,
    alignItems: 'center',
  },
  zoomInstructionsText: {
    color: 'white',
    marginVertical: 2,
  },
  dateSeparator: {
    alignItems: 'center',
    marginVertical: verticalScale(5),
    paddingVertical: verticalScale(5),
  },
  dateSeparatorText: {
    color: '#000',
    backgroundColor: Color.common,
    fontSize: scaleSize(13),
    paddingHorizontal: scaleSize(15),
    paddingVertical: verticalScale(8),
    borderRadius: scaleSize(10),
  },
  profileImage: {
    width: scaleSize(35),
    height: scaleSize(35),
    borderRadius: scaleSize(20),
    backgroundColor: Color.white,
    marginHorizontal: scaleSize(7),
  },
});


