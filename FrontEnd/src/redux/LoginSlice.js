import { createSlice } from "@reduxjs/toolkit";

const initialState = {
  isLoggedIn: localStorage.getItem('isLoggedIn') === 'true'
};

const LoginSlice = createSlice({
  initialState,
  name: "login",
  reducers: {
    setIsLoggedIn: (state, action) => {
      state.isLoggedIn = action.payload;
      localStorage.setItem("isLoggedIn", action.payload);
    },
  },
});

export const { setIsLoggedIn } = LoginSlice.actions;

export default LoginSlice.reducer;
