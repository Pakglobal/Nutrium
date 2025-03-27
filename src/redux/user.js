import {createSlice} from '@reduxjs/toolkit';

const initialState = {
  userInfo: {},
  profileInfo: {},
  fcmToken: {},
  token: {},
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
    }
  },
});

export const {loginData, profileData, setFcmToken, setToken} = userSlice.actions;

export default userSlice.reducer;
