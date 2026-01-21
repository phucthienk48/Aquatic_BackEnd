const express = require("express");
const router = express.Router();
const contactController = require("../controllers/contact.controller");

/* ===== PUBLIC ===== */
router.post("/", contactController.createContact);

/* ===== ADMIN ===== */
router.get("/", contactController.getContacts);
router.put("/:id/status", contactController.updateStatus);
router.delete("/:id", contactController.deleteContact);

module.exports = router;
