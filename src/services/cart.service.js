const Cart = require("../models/Cart.model");
const Product = require("../models/Product.model");

exports.getCart = async (userId) => {
  return await Cart.findOne({ user: userId });
};

exports.addToCart = async (userId, productId, quantity = 1) => {
  let cart = await Cart.findOne({ user: userId });

  const product = await Product.findById(productId);
  if (!product) throw new Error("Không tìm thấy sản phẩm");

  const image =
    product.images?.[0] || "data/placeholder.jpg";

  if (!cart) {
    cart = await Cart.create({
      user: userId,
      items: [
        {
          product: product._id,
          name: product.name,
          price: product.price,
          image, 
          quantity,
        },
      ],
    });
    return cart;
  }

  const item = cart.items.find(
    (i) => i.product.toString() === productId
  );

  if (item) {
    item.quantity += quantity;
  } else {
    cart.items.push({
      product: product._id,
      name: product.name,
      price: product.price,
      image, 
      quantity,
    });
  }

  await cart.save();
  return cart;
};


exports.updateQuantity = async (userId, productId, quantity) => {
  const cart = await Cart.findOne({ user: userId });
  const item = cart.items.find(
    (i) => i.product.toString() === productId
  );
  if (item) item.quantity = quantity;
  await cart.save();
  return cart;
};

exports.removeItem = async (userId, productId) => {
  const cart = await Cart.findOne({ user: userId });
  cart.items = cart.items.filter(
    (i) => i.product.toString() !== productId
  );
  await cart.save();
  return cart;
};

exports.clearCart = async (userId) => {
  return await Cart.findOneAndUpdate(
    { user: userId },
    { items: [] },
    { new: true }
  );
};
