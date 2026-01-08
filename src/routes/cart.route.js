// routes/cart.routes.js
const express = require("express");
const router = express.Router();
const cartController = require("../controllers/cart.controller");

// Thêm sản phẩm vào giỏ
router.post("/add", cartController.addToCart);

// Lấy giỏ hàng theo userId
router.get("/:userId", cartController.getCart);

// Cập nhật số lượng sản phẩm
router.put("/update", cartController.updateCart);

// ❗ Xóa 1 sản phẩm khỏi giỏ
router.delete("/remove/:userId/:productId", cartController.removeItem);

// ❗ Xóa toàn bộ giỏ hàng
router.delete("/clear/:userId", cartController.clearCart);

module.exports = router;
