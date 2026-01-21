const express = require("express");
const router = express.Router();
const commentController = require("../controllers/comment.controller");

router.post("/", commentController.create);
router.get("/product/:productId", commentController.getByProduct);
router.put("/:id", commentController.update);

router.get("/", commentController.getAll);
router.delete("/:id", commentController.removeByAdmin);


module.exports = router;
