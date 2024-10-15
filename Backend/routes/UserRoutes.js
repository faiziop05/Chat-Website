const express=require("express")
const multer =require( "multer");
const storage = multer.memoryStorage();
const upload = multer({ storage });
const { RegisterUser,Login, getUsers, AddUserToRoom, FetchRoomsList,UploadProfileImage,getProfileImage } = require("../conrtollers/RegisterUser")
const router=express.Router()
router.post("/RegisterUser",RegisterUser)
router.post("/Login",Login)
router.get("/search:searchTerm",getUsers)
router.post("/room",AddUserToRoom)
router.post("/FetchRoomsList",FetchRoomsList)
router.post("/getProfileImage",getProfileImage)
router.post("/UploadProfileImage",upload.single("image"),UploadProfileImage)

module.exports=router