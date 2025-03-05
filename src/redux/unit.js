import {createSlice} from '@reduxjs/toolkit';

const initialState = {
  units: {
    Height: 'Centimeter',
    Weight: 'Kilogram',
    Volume: 'Liter',
    Energy: 'Kilocalorie',
    Distance: 'Kilometer',
  },
};

export const unitSlice = createSlice({
  name: 'units',
  initialState,
  reducers: {
    updateUnits: (state, action) => {
      state.units = action.payload;
    },
  },
});

export const {updateUnits} = unitSlice.actions;

export default unitSlice.reducer;