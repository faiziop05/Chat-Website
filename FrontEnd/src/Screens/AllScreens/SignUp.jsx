import React, { useState } from "react";
import "../styles/LoginSignUp.css";
import { useSelector } from "react-redux";
import { useDispatch } from "react-redux";
import { setIsLoggedIn } from "../../redux/LoginSlice";
import axios from "axios";
import { useNavigate } from "react-router";
const SignUp = () => {
  const navigate=useNavigate()
  const dispatch = useDispatch();
  const [fullName, setFullName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [error, setError] = useState(null);

  const handleCreateAccount =async () => {
    try {
      setError(null)
      if (!fullName || !email || !password || !confirmPassword) {
        setError("Enter full name, email, password and confirm password");
        return;
      }
      if (password != confirmPassword) {
        setError("Passwords do not match");
        return;
      }

      const user = {
        fullName,
        email,
        password,
      };

      const res=await axios.post("http://localhost:5000/api/user/RegisterUser",user)
      if(res.status==200){
        alert("Account created succesfully, now login with same account to continue")
        navigate("/")
      }
    } catch (error) {
      console.log(error);
    }
  };

  return (
    <div className="LoginContianer">
      <div className="LoginLeftConatiner">
        <h1 className="LoginHeadingText">Create Account</h1>
        <div>
          <div className="LoginSignUpLabelInputWrapper">
            <label htmlFor="userLoginFullName">Full Name</label>
            <input value={fullName} onChange={(e)=>setFullName(e.target.value)} placeholder="Full Name" type="text" id="userLoginFullName" />
          </div>
          <div className="LoginSignUpLabelInputWrapper">
            <label htmlFor="userSignUpEmail">Email</label>
            <input value={email} onChange={(e)=>setEmail(e.target.value)} placeholder="Email" type="text" id="userSignUpEmail" />
          </div>
          <div className="LoginSignUpLabelInputWrapper">
            <label htmlFor="userSignUpPassword">Password</label>
            <input value={password} onChange={(e)=>setPassword(e.target.value)} placeholder="Password" type="text" id="userSignUpPassword" />
          </div>
          <div className="LoginSignUpLabelInputWrapper">
            <label htmlFor="userSignUpConfirmPassword">Confirm Password</label>
            <input
            value={confirmPassword} onChange={(e)=>setConfirmPassword(e.target.value)}
              placeholder="Confirm Password"
              type="text"
              id="userSignUpConfirmPassword"
            />
            {error && <p style={{color:'red'}}>{error}</p>}
          </div>

          <button onClick={handleCreateAccount} className="LoginSignUpBtn">
            Create Account
          </button>
          <div className="DontHaveOrHaveAccountBtnWraper">
            <p>Already have an account? </p>
            <button onClick={()=>{navigate("/")}}>Login</button>
          </div>
        </div>
      </div>

      <div className="LoginRightContainer">
        <h2>Create your account</h2>
        <p>
          If you already have an account, than Login with your account to stay
          connected with your friends and family
        </p>
      </div>
    </div>
  );
};

export default SignUp;
