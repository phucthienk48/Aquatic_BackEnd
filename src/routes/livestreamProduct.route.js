const express = require("express");
const router = express.Router();
const controller = require("../controllers/livestreamProduct.controller");

router.get("/:livestreamId", controller.getLivestreamProducts);

router.post("/:livestreamId", controller.addProduct);

router.delete(
  "/:livestreamId/:productId",
  controller.removeProduct
);

router.put(
  "/:livestreamId/pin/:productId",
  controller.pinProduct
);


module.exports = router;
