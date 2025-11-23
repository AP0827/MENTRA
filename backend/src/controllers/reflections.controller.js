// In-memory storage (replace with database later)
const reflections = new Map(); // userId -> array of reflections

exports.saveReflection = async (req, res) => {
  try {
    const { userId, website, reflection, aiResponse, helpful, proceeded } = req.body;

    if (!userId || !website || !reflection) {
      return res.status(400).json({ error: 'Missing required fields' });
    }

    const reflectionData = {
      id: Date.now().toString(),
      userId,
      website,
      reflection,
      aiResponse: aiResponse || '',
      helpful: helpful !== undefined ? helpful : null,
      proceeded: proceeded || false,
      timestamp: new Date().toISOString(),
      createdAt: new Date().toISOString()
    };

    if (!reflections.has(userId)) {
      reflections.set(userId, []);
    }

    reflections.get(userId).push(reflectionData);

    return res.json({
      ok: true,
      reflection: reflectionData
    });
  } catch (err) {
    console.error('saveReflection error:', err);
    return res.status(500).json({ error: err.message });
  }
};

exports.getReflections = async (req, res) => {
  try {
    const { userId } = req.params;
    const limit = parseInt(req.query.limit) || 50;

    if (!userId) {
      return res.status(400).json({ error: 'Missing userId' });
    }

    const userReflections = reflections.get(userId) || [];
    
    // Sort by timestamp descending and limit
    const sorted = userReflections
      .sort((a, b) => new Date(b.timestamp).getTime() - new Date(a.timestamp).getTime())
      .slice(0, limit);

    return res.json(sorted);
  } catch (err) {
    console.error('getReflections error:', err);
    return res.status(500).json({ error: err.message });
  }
};

exports.updateReflection = async (req, res) => {
  try {
    const { userId, reflectionId } = req.params;
    const { helpful, proceeded } = req.body;

    if (!userId || !reflectionId) {
      return res.status(400).json({ error: 'Missing userId or reflectionId' });
    }

    const userReflections = reflections.get(userId);
    if (!userReflections) {
      return res.status(404).json({ error: 'User not found' });
    }

    const reflection = userReflections.find(r => r.id === reflectionId);
    if (!reflection) {
      return res.status(404).json({ error: 'Reflection not found' });
    }

    if (helpful !== undefined) reflection.helpful = helpful;
    if (proceeded !== undefined) reflection.proceeded = proceeded;

    return res.json({
      ok: true,
      reflection
    });
  } catch (err) {
    console.error('updateReflection error:', err);
    return res.status(500).json({ error: err.message });
  }
};
