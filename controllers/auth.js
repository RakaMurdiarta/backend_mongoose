const { validationResult } = require("express-validator");
const bcrypt = require("bcryptjs");
const jwt = require("jsonwebtoken");

const User = require("../models/users.model.js");

exports.signup = (req, res, next) => {
  const errors = validationResult(req);
  // console.log("ssdsddd", errors.errors[0].msg);
  if (!errors.isEmpty()) {
    const error = new Error(errors?.errors[0]?.msg ?? "");
    error.statusCode = 422;
    error.data = errors.array();
    throw error;
  }
  const email = req.body.email;
  const name = req.body.name;
  const password = req.body.password;
  bcrypt
    .hash(password, 12)
    .then((hashPass) => {
      const user = new User({
        email,
        password: hashPass,
        name,
      });
      return user.save();
    })
    .then((result) => {
      res.status(201).json({ msg: "User Created", userId: result._id });
    })
    .catch((err) => {
      if (!err.statusCode) {
        console.log(!err.statusCode);
        err.statusCode = 500;
      }
      next(err);
    });
};

exports.login = (req, res, next) => {
  const email = req.body.email;
  const password = req.body.password;

  let loadedUser;
  User.findOne({ email })
    .then((user) => {
      if (!user) {
        const error = new Error("A user with this email could not be found");
        error.statusCode = 401;
        throw error;
      }
      loadedUser = user;
      return bcrypt.compare(password, user?.password);
    })
    .then((isEqual) => {
      if (!isEqual) {
        const error = new Error("Wrong Password!");
        error.statusCode = 401;
        throw error;
      }
      const token = jwt.sign(
        {
          email: loadedUser.email,
          userId: loadedUser._id,
          user: loadedUser.name,
        },
        "fsfskfjfdfdfdf",
        {
          expiresIn: "1h",
        }
      );

      const refreshToken = jwt.sign(
        {
          email: loadedUser.email,
          userId: loadedUser._id,
          user: loadedUser.name,
        },
        "refreshtoken",
        {
          expiresIn: "1h",
        }
      );

      res.cookie("refreshToken", refreshToken, {
        httpOnly: true,
        sameSite: "None",
        secure: true,
        maxAge: 24 * 60 * 60 * 1000,
      });

      res.status(200).json({
        token,
        userId: loadedUser._id,
        email: loadedUser.email,
        user: loadedUser.name,
        refresh: refreshToken,
      });
    })
    .catch((err) => {
      if (!err.satusCode) {
        err.statusCode = 500;
      }
      next(err);
    });
};

exports.logout = (req, res) => {
  const cookies = req.cookies;

  if (!cookies?.refreshToken) return res.sendStatus(204);

  const refreshToken = cookies.refreshToken;

  res.clearCookie("refreshToken", {
    httpOnly: true,
    sameSite: "None",
    secure: true,
  });
  res.sendStatus(204);
};
