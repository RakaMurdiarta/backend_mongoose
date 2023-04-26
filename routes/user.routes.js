const express = require("express");
const UserAdd = require("../controllers/users.controllers");
const products = require("../controllers/products.controlers");
const { body } = require("express-validator");
const isAuth = require("../middleware/isAuth.js");
const refresh = require("../controllers/refreshToken.js");

const router = express.Router();

router.post("/addUser", UserAdd.AddUser);
router.get("/users", isAuth.auth, UserAdd.getUsers);
router.get("/products", isAuth.auth, products.getProducts);
router.get(
  "/getproduct/:productId",
  isAuth.auth,
  // isAuth.adminAuth,
  products.getProduct
);
router.post("/delete/user", UserAdd.deleteUser);
router.post("/update/user", UserAdd.updateUser);

router.get("/getCart", UserAdd.getCart);
router.post(
  "/addproduct",
  [
    body("title")
      .trim()
      .isLength({ min: 7 })
      .withMessage("Length must minimal 7 characther"),
    body("price").trim().isLength({ min: 3 }),
    body("price").toInt(),
  ],
  isAuth.auth,
  products.addProduct
);
router.get("/clearcart", UserAdd.clearCart);
router.get("/del/:productId", products.deleteProduct);
router.get("/user/:userid", UserAdd.getUser);
router.get("/refresh", refresh.handleRefreshToken);

module.exports = router;
