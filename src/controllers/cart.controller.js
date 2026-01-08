const cartService = require("../services/cart.service");

exports.getCart = async (req, res) => {
  const { userId } = req.params;
  const cart = await cartService.getCart(userId);
  res.json(cart);
};

exports.addToCart = async (req, res) => {
  const { userId, productId, quantity } = req.body;
  const cart = await cartService.addToCart(userId, productId, quantity);
  res.json(cart);
};

exports.updateCart = async (req, res) => {
  const { userId, productId, quantity, image } = req.body;
  const cart = await cartService.updateQuantity(userId, productId, quantity, image);
  res.json(cart);
};

exports.removeItem = async (req, res) => {
  const { userId, productId } = req.params;
  const cart = await cartService.removeItem(userId, productId);
  res.json(cart);
};

exports.clearCart = async (req, res) => {
  const { userId } = req.params;
  const cart = await cartService.clearCart(userId);
  res.json(cart);
};
