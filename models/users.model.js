const mongoose = require("mongoose");

const Schema = mongoose.Schema;

const usersSchema = new Schema({
  name: {
    type: String,
    require: true,
  },
  email: {
    type: String,
    require: true,
  },
  password: {
    type: String,
    require: true,
  },
  cart: {
    items: [
      {
        productId: {
          type: mongoose.Schema.Types.ObjectId,
          ref: "products",
          required: true,
        },
        quantity: { type: Number, required: true },
      },
    ],
  },
  createdAt: { type: Date, default: Date.now },
  updatedAt: { type: Date, default: Date.now },
});

usersSchema.methods.addToChart = function (product) {
  const cartProductIndex = this.cart.items.findIndex((cp) => {
    return cp.productId.toString() === product._id.toString();
  });

  let newQuantity = 1;
  const updatedCartItems = [...this.cart.items];
  if (cartProductIndex >= 0) {
    newcart = this.cart.items[cartProductIndex].quantity + 1;
    updatedCartItems[cartProductIndex].quantity = newQuantity;
  } else {
    updatedCartItems.push({
      productId: product._id,
      quantity: newQuantity,
    });
  }
  const updateCart = {
    items: updatedCartItems,
  };

  this.cart = updateCart;
  return this.save();
};

usersSchema.methods.clearChart = function () {
  this.cart.items = [];
  return this.save();
};

usersSchema.methods.clearChart = function () {
  this.cart.items = [];
  return this.save();
};

module.exports = mongoose.model("user", usersSchema);
