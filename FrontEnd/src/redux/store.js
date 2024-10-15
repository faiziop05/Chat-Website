import { configureStore } from "@reduxjs/toolkit";
import LoginSlice from "./LoginSlice";
import UserSlice from "./UserSlice";
const store = configureStore({
  reducer: {
    Login: LoginSlice,
    User:UserSlice
  },
});

export default store;
