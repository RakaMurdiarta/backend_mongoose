const express = require("express");
const User = require("../models/users.model.js");
const AuthController = require("../controllers/auth.js");
const { body } = require("express-validator");

const router = express.Router();

router.post(
  "/signup",
  [
    body("email")
      .isEmail()
      .withMessage("Please enter valid email")
      .custom((value, { req }) => {
        return User.findOne({ email: value }).then((userDoc) => {
          if (userDoc) {
            return Promise.reject("Email Already Exist!");
          }
        });
      })
      .normalizeEmail(),
    body("password").trim().isLength({ min: 5 }),
    body("name").trim().not().isEmpty(),
  ],
  AuthController.signup
);

router.post('/login',AuthController.login)
router.get('/logout',AuthController.logout)


module.exports = router;
