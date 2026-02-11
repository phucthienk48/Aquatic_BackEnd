const express = require("express");
const router = express.Router();
const LivestreamController = require("../controllers/livestream.controller");

// Danh sách phòng đang live
router.get("/live", LivestreamController.getLive);

// Chi tiết phòng
router.get("/:id", LivestreamController.getDetail);


// Lấy tất cả phòng (live + ended)
router.get("/", LivestreamController.getAll);

// Tạo phòng
router.post("/", LivestreamController.create);

// Cập nhật phòng
router.put("/:id", LivestreamController.update);

// Start livestream
router.put("/:id/start", LivestreamController.start);

// End livestream
router.put("/:id/end", LivestreamController.end);

// Xóa phòng (chỉ khi không live)
router.delete("/:id", LivestreamController.delete);

module.exports = router;
