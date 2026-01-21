const commentService = require("../services/comment.service");

/* ===== CREATE COMMENT ===== */
exports.create = async (req, res) => {
  try {
    const { userId, productId, content, rating, images } = req.body;

    if (!userId || !productId || !content) {
      return res.status(400).json({
        message: "Thiếu userId, productId hoặc content",
      });
    }

    const comment = await commentService.createComment({
      user: userId,
      product: productId,
      content,
      rating: Number(rating) || 0,
      images: Array.isArray(images) ? images : [],
    });

    res.status(201).json(comment);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};

/* ===== GET COMMENT BY PRODUCT ===== */
exports.getByProduct = async (req, res) => {
  try {
    const { productId } = req.params;

    if (!productId) {
      return res
        .status(400)
        .json({ message: "Thiếu productId" });
    }

    const comments = await commentService.getByProduct(productId);
    res.json(comments);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};

/* ===== GET ALL COMMENTS (ADMIN PAGE) ===== */
exports.getAll = async (req, res) => {
  try {
    const comments = await commentService.getAll();
    res.json(comments);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};

/* ===== UPDATE COMMENT (USER) ===== */
exports.update = async (req, res) => {
  try {
    const { content, rating, images } = req.body;

    const comment = await commentService.updateComment(
      req.params.id,
      {
        content,
        rating: Number(rating) || 0,
        images: Array.isArray(images) ? images : [],
      }
    );

    if (!comment) {
      return res
        .status(404)
        .json({ message: "Không tìm thấy bình luận" });
    }

    res.json(comment);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};

/* ===== DELETE COMMENT ===== */
exports.removeByAdmin = async (req, res) => {
  try {
    const deleted = await commentService.deleteComment(
      req.params.id
    );

    if (!deleted) {
      return res
        .status(404)
        .json({ message: "Không tìm thấy bình luận" });
    }

    res.json({ message: "Đã xóa bình luận" });
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};
