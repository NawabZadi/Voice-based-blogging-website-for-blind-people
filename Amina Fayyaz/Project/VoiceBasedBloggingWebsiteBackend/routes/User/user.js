const express = require("express");
const { body } = require("express-validator/check");
const isAuth = require("../../middleware/is-auth");
const userController = require("../../controllers/User/user");

const router = express.Router();


router.get("/get-profile",isAuth,userController.getCurrentUserProfile);

router.get("/get-profile/:id",userController.getUserProfile);

router.post("/upload-profile-picture",isAuth,userController.uploadProfilePicture);

router.post("/upload-description",isAuth,userController.uploadDescription);


module.exports = router;