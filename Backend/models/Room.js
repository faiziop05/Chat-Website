const mongoose = require("mongoose");
const metaDataSchema = new mongoose.Schema({
    userId: {
      type: mongoose.Schema.Types.ObjectId, // Assuming userId is an ObjectId
      required: true,
    },
    name: {
      type: String,
      required: true,
    },
    img: {
      type: String,
      default: "", // Default value if no image is provided
    },
    lastMessage: {
      type: String,
      default: "", // Default value for lastMessage
    },
    lastMessageTime: {
      type: Date,
      default: Date.now, // Set default to current date/time
    },
    roomId: { type: String, required: true },
  });
const RoomSchema = new mongoose.Schema({
  roomId: { type: String, required: true },
  users: { type: Array, required: true },
  MetaData: {
    type: [metaDataSchema], // Array of MetaData objects
    default: [], // Default to an empty array if no MetaData is provided
  },
  content: { type: Array },
});

const Room = new mongoose.model("Room", RoomSchema);
module.exports = Room;
