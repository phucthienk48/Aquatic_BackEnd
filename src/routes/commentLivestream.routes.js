const express = require("express");
const router = express.Router();

const CommentLivestreamController = require(
  "../controllers/commentLivestream.controller"
);

// tạo comment
router.post("/", CommentLivestreamController.create);

// lấy comment theo livestream
router.get(
  "/livestream/:livestreamId",
  CommentLivestreamController.getByLivestream
);

// xóa 1 comment
router.delete("/:id", CommentLivestreamController.delete);

module.exports = router;
