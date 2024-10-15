import React from "react";
import { BrowserRouter, Route, Routes } from "react-router-dom";
import Home from "./Screens/AllScreens/Home";
import { Login, NoPage, Profile, SignUp } from "./Screens";
import "@fontsource/roboto/300.css";
import "@fontsource/roboto/400.css";
import "@fontsource/roboto/500.css";
import "@fontsource/roboto/700.css";
import { useSelector } from "react-redux";

const App = () => {
  const isLoggedIn = useSelector((state) => state.Login.isLoggedIn);
  return (
    <BrowserRouter>
      <Routes>
        {isLoggedIn ? (
          <>
            <Route index element={<Home />} />
            <Route path="Profile" element={<Profile />} />
            <Route path="*" element={<NoPage />} />
          </>
        ) : (
          <>
            <Route index element={<Login />} />
            <Route path="SignUp" element={<SignUp />} />
            <Route path="*" element={<NoPage />} />
          </>
        )}
      </Routes>
    </BrowserRouter>
  );
};

export default App;
