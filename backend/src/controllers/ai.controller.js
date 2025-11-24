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

// Add the missing getResponse function
exports.getResponse = async (req, res) => {
  try {
    const { userId, reflection, website } = req.body;

    if (!userId || !reflection || !website) {
      return res.status(400).json({ error: 'Missing required fields: userId, reflection, website' });
    }

    // For now, we'll use the existing RAG service to generate a response
    // In a more complete implementation, this might be a simpler direct LLM call
    const result = await ragService.runRag(reflection, `What is your insight on this reflection about ${website}?`, [], {});

    return res.json({
      ok: true,
      response: result.suggestion
    });
  } catch (err) {
    console.error("getResponse error:", err);
    return res.status(500).json({ ok: false, error: err.message });
  }
};
