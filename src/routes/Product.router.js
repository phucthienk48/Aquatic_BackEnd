const express = require("express");
const router = express.Router();
const ProductController = require("../controllers/Product.controller");

router.post("/", ProductController.createProduct);
router.get("/", ProductController.getAllProduct);
router.get("/:id", ProductController.getProductById);
router.put("/:id", ProductController.updateProduct);
router.delete("/:id", ProductController.deleteProduct);

module.exports = router;
