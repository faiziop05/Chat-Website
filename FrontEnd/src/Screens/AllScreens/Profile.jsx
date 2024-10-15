import React, { useEffect, useRef, useState } from "react";
import "../styles/Settings.css";
import axios from "axios";
import { useDispatch, useSelector } from "react-redux";
import { setChatAppUser } from "../../redux/UserSlice";
import { setIsLoggedIn } from "../../redux/LoginSlice";
import { useNavigate } from "react-router";
const Profile = () => {
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const [isnewImage, setIsNEwImage] = useState(false);
  const User = useSelector((state) => state.User.ChatAppUser);
  const [image, setImage] = useState(null);
  const inputFileRef = useRef();
  const handleLogout = () => {
    dispatch(setIsLoggedIn(false));
    dispatch(setChatAppUser({}));
    navigate("/", { replace: true });
  };
  const onImageChange = (event) => {
    if (event.target.files && event.target.files[0]) {
      setImage(event.target.files[0]);
      setIsNEwImage(true);
    }
  };

  const uploadImage = () => {
    const formData = new FormData();
    formData.append("image", image);
    formData.append("userId", User._id);

    axios
      .post("http://localhost:5000/api/user/UploadProfileImage", formData, {
        headers: {
          "Content-Type": "multipart/form-data",
        },
      })
      .then((response) => {
        console.log("File uploaded successfully", response.data);
      })
      .catch((error) => {
        console.error("Error uploading file", error);
      })
      .finally(() => {
        setIsNEwImage(false);
        fetch()
      });
  };

  const handleSelectClick = () => {
    inputFileRef.current.click();
  };

  const fetch = async () => {
    try {
      const res = await axios.post(
        "http://localhost:5000/api/user/getProfileImage",
        { id: User._id }
      );

      if (res.status == 200) {
        setImage(res.data);
      }
    } catch (error) {
      console.log(error);
    }
  };
  useEffect(() => {
    fetch();
  }, [User]);

  return (
    <div>
      <div className="navbar">
      <h1 className="HaedingPageTitle">
          Chat<span className="HaedingPageTitleSpan">Sphere</span>
        </h1>
      </div>

      <div className="SettingsBottumContainer">
        <img
          alt="preview image"
          src={isnewImage ? URL.createObjectURL(image) : image}
          className="ProfileImage"
        />
        <input
          ref={inputFileRef}
          type="file"
          accept="image/*"
          className="ProfileImageInput"
          style={{ display: "none" }}
          onChange={onImageChange}
        />
        <button onClick={handleSelectClick} className="ChangeImage">
          Change Image
        </button>
        <button onClick={uploadImage} className="UploadImage">
          Upload Image
        </button>
        <button
          style={{
            border: 0,
            backgroundColor: "red",
            width: 200,
            height: 40,
            alignItems: "center",
            justifyContent: "center",
            color: "#fff",
            borderRadius: 50,
            marginTop: 10,
          }}
          onClick={handleLogout}
        >
          Logout
        </button>
      </div>
    </div>
  );
};

export default Profile;
