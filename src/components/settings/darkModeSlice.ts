import { createSlice } from '@reduxjs/toolkit';

export interface DarkInterface {
    isDarkMode:boolean
}


const initialState: DarkInterface = {
    isDarkMode:false
};

const darkModeSlice = createSlice({
  name: 'darkMode',
  initialState,
  reducers: {
    toggleDarkMode: (state) => {
      state.isDarkMode = !state.isDarkMode;
      localStorage.setItem('darkmode', state.isDarkMode.toString());
    },
    setDarkMode: (state, action) => {
      state.isDarkMode = action.payload;
      localStorage.setItem('darkmode', action.payload.toString());
    },
  },
});

export const { toggleDarkMode, setDarkMode } = darkModeSlice.actions;
export const selectDarkMode = (state: { darkMode: DarkInterface }) => state.darkMode.isDarkMode;
export default darkModeSlice.reducer;
