const express = require("express");

const router = express.Router();

const controller = require(
  "../controllers/livestreamCamera.controller"
);

// start camera
router.post(
  "/start-camera",
  controller.startCamera
);

// stop camera
router.post(
  "/stop-camera",
  controller.stopCamera
);

// get chunks
router.get(
  "/chunks/:livestreamId",
  controller.getChunks
);

// get camera status
router.get(
  "/status/:livestreamId",
  controller.getStatus
);

// delete chunks
router.delete(
  "/chunks/:livestreamId",
  controller.deleteChunks
);

module.exports = router;