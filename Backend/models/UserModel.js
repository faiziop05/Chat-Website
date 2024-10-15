const mongoose = require("mongoose");

const UserSchema = new mongoose.Schema({
  fullName: { type: String, required: true },
  email: { type: String, required: true, unique: true },
  password: { type: String, required: true },
  img:{type:String}
});

const UserModel = new mongoose.model("User", UserSchema);
module.exports=UserModel