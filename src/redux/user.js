import {createSlice} from '@reduxjs/toolkit';

const initialState = {
  userInfo: {},
  profileInfo: {},
  fcmToken: {},
  token: {},
  guestToken: {},
  guestUserData: {},
  isCompleted: false,
};

const userSlice = createSlice({
  name: 'user',
  initialState,
  reducers: {
    loginData: (state, action) => {
      state.userInfo = action.payload;
    },
    setFcmToken: (state, action) => {
      state.fcmToken = action.payload;
    },
    setToken: (state, action) => {
      state.token = action.payload;
    },
    setGuestToken: (state, action) => {
      state.guestToken = action.payload;
    },
    guestLoginData: (state, action) => {
      state.guestUserData = action.payload;
    },
    completeOnboarding(state) {
      state.isCompleted = true;
    },
  },
});

export const {
  loginData,
  setFcmToken,
  setToken,
  setGuestToken,
  guestLoginData,
  completeOnboarding,
  resetOnboarding,
} = userSlice.actions;

export default userSlice.reducer;
