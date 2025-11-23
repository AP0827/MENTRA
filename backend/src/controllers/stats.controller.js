// In-memory storage (replace with database later)
const stats = new Map(); // userId -> stats object

exports.getStats = async (req, res) => {
  try {
    const { userId } = req.params;

    if (!userId) {
      return res.status(400).json({ error: 'Missing userId' });
    }

    const userStats = stats.get(userId) || {
      focusTime: 0,
      distractions: 0,
      streak: 0,
      productivity: 0,
      lastUpdated: new Date().toISOString()
    };

    return res.json(userStats);
  } catch (err) {
    console.error('getStats error:', err);
    return res.status(500).json({ error: err.message });
  }
};

exports.updateStats = async (req, res) => {
  try {
    const { userId } = req.params;
    const { focusTime, distractions, streak, productivity } = req.body;

    if (!userId) {
      return res.status(400).json({ error: 'Missing userId' });
    }

    const userStats = stats.get(userId) || {
      focusTime: 0,
      distractions: 0,
      streak: 0,
      productivity: 0
    };

    // Update stats
    if (focusTime !== undefined) userStats.focusTime += focusTime;
    if (distractions !== undefined) userStats.distractions += distractions;
    if (streak !== undefined) userStats.streak = streak;
    if (productivity !== undefined) userStats.productivity = productivity;

    userStats.lastUpdated = new Date().toISOString();

    stats.set(userId, userStats);

    return res.json({
      ok: true,
      stats: userStats
    });
  } catch (err) {
    console.error('updateStats error:', err);
    return res.status(500).json({ error: err.message });
  }
};
