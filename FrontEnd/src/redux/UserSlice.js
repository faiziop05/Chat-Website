import { createSlice } from "@reduxjs/toolkit";

const initialState = {
  ChatAppUser: JSON.parse(localStorage.getItem("ChatAppUser")) || {},
};

const UserSlice = createSlice({
  initialState,
  name: "User",
  reducers: {
    setChatAppUser: (state, action) => {
      state.ChatAppUser = action.payload;
      localStorage.setItem("ChatAppUser", JSON.stringify(action.payload));
    },
  },
});

export const { setChatAppUser } = UserSlice.actions;

export default UserSlice.reducer;
