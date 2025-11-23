/**
 * Extension Bridge - Interface for communicating with Chrome Extension
 * Provides fallback for when running outside extension context
 */

interface ChromeExtension {
  storage?: {
    local: {
      get(keys: string[]): Promise<any>;
      set(items: any): Promise<void>;
    };
  };
  runtime?: {
    sendMessage(message: any): Promise<any>;
  };
}

const isBrowser = typeof window !== 'undefined';
const hasChrome = isBrowser && typeof (window as any).chrome !== 'undefined';
const chromeExt = hasChrome ? (window as any).chrome as ChromeExtension : null;

/**
 * Get reflections from extension's IndexedDB
 */
async function getReflections(limit: number = 50): Promise<any[]> {
  if (!chromeExt?.runtime) {
    // Extension not available - using fallback
    return [];
  }

  try {
    const response = await chromeExt.runtime.sendMessage({
      type: 'GET_REFLECTIONS',
      limit
    });
    return response.reflections || [];
  } catch (error) {
    console.error('Error getting reflections from extension:', error);
    return [];
  }
}

/**
 * Get stats from extension's IndexedDB
 */
async function getStats(): Promise<any> {
  if (!chromeExt?.runtime) {
    return null;
  }

  try {
    const response = await chromeExt.runtime.sendMessage({
      type: 'GET_STATS'
    });
    return response.stats || null;
  } catch (error) {
    console.error('Error getting stats from extension:', error);
    return null;
  }
}

/**
 * Get settings from extension storage
 */
async function getSettings(): Promise<any> {
  if (!chromeExt?.storage?.local) {
    return null;
  }

  try {
    const result = await chromeExt.storage.local.get(['settings', 'blockedSites']);
    return result || null;
  } catch (error) {
    console.error('Error getting settings from extension:', error);
    return null;
  }
}

/**
 * Check if extension is available
 */
function isExtensionAvailable(): boolean {
  return !!chromeExt?.runtime;
}

/**
 * Get user ID from extension storage
 */
async function getUserId(): Promise<string | null> {
  if (!chromeExt?.storage?.local) {
    return null;
  }

  try {
    const result = await chromeExt.storage.local.get(['userId']);
    return result.userId || null;
  } catch (error) {
    console.error('Error getting userId from extension:', error);
    return null;
  }
}

const extensionBridge = {
  getReflections,
  getStats,
  getSettings,
  getUserId,
  isExtensionAvailable
};

export default extensionBridge;
