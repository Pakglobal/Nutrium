import io from 'socket.io-client';

const SOCKET_SERVER_URL = 'https://nutrium-back-end-1.onrender.com';

let socket;

export const getSocket = () => {
  return socket;
};

export const connectSocket = () => {
  if (!socket || !socket.connected) {
    if (socket && !socket.connected) {
      socket.disconnect();
    }

    socket = io(SOCKET_SERVER_URL, {
      transports: ['websocket'],
      forceNew: true,
      reconnectionAttempts: 10,
      timeout: 5000,
    });

    socket.on('connect', () => {
      console.log('✅ Socket connected:', socket.id);
    });

    socket.on('connect_error', error => {
      console.error('❌ Socket connection error:', error);
    });

    socket.on('disconnect', reason => {
      console.error('❌ Socket disconnected:', reason);
    });
  }
  return socket;
};

export const disconnectSocket = () => {
  if (socket) {
    socket.disconnect();
    socket = null;
  }
};

export const joinRoom = (userId, otherUserId) => {
  if (socket && socket.connected) {
    socket.emit('join', {userId, otherUserId});
  } else {
    console.error('Cannot join room: Socket not connected');
    const newSocket = connectSocket();
    if (newSocket.connected) {
      joinRoom(userId, otherUserId);
    } else {
      newSocket.on('connect', () => joinRoom(userId, otherUserId));
    }
  }
};

export const markMessagesAsSeen = (messageIds, senderId, receiverId) => {
  if (!messageIds || messageIds.length === 0) {
    console.warn('⚠️ No messages to mark as seen');
    return false;
  }

  if (!socket || !socket.connected) {
    console.error('❌ Cannot mark messages as seen: Socket not connected');
    return false;
  }

  console.log('📢 Marking messages as seen:', messageIds);
  socket.emit('messagesSeen', {messageIds, senderId, receiverId});
  return true;
};

export const onMessagesSeen = callback => {
  if (!socket || !socket.connected) {
    console.warn('⚠️ Cannot set messages seen listener: Socket not connected');
    return false;
  }

  socket.off('messagesSeen');
  socket.on('messagesSeen', data => {
    console.log('✅ Messages marked as seen:', data);
    callback(data);
  });

  return true;
};

export const onUnreadMessages = callback => {
  if (!socket || !socket.connected) {
    console.warn(
      '⚠️ Cannot set unread messages listener: Socket not connected',
    );
    return false;
  }

  socket.off('unreadMessages');
  socket.on('unreadMessages', data => {
    console.log('📩 Received unread messages:', data);
    callback(data);
  });

  return true;
};
export const sendMessage = async (
  senderId,
  receiverId,
  message,
  fileUri,
  tempId,
) => {
  const socket = getSocket();

  try {
    let fileUrl = fileUri || null;
    const messageData = {
      senderId,
      receiverId,
      message: message || '',
      file: fileUrl,
      tempId,
      seen: false,
    };
    console.log('messageDatamessageData', messageData);

    if (socket && socket.connected) {
      socket.emit('sendMessage', messageData);
      return messageData;
    } else {
      console.error('❌ Socket is not connected');
      throw new Error('Socket is not connected');
    }
  } catch (error) {
    console.error('❌ Error sending message:', error);
    throw error;
  }
};

export const getChatHistory = (userId, otherUserId, callback) => {
  if (!socket) {
    console.error('Cannot get chat history: Socket not initialized');
    return;
  }

  socket.off('chatHistory');

  socket.on('chatHistory', history => {
    callback(history);
  });

  socket.emit('getHistory', {userId, otherUserId});
};

export const onReceiveMessage = callback => {
  if (!socket) {
    console.error('Cannot set message listener: Socket not initialized');
    return;
  }

  socket.off('receiveMessage');

  socket.on('receiveMessage', message => {
    callback(message);
  });
};

export const leaveRoom = (userId, otherUserId) => {
  if (socket && socket.connected) {
    console.log(`📢 Leaving room: ${userId}-${otherUserId}`);
    socket.emit('leave', {userId, otherUserId});
    return true;
  } else {
    console.error('❌ Cannot leave room: Socket not connected');
    return false;
  }
};
