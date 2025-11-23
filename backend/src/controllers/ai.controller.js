const ragService = require('../services/ai/rag.service');
const { PromptManager } = require('../services/ai/promptmanager');
const embeddingService = require('../services/ai/embedding.service');

// Initialize PromptManager instance
const promptManager = new PromptManager();

exports.runRag = async (req, res) => {
  try {
    const { text, question, memories = [], options = {} } = req.body;

    if (!text || typeof text !== "string") {
      return res.status(400).json({ error: "Missing 'text' in request body" });
    }

    const result = await ragService.runRag(text, question, memories, options);

    return res.json({
      ok: true,
      suggestion: result.suggestion,
      metadata: result.metadata
    });
  } catch (err) {
    console.error("runRag error:", err);
    return res.status(500).json({ ok: false, error: err.message });
  }
};

exports.getPrompts = (req, res) => {
  const { id } = req.query;
  const promptId = id || "reflection_v1";
  const prompt = promptManager.getPrompt(promptId);
  
  if (!prompt) {
    return res.status(404).json({ ok: false, error: "Prompt not found" });
  }
  
  return res.json({ ok: true, prompt });
};

exports.embed = async (req, res) => {
  try {
    const { text } = req.body;

    if (!text || typeof text !== "string") {
      return res.status(400).json({ error: "Missing 'text' in request body" });
    }

    const embedding = await embeddingService.generateEmbedding(text);
    return res.json({ ok: true, embedding });
  } catch (err) {
    console.error("embed error:", err);
    return res.status(500).json({ ok: false, error: err.message });
  }
};
