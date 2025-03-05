import React, {useEffect, useState, useRef} from 'react';
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
} from 'react-native';
import DocumentPicker from 'react-native-document-picker';
import {
  connectSocket,
  joinRoom,
  getChatHistory,
  onReceiveMessage,
  sendMessage,
} from '../../../../Components/SocketService';
import Color from '../../../../assets/colors/Colors';
import {useNavigation} from '@react-navigation/native';
import AntDesign from 'react-native-vector-icons/AntDesign';
import Ionicons from 'react-native-vector-icons/Ionicons';
import MaterialIcons from 'react-native-vector-icons/MaterialIcons';
import Feather from 'react-native-vector-icons/Feather';
import {scale as scaleSize, verticalScale} from 'react-native-size-matters';
import moment from 'moment';
import {useSelector} from 'react-redux';

const MessageScreen = ({route}) => {
  const getId = useSelector(state => state?.user?.userInfo);
  const id = getId?.userData?._id || getId?.user?._id;

  const userId = id;
  const otherUserId = route?.params?.data?._id;
  const navigation = useNavigation();
  const userName = route?.params?.data?.fullName;
  const userImage = route?.params?.data?.image;

  const [messages, setMessages] = useState([]);
  const [text, setText] = useState('');
  const [selectedFile, setSelectedFile] = useState(null);
  const [loading, setLoading] = useState(false);
  const [fileUploading, setFileUploading] = useState(false);
  const [abortController, setAbortController] = useState(null);

  const [imageViewerVisible, setImageViewerVisible] = useState(false);
  const [selectedImage, setSelectedImage] = useState(null);

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
    });

    const messageHandler = newMessage => {
      setMessages(prevMessages => [newMessage, ...prevMessages]);
    };

    onReceiveMessage(messageHandler);

    return () => {
      socket.off('receiveMessage', messageHandler);
      socket.disconnect();
    };
  }, []);

  if (loading) {
    return (
      <View
        style={{
          flex: 1,
          justifyContent: 'center',
          alignItems: 'center',
        }}>
        <ActivityIndicator size="large" color={Color.primaryGreen} />
      </View>
    );
  }

  const formatTime = isoString => {
    return moment(isoString).format('h.mm A');
  };

  const handleSend = () => {
    if (text?.trim() || selectedFile) {
      sendMessage(userId, otherUserId, text, selectedFile?.url);
      setText('');
      setSelectedFile(null);
    }
  };

  const uploadFile = async file => {
    if (abortController) {
      abortController.abort();
    }

    const controller = new AbortController();
    setAbortController(controller);

    setFileUploading(true);
    const formData = new FormData();
    formData?.append('file', {
      uri: file?.uri,
      name: file?.name,
      type: file?.type,
    });

    try {
      const response = await fetch(
        'https://nutrium-back-end-1.onrender.com/api/v1/upload',
        {
          method: 'POST',
          body: formData,
          headers: {
            'Content-Type': 'multipart/form-data',
          },
          signal: controller.signal,
        },
      );

      const data = await response.json();
      setSelectedFile(data);
      setFileUploading(false);
    } catch (error) {
      if (error.name === 'AbortError') {
        console.log('Upload was cancelled');
      } else {
        console.error('Upload Error:', error);
      }
      setFileUploading(false);
    } finally {
      setAbortController(null);
    }
  };

  const handleCancelUpload = () => {
    if (abortController) {
      abortController.abort();
    }
    setSelectedFile(null);
    setFileUploading(false);
    setAbortController(null);
  };

  const handleSendFile = async () => {
    try {
      const result = await DocumentPicker.pick({
        type: [DocumentPicker?.types?.allFiles],
      });

      if (result && result[0]) {
        setFileUploading(true);

        setSelectedFile({
          name: result[0]?.name,
          uri: result[0]?.uri,
          type: result[0]?.type,
        });

        await uploadFile(result[0]);
      }
    } catch (err) {
      setFileUploading(false);
      if (DocumentPicker.isCancel(err)) {
        console.error('User cancelled file picker');
      } else {
        console.error('DocumentPicker Error: ', err);
      }
    }
  };

  const openImageViewer = imageUri => {
    setSelectedImage(imageUri);
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

  const renderMessage = ({item}) => {
    const isSender = item?.senderId === userId;
    const fileUrl = item?.file || item?.fileUrl;
    const isImageFile =
      fileUrl &&
      (fileUrl?.toLowerCase()?.endsWith('.jpg') ||
        fileUrl?.toLowerCase()?.endsWith('.png') ||
        fileUrl?.toLowerCase()?.endsWith('.jpeg'));

    const time = formatTime(item?.createdAt || item?.timestamp);

    return (
      <View
        style={[
          styles.messageContainer,
          isSender ? styles.sent : styles.received,
        ]}>
        {fileUrl && isImageFile ? (
          <TouchableOpacity
            style={styles.imageContainer}
            onPress={() => openImageViewer(fileUrl)}>
            <Image source={{uri: fileUrl}} style={styles.image} />
          </TouchableOpacity>
        ) : fileUrl ? (
          <View style={styles.fileContainer}>
            <Text style={styles.fileText}>📎 {fileUrl.split('/').pop()}</Text>
          </View>
        ) : null}

        {item?.message && (
          <View style={styles.messageContent}>
            <Text style={styles.messageText}>{item?.message}</Text>
            <Text style={styles.timestampText}>{time}</Text>
          </View>
        )}

        {!item?.message && <Text style={styles.timestampText}>{time}</Text>}
      </View>
    );
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

  const renderItem = ({item}) => {
    if (item.type === 'date') {
      return (
        <View style={styles.dateSeparator}>
          <Text style={styles.dateSeparatorText}>
            {formatDateForSeparator(item?.date)}
          </Text>
        </View>
      );
    } else {
      return renderMessage({item});
    }
  };

  return (
    <View style={styles.container}>
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
          <Image
            style={{
              padding: 15,
              borderRadius: scaleSize(20),
              marginLeft: scaleSize(5),
            }}
            source={{uri: userImage}}
          />
          <Text style={styles.backTxt}>{userName}</Text>
        </View>

        <TouchableOpacity style={{marginHorizontal: scaleSize(16)}}>
          <Feather
            name="info"
            color={Color.primaryGreen}
            size={verticalScale(22)}
          />
        </TouchableOpacity>
      </View>

      <FlatList
        data={flatListData}
        keyExtractor={item =>
          item?.type === 'date' ? item?.id : item?._id?.toString()
        }
        renderItem={renderItem}
        inverted
      />

      {selectedFile && (
        <View style={styles.previewContainer}>
          {fileUploading ? (
            <View style={styles.uploadingContainer}>
              <ActivityIndicator size="small" color={Color.primaryGreen} />
              <Text style={styles.uploadingText}>Uploading file...</Text>
            </View>
          ) : (
            <View style={styles.uploadingContainer}>
              <MaterialIcons
                name="attachment"
                size={22}
                color={Color.primaryGreen}
              />
              <Text style={styles.uploadingText}>
                File uploading successful...
              </Text>
            </View>
          )}

          <TouchableOpacity
            style={styles.cancelButton}
            onPress={handleCancelUpload}>
            <Text style={styles.cancelText}>Cancel</Text>
          </TouchableOpacity>
        </View>
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
                ? Color.primaryGreen
                : Color.gray
            }
          />
        </TouchableOpacity>
      </View>

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
            delayLongPress={200}
            onPressOut={() => {}}
            onPressIn={() => {}}>
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
                onPress={e => {
                  e.stopPropagation();
                }}
                onLongPress={e => {
                  e.stopPropagation();
                  resetImageZoom();
                }}
                delayLongPress={200}
                onPressOut={() => {}}
                onPressIn={() => {}}>
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
    </View>
  );
};

export default MessageScreen;

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#f0f0f0',
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
    backgroundColor: Color.primary,
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
  },
  attachButton: {
    padding: scaleSize(5),
  },
  input: {
    flex: 1,
    fontSize: scaleSize(14),
  },
  sendButton: {
    padding: scaleSize(5),
  },
  backTxt: {
    fontSize: scaleSize(14),
    marginLeft: scaleSize(10),
    color: Color.black,
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
});
