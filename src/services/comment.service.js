const Comment = require("../models/Comment.model");

/* CREATE */
const createComment = async (data) => {
  return await Comment.create(data);
};

/* GET BY PRODUCT */
const getByProduct = async (productId) => {
  return await Comment.find({ product: productId })
    .populate("user", "username email")
    .sort({ createdAt: -1 });
};

/* GET ALL */
const getAll = async () => {
  return await Comment.find()
    .populate("user", "username email")
    .populate("product", "name price images")
    .populate("order", "_id")
    .sort({ createdAt: -1 });
};

/* GET MY COMMENT */
const getMyComment = async ({ user, product, order }) => {
  return await Comment.findOne({ user, product, order });
};

/* UPDATE */
const updateComment = async (id, data) => {
  return await Comment.findByIdAndUpdate(id, data, { new: true });
};

/* DELETE */
const deleteComment = async (id) => {
  return await Comment.findByIdAndDelete(id);
};

const getAllComment = async () => {
  return await Comment.find()
    .populate("user", "username email")
    .populate("product", "name price images")
    .populate("order", "status createdAt")
    .sort({ createdAt: -1 });
};


module.exports = {
  createComment,
  getByProduct,
  getAll,
  getAllComment,
  getMyComment,
  updateComment,
  deleteComment,
};
