const Chat = require('../models/chatModel');

// Get chat messages for a specific chat room
exports.getChatMessages = async (chatRoomId) => {
  try {
    const chat = await Chat.findOne({ chatRoomId });
    return chat ? chat.messages : [];
  } catch (error) {
    throw error;
  }
};

// Save a new message in the chat room
exports.saveMessage = async (chatRoomId, messageData) => {
  try {
    let chat = await Chat.findOne({ chatRoomId });

    if (!chat) {
      chat = new Chat({ chatRoomId, messages: [] });
    }

    chat.messages.push(messageData);
    await chat.save();
    return chat.messages;
  } catch (error) {
    throw error;
  }
};
