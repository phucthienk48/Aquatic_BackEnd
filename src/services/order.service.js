const Order = require("../models/order.model");
const Cart = require("../models/cart.model");

const createOrder = async ({
  user,               // 👈 đổi userId → user
  paymentMethod,
  shippingAddress,
}) => {
  if (!user) throw new Error("Missing user");

  const cart = await Cart.findOne({ user });

  if (!cart || cart.items.length === 0)
    throw new Error("Cart is empty");

  const items = cart.items.map((item) => ({
    product: item.product,
    name: item.name,
    price: item.price,
    quantity: item.quantity,
    image: item.image,
  }));

  const totalPrice = items.reduce(
    (sum, i) => sum + i.price * i.quantity,
    0
  );

  const order = await Order.create({
    user,
    items,
    totalPrice,
    paymentMethod,
    shippingAddress,
  });

  cart.items = [];
  await cart.save();

  return order;
};

const getAllOrders = async () => {
  return await Order.find()
    .populate("user", "username email")
    .sort({ createdAt: -1 });
};

const getOrderById = async (id) => {
  return await Order.findById(id)
    .populate("user", "username email")
    .populate("items.product");
};
//  NEW: lấy đơn theo userId
const getOrdersByUserId = async (userId) => {
  return await Order.find({ user: userId })
    .populate("user", "username email") // 🔥 THÊM DÒNG NÀY
    .populate("items.product")
    .sort({ createdAt: -1 });
};


const updateOrderStatus = async (id, status) => {
  return await Order.findByIdAndUpdate(
    id,
    { status },
    { new: true }
  );
};

const deleteOrder = async (id) => {
  return await Order.findByIdAndDelete(id);
};

module.exports = {
  createOrder,
  getAllOrders,
  getOrderById,
  getOrdersByUserId, //  export
  updateOrderStatus,
  deleteOrder,
};
