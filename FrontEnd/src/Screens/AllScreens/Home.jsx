import React, { useState, useEffect, useCallback } from "react"; // Make sure the socket connection is set up in this file
import { useSelector } from "react-redux";
import "../styles/Home.css";
import { IoChatboxEllipsesOutline } from "react-icons/io5";
import { CiSettings } from "react-icons/ci";
import { CgProfile } from "react-icons/cg";
import axios from "axios";
import ChatComponent from "../../Components/ChatComponent";
import { useNavigate } from "react-router";
import { socket } from "../../Components/socket";

const Home = () => {
  const navigate = useNavigate();
  const User = useSelector((state) => state.User.ChatAppUser); // Redux state
  const [results, setResults] = useState([]);
  const [data, setData] = useState([]);
  const [selecetedChatRoom, setSelectedChatRoom] = useState({});
  const [listShow, setListShow] = useState(true);
  const [searchShow, setSearchShow] = useState(false);
  const [onlineUsers, setOnlineUsers] = useState([]);
  useEffect(() => {
    socket.emit("new-user-add", User._id);
  }, [User]);

  const handleKeyDown = async (e) => {
    try {
      setListShow(false);
      setSearchShow(true);
      if (!results) {
        setResults([]);
        return;
      }
      const searchTerm = e.target.value;

      const response = await axios.get(
        `http://localhost:5000/api/user/search${searchTerm}`
      );
      if (response.status == 200) {
        setResults(response.data);
      }
    } catch (error) {
      console.error("Error fetching data:", error);
      setListShow(true);
      setSearchShow(false);
    }
  };

  const handleSearchedPerosnClick = async (id) => {
    try {
      if (!id) {
        console.log("No id Found");
        return;
      }
      const newdata = {
        roomId: `${id}${User._id}`,
        users: [id, User._id],
      };
      const res = await axios.post(
        "http://localhost:5000/api/user/room",
        newdata
      );
      if (res.status == 201) {
        alert("Success");
      }
      setResults([]);
      fetch();
    } catch (error) {
      console.log(error);
    } finally {
      setListShow(true);
      setSearchShow(false);
    }
  };

  const fetch = async () => {
    try {
      const res = await axios.post(
        "http://localhost:5000/api/user/FetchRoomsList",
        { id: User._id }
      );

      if (res.status == 201) {
        setData(res.data.data);
      }
    } catch (error) {
      console.log(error);
    }
  };
  useEffect(() => {
    fetch();
  }, []);

  useEffect(() => {
    socket.on("get-users", (users) => {
      setOnlineUsers(users); // Store online users in state
    });

    socket.emit("get-users");

    return () => {
      socket.off("get-users");
    };
  }, []);

  const handleSelectChatRoom = (item) => {
    const isOnline = onlineUsers.some((user) => user.userId === item.userId);

    // Set chat room with online status
    setSelectedChatRoom({ ...item, status: isOnline ? "Online" : "Offline" });
  };

  const formatDate = (date) => {
    const today = new Date().toDateString;
    const msgDate = new Date(date).toDateString();
    if (today == msgDate) {
      return new Date(date).toLocaleTimeString();
    } else {
      return msgDate;
    }
  };

  return (
    <div className="HomeContainer">
      <div className="navbar">
        <h1 className="HaedingPageTitle">
          Chat<span className="HaedingPageTitleSpan">Sphere</span>
        </h1>
      </div>
      <div className="MainHomeContainer">
        <div className="HomeLeftBarContainer">
          <IoChatboxEllipsesOutline className="sideBarIcon" size={24} />
          <div>
            <CgProfile
              onClick={() => navigate("/Profile")}
              className="sideBarIcon"
              size={24}
            />
          </div>
        </div>
        <div className="HomeContactChatListContainer">
          <div className="ChatsListHeadingIconWrapper">
            <h2>Chats</h2>
          </div>
          <input
            onChange={handleKeyDown}
            placeholder="Search or create new chat"
            type="text"
            className="HomeChatsSearchBar"
          />
          <div className="ContactChatsHistoryWrapper">
            {searchShow &&
              results.length > 0 &&
              results.map((item) => (
                <button
                  onClick={() => handleSearchedPerosnClick(item._id)}
                  key={item._id}
                  className="ContactChatItem"
                >
                  <div className="ContactChatItemLeftWrapper">
                    <div>
                      <h4>{item.fullName}</h4>
                      <p>{item.email}</p>
                    </div>
                  </div>
                </button>
              ))}

            {listShow &&
              data.length > 0 &&
              data.map((item) => {
                return (
                  <button
                    onClick={() => handleSelectChatRoom(item)}
                    key={item.userId}
                    className="ContactChatItem"
                  >
                    <div className="ContactChatItemLeftWrapper">
                      {item.image ? (
                        <img src={item.image} alt={item.name} />
                      ) : (
                        <CgProfile className="profileIcon" />
                      )}
                      <div>
                        <h4>{item.name}</h4>
                        <p>{item.lastMessage || "No last message"}</p>
                      </div>
                    </div>
                    <p className="messageTime">
                      {formatDate(item.lastMessageTime)}
                    </p>
                  </button>
                );
              })}
          </div>
        </div>
        <ChatComponent selecetedChatRoom={selecetedChatRoom} />
      </div>
    </div>
  );
};

export default Home;
