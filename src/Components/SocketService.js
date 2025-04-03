// socket-service.js
import io from 'socket.io-client';

const SOCKET_SERVER_URL = 'https://nutrium-back-end-1.onrender.com';

let socket;
let socketInitialized = false;

export const getSocket = () => {
  return socket;
};

export const connectSocket = () => {
  if (!socket || !socket.connected) {
    socket = io(SOCKET_SERVER_URL, {
      transports: ['websocket'],
      forceNew: true,
      reconnectionAttempts: 10,
      timeout: 5000,
    });

    socket.on('connect', () => {
      console.log('✅ Socket connected:', socket.id);
      socketInitialized = true;
    });

    socket.on('connect_error', error => {
      console.error('❌ Socket connection error:', error);
      socketInitialized = false;
    });

    socket.on('disconnect', reason => {
      console.error('❌ Socket disconnected:', reason);
      socketInitialized = false;
    });
  }
  return socket;
};

export const disconnectSocket = () => {
  if (socket) {
    socket.disconnect();
    socket = null;
    socketInitialized = false;
  }
};

export const joinRoom = (userId, otherUserId) => {
  if (socket && socket.connected) {
    console.log(`📢 Joining room: ${userId}-${otherUserId}`);
    socket.emit('join', {userId, otherUserId});
    return true;
  } else {
    console.error('Cannot join room: Socket not connected');
    return false;
  }
};

export const getChatHistory = (userId, otherUserId, callback) => {
  if (!socket || !socket.connected) {
    console.error('Cannot get chat history: Socket not connected');
    return false;
  }

  // Remove any existing listener to prevent duplicates
  socket.off('chatHistory');

  socket.on('chatHistory', history => {
    callback(history);
  });

  socket.emit('getHistory', {userId, otherUserId});
  return true;
};

export const sendMessage = async (
  senderId,
  receiverId,
  message,
  fileUri,
  seen = false,
) => {
  try {
    if (!socketInitialized) {
      connectSocket();
    }
    
    const socket = getSocket();
    let fileUrl = fileUri || null;

    const messageData = {
      senderId,
      receiverId,
      message: message || '',
      file: fileUrl,
      seen: seen,
    };

    if (socket && socket.connected) {
      socket.emit('sendMessage', messageData);
      return true;
    } else {
      console.error('❌ Socket is not connected');
      throw new Error('Socket is not connected');
    }
  } catch (error) {
    console.error('❌ Error sending message:', error);
    throw error;
  }
};

export const markMessagesAsSeen = (messageIds, senderId, receiverId) => {
  if (!messageIds || messageIds.length === 0) {
    console.log('No messages to mark as seen');
    return false;
  }
  
  if (socket && socket.connected) {
    console.log('📢 Marking messages as seen:', messageIds);
    socket.emit('messagesSeen', {messageIds, senderId, receiverId});
    return true;
  } else {
    console.error('⚠️ Unable to mark messages as seen, socket not connected');
    return false;
  }
};

export const onMessagesSeen = callback => {
  if (!socket) {
    console.error('Cannot set messages seen listener: Socket not initialized');
    return false;
  }

  socket.off('messagesSeen');

  socket.on('messagesSeen', data => {
    console.log('✅ Messages marked as seen:', data);
    callback(data);
  });
  
  return true;
};

export const onReceiveMessage = callback => {
  if (!socket) {
    console.error('Cannot set message listener: Socket not initialized');
    return false;
  }

  socket.off('receiveMessage');

  socket.on('receiveMessage', message => {
    callback(message);
  });
  
  return true;
};

export const leaveRoom = (userId, otherUserId) => {
  if (socket && socket.connected) {
    console.log(`📢 Leaving room: ${userId}-${otherUserId}`);
    socket.emit('leave', {userId, otherUserId});
    return true;
  } else {
    console.error('Cannot leave room: Socket not connected');
    return false;
  }
};

// Add a new listener for unread messages
export const onUnreadMessages = callback => {
  if (!socket) {
    console.error('Cannot set unread messages listener: Socket not initialized');
    return false;
  }

  socket.off('unreadMessages');

  socket.on('unreadMessages', data => {
    console.log('✅ Received unread messages:', data);
    callback(data);
  });
  
  return true;
};