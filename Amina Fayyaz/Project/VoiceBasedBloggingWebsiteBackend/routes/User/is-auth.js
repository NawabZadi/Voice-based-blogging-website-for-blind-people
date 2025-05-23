const express = require("express");
const { body } = require("express-validator/check");

const User = require("../../models/User/user");
const authController = require("../../controllers/User/is-auth");
const isAuth = require("../../middleware/is-auth");

const router = express.Router();

router.post(
  "/signup",
  [
    body("username")
    .trim()
    .isLength({ min: 3, max: 20 })
    .not()
    .isEmpty(),
    body("email")
      .custom((value, { req }) => {
        return User.findOne({ Email: value }).then(userDoc => { // check if the account already exists with the given email
          if (userDoc) {
            return Promise.reject("An account with this email address already exists!");
          }
        });
      })
      .trim()
      .not()
      .isEmpty(),

    body("password")
      .trim()
      .isLength({ min: 8, max: 25 })
      .not()
      .isEmpty(),
  ],
  authController.userSignUp);

router.post("/login",
[
    body("email")
        .trim()
        .not()
        .isEmpty(),
    body("password")
        .trim()
        .not()
        .isEmpty()
],authController.userLogin);

router.post("/add-facial-auth",isAuth,authController.AddFacialAuthentication);
router.post("/verify-facial-auth",authController.VerifyFacialAuthentication);


module.exports = router;