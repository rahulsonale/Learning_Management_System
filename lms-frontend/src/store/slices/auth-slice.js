import { createSlice } from "@reduxjs/toolkit";

const storedUser = JSON.parse(localStorage.getItem("lms:user") || "null");

const initialState = {
  user: storedUser,
};

const authSlice = createSlice({
  name: "auth",
  initialState,
  reducers: {
    login(state, action) {
      state.user = action.payload;
      localStorage.setItem("lms:user", JSON.stringify(action.payload));
    },
    logout() {
      localStorage.removeItem("lms:user");
      return { user: null };
    },
  },
});

export const { login, logout } = authSlice.actions;
export default authSlice.reducer;
