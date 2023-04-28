const usersModel = require("../models/users.model");
const ProdModel = require("../models/product.models");

exports.AddUser = (req, res) => {
  const name = req.body.nama;
  const email = req.body.email;
  const user = new usersModel({
    nama: name,
    email: email,
  });
  user
    .save()
    .then((data) => {
      res.json({ msg: "Add User Connected" });
    })
    .catch((err) => {
      res.json({ msg: err.message });
    });
};

exports.getUsers = (req, res) => {
  usersModel.find().then((user) => {
    res.json({ data: user });
  });
};

exports.getCart = (req, res) => {
  req.user.populate("cart.items.productId").then((r) => {
    res.json(r);
  });
};

exports.clearCart = (req, res) => {
  const cart = req.user.clearChart();
  res.json(cart);
};

exports.createCart = (req, res) => {
  usersModel.findOne().then((user) => {
    user.create();
  });
};

exports.deleteUser = (req, res) => {
  const { id } = req.body;

  usersModel.deleteOne({ _id: id }).then((user) => {
    const { deletedCount } = user;
    console.log(id);
    if (deletedCount === 0) {
      res.status(401).json({ msg: "User Tidak Ada" });
    } else {
      usersModel.find().then((user) => {
        res.json({ data: user });
      });
    }
  });
};

exports.updateUser = (req, res) => {
  const { id } = req.body;
  const { name } = req.body;

  usersModel
    .updateOne({ _id: id }, { name })
    .then((result) => {
      usersModel.find().then((user) => {
        res.json({ data: user });
      });
    })
    .catch((err) => {
      res.send(err.message);
    });
};

exports.getUser = (req, res, next) => {
  const { userid } = req.params;
  try {
    usersModel.findById(userid).then((user) => {
      if (user) {
        return res.status(200).json({ user });
      }
      return res.status(200).json({ msg: "User Tidak Ditemukan" });
    });
  } catch (error) {
    res.status(404).json({ msg: error.message });
  }
};
