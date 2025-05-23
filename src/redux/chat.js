import {createSlice} from '@reduxjs/toolkit';

const chatSlice = createSlice({
  name: 'chat',
  initialState: {
    messages: {},
  },
  reducers: {
    setMessages: (state, action) => {
      const {userId, otherUserId, messages} = action.payload;
      const key = `${userId}_${otherUserId}`;
      state.messages[key] = messages;
    },
    addMessage: (state, action) => {
      const {userId, otherUserId, message} = action.payload;
      const key = `${userId}_${otherUserId}`;
      if (!state.messages[key]) {
        state.messages[key] = [];
      }
      state.messages[key] = [message, ...state.messages[key]];
    },
    updateMessage: (state, action) => {
      const {userId, otherUserId, message} = action.payload;
      const key = `${userId}_${otherUserId}`;
      if (state.messages[key]) {
        state.messages[key] = state.messages[key].map(msg =>
          (msg._id && msg._id === message._id) ||
          (msg.tempId && msg.tempId === message.tempId)
            ? {
                ...message,
                tempId: msg.tempId || message.tempId,
                seen: msg.seen,
                isEdited: message.isEdited,
              }
            : msg,
        );
      }
    },
    markMessagesSeen: (state, action) => {
      const {userId, otherUserId, messageIds} = action.payload;
      const key = `${userId}_${otherUserId}`;
      if (state.messages[key]) {
        state.messages[key] = state.messages[key].map(msg =>
          messageIds.includes(msg._id) ? {...msg, seen: true} : msg,
        );
      }
    },
    deleteMessage: (state, action) => {
      const {userId, otherUserId, messageId} = action.payload;
      const key = `${userId}_${otherUserId}`;
      if (state.messages[key]) {
        state.messages[key] = state.messages[key].filter(
          msg => msg._id !== messageId,
        );
      }
    },
    clearMessages: (state, action) => {
      const {userId, otherUserId} = action.payload;
      const key = `${userId}_${otherUserId}`;
      state.messages[key] = [];
    },
  },
});

export const {
  setMessages,
  addMessage,
  updateMessage,
  markMessagesSeen,
  deleteMessage,
  clearMessages,
} = chatSlice.actions;
export default chatSlice.reducer;
