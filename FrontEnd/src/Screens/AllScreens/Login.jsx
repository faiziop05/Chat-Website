import React, { useState } from "react";
import "../styles/LoginSignUp.css";
import { useDispatch } from "react-redux";
import axios from "axios";
import { setIsLoggedIn } from "../../redux/LoginSlice";
import { setChatAppUser } from "../../redux/UserSlice";
import { useNavigate } from "react-router";
const Login = () => {
  const navigate=useNavigate()
  const dispatch = useDispatch();
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState(null);

  const handleLoginAccount = async () => {
    try {
      setError(null);
      if (!email || !password) {
        setError("Enter full name, email, password and confirm password");
        return;
      }
      const user = {
        email,
        password,
      };
      const res = await axios.post(
        "http://localhost:5000/api/user/Login",
        user
      );
      if (res.status == 200) {
        dispatch(setIsLoggedIn(true));
        dispatch(setChatAppUser(res.data));
      }
    } catch (error) {
      console.log(error);
    }
  };

  return (
    <div className="LoginContianer">
      <div className="LoginLeftConatiner">
        <h1 className="LoginHeadingText">Login</h1>
        <div>
          <div className="LoginSignUpLabelInputWrapper">
            <label htmlFor="userLoginEmail">Email</label>
            <input
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              placeholder="Email"
              type="text"
              id="userLoginEmail"
            />
          </div>
          <div className="LoginSignUpLabelInputWrapper">
            <label htmlFor="userLoginPassword">Password</label>
            <input
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              placeholder="Password"
              type="text"
              id="userLoginPassword"
            />
            {error && <p style={{ color: "red" }}>{error}</p>}
          </div>

          <button onClick={handleLoginAccount} className="LoginSignUpBtn">
            Login
          </button>
          <div className="DontHaveOrHaveAccountBtnWraper">
            <p>Don't have an account? </p>
            <button onClick={()=>{navigate("/SignUp")}}>Create Account</button>
          </div>
        </div>
      </div>

      <div className="LoginRightContainer">
        <h2>Login with your account</h2>
        <p>
          If don't have an account, than create an account to stay connected
          with your friends and family
        </p>
      </div>
    </div>
  );
};

export default Login;
