const express = require("express");
const router = express.Router();
const orderController = require("../controllers/order.controller");

// Tạo đơn hàng
router.post("/", orderController.createOrder);

// Lấy tất cả đơn hàng (admin)
router.get("/", orderController.getAllOrders);

// Lấy chi tiết đơn hàng
router.get("/:id", orderController.getOrderById);

router.get("/user/:userId", orderController.getOrdersByUserId);

// Cập nhật trạng thái đơn hàng
router.put("/:id/status", orderController.updateOrderStatus);

// Xóa đơn hàng
router.delete("/:id", orderController.deleteOrder);

module.exports = router;
