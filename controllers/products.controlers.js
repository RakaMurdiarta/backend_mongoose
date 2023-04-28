const ProductModel = require("../models/product.models");
const { validationResult } = require("express-validator");

exports.addProduct = (req, res, next) => {
  const title = req.body.title;
  const price = req.body.price;
  const description = req.body.description;
  console.log(description);
  console.log(req.file);
  const imageUrl = req.file.path.replace("\\", "/");
  console.log(imageUrl, "ddd");
  const userId = req.user;

  const products = new ProductModel({
    title,
    price,
    description,
    imageUrl,
    userId,
  });

  const errors = validationResult(req);

  if (!errors.isEmpty()) {
    const error = new Error(JSON.stringify(errors.errors));
    error.statusCode = 422;
    throw error;
  }

  if (!req.file) {
    const error = new Error("No Image Provide");
    error.statusCode = 422;
    throw error;
  }

  products
    .save()
    .then((data) => {
      res.json({ msg: "Add Products", data: data });
    })
    .catch((err) => {
      // res.json({ msg: err.message });
      if (!err.statusCode) {
        err.statusCode = 505;
      }
      next(err);
    });
};

exports.getProducts = (req, res, next) => {
  try {
    ProductModel.find()
      .then((products) => {
        res.json({ data: products });
      })
      .catch((err) => {
        res.json({ msg: err.message });
      });
  } catch (error) {
    res.status(404).json({ msg: "Forbidden" });
  }
};

exports.getProduct = (req, res, next) => {
  const prodId = req.params.productId;
  ProductModel.findById(prodId).then((product) => {
    res.json({ data: product });
  });
};

exports.postCart = (req, res) => {
  const prodId = req.body.productId;
  ProductModel.findById(prodId)
    .then((p) => {
      return req.user.addToChart(p);
    })
    .then((r) => {
      console.log(r);
      res.json(r);
    });
};

exports.deleteProduct = (req, res) => {
  const { productId } = req.params;
  ProductModel.deleteOne({ _id: productId })
    .then((result) => {
      ProductModel.find().then((products) => {
        res.status(200).json({ data: products });
      });
    })
    .catch((err) => {
      res.status(401).json({
        msg: err.message,
      });
    });
};

exports.updateProduct = (req, res, next) => {
  ProductModel.updateOne({ _id: id }, req.body)
    .then((result) => {
      res.status(200).json({ msg: result });
    })
    .catch((err) => {
      res.status(401).json({ msg: err.message });
    });
};
