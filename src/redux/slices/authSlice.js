import { createSlice } from "@reduxjs/toolkit";

const initialState = {
  isLoggedIn: false,
  isAdmin: false,
  hasRegistered: false,
};

const authSlice = createSlice({
  name: "auth",
  initialState,
  reducers: {
    login(state) {
      state.isLoggedIn = true;
    },
    logout(state) {
      state.isLoggedIn = false;
      state.isAdmin = false;
    },
    setAdmin(state, action) {
      state.isAdmin = action.payload;
    },
    setRegistered(state, action) {
      state.hasRegistered = action.payload;
    },
  },
});

export const { login, logout, setAdmin, setRegistered } = authSlice.actions;
export default authSlice.reducer;
