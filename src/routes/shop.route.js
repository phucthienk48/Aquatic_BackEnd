const express = require("express");
const router = express.Router();
const shopController = require("../controllers/shop.controller");

// CRUD Shop
router.post("/", shopController.createShop);        // Thêm
router.get("/", shopController.getAllShops);        // Xem
router.get("/:id", shopController.getShopById);     // Chi tiết
router.put("/:id", shopController.updateShop);      // Sửa
router.delete("/:id", shopController.deleteShop);   // Xóa

module.exports = router;
