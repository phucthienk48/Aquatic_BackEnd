const express = require("express");
const router = express.Router();
const upload = require("../middlewares/upload");

router.post("/", upload.single("image"), (req, res) => {
  if (!req.file) {
    return res.status(400).json({
      message: "Không có file được upload. Kiểm tra key = image",
    });
  }

  res.json({
    url: req.file.path,
    public_id: req.file.filename,
  });
});

module.exports = router;
