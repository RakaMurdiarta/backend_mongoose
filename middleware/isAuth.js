const jwt = require("jsonwebtoken");
const Products = require("../models/product.models.js");

exports.auth = (req, res, next) => {
  const authHeader = req.headers["authorization"];

  console.log(req.headers);

  console.log(authHeader, "isAUth");
  if (!authHeader) {
    const error = new Error("Not Authenticated");
    error.statusCode = 401;
    throw error;
  }

  const token = authHeader.split(" ")[1];
  let decodeToken;
  try {
    decodeToken = jwt.verify(token, "fsfskfjfdfdfdf");
  } catch (error) {
    error.statusCode = 403;
    throw error;
  }
  if (!decodeToken) {
    const error = new Error("Not Authenticated");
    error.statusCode = 401;
    throw error;
  }

  req.userId = decodeToken.userId;
  console.log(req.userId);
  next();
};

exports.adminAuth = (req, res, next) => {
  let id = req.userId;

  Products.findOne({ _id: req.params.productId })
    .then((result) => {
      return result;
    })
    .then((product) => {
      if (product.userId?.toString() !== id) {
        const error = new Error("Forbidden");
        error.StatusCode = 403;
        throw error;
      } else {
        next();
      }
    });
};
