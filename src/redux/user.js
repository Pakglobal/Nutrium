import {createSlice} from '@reduxjs/toolkit';

const initialState = {
  userInfo: {},
  profileInfo: {},
  fcmToken: '',
  token: {},
  guestUserData: {},
  isGuest: false,
  guestMode: false,
};

const userSlice = createSlice({
  name: 'user',
  initialState,
  reducers: {
    loginData: (state, action) => {
      state.userInfo = action.payload;
    },
    profileData: (state, action) => {
      state.profileInfo = action.payload;
    },
    setFcmToken: (state, action) => {
      state.fcmToken = action.payload;
    },
    setToken: (state, action) => {
      state.token = action.payload;
    },
    setIsGuest: (state, action) => {
      state.isGuest = action.payload;
    },
    setGuestMode: (state, action) => {
      state.guestMode = action.payload;
    },
    guestLoginData: (state, action) => {
      state.guestUserData = action.payload;
    },
  },
});

export const {
  loginData,
  profileData,
  setFcmToken,
  setToken,
  setIsGuest,
  setGuestMode,
  guestLoginData,
} = userSlice.actions;

export default userSlice.reducer;
