import {createSlice} from '@reduxjs/toolkit';

const initialState = {
  appointmentInfo: {},
  clientInfo: {},
};

const adminSlice = createSlice({
  name: 'admin',
  initialState,
  reducers: {
    clientInfoData: (state, action) => {
      state.clientInfo = action.payload;
    },
    appointmentData: (state, action) => {
      state.appointmentInfo = action.payload;
    },
  },
});

export const {appointmentData, clientInfoData} = adminSlice.actions;

export default adminSlice.reducer;
