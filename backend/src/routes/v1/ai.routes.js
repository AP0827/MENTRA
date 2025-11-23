const express = require("express");
const router = express.Router();
const aiController = require("../../controllers/ai.controller");

router.post("/rag", aiController.runRag);

router.get("/prompts", aiController.getPrompts);

router.post("/embed", aiController.embed);

module.exports = router;
