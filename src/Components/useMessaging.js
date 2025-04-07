// import React, { useEffect, useState, useRef, useCallback } from 'react';
// import {
//   View,
//   Text,
//   FlatList,
//   TextInput,
//   TouchableOpacity,
//   StyleSheet,
//   Image,
//   ActivityIndicator,
//   Modal,
//   Animated,
//   PanResponder,
//   SafeAreaView,
//   ImageBackground,
// } from 'react-native';
// import DocumentPicker from 'react-native-document-picker';
// import {
//   connectSocket,
//   joinRoom,
//   getChatHistory,
//   onReceiveMessage,
//   sendMessage,
//   disconnectSocket,
//   markMessagesAsSeen,
//   onMessagesSeen,
//   leaveRoom,
//   onUnreadMessages,
// } from '../Components/SocketService';
// import { useFocusEffect, useNavigation } from '@react-navigation/native';
// import AntDesign from 'react-native-vector-icons/AntDesign';
// import Ionicons from 'react-native-vector-icons/Ionicons';
// import Feather from 'react-native-vector-icons/Feather';
// import { scale as scaleSize, verticalScale } from 'react-native-size-matters';
// import moment from 'moment';
// import Color from '../assets/colors/Colors';

// const MessageComponent = ({
//   userId,
//   otherUserId,
//   userName,
//   image,
//   showHeader = true,
//   containerStyle,
//   gender,
// }) => {
//   const navigation = useNavigation();
//   const userImage = image
//     ? { uri: image }
//     : gender === 'Female'
//       ? require('../assets/Images/woman.png')
//       : require('../assets/Images/man.png');
//   const [messages, setMessages] = useState([]);
//   const [text, setText] = useState('');
//   const [selectedFile, setSelectedFile] = useState(null);
//   const [loading, setLoading] = useState(false);
//   const [fileUploading, setFileUploading] = useState(false);
//   const [imageViewerVisible, setImageViewerVisible] = useState(false);
//   const [selectedImage, setSelectedImage] = useState(null);
//   const [uploadingFiles, setUploadingFiles] = useState({});
//   const scale = useRef(new Animated.Value(1)).current;
//   const lastScale = useRef(1);
//   const offsetX = useRef(new Animated.Value(0)).current;
//   const offsetY = useRef(new Animated.Value(0)).current;
//   const lastX = useRef(0);
//   const lastY = useRef(0);
//   const socketRef = useRef(null);
//   const socketConnectedRef = useRef(false);
//   const roomJoinedRef = useRef(false);
//   const listenersRegisteredRef = useRef(false);
//   const pendingSeenMessagesRef = useRef(new Set()); // Use Set for unique IDs
//   const processedEventsRef = useRef(new Set()); // Track processed event IDs

//   const sortedMessages = [...messages]?.sort(
//     (a, b) => new Date(b?.createdAt) - new Date(a?.createdAt),
//   );

//   const panResponder = useRef(
//     PanResponder.create({
//       onStartShouldSetPanResponder: () => true,
//       onMoveShouldSetPanResponder: () => true,
//       onPanResponderGrant: () => {
//         lastX.current = offsetX._value;
//         lastY.current = offsetY._value;
//       },
//       onPanResponderMove: (event, gestureState) => {
//         if (event.nativeEvent.changedTouches.length === 2) {
//           const touch1 = event.nativeEvent.changedTouches[0];
//           const touch2 = event.nativeEvent.changedTouches[1];
//           const distance = Math.sqrt(
//             Math.pow(touch2.pageX - touch1.pageX, 2) +
//             Math.pow(touch2.pageY - touch1.pageY, 2),
//           );
//           const newScale = Math.max(1, Math.min(5, distance / 100));
//           scale.setValue(newScale);
//         } else if (lastScale.current > 1) {
//           offsetX.setValue(lastX.current + gestureState.dx);
//           offsetY.setValue(lastY.current + gestureState.dy);
//         }
//       },
//       onPanResponderRelease: () => {
//         lastScale.current = scale._value;
//         if (scale._value <= 1) {
//           Animated.parallel([
//             Animated.spring(scale, { toValue: 1, useNativeDriver: true }),
//             Animated.spring(offsetX, { toValue: 0, useNativeDriver: true }),
//             Animated.spring(offsetY, { toValue: 0, useNativeDriver: true }),
//           ]).start();
//           lastScale.current = 1;
//           lastX.current = 0;
//           lastY.current = 0;
//         }
//       },
//     }),
//   ).current;

//   const handleNewMessage = useCallback(
//     (newMessage) => {
//       const eventId = newMessage._id || `${newMessage.senderId}-${newMessage.createdAt}`;
//       if (processedEventsRef.current.has(eventId)) {
//         console.log('Skipping duplicate event:', eventId);
//         return;
//       }
//       processedEventsRef.current.add(eventId);

//       console.log('Received new message:', newMessage);
//       setMessages((prevMessages) => {
//         console.log('Current messages:', prevMessages);

//         // Check if this is a replacement for a temporary message using correlationId
//         const tempMessageIndex = newMessage.correlationId
//           ? prevMessages.findIndex(
//             (msg) => msg.isTemp && msg.correlationId === newMessage.correlationId,
//           )
//           : -1;

//         if (tempMessageIndex !== -1) {
//           console.log('Replacing temp message at index:', tempMessageIndex);
//           const updatedMessages = [...prevMessages];
//           updatedMessages[tempMessageIndex] = { ...newMessage, seen: newMessage.seen || false };
//           return updatedMessages;
//         }

//         // Otherwise, add as a new message
//         const messageExists = prevMessages.some((msg) => msg._id === newMessage._id);
//         if (messageExists) {
//           console.log('Message already exists, skipping:', newMessage._id);
//           return prevMessages;
//         }
//         console.log('Adding new message:', newMessage);
//         const updatedMessages = [newMessage, ...prevMessages];
//         if (newMessage.senderId === otherUserId && !newMessage.seen) {
//           pendingSeenMessagesRef.current.add(newMessage._id);
//         }
//         return updatedMessages;
//       });
//     },
//     [otherUserId],
//   );


//   // Handle messages marked as seen
//   const handleMessagesSeen = useCallback(
//     ({ messageIds }) => {
//       const eventId = `seen-${messageIds.join('-')}`;
//       if (processedEventsRef.current.has(eventId)) return; // Skip if already processed
//       processedEventsRef.current.add(eventId);

//       console.log('Messages seen update:', messageIds);
//       if (messageIds?.length) {
//         setMessages((prevMessages) =>
//           prevMessages.map((msg) =>
//             messageIds.includes(msg?._id) ? { ...msg, seen: true } : msg,
//           ),
//         );
//         // Clear pending seen messages that were marked
//         messageIds.forEach((id) => pendingSeenMessagesRef.current.delete(id));
//       }
//     },
//     [],
//   );



//   // Handle unread messages
//   const handleUnreadMessages = useCallback(
//     ({ messages: unreadMessages }) => {
//       const eventId = `unread-${unreadMessages.map((m) => m._id).join('-')}`;
//       if (processedEventsRef.current.has(eventId)) return; // Skip if already processed
//       processedEventsRef.current.add(eventId);

//       console.log('Unread messages:', unreadMessages);
//       if (unreadMessages?.length) {
//         setMessages((prevMessages) => {
//           const existingIds = new Set(prevMessages.map((msg) => msg._id));
//           const newUnreadMessages = unreadMessages.filter(
//             (msg) => !existingIds.has(msg._id),
//           );
//           if (newUnreadMessages.length === 0) return prevMessages;
//           const updatedMessages = [...newUnreadMessages.reverse(), ...prevMessages];
//           newUnreadMessages
//             .filter((msg) => msg.senderId === otherUserId && !msg.seen)
//             .forEach((msg) => pendingSeenMessagesRef.current.add(msg._id));
//           return updatedMessages;
//         });
//       }
//     },
//     [otherUserId],
//   );

//   // Initialize WebSocket connection and listeners
//   const initializeChat = useCallback(() => {
//     if (socketConnectedRef.current) return;

//     const socket = connectSocket();
//     socketRef.current = socket;

//     if (socket) {
//       socketConnectedRef.current = true;
//       setLoading(true);

//       const joinSuccess = joinRoom(userId, otherUserId);
//       if (joinSuccess) {
//         roomJoinedRef.current = true;
//       }

//       getChatHistory(userId, otherUserId, (history) => {
//         if (history) {
//           setMessages(history?.reverse() || []);
//           const unreadMessages = history
//             .filter((msg) => msg.senderId === otherUserId && !msg.seen)
//             .map((msg) => msg._id);
//           unreadMessages.forEach((id) => pendingSeenMessagesRef.current.add(id));
//         }
//         setLoading(false);
//       });

//       if (!listenersRegisteredRef.current) {
//         socket.off('receiveMessage');
//         socket.off('messagesSeen');
//         socket.off('unreadMessages');
//         onReceiveMessage(handleNewMessage);
//         onMessagesSeen(handleMessagesSeen);
//         onUnreadMessages(handleUnreadMessages);
//         listenersRegisteredRef.current = true;
//       }
//     }
//   }, [userId, otherUserId, handleNewMessage, handleMessagesSeen, handleUnreadMessages]);

//   // Cleanup WebSocket connection and listeners
//   const cleanupChat = useCallback(() => {
//     if (roomJoinedRef.current) {
//       leaveRoom(userId, otherUserId);
//       roomJoinedRef.current = false;
//     }
//     if (socketConnectedRef.current && socketRef.current) {
//       socketRef.current.off('receiveMessage', handleNewMessage);
//       socketRef.current.off('messagesSeen', handleMessagesSeen);
//       socketRef.current.off('unreadMessages', handleUnreadMessages);
//       disconnectSocket();
//       socketConnectedRef.current = false;
//       listenersRegisteredRef.current = false;
//     }
//     pendingSeenMessagesRef.current.clear();
//     processedEventsRef.current.clear();
//   }, [userId, otherUserId, handleNewMessage, handleMessagesSeen, handleUnreadMessages]);

//   // Use useFocusEffect to handle screen focus
//   useFocusEffect(
//     useCallback(() => {
//       initializeChat();
//       return () => {
//         cleanupChat();
//       };
//     }, [initializeChat, cleanupChat]),
//   );

//   // Debounced function to mark messages as seen
//   const markVisibleMessagesAsSeen = useCallback(() => {
//     if (pendingSeenMessagesRef.current.size > 0) {
//       const messageIdsToMark = Array.from(pendingSeenMessagesRef.current);
//       pendingSeenMessagesRef.current.clear(); // Clear pending messages
//       markMessagesAsSeen(messageIdsToMark, otherUserId, userId);
//     }
//   }, [otherUserId, userId]);

//   // Run markVisibleMessagesAsSeen only once on mount or when explicitly needed
//   useEffect(() => {
//     const timeout = setTimeout(() => {
//       markVisibleMessagesAsSeen();
//     }, 1000); // Increased delay to batch updates
//     return () => clearTimeout(timeout);
//   }, [markVisibleMessagesAsSeen]); // Dependency only on the function

//   const formatTime = (isoString) => {
//     return moment(isoString).format('h:mm A');
//   };

//   const handleSend = () => {
//     if (text?.trim() || selectedFile) {
//       const tempMessageId = `temp-${Date.now()}`;
//       const tempMessage = {
//         _id: tempMessageId,
//         senderId: userId,
//         receiverId: otherUserId,
//         message: text,
//         file: selectedFile?.url,
//         createdAt: new Date().toISOString(),
//         seen: false,
//         isTemp: true, // Already present, good!
//       };
//       setMessages((prevMessages) => [tempMessage, ...prevMessages]);

//       // sendMessage(userId, otherUserId, text, selectedFile?.url);
//       // sendMessage(userId, otherUserId, text, selectedFile?.url, (sentMessage) => {
//       //   setMessages((prevMessages) =>
//       //     prevMessages.map((msg) =>
//       //       msg._id === tempMessageId ? { ...sentMessage, seen: false } : msg,
//       //     ),
//       //   );
//       // });
//       setText('');
//       setSelectedFile(null);
//     }
//   };




//   const closeImageViewer = () => {
//     setImageViewerVisible(false);
//     setSelectedImage(null);
//   };

//   const resetImageZoom = () => {
//     Animated.parallel([
//       Animated.spring(scale, { toValue: 1, useNativeDriver: true }),
//       Animated.spring(offsetX, { toValue: 0, useNativeDriver: true }),
//       Animated.spring(offsetY, { toValue: 0, useNativeDriver: true }),
//     ]).start();
//     lastScale.current = 1;
//     lastX.current = 0;
//     lastY.current = 0;
//   };

//   const groupMessagesByDate = (messages) => {
//     const groups = {};
//     messages?.forEach((message) => {
//       const date = moment(message?.createdAt)?.format('YYYY-MM-DD');
//       if (!groups[date]) {
//         groups[date] = [];
//       }
//       groups[date]?.push(message);
//     });
//     return groups;
//   };

//   const createFlatListData = (messages) => {
//     if (!messages?.length) return [];

//     const groupedMessages = groupMessagesByDate(messages);
//     const flatListData = [];

//     Object.keys(groupedMessages)
//       .sort((a, b) => new Date(b) - new Date(a))
//       .forEach((date) => {
//         const messagesForDate = groupedMessages[date].sort(
//           (a, b) => new Date(b?.createdAt) - new Date(a?.createdAt),
//         );
//         messagesForDate.forEach((message) => {
//           flatListData.push({ ...message, type: 'message' });
//         });
//         flatListData.push({ id: `date-${date}`, type: 'date', date });
//       });

//     return flatListData;
//   };

//   const formatDateForSeparator = (dateString) => {
//     const messageDate = moment(dateString);
//     const today = moment().startOf('day');
//     const yesterday = moment().subtract(1, 'day').startOf('day');

//     if (messageDate?.isSame(today, 'day')) {
//       return 'Today';
//     } else if (messageDate?.isSame(yesterday, 'day')) {
//       return 'Yesterday';
//     } else if (messageDate?.isAfter(today.clone().subtract(7, 'days'))) {
//       return messageDate?.format('dddd');
//     } else {
//       return messageDate?.format('MMM D');
//     }
//   };

//   const flatListData = createFlatListData(sortedMessages);

//   const renderItem = ({ item }) => {
//     if (item.type === 'date') {
//       return (
//         <View style={styles.dateSeparator}>
//           <Text style={styles.dateSeparatorText}>
//             {formatDateForSeparator(item?.date)}
//           </Text>
//         </View>
//       );
//     } else {
//       return renderMessage({ item });
//     }
//   };

//   const openImageViewer = (fileUrl) => {
//     setSelectedImage(fileUrl);
//     setImageViewerVisible(true);
//     scale.setValue(1);
//     offsetX.setValue(0);
//     offsetY.setValue(0);
//     lastScale.current = 1;
//     lastX.current = 0;
//     lastY.current = 0;
//   };

//   const handleSendFile = async () => {
//     try {
//       const result = await DocumentPicker.pick({
//         type: [DocumentPicker.types.allFiles],
//       });

//       if (result && result[0]) {
//         const fileId = `temp-${Date.now()}`;
//         setUploadingFiles((prev) => ({ ...prev, [fileId]: true }));
//         setFileUploading(true);

//         const tempMessage = {
//           _id: fileId,
//           senderId: userId,
//           receiverId: otherUserId,
//           file: result[0].uri,
//           createdAt: new Date().toISOString(),
//           isTemp: true,
//         };

//         setMessages((prevMessages) => [tempMessage, ...prevMessages]);

//         try {
//           const uploadedFile = await uploadFileAndGetUrl(result[0]);
//           sendMessage(userId, otherUserId, '', uploadedFile.url, (sentMessage) => {
//             setMessages((prevMessages) =>
//               prevMessages.map((msg) =>
//                 msg._id === fileId ? { ...sentMessage, seen: false } : msg,
//               ),
//             );
//           });
//         } catch (error) {
//           console.error('Upload failed:', error);
//         } finally {
//           setUploadingFiles((prev) => {
//             const newState = { ...prev };
//             delete newState[fileId];
//             return newState;
//           });
//           setFileUploading(false);
//         }
//       }
//     } catch (err) {
//       if (DocumentPicker.isCancel(err)) {
//         console.error('User cancelled file picker');
//       } else {
//         console.error('DocumentPicker Error: ', err);
//       }
//     }
//   };

//   const uploadFileAndGetUrl = async (file) => {
//     const formData = new FormData();
//     formData.append('file', {
//       uri: file?.uri,
//       name: file?.name,
//       type: file?.type,
//     });

//     const response = await fetch(
//       'https://nutrium-back-end-1.onrender.com/api/v1/upload',
//       {
//         method: 'POST',
//         body: formData,
//         headers: { 'Content-Type': 'multipart/form-data' },
//       },
//     );

//     if (!response.ok) {
//       throw new Error('Upload failed');
//     }

//     return await response.json();
//   };

const renderMessage = ({ item }) => {
  const isSender = item?.senderId === userId;
  const fileUrl = item?.file || item?.fileUrl;
  const time = formatTime(item?.createdAt || item?.timestamp);
  const isUploading = item.isTemp || uploadingFiles[item._id];
  const isSeen = item?.seen;

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
              <ActivityIndicator size="large" color={Color.primaryGreen} />
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
                      color={isSeen ? Color.primaryGreen : Color.gray}
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
              {isSender && (
                <Ionicons
                  name={isSeen ? 'checkmark-done' : 'checkmark'}
                  size={16}
                  color={isSeen ? Color.primaryGreen : Color.gray}
                />
              )}
            </View>
          </View>
        </View>
      )}
    </View>
  );
};

//   const renderHeader = () => {
//     if (!showHeader) return null;

//     return (
//       <View
//         style={{
//           paddingVertical: verticalScale(12),
//           backgroundColor: Color.common,
//           flexDirection: 'row',
//           justifyContent: 'space-between',
//           alignItems: 'center',
//         }}>
//         <View
//           style={{
//             flexDirection: 'row',
//             alignItems: 'center',
//             marginHorizontal: scaleSize(16),
//           }}>
//           <TouchableOpacity onPress={() => navigation.goBack()}>
//             <AntDesign
//               name="arrowleft"
//               color={Color.black}
//               size={verticalScale(18)}
//             />
//           </TouchableOpacity>
//           <Image style={styles.profileImage} source={userImage} />
//           <Text style={styles.backTxt}>{userName}</Text>
//         </View>
//         <TouchableOpacity style={{ marginHorizontal: scaleSize(16) }}>
//           <Feather
//             name="info"
//             color={Color.primaryGreen}
//             size={verticalScale(22)}
//           />
//         </TouchableOpacity>
//       </View>
//     );
//   };

//   return (
//     <SafeAreaView style={[styles.container, containerStyle]}>
//       {renderHeader()}
//       <ImageBackground
//         style={{ flex: 1 }}
//         source={require('../assets/Images/chatBackground.jpg')}>
//         {loading ? (
//           <View
//             style={{
//               flex: 1,
//               justifyContent: 'center',
//               alignItems: 'center',
//             }}>
//             <ActivityIndicator size="large" color={Color.primaryGreen} />
//           </View>
//         ) : (
//           <FlatList
//             data={flatListData}
//             keyExtractor={(item) =>
//               item?.type === 'date' ? item?.id : item?._id?.toString()
//             }
//             renderItem={renderItem}
//             inverted
//           />
//         )}
//         <View style={styles.inputContainer}>
//           <TouchableOpacity
//             style={styles.attachButton}
//             onPress={handleSendFile}
//             disabled={fileUploading}>
//             <Ionicons
//               name="attach"
//               size={24}
//               color={fileUploading ? Color.lightGray : Color.gray}
//             />
//           </TouchableOpacity>
//           <TextInput
//             style={styles.input}
//             value={text}
//             onChangeText={setText}
//             placeholder="Type a message..."
//             multiline
//             placeholderTextColor={Color.black}
//           />
//           <TouchableOpacity
//             style={styles.sendButton}
//             onPress={handleSend}
//             disabled={(!text.trim() && !selectedFile) || fileUploading}>
//             <Ionicons
//               name="send"
//               size={20}
//               color={
//                 text.trim() || (selectedFile && !fileUploading)
//                   ? Color.primaryGreen
//                   : Color.gray
//               }
//             />
//           </TouchableOpacity>
//         </View>
//       </ImageBackground>
//       <Modal
//         visible={imageViewerVisible}
//         transparent={true}
//         animationType="fade"
//         onRequestClose={closeImageViewer}>
//         <View style={styles.modalContainer}>
//           <View style={styles.modalHeader}>
//             <TouchableOpacity
//               style={styles.closeButton}
//               onPress={closeImageViewer}>
//               <AntDesign name="close" size={24} color="#fff" />
//             </TouchableOpacity>
//           </View>
//           <TouchableOpacity
//             activeOpacity={1}
//             style={styles.imageViewerContainer}
//             onPress={closeImageViewer}
//             onLongPress={resetImageZoom}
//             delayLongPress={200}>
//             <Animated.View
//               {...panResponder.panHandlers}
//               style={[
//                 styles.imageViewerWrapper,
//                 {
//                   transform: [
//                     { scale: scale },
//                     { translateX: offsetX },
//                     { translateY: offsetY },
//                   ],
//                 },
//               ]}>
//               <TouchableOpacity
//                 activeOpacity={1}
//                 onPress={(e) => e.stopPropagation()}
//                 onLongPress={(e) => {
//                   e.stopPropagation();
//                   resetImageZoom();
//                 }}
//                 delayLongPress={200}>
//                 <Animated.Image
//                   source={{ uri: selectedImage }}
//                   style={styles.fullScreenImage}
//                   resizeMode="contain"
//                 />
//               </TouchableOpacity>
//             </Animated.View>
//           </TouchableOpacity>
//         </View>
//       </Modal>
//     </SafeAreaView>
//   );
// };

// export default MessageComponent;

// const styles = StyleSheet.create({
//   container: {
//     flex: 1,
//     backgroundColor: '#f0f0f0',
//   },
//   loadingImageContainer: {
//     width: scaleSize(200),
//     height: scaleSize(200),
//     justifyContent: 'center',
//     alignItems: 'center',
//     backgroundColor: 'rgba(0,0,0,0.05)',
//     borderRadius: scaleSize(8),
//     overflow: 'hidden',
//   },
//   messageContainer: {
//     paddingVertical: verticalScale(5),
//     paddingHorizontal: scaleSize(5),
//     marginVertical: scaleSize(2),
//     marginHorizontal: scaleSize(10),
//     borderRadius: scaleSize(8),
//     maxWidth: '75%',
//   },
//   sent: {
//     backgroundColor: Color.lightGreen,
//     alignSelf: 'flex-end',
//     borderBottomRightRadius: 0,
//   },
//   received: {
//     backgroundColor: Color.white,
//     alignSelf: 'flex-start',
//     borderBottomLeftRadius: 0,
//   },
//   imageContainer: {
//     backgroundColor: 'rgba(255,255,255,0.1)',
//     borderRadius: scaleSize(8),
//     padding: scaleSize(5),
//   },
//   image: {
//     width: scaleSize(200),
//     height: scaleSize(200),
//     borderRadius: scaleSize(8),
//   },
//   messageContent: {
//     flexDirection: 'row',
//     justifyContent: 'flex-end',
//   },
//   messageText: {
//     color: Color.black,
//     fontSize: scaleSize(14),
//     paddingVertical: verticalScale(5),
//     paddingHorizontal: scaleSize(5),
//     marginRight: 10,
//   },
//   timestampText: {
//     color: Color.gray,
//     fontSize: scaleSize(10),
//   },
//   messageFooter: {
//     marginLeft: scaleSize(5),
//   },
//   inputContainer: {
//     flexDirection: 'row',
//     alignItems: 'center',
//     backgroundColor: '#fff',
//     borderRadius: scaleSize(25),
//     paddingHorizontal: scaleSize(10),
//     marginHorizontal: scaleSize(10),
//     marginBottom: verticalScale(8),
//     marginTop: verticalScale(3),
//   },
//   attachButton: {
//     padding: scaleSize(5),
//   },
//   input: {
//     flex: 1,
//     fontSize: scaleSize(14),
//     color: Color.black,
//   },
//   sendButton: {
//     padding: scaleSize(5),
//   },
//   backTxt: {
//     fontSize: scaleSize(14),
//     color: Color.black,
//     marginLeft: scaleSize(5),
//   },
//   modalContainer: {
//     flex: 1,
//     backgroundColor: 'rgba(0, 0, 0, 0.9)',
//     justifyContent: 'center',
//   },
//   modalHeader: {
//     position: 'absolute',
//     top: 0,
//     left: 0,
//     right: 0,
//     height: 60,
//     flexDirection: 'row',
//     justifyContent: 'flex-end',
//     alignItems: 'center',
//     zIndex: 10,
//     paddingHorizontal: 15,
//   },
//   closeButton: {
//     padding: 10,
//   },
//   imageViewerContainer: {
//     flex: 1,
//     justifyContent: 'center',
//     alignItems: 'center',
//   },
//   imageViewerWrapper: {
//     justifyContent: 'center',
//     alignItems: 'center',
//   },
//   fullScreenImage: {
//     width: scaleSize(300),
//     height: verticalScale(300),
//   },
//   dateSeparator: {
//     alignItems: 'center',
//     marginVertical: verticalScale(5),
//     paddingVertical: verticalScale(5),
//   },
//   dateSeparatorText: {
//     color: '#000',
//     backgroundColor: Color.common,
//     fontSize: scaleSize(13),
//     paddingHorizontal: scaleSize(15),
//     paddingVertical: verticalScale(8),
//     borderRadius: scaleSize(10),
//   },
//   profileImage: {
//     width: scaleSize(35),
//     height: scaleSize(35),
//     borderRadius: scaleSize(20),
//     backgroundColor: Color.white,
//     marginHorizontal: scaleSize(7),
//   },
// });





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
} from 'react-native';
import DocumentPicker from 'react-native-document-picker';
import {
  connectSocket,
  joinRoom,
  getChatHistory,
  onReceiveMessage,
  sendMessage,
} from '../Components/SocketService';

import { useNavigation } from '@react-navigation/native';
import AntDesign from 'react-native-vector-icons/AntDesign';
import Ionicons from 'react-native-vector-icons/Ionicons';
import MaterialIcons from 'react-native-vector-icons/MaterialIcons';
import Feather from 'react-native-vector-icons/Feather';
import { scale as scaleSize, verticalScale } from 'react-native-size-matters';
import moment from 'moment';
import Color from '../assets/colors/Colors';
import uuid from 'react-native-uuid';

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
    });
    const messageHandler = (newMessage) => {
      setMessagesByClient((prev) => {
        const clientMsgs = prev[newMessage.receiverId] || [];
        const existingIndex = clientMsgs.findIndex(
          (msg) => msg.tempId && msg.tempId === newMessage.tempId
        );
        if (existingIndex !== -1) {
          const updatedMsgs = [...clientMsgs];
          updatedMsgs[existingIndex] = { ...newMessage };
          return {
            ...prev,
            [newMessage.receiverId]: updatedMsgs,
          };
        }
        const alreadyExists = clientMsgs.some(
          (msg) => msg._id && msg._id === newMessage._id
        );
        if (alreadyExists) {
          return prev;
        }
        return {
          ...prev,
          [newMessage.receiverId]: [...clientMsgs, newMessage],
        };
      });
    };
    onReceiveMessage(messageHandler);

    const markMessagesAsSeen = () => {

      
      if (messages[0]?.senderId == userId) return null;
      const unseenMessages = messages.filter(msg => !msg?.seen);
      console.log("sabkjb");
      
      if (unseenMessages.length > 0) {
        const messageIds = unseenMessages.map(msg => msg?._id);
        console.log(messageIds, 'id');
        socket.emit('messageSeen', { userId, otherUserId, messageIds });
        setMessages(prevMessages =>
          prevMessages.map(msg =>
            messageIds.includes(msg.id) ? { ...msg, seen: true } : msg
          )
        );
      }
    };

    markMessagesAsSeen();


    return () => {
      socket.off('receiveMessage', messageHandler);
      socket.disconnect();
    };
  }, [userId, otherUserId]);

  const formatTime = isoString => {
    return moment(isoString).format('h.mm A');
  };

  const handleSend = () => {
    if (text?.trim() || selectedFile) {
      const tempId = uuid.v4();
      const tempMessage = {
        tempId: tempId,
        senderId: userId,
        receiverId: otherUserId,
        message: text,
        file: selectedFile?.url,
        seen: false,
      };
      setMessages((prevMessages) => [tempMessage, ...prevMessages]);

      sendMessage(userId, otherUserId, text, selectedFile?.url, tempId);
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
      'https://nutrium-back-end-1.onrender.com/api/v1/upload',
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
                <ActivityIndicator size="large" color={Color.primaryGreen} />
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
                        color={isSeen ? Color.primaryGreen : Color.gray}
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
                {isSender && (
                  <Ionicons
                    name={isSeen ? 'checkmark-done' : 'checkmark'}
                    size={16}
                    color={isSeen ? Color.primaryGreen : Color.gray}
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
            color={Color.primaryGreen}
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
          <View
            style={{
              flex: 1,
              justifyContent: 'center',
              alignItems: 'center',
            }}>
            <ActivityIndicator size="large" color={Color.primaryGreen} />
          </View>
        ) : (
          <FlatList
            data={flatListData}
            keyExtractor={item =>
              item?.type === 'date' ? item?.id : item?._id?.toString()
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
                  ? Color.primaryGreen
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
    backgroundColor: Color.white,
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

