const cloudinary = require("cloudinary").v2;
const chatModel = require("../models/chatModel.js");
const Room = require("../models/Room.js");
const UserModel = require("../models/UserModel.js");

const RegisterUser = async (req, res) => {
  try {
    const { fullName, email, password, img } = req.body;
    if (!fullName || !email || !password) {
      res.status(500).json({ message: "Error, please enter all values" });
      return;
    }
    const newUser = await new UserModel({
      fullName,
      email,
      password,
      img: img || "",
    });
    await newUser.save();
    res.status(200).json({ message: "Successfully created an account" });
  } catch (error) {
    console.log(error);
  }
};

const Login = async (req, res) => {
  try {
    const { email, password } = req.body;
    if (!email || !password) {
      res.status(500).json({ message: "Error, please enter all values" });
      return;
    }
    const user = await UserModel.findOne({ email: email });
    if (!user) {
      res.status(400).json({ message: "User not found" });
      return;
    }
    const pass = user.password == password;
    if (pass) {
      res.status(200).json(user);
    }
  } catch (error) {
    console.log(error);
  }
};

const getUsers = async (req, res) => {
  try {
    const { searchTerm } = req.params;
    const regex = new RegExp(searchTerm, "i");
    if (!searchTerm) {
      res.status(500).json({ message: "Bad Requist" });
      return;
    }
    const user = await UserModel.find({ email: { $regex: regex } }).limit(10);
    if (user.length < 1) {
      res.status(400).json({ message: "User not found" });
      return;
    }

    res.status(200).json(user);
  } catch (error) {
    console.log(error);
  }
};

const FetchRoomsList = async (req, res) => {
  try {
    const { id } = req.body;

    if (!id) {
      return res.status(400).json({ message: "Bad Request" });
    }
    const chatList = await Room.find({ users: id });
    if (chatList.length === 0) {
      return { message: "No rooms found for this user." };
    }
    const data = chatList.map((item) => item.toObject().MetaData);

    const flattenedData = data.flatMap((element) =>
      element.map((item) => ({ ...item }))
    );

    const newData = flattenedData.filter((item) => item.userId != id);

    // Use Promise.all to handle async operations inside map
    const finalData = await Promise.all(
      newData.map(async (item) => {
        const user = await UserModel.findOne({ _id: item.userId });
        return { ...item, image: user.img }; // Append image to the item
      })
    );

    res.status(201).json({ message: "Here is data", data: finalData });
  } catch (error) {
    console.log(error);
    res.status(500).json({ message: "Server error", error });
  }
};

const AddUserToRoom = async (req, res) => {
  try {
    const newdata = req.body;
    const { roomId, users } = req.body;
    if (!newdata) {
      return res.status(400).json({ message: "Bad Request" });
    }
    const existingUser = await Room.findOne({
      userId: newdata.userId,
      roomId: newdata.roomId,
    });
    if (existingUser) {
      return res
        .status(400)
        .json({ message: "User already exists in the room" });
    }
    const user = await UserModel.findOne({ _id: users[1] });
    const user2 = await UserModel.findOne({ _id: users[0] });
    const MetaData = [
      {
        userId: users[1],
        name: user.fullName,
        img: user.img || "",
        lastMessage: "",
        lastMessageTime: Date.now(),
        roomId,
      },
      {
        userId: users[0],
        name: user2.fullName,
        img: user2.img,
        lastMessage: "",
        lastMessageTime: Date.now(),
        roomId,
      },
    ];
    const newUser = new Room({
      roomId,
      users,
      MetaData,
      content: [],
    });
    await newUser.save();
    res
      .status(201)
      .json({ message: "User added to room successfully", data: newUser });
  } catch (error) {
    console.log(error);
    res.status(500).json({ message: "Server error", error });
  }
};

const getProfileImage = async (req, res) => {
  const { id } = req.body;
  if (!id) return res.status(400).json({ message: "Bad Request" });

  const response = await UserModel.findOne({ _id: id });
  const image = response.img;
  res.status(200).json(image);
};

// Cloudinary image upload controller
const UploadProfileImage = async (req, res) => {
  const image = req.file; // Uploaded file
  const { userId } = req.body;

  try {
    if (!image) {
      return res.status(400).json({ message: "No image file uploaded" });
    }

    const randomNum = Math.random(10000) * 10;
    const randomNum2 = Math.random(10000) * 10;
    const randomNum3 = Math.random(10000) * 10;

    // Create a Cloudinary upload stream
    const uploadStream = cloudinary.uploader.upload_stream(
      {
        public_id: `${randomNum2}${randomNum3}${randomNum}${userId}`, // Use userId as the public ID
      },
      async (error, result) => {
        if (error) {
          console.error("Error uploading image:", error);
          return res.status(500).json({ error: "Image upload failed" });
        }

        // Optimize the image
        const optimizeUrl = cloudinary.url(result.public_id, {
          fetch_format: "auto",
          quality: "auto",
        });

        try {
          // Update the user's profile image in the database
          const ProfileUpload = await UserModel.findOneAndUpdate(
            { _id: userId }, // Find the user by their ID
            { img: optimizeUrl }, // Update the 'img' field with the optimized image URL
            { new: true, useFindAndModify: false } // Return the updated document
          );

          if (!ProfileUpload) {
            return res.status(404).json({ error: "User not found" });
          }
          await Room.updateMany(
            { "MetaData.userId": userId }, // Match all documents containing the userId in MetaData array
            {
              $set: {
                "MetaData.$[elem].img": image, // Update the 'img' field for the matched user
              },
            },
            {
              arrayFilters: [{ "elem.userId": userId }], // Only apply to the elements where userId matches
            }
          );

          res.status(200).json({ message: "Profile uploaded successfully" });
        } catch (dbError) {
          console.error("Error saving Profile Image:", dbError);
          res.status(500).json({ error: "Failed to update Profile Image" });
        }
      }
    );

    // Pipe the image buffer to the Cloudinary upload stream
    if (image.buffer) {
      uploadStream.end(image.buffer); // Send image buffer to Cloudinary
    } else {
      console.error("Image buffer not found");
      return res.status(400).json({ error: "Image buffer not found" });
    }
  } catch (error) {
    console.error("Error processing request:", error);
    return res.status(500).json({ error: "Server error" });
  }
};

module.exports = {
  Login,
  RegisterUser,
  getUsers,
  AddUserToRoom,
  FetchRoomsList,
  UploadProfileImage,
  getProfileImage
};
