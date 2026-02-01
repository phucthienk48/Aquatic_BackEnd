const express = require("express");
const router = express.Router();
const commentController = require("../controllers/comment.controller");

/* CREATE + UPDATE */
router.post("/", commentController.create);
router.put("/:id", commentController.update);
router.get("/all", commentController.getAllComment);

/* GET */
router.get("/my", commentController.getMyComment);
router.get("/product/:productId", commentController.getByProduct);
router.get("/", commentController.getAll);

/* DELETE */
router.delete("/:id", commentController.remove);

module.exports = router;
