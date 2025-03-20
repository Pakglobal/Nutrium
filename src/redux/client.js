import {createSlice} from '@reduxjs/toolkit';

const initialState = {
  clientAppointmentInfo: {},
  measurementInfo: {},
  mealInfo: {},
  addInfo: {},
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
    addData: (state, action) => {
      state.addInfo = action.payload;
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
  addData,
} = clientSlice.actions;

export default clientSlice.reducer;
