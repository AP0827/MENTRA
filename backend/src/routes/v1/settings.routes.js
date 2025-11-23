const express = require("express");
const router = express.Router();
const settingsController = require("../../controllers/settings.controller");

// Get settings for a user
router.get("/:userId", settingsController.getSettings);

// Update settings for a user
router.put("/:userId", settingsController.updateSettings);

// Get default blocked sites
router.get("/defaults/blocked-sites", settingsController.getDefaultBlockedSites);

module.exports = router;
