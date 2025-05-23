import {createSlice} from '@reduxjs/toolkit';

const initialState = {
  appointmentInfo: {},
};

const adminSlice = createSlice({
  name: 'admin',
  initialState,
  reducers: {
    appointmentData: (state, action) => {
      state.appointmentInfo = action.payload;
    },
  },
});

export const {appointmentData} = adminSlice.actions;

export default adminSlice.reducer;
