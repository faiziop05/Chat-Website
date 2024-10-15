const mongoose = require('mongoose');

const chatSchema = new mongoose.Schema({
  chatRoomId: { type: String, required: true },
  messages: [
    {
      sender: {
        id: { type: String, required: true },
        name: { type: String, required: true },
        avatar: { type: String, required: true }
      },
      content: { type: String, required: true },
      timestamp: { type: Date, default: Date.now }
    }
  ]
});

module.exports = mongoose.model('Chat', chatSchema);
