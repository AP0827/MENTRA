const express = require("express");
const router = express.Router();
const statsController = require("../../controllers/stats.controller");

// Get stats for a user
router.get("/:userId", statsController.getStats);

// Update stats for a user
router.post("/:userId", statsController.updateStats);

module.exports = router;
