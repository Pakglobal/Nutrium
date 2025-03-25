import {createSlice} from '@reduxjs/toolkit';

const initialState = {
  drawerInfo: ['MESSAGES'],
};

const drawerSlice = createSlice({
  name: 'drawer',
  initialState,
  reducers: {
    drawerData: (state, action) => {
      state.drawerInfo = action.payload;
    },
  },
});

export const {drawerData} = drawerSlice.actions;

export default drawerSlice.reducer;
