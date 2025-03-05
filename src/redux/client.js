import {createSlice} from '@reduxjs/toolkit';

const initialState = {
  clientAppointmentInfo: {},
  measurementInfo: {},
};

const clientSlice = createSlice({
  name: 'client',
  initialState,
  reducers: {
    clientAppointmentData: (state, action) => {
      state.clientAppointmentInfo = action.payload;
    },
    measurementData: (state, action) => {
      state.measurementInfo = action.payload;
    },
    updateAppointmentStatus: (state, action) => {
      const {appointmentId, status} = action.payload;
      state.clientAppointmentInfo = state.clientAppointmentInfo.map(
        appointment =>
          appointment._id === appointmentId
            ? {...appointment, status}
            : appointment,
      );
    },
  },
});

export const {
  measurementData,
  clientAppointmentData,
  updateAppointmentStatus,
  waterIntakeData,
} = clientSlice.actions;

export default clientSlice.reducer;
