// Background Service Worker - Mentra with IndexedDB & Warm Start
// Integrates with backend API and local IndexedDB storage

const API_URL = 'http://localhost:3001/api';
let currentUserId = null;

// Import storage manager (try-catch for module compatibility)
try {
  importScripts('storage-manager.js');
} catch (e) {
  // Storage manager will be loaded dynamically
}

// Blocked websites list (dynamically loaded from backend)
let blockedSites = [];

// Warm start tracking
let dailyDistractionCount = 0;
let warmStartActive = true;
const WARM_START_THRESHOLD = 2; // Gentle toast for first 2 distractions
let lastResetDate = new Date().toDateString();

// Reflection prompts (dynamically loaded from backend)
let REFLECTION_PROMPTS = [
  "What brings you here right now?",
  "Is this intentional, or a drift?",
  "What do you truly need in this moment?"
];

// Initialize extension
chrome.runtime.onInstalled.addListener(async (details) => {
  
  // Initialize storage manager
  if (typeof storageManager !== 'undefined') {
    await storageManager.init();
  }
  
  // Get or create user ID
  const result = await chrome.storage.local.get(['userId']);
  if (!result.userId) {
    currentUserId = crypto.randomUUID();
    await chrome.storage.local.set({ userId: currentUserId });
    
    // Register user with backend
    try {
      await fetch(`${API_URL}/auth/register`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          email: `user-${currentUserId}@mentra.local`,
          password: currentUserId,
          name: 'Mentra User'
        })
      });
    } catch (error) {
      console.error('Failed to register user:', error);
    }
  } else {
    currentUserId = result.userId;
  }
  
  // Load warm start state
  const warmState = await chrome.storage.local.get(['dailyDistractionCount', 'lastResetDate']);
  if (warmState.lastResetDate === new Date().toDateString()) {
    dailyDistractionCount = warmState.dailyDistractionCount || 0;
  } else {
    // New day - reset
    dailyDistractionCount = 0;
    warmStartActive = true;
  }
  
  // Load settings from backend
  await loadSettings();
  
  // Schedule daily cleanup
  scheduleDailyCleanup();
});

// Load settings and prompts from backend
async function loadSettings() {
  try {
    // Load settings from backend
    const settingsResponse = await fetch(`${API_URL}/settings/${currentUserId}`);
    if (settingsResponse.ok) {
      const settings = await settingsResponse.json();
      blockedSites = settings.blockedSites || [];
      await chrome.storage.local.set({ blockedSites, settings });
      // Settings loaded from backend
    } else {
      // Fallback: load defaults from backend
      const defaultsResponse = await fetch(`${API_URL}/settings/defaults/blocked-sites`);
      if (defaultsResponse.ok) {
        const { sites } = await defaultsResponse.json();
        blockedSites = sites;
        // Loaded default blocked sites
      }
    }

    // Load reflection prompts from backend
    const promptsResponse = await fetch(`${API_URL}/prompts?id=reflection_v1`);
    if (promptsResponse.ok) {
      const { prompt } = await promptsResponse.json();
      if (prompt && prompt.template) {
        // Extract prompts from template or use default questions
        REFLECTION_PROMPTS = [
          "What brings you here right now?",
          "Is this intentional, or a drift?",
          "What's one thing you wanted to finish before this?",
          "Would a 2-minute reset help you more right now?",
          "How are you really feeling at this moment?",
          "What would Future You thank Present You for doing?",
          "Is this aligned with your goals today?",
          "Could this wait until later?",
          "What are you avoiding right now?",
          "Will this help you feel better, or just distract?",
          "What do you truly need in this moment?"
        ];
        // Loaded reflection prompts
      }
    }
  } catch (error) {
    console.error('Failed to load settings from backend:', error);
    // Use hardcoded fallbacks if all else fails
    blockedSites = [
      'youtube.com',
      'twitter.com',
      'instagram.com',
      'reddit.com',
      'facebook.com',
      'tiktok.com',
      'netflix.com',
      'twitch.tv'
    ];
    REFLECTION_PROMPTS = [
      "What brings you here right now?",
      "What do you truly need in this moment?"
    ];
  }
  
  // Also load from IndexedDB if available (for offline use)
  if (typeof storageManager !== 'undefined') {
    const localSettings = await storageManager.getSetting('blockedSites');
    if (localSettings && localSettings.length > 0) {
      blockedSites = localSettings;
    }
  }
}

// Load user ID and state on startup
chrome.storage.local.get(['userId', 'dailyDistractionCount', 'lastResetDate']).then(result => {
  currentUserId = result.userId;
  
  if (result.lastResetDate === new Date().toDateString()) {
    dailyDistractionCount = result.dailyDistractionCount || 0;
  } else {
    dailyDistractionCount = 0;
    warmStartActive = true;
  }
  
  if (currentUserId) {
    loadSettings();
  }
});

// Listen for storage changes
chrome.storage.onChanged.addListener((changes, namespace) => {
  if (changes.blockedSites) {
    blockedSites = changes.blockedSites.newValue;
  }
});

// Monitor navigation and check for blocked sites
// Use onCompleted instead of onBeforeNavigate to ensure content script is loaded
chrome.webNavigation.onCompleted.addListener(async (details) => {
  if (details.frameId !== 0) return; // Only main frame
  
  try {
    const url = new URL(details.url);
    const hostname = url.hostname.replace('www.', '');
    
    // Check if site is blocked
    const isBlocked = blockedSites.some(site => hostname.includes(site));
    
    if (isBlocked) {
      // Blocked site detected
      
      // Check whitelist first
      const isWhitelisted = await checkWhitelist(hostname);
      if (isWhitelisted) {
        // Site is whitelisted
        return;
      }
      
      dailyDistractionCount++;
      await chrome.storage.local.set({ 
        dailyDistractionCount, 
        lastResetDate: new Date().toDateString() 
      });
      
      // Warm start - gentle toast for first N distractions
      if (warmStartActive && dailyDistractionCount <= WARM_START_THRESHOLD) {
        // Show gentle toast notification instead of blocking
        chrome.notifications.create({
          type: 'basic',
          iconUrl: chrome.runtime.getURL('icons/icon128.png'),
          title: '🌿 Mentra is active',
          message: "We'll help you stay intentional today.",
          priority: 0,
          silent: true
        });
        
        // Track warm start impression
        if (typeof storageManager !== 'undefined') {
          await storageManager.saveReflection({
            userId: currentUserId,
            domain: hostname,
            website: url.href,
            prompt: 'Warm start notification',
            quickResponse: 'warm_start',
            timestamp: Date.now()
          });
        }
        
        return; // Let them through
      }
      
      // After warm start, normal blocking behavior
      warmStartActive = false;
      
      // Get random prompt for variety (with fallback)
      const promptIndex = Math.floor(Math.random() * REFLECTION_PROMPTS.length);
      const prompt = REFLECTION_PROMPTS[promptIndex] || "What brings you here right now?";
      
      // Wait for page and content script to be ready, then send message
      // Use retry logic since content scripts may take time to initialize
      let retries = 5;
      let delay = 200;
      let success = false;
      
      while (retries > 0 && !success) {
        try {
          await new Promise(resolve => setTimeout(resolve, delay));
          
          const response = await chrome.tabs.sendMessage(details.tabId, {
            type: 'SHOW_REFLECTION_MODAL',
            website: url.href,
            url: details.url,
            prompt: prompt,
            count: dailyDistractionCount
          });
          
          // Modal displayed successfully
          success = true;
        } catch (error) {
          retries--;
          delay = 300; // Increase delay for subsequent retries
          
          if (retries === 0) {
            console.error('❌ Failed to send message after all retries:', error);
          } else {
            // Retrying...
          }
        }
      }
      
      // Update distraction count in backend and IndexedDB
      updateStats({ distractions: 1 }).catch(err => {
        // Stats update failed (non-critical)
      });
    }
  } catch (error) {
    console.error('Error in navigation listener:', error);
  }
});

// Check if domain is whitelisted
async function checkWhitelist(domain) {
  if (typeof storageManager === 'undefined') return false;
  
  try {
    const rules = await storageManager.getActiveWhitelistRules(domain);
    return rules && rules.length > 0;
  } catch (error) {
    console.error('Error checking whitelist:', error);
    return false;
  }
}

// Handle messages from content scripts and popup
chrome.runtime.onMessage.addListener((message, sender, sendResponse) => {
  // Message received
  
  switch (message.type) {
    case 'SAVE_REFLECTION':
      saveReflection(message.data)
        .then(() => sendResponse({ success: true }))
        .catch(error => sendResponse({ success: false, error: error.message }));
      return true;
      
    case 'GET_AI_RESPONSE':
      getAIResponse(message.reflection, message.website, message.prompt)
        .then(response => sendResponse({ response }))
        .catch(error => sendResponse({ error: error.message }));
      return true;
      
    case 'UPDATE_STATS':
      updateStats(message.stats)
        .then(() => sendResponse({ success: true }))
        .catch(error => sendResponse({ success: false, error: error.message }));
      return true;
      
    case 'WHITELIST_ADD':
      addWhitelistRule(message.rule)
        .then(() => sendResponse({ success: true }))
        .catch(error => sendResponse({ success: false, error: error.message }));
      return true;
      
    case 'FEEDBACK':
      handleFeedback(message.helpful)
        .then(() => sendResponse({ success: true }))
        .catch(error => sendResponse({ success: false, error: error.message }));
      return true;
      
    case 'GET_BLOCKED_SITES':
      sendResponse({ sites: blockedSites });
      break;
      
    case 'GET_USER_ID':
      sendResponse({ userId: currentUserId });
      break;
      
    case 'GET_REFLECTIONS':
      getReflections(message.limit)
        .then(reflections => sendResponse({ reflections }))
        .catch(error => sendResponse({ error: error.message }));
      return true;
      
    case 'GET_STATS':
      chrome.storage.local.get(['stats'], (result) => {
        sendResponse({ stats: result.stats || null });
      });
      return true;
      
    case 'GET_SETTINGS':
      chrome.storage.local.get(['settings'], (result) => {
        sendResponse({ settings: result.settings || null });
      });
      return true;
      
    case 'UPDATE_SETTINGS':
      chrome.storage.local.set({ settings: message.settings }, () => {
        // Reload blocked sites if they changed
        if (message.settings.blockedSites) {
          blockedSites = message.settings.blockedSites;
        }
        sendResponse({ success: true });
      });
      return true;
      
    default:
      sendResponse({ error: 'Unknown message type' });
  }
});

// Save reflection to both backend and IndexedDB
async function saveReflection(data) {
  const domain = new URL(data.website).hostname.replace('www.', '');
  
  // Save to IndexedDB
  if (typeof storageManager !== 'undefined') {
    try {
      await storageManager.saveReflection({
        userId: currentUserId,
        domain: domain,
        website: data.website,
        prompt: data.prompt,
        quickResponse: data.quickResponse,
        freeText: data.freeText,
        timestamp: Date.now()
      });
    } catch (error) {
      console.error('Failed to save to IndexedDB:', error);
    }
  }
  
  // Save to backend
  try {
    const response = await fetch(`${API_URL}/reflections`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        userId: currentUserId,
        website: data.website,
        reflection: data.reflection || data.quickResponse,
        aiResponse: data.aiResponse,
        helpful: data.helpful || null,
        proceeded: data.proceeded || false
      })
    });
    
    if (!response.ok) {
      throw new Error('Failed to save reflection to backend');
    }
    
    const result = await response.json();
    // Reflection saved to backend
    return result;
  } catch (error) {
    console.error('Error saving reflection to backend:', error);
  }
}

// Get AI response from backend using RAG (Retrieval-Augmented Generation)
async function getAIResponse(reflection, website, prompt) {
  try {
    // Step 1: Generate embedding for current reflection
    const embeddingResponse = await fetch(`${API_URL}/ai/embed`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        text: reflection
      })
    });
    
    if (!embeddingResponse.ok) {
      const errorText = await embeddingResponse.text();
      console.error('Embedding error:', errorText);
      throw new Error(`Failed to generate embedding: ${embeddingResponse.status}`);
    }
    
    const { embedding } = await embeddingResponse.json();
    
    // Step 2: Retrieve similar past reflections from IndexedDB
    let memories = [];
    if (typeof storageManager !== 'undefined') {
      try {
        // Get similar reflections using cosine similarity
        const similarReflections = await storageManager.findSimilarReflections(
          embedding,
          5 // Get top 5 similar reflections
        );
        
        // Format memories for RAG
        memories = similarReflections
          .filter(r => r.freeText || r.quickResponse)
          .map(r => {
            const text = r.freeText || r.quickResponse;
            const date = new Date(r.timestamp).toLocaleDateString();
            return `[${date}] ${text} (visiting ${r.domain})`;
          });
        
        // Retrieved similar memories for context
      } catch (error) {
        // Could not retrieve memories
      }
    }
    
    // Step 3: Use RAG to generate personalized coaching
    const ragResponse = await fetch(`${API_URL}/ai/rag`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        text: reflection,
        question: prompt,
        memories: memories,
        options: {
          model: 'gpt-4o-mini',
          temperature: 0.7,
          maxTokens: 150
        }
      })
    });
    
    if (!ragResponse.ok) {
      const errorText = await ragResponse.text();
      console.error('RAG error:', errorText);
      throw new Error(`Failed to get RAG response: ${ragResponse.status}`);
    }
    
    const ragData = await ragResponse.json();
    
    // Step 4: Save embedding to IndexedDB for future similarity search
    if (typeof storageManager !== 'undefined' && embedding) {
      try {
        const domain = new URL(website).hostname.replace('www.', '');
        await storageManager.saveEmbedding({
          userId: currentUserId,
          domain: domain,
          embedding: embedding,
          timestamp: Date.now()
        });
      } catch (error) {
        // Could not save embedding
      }
    }
    
    return ragData.suggestion;
  } catch (error) {
    console.error('Error getting AI response:', error.message);
    
    // Fallback to gentle local responses
    const domain = new URL(website).hostname.replace('www.', '');
    const responses = [
      `I hear you. Before visiting ${domain}, take a breath. What do you truly need right now?`,
      `It's okay to take breaks. Consider: will ${domain} give you the rest you're seeking?`,
      `Your awareness is the first step. What if you set a mindful time limit for ${domain}?`,
      `Interesting that you're drawn to ${domain}. What feeling are you hoping to find there?`,
      `Take this moment to check in with yourself. Is ${domain} aligned with your intentions?`,
      `Sometimes we seek distraction when we need something else. What might that be?`
    ];
    return responses[Math.floor(Math.random() * responses.length)];
  }
}

// Update statistics in backend and IndexedDB
async function updateStats(newStats) {
  // Update in backend
  try {
    const response = await fetch(`${API_URL}/stats/${currentUserId}`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(newStats)
    });
    
    if (!response.ok) {
      throw new Error('Failed to update stats');
    }
    
    const stats = await response.json();
    await chrome.storage.local.set({ stats });
    return stats;
  } catch (error) {
    console.error('Error updating stats:', error);
    // Fallback to local storage
    const result = await chrome.storage.local.get(['stats']);
    const stats = { ...result.stats, ...newStats };
    await chrome.storage.local.set({ stats });
  }
  
  // Save to IndexedDB analytics
  if (typeof storageManager !== 'undefined') {
    try {
      const today = new Date().toISOString().split('T')[0];
      const existing = await storageManager.getAnalytics(today, today);
      
      const analytics = existing.length > 0 ? existing[0] : {
        date: today,
        distractionCount: 0,
        focusTime: 0,
        reflectionCount: 0
      };
      
      if (newStats.distractions) analytics.distractionCount += newStats.distractions;
      if (newStats.focusTime) analytics.focusTime += newStats.focusTime;
      if (newStats.reflections) analytics.reflectionCount += newStats.reflections;
      
      await storageManager.saveAnalytics(analytics);
    } catch (error) {
      console.error('Failed to save analytics to IndexedDB:', error);
    }
  }
}

// Add whitelist rule to IndexedDB
async function addWhitelistRule(rule) {
  if (typeof storageManager === 'undefined') {
    throw new Error('Storage manager not available');
  }
  
  try {
    await storageManager.saveWhitelistRule(rule);
    // Whitelist rule added
  } catch (error) {
    console.error('Failed to add whitelist rule:', error);
    throw error;
  }
}

// Handle user feedback
async function handleFeedback(helpful) {
  // User feedback recorded
  // Could send to backend for analytics
}

// Get reflections from IndexedDB
async function getReflections(limit = 50) {
  if (typeof storageManager === 'undefined') {
    return [];
  }
  
  try {
    const reflections = await storageManager.getLastReflections(limit);
    return reflections;
  } catch (error) {
    console.error('Failed to get reflections:', error);
    return [];
  }
}

// Schedule daily cleanup of expired whitelist rules
function scheduleDailyCleanup() {
  chrome.alarms.create('dailyCleanup', { periodInMinutes: 60 }); // Every hour
}

chrome.alarms.onAlarm.addListener(async (alarm) => {
  if (alarm.name === 'dailyCleanup') {
    if (typeof storageManager !== 'undefined') {
      try {
        await storageManager.cleanupExpiredRules();
        // Cleaned up expired whitelist rules
      } catch (error) {
        console.error('Failed to cleanup whitelist rules:', error);
      }
    }
  }
});

// Daily reset alarm
chrome.alarms.create('dailyReset', { periodInMinutes: 1440 }); // 24 hours

chrome.alarms.onAlarm.addListener(async (alarm) => {
  if (alarm.name === 'dailyReset') {
    // Reset warm start
    warmStartActive = true;
    dailyDistractionCount = 0;
    await chrome.storage.local.set({ 
      dailyDistractionCount: 0,
      lastResetDate: new Date().toDateString()
    });
    
    try {
      // Get current stats from backend
      const response = await fetch(`${API_URL}/stats/${currentUserId}`);
      const stats = await response.json();
      
      // Reset daily stats
      await updateStats({
        focusTime: 0,
        distractions: 0,
        streak: (stats.distractions > 0 || stats.focusTime > 0) ? stats.streak + 1 : stats.streak
      });
    } catch (error) {
      console.error('Error in daily reset:', error);
    }
  }
});

// Track focus time (when user is NOT on blocked sites)
let focusStartTime = null;
let currentTabId = null;

chrome.tabs.onActivated.addListener((activeInfo) => {
  checkCurrentTab(activeInfo.tabId);
});

chrome.tabs.onUpdated.addListener((tabId, changeInfo, tab) => {
  if (changeInfo.status === 'complete') {
    checkCurrentTab(tabId);
  }
});

async function checkCurrentTab(tabId) {
  try {
    const tab = await chrome.tabs.get(tabId);
    if (!tab.url) return;
    
    const url = new URL(tab.url);
    const hostname = url.hostname.replace('www.', '');
    const isBlocked = blockedSites.some(site => hostname.includes(site));
    
    if (isBlocked) {
      // Stop focus timer
      if (focusStartTime) {
        const focusTime = Date.now() - focusStartTime;
        await updateFocusTime(focusTime);
        focusStartTime = null;
      }
    } else if (!focusStartTime && !url.protocol.startsWith('chrome')) {
      // Start focus timer (only for actual websites)
      focusStartTime = Date.now();
      currentTabId = tabId;
    }
  } catch (error) {
    // Tab might be closed or invalid URL
    console.error('Error checking current tab:', error);
  }
}

async function updateFocusTime(milliseconds) {
  const minutes = Math.floor(milliseconds / 60000);
  if (minutes > 0) {
    await updateStats({ focusTime: minutes });
  }
}
