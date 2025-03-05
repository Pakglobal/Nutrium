import {createSlice} from '@reduxjs/toolkit';

const initialState = {
  appointmentInfo: {},
  clientInfo: {},
};

const adminSlice = createSlice({
  name: 'admin',
  initialState,
  reducers: {
    clientData: (state, action) => {
      state.clientInfo = action.payload;
    },
    appointmentData: (state, action) => {
      state.appointmentInfo = action.payload;
    },
  },
});

export const {appointmentData, clientData} = adminSlice.actions;

export default adminSlice.reducer;
