const express = require("express");
const router = express.Router();
const reflectionsController = require("../../controllers/reflections.controller");

// Save a new reflection
router.post("/", reflectionsController.saveReflection);

// Get reflections for a user
router.get("/:userId", reflectionsController.getReflections);

// Update a reflection (helpful/proceeded)
router.patch("/:userId/:reflectionId", reflectionsController.updateReflection);

module.exports = router;
