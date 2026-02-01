const commentService = require("../services/comment.service");
const Order = require("../models/order.model");
const Comment = require("../models/Comment.model");


/* ===== CREATE ===== */
exports.create = async (req, res) => {
  try {
    const { user, product, order, content, rating, images } = req.body;

    if (!user || !product || !order || !content) {
      return res.status(400).json({
        message: "Thiếu user, product, order hoặc content",
      });
    }

    /* chỉ cho comment khi đơn hoàn thành */
    const foundOrder = await Order.findOne({
      _id: order,
      user,
      status: "hoàn thành",
    });

    if (!foundOrder) {
      return res.status(403).json({
        message: "Chỉ được đánh giá khi đơn hàng hoàn thành",
      });
    }

    const comment = await commentService.createComment({
      user,
      product,
      order,
      content,
      rating: Number(rating) || 5,
      images: Array.isArray(images) ? images : [],
    });

    res.status(201).json(comment);
  } catch (err) {
    if (err.code === 11000) {
      return res.status(400).json({
        message: "Bạn đã đánh giá sản phẩm này trong đơn hàng này rồi",
      });
    }
    res.status(500).json({ message: err.message });
  }
};

/* ===== GET BY PRODUCT ===== */
exports.getByProduct = async (req, res) => {
  try {
    const comments = await commentService.getByProduct(
      req.params.productId
    );
    res.json(comments);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};

/* ===== GET MY COMMENT ===== */
exports.getMyComment = async (req, res) => {
  try {
    const { user, product, order } = req.query;

    if (!user || !product || !order) {
      return res.status(400).json({ message: "Thiếu tham số" });
    }

    const comment = await commentService.getMyComment({
      user,
      product,
      order,
    });

    res.json(comment || null);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};



/* ===== UPDATE ===== */
exports.update = async (req, res) => {
  try {
    const comment = await commentService.updateComment(
      req.params.id,
      {
        content: req.body.content,
        rating: Number(req.body.rating) || 5,
        images: Array.isArray(req.body.images)
          ? req.body.images
          : [],
      }
    );

    if (!comment) {
      return res.status(404).json({
        message: "Không tìm thấy bình luận",
      });
    }

    res.json(comment);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};

/* ===== DELETE ===== */
exports.remove = async (req, res) => {
  try {
    const deleted = await commentService.deleteComment(
      req.params.id
    );

    if (!deleted) {
      return res.status(404).json({
        message: "Không tìm thấy bình luận",
      });
    }

    res.json({ message: "Đã xóa bình luận" });
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};

/* ===== GET ALL ===== */
exports.getAll = async (req, res) => {
  const products = await Product.find();

  const productIds = products.map(p => p._id);

  const ratings = await Comment.aggregate([
    { $match: { product: { $in: productIds } } },
    {
      $group: {
        _id: "$product",
        avgRating: { $avg: "$rating" },
        count: { $sum: 1 }
      }
    }
  ]);

  const ratingMap = {};
  ratings.forEach(r => {
    ratingMap[r._id.toString()] = r;
  });

  const result = products.map(p => ({
    ...p.toObject(),
    ratingAvg: ratingMap[p._id]?.avgRating || 0,
    ratingCount: ratingMap[p._id]?.count || 0
  }));

  res.json(result);
};
/* ===== GET ALL COMMENT (ADMIN) ===== */
exports.getAllComment = async (req, res) => {
  try {
    const comments = await Comment.find()
      .populate("user", "name email")
      .populate("product", "name price")
      .populate("order", "status createdAt")
      .sort({ createdAt: -1 });

    res.json(comments);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};

