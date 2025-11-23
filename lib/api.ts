// API client for Mentra backend
const API_URL = 'http://localhost:3001/api';

// Get user ID from extension storage or generate one
export async function getUserId(): Promise<string> {
  if (typeof window !== 'undefined' && (window as any).chrome?.storage) {
    return new Promise((resolve) => {
      (window as any).chrome.storage.local.get(['userId'], (result: any) => {
        resolve(result.userId || 'demo-user');
      });
    });
  }
  // Fallback for non-extension context
  if (typeof window !== 'undefined') {
    return localStorage.getItem('mentra_user_id') || 'demo-user';
  }
  return 'demo-user';
}

// Reflections API
export async function getReflections(userId: string) {
  try {
    const response = await fetch(`${API_URL}/reflections/${userId}`);
    if (!response.ok) throw new Error('Failed to fetch reflections');
    return await response.json();
  } catch (error) {
    console.error('Error fetching reflections:', error);
    return [];
  }
}

export async function saveReflection(userId: string, data: {
  website: string;
  reflection: string;
  aiResponse: string;
  helpful?: boolean | null;
  proceeded?: boolean;
}) {
  try {
    const response = await fetch(`${API_URL}/reflections`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ userId, ...data })
    });
    if (!response.ok) throw new Error('Failed to save reflection');
    return await response.json();
  } catch (error) {
    console.error('Error saving reflection:', error);
    throw error;
  }
}

// Stats API
export async function getStats(userId: string) {
  try {
    const response = await fetch(`${API_URL}/stats/${userId}`);
    if (!response.ok) throw new Error('Failed to fetch stats');
    return await response.json();
  } catch (error) {
    console.error('Error fetching stats:', error);
    return {
      focusTime: 0,
      distractions: 0,
      streak: 0,
      productivity: 0
    };
  }
}

export async function updateStats(userId: string, stats: {
  focusTime?: number;
  distractions?: number;
  streak?: number;
  productivity?: number;
}) {
  try {
    const response = await fetch(`${API_URL}/stats/${userId}`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(stats)
    });
    if (!response.ok) throw new Error('Failed to update stats');
    return await response.json();
  } catch (error) {
    console.error('Error updating stats:', error);
    throw error;
  }
}

// Settings API
export async function getSettings(userId: string) {
  try {
    const response = await fetch(`${API_URL}/settings/${userId}`);
    if (!response.ok) throw new Error('Failed to fetch settings');
    return await response.json();
  } catch (error) {
    console.error('Error fetching settings:', error);
    return {
      blockedSites: [],
      aiModel: 'gpt4',
      notifications: true,
      cloudSync: false
    };
  }
}

export async function updateSettings(userId: string, settings: {
  blockedSites?: string[];
  aiModel?: string;
  apiKey?: string;
  notifications?: boolean;
  cloudSync?: boolean;
}) {
  try {
    const response = await fetch(`${API_URL}/settings/${userId}`, {
      method: 'PUT',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(settings)
    });
    if (!response.ok) throw new Error('Failed to update settings');
    return await response.json();
  } catch (error) {
    console.error('Error updating settings:', error);
    throw error;
  }
}

// AI API
export async function getAIResponse(userId: string, reflection: string, website: string) {
  try {
    const response = await fetch(`${API_URL}/ai/response`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ userId, reflection, website })
    });
    if (!response.ok) throw new Error('Failed to get AI response');
    const data = await response.json();
    return data.response;
  } catch (error) {
    console.error('Error getting AI response:', error);
    return 'I understand. Take a moment to reflect on whether this is the best use of your time right now.';
  }
}
