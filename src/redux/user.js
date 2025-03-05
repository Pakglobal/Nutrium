import { createSlice } from '@reduxjs/toolkit';

const initialState = {
  userInfo: {},
  profileInfo: {},
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
    }
  },
});

export const { loginData, profileData } = userSlice.actions;

export default userSlice.reducer;
