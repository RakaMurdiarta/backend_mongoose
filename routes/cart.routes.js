const express = require("express");
const cartAdd = require("../controllers/carts.controlers");
const router = express.Router();
const productC=require('../controllers/products.controlers')

router.post("/addcart", cartAdd.addCart);
// router.get("/getUser", cartAdd.getUsers);
router.post("/postcart", productC.postCart);

module.exports = router;
