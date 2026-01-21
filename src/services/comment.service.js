const Comment = require("../models/Comment.model");

/* ================= CREATE ================= */
const createComment = async ({ user, product, content, rating, images }) => {
  return await Comment.create({
    user,       // userId
    product,
    content,
    rating,
    images,
  });
};

/* ================= GET BY PRODUCT ================= */
const getByProduct = async (productId) => {
  return await Comment.find({ product: productId })
    .populate("user", "username email") // ✅ ĐÚNG FIELD
    .sort({ createdAt: -1 });
};

/* ================= GET ALL (ADMIN) ================= */
const getAll = async () => {
  return await Comment.find()
    .populate("user", "username email") // ✅
    .populate("product", "name price images")
    .sort({ createdAt: -1 });
};

/* ================= UPDATE ================= */
const updateComment = async (commentId, data) => {
  return await Comment.findByIdAndUpdate(
    commentId,
    {
      content: data.content,
      rating: data.rating,
      images: data.images,
    },
    { new: true }
  );
};

/* ================= DELETE ================= */
const deleteComment = async (commentId) => {
  return await Comment.findByIdAndDelete(commentId);
};

module.exports = {
  createComment,
  getByProduct,
  getAll,
  updateComment,
  deleteComment,
};
