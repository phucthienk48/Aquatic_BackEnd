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

module.exports = {
  createProduct,
  getAllProduct,
  getProductById,
  updateProduct,
  deleteProduct,
};
