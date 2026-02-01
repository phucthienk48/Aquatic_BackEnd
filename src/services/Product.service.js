const Product = require("../models/Product.model");

// Create
const createProduct = async (data) => {
  return await Product.create(data);
};

// Get all
const getAllProduct = async () => {
  return await Product.find().sort({ createdAt: -1 });
};

// Get by id
const getProductById = async (id) => {
  return await Product.findById(id);
};

// Update
const updateProduct = async (id, data) => {
  return await Product.findByIdAndUpdate(id, data, { new: true });
};

// Delete
const deleteProduct = async (id) => {
  return await Product.findByIdAndDelete(id);
};

// 🔍 SEARCH PRODUCT
const searchProduct = async (keyword) => {
  if (!keyword) return [];

  return await Product.find({
    name: { $regex: keyword, $options: "i" },
  })
    .select("name price oldprice images type")
    .sort({ createdAt: -1 })
    .limit(8);
};

module.exports = {
  createProduct,
  getAllProduct,
  getProductById,
  updateProduct,
  deleteProduct,
  searchProduct,
};
