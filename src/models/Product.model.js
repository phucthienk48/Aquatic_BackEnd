const mongoose = require("mongoose");

const productSchema = new mongoose.Schema(
  {
    // ID riêng (ngoài _id mặc định của MongoDB)
    id: {
      type: String,
      required: true,
      unique: true,
      trim: true,
    },

    name: {
      type: String,
      required: true,
      trim: true,
    },

    // Loại sản phẩm: fish, medicine, equipment,...
    type: {
      type: String,
      required: true,
      enum: ["fish", "medicine", "equipment", "food", "other"],
    },

    species: {
      type: String,
      required: true,
    },

    price: {
      type: Number,
      required: true,
      min: 0,
    },
    
    oldprice: {
      type: Number,
      required: true,
      min: 0,
    },

    quantity: {
      type: Number,
      default: 0,
    },

    // Mô tả chi tiết sản phẩm
    description: {
      type: String,
    },

    // Hướng dẫn sử dụng / chăm sóc
    instruction: {
      type: String,
    },

    // Cách bảo quản
    storage: {
      type: String,
    },

    // Cảnh báo / lưu ý
    warning: {
      type: String,
    },

    images: {
      type: [String],
      default: [],
    },

    status: {
      type: String,
      enum: ["available", "out_of_stock"],
      default: "available",
    },
  },
  { timestamps: true }
);

module.exports = mongoose.model("Product", productSchema);
