import React, { useEffect, useRef, useState } from "react";

import { socket } from "./socket";
import { IoIosCall } from "react-icons/io";
import { IoVideocam } from "react-icons/io5";
import { useSelector } from "react-redux";
import { CgProfile } from "react-icons/cg";
import data from "@emoji-mart/data";
import Picker from "@emoji-mart/react";
import { BsEmojiSmile } from "react-icons/bs";



const ChatComponent = ({ selecetedChatRoom }) => {
  const User = useSelector((state) => state.User.ChatAppUser);
  const [messages, setMessages] = useState([]);
  const [newMessage, setNewMessage] = useState("");
  const chatRoomId = selecetedChatRoom.roomId;
  const chatEndRef = useRef(null);
  const [showPicker, setShowPicker] = useState(false);

  const handleEmojiSelect = (emoji) => {
    setNewMessage(newMessage + emoji.native);
  };
  const scrollToBottom = () => {
    chatEndRef.current?.scrollIntoView();
  };

  useEffect(() => {
    scrollToBottom();
  }, [messages]); // Scroll when messages are updated

  useEffect(() => {
    socket.emit("joinRoom", chatRoomId);
    socket.on("chatHistory", (chatHistory) => {
      setMessages(chatHistory);
    });
    socket.on("message", (updatedMessages) => {
      setMessages(updatedMessages);
    });
    return () => {
      socket.off("chatHistory");
      socket.off("message");
    };
  }, [chatRoomId]);

  const handleSendMessage = () => {
    if (!newMessage.trim()) return;

    const message = {
      sender: {
        id: User?._id,
        name: User?.fullName,
        avatar: User?.img || "https://i.pravatar.cc/40?img=1",
      },
      content: newMessage,
      timestamp: new Date(),
    };

    socket.emit("newMessage", { chatRoomId, message });
    setNewMessage("");
    setShowPicker(false)
  };

  return (
    <div className="ChatsSectionWrapper">
      {chatRoomId && (
        <div className="chatSectionHeader">
          <div className="ContactChatItemLeftWrapper">
            {selecetedChatRoom.image ? (
              <img src={selecetedChatRoom.image} alt="user" />
            ) : (
              <CgProfile className="profileIcon" />
            )}
            <div>
              <h4>{selecetedChatRoom.name}</h4>
              <p>{selecetedChatRoom.status}</p>
            </div>
          </div>
          <div className="AudioVideoCallWrapper">
            <IoIosCall size={26} className="AudioVideoCallIcon" />
            <IoVideocam size={26} className="AudioVideoCallIcon" />
          </div>
        </div>
      )}

      <div className="chat-window">
        {messages.map((message, index) => {
          return (
            <div
              key={index}
              className={
                message.sender.id == User._id ? "message-right" : "message"
              }
            >
              <div className="message-content">
                {message.content}
                <br />
                <small>
                  <p></p>
                  {new Date(message.timestamp).toLocaleTimeString()}
                </small>
              </div>
            </div>
          );
        })}
        <div ref={chatEndRef} />
      </div>
      {showPicker && (
        <div className="emojiPicker">

        <Picker
          data={data}
          onEmojiSelect={handleEmojiSelect}
          />
          </div>
      )}
      {chatRoomId && (
        <div className="input-wrapper">
          <input
            type="text"
            value={newMessage}
            onChange={(e) => setNewMessage(e.target.value)}
            placeholder="Type a message"
          />
          <BsEmojiSmile className="EmogiPickerIconBtn" onClick={() => setShowPicker(!showPicker)}/>
          <div>
          </div>

          <button onClick={handleSendMessage}>Send</button>
        </div>
      )}
    </div>
  );
};

export default ChatComponent;
