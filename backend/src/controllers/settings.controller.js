// In-memory storage (replace with database later)
const settings = new Map(); // userId -> settings object

// Default blocked sites
const DEFAULT_BLOCKED_SITES = [
  'youtube.com',
  'twitter.com',
  'instagram.com',
  'reddit.com',
  'facebook.com',
  'tiktok.com',
  'netflix.com',
  'twitch.tv'
];

exports.getSettings = async (req, res) => {
  try {
    const { userId } = req.params;

    if (!userId) {
      return res.status(400).json({ error: 'Missing userId' });
    }

    const userSettings = settings.get(userId) || {
      blockedSites: DEFAULT_BLOCKED_SITES,
      aiModel: 'gpt4',
      apiKey: null,
      notifications: true,
      cloudSync: false,
      lastUpdated: new Date().toISOString()
    };

    return res.json(userSettings);
  } catch (err) {
    console.error('getSettings error:', err);
    return res.status(500).json({ error: err.message });
  }
};

exports.updateSettings = async (req, res) => {
  try {
    const { userId } = req.params;
    const { blockedSites, aiModel, apiKey, notifications, cloudSync } = req.body;

    if (!userId) {
      return res.status(400).json({ error: 'Missing userId' });
    }

    const userSettings = settings.get(userId) || {
      blockedSites: DEFAULT_BLOCKED_SITES,
      aiModel: 'gpt4',
      apiKey: null,
      notifications: true,
      cloudSync: false
    };

    // Update settings
    if (blockedSites !== undefined) userSettings.blockedSites = blockedSites;
    if (aiModel !== undefined) userSettings.aiModel = aiModel;
    if (apiKey !== undefined) userSettings.apiKey = apiKey;
    if (notifications !== undefined) userSettings.notifications = notifications;
    if (cloudSync !== undefined) userSettings.cloudSync = cloudSync;

    userSettings.lastUpdated = new Date().toISOString();

    settings.set(userId, userSettings);

    return res.json({
      ok: true,
      settings: userSettings
    });
  } catch (err) {
    console.error('updateSettings error:', err);
    return res.status(500).json({ error: err.message });
  }
};

// Get default blocked sites
exports.getDefaultBlockedSites = (req, res) => {
  return res.json({
    ok: true,
    sites: DEFAULT_BLOCKED_SITES
  });
};
