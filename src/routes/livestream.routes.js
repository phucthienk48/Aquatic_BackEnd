const router = require("express").Router();
const ctrl = require("../controllers/livestream.controller");

router.post("/", ctrl.createRoom);
router.get("/", ctrl.getAllRooms);
router.get("/:id", ctrl.getRoomDetail);

router.put("/:id/start", ctrl.startLive);
router.put("/:id/end", ctrl.endLive);

router.post("/:id/pin-product", ctrl.pinProduct);

module.exports = router;
