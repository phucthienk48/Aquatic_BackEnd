const mongoose = require("mongoose");

const orderItemSchema = new mongoose.Schema({
  product: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "Product",
    required: true,
  },
  name: String,
  image: String,
  price: Number,
  quantity: {
    type: Number,
    required: true,
    min: 1,
  },
});

const orderSchema = new mongoose.Schema(
  {
    user: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      required: true,
    },

    items: [orderItemSchema],

    totalPrice: {
      type: Number,
      required: true,
    },

    status: {
      type: String,
      enum: [
        "chờ xử lý",
        "đã xác nhận",
        "đang giao hàng",
        "hoàn thành",
        "đã hủy",
      ],
      default: "chờ xử lý",
    },

    paymentMethod: {
      type: String,
      enum: ["cod", "vietqr", "momo"],
      default: "cod",
    },

    shippingAddress: {
      fullName: String,
      phone: String,
      address: String,
      note: String,
    },
  },
  { timestamps: true }
);

module.exports =
  mongoose.models.Order || mongoose.model("Order", orderSchema);

