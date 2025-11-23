/**
 * IndexedDB Storage Manager for Mentra Extension
 * Handles reflections, embeddings, whitelist rules, and analytics
 */

const DB_NAME = 'MentraDB';
const DB_VERSION = 1;

// Store names
const STORES = {
  REFLECTIONS: 'reflections',
  EMBEDDINGS: 'embeddings',
  WHITELIST: 'whitelist',
  ANALYTICS: 'analytics',
  SETTINGS: 'settings'
};

class StorageManager {
  constructor() {
    this.db = null;
  }

  /**
   * Initialize the database and create object stores
   */
  async init() {
    return new Promise((resolve, reject) => {
      const request = indexedDB.open(DB_NAME, DB_VERSION);

      request.onerror = () => reject(request.error);
      request.onsuccess = () => {
        this.db = request.result;
        resolve(this.db);
      };

      request.onupgradeneeded = (event) => {
        const db = event.target.result;

        // Reflections store
        if (!db.objectStoreNames.contains(STORES.REFLECTIONS)) {
          const reflectionStore = db.createObjectStore(STORES.REFLECTIONS, { 
            keyPath: 'id', 
            autoIncrement: true 
          });
          reflectionStore.createIndex('timestamp', 'timestamp', { unique: false });
          reflectionStore.createIndex('domain', 'domain', { unique: false });
          reflectionStore.createIndex('userId', 'userId', { unique: false });
        }

        // Embeddings store
        if (!db.objectStoreNames.contains(STORES.EMBEDDINGS)) {
          const embeddingStore = db.createObjectStore(STORES.EMBEDDINGS, { 
            keyPath: 'id', 
            autoIncrement: true 
          });
          embeddingStore.createIndex('reflectionId', 'reflectionId', { unique: true });
          embeddingStore.createIndex('timestamp', 'timestamp', { unique: false });
        }

        // Whitelist rules store
        if (!db.objectStoreNames.contains(STORES.WHITELIST)) {
          const whitelistStore = db.createObjectStore(STORES.WHITELIST, { 
            keyPath: 'id', 
            autoIncrement: true 
          });
          whitelistStore.createIndex('domain', 'domain', { unique: false });
          whitelistStore.createIndex('expiresAt', 'expiresAt', { unique: false });
        }

        // Analytics store (for local aggregations)
        if (!db.objectStoreNames.contains(STORES.ANALYTICS)) {
          const analyticsStore = db.createObjectStore(STORES.ANALYTICS, { 
            keyPath: 'date' 
          });
        }

        // Settings store
        if (!db.objectStoreNames.contains(STORES.SETTINGS)) {
          db.createObjectStore(STORES.SETTINGS, { keyPath: 'key' });
        }
      };
    });
  }

  /**
   * Save a reflection to IndexedDB
   * @param {Object} reflection - { userId, domain, website, prompt, quickResponse, freeText, timestamp }
   */
  async saveReflection(reflection) {
    if (!this.db) await this.init();

    return new Promise((resolve, reject) => {
      const transaction = this.db.transaction([STORES.REFLECTIONS], 'readwrite');
      const store = transaction.objectStore(STORES.REFLECTIONS);

      const reflectionData = {
        userId: reflection.userId,
        domain: reflection.domain,
        website: reflection.website,
        prompt: reflection.prompt,
        quickResponse: reflection.quickResponse || null,
        freeText: reflection.freeText || null,
        timestamp: reflection.timestamp || Date.now()
      };

      const request = store.add(reflectionData);

      request.onsuccess = () => resolve(request.result);
      request.onerror = () => reject(request.error);
    });
  }

  /**
   * Get the last N reflections
   * @param {number} limit - Number of reflections to retrieve
   */
  async getLastReflections(limit = 50) {
    if (!this.db) await this.init();

    return new Promise((resolve, reject) => {
      const transaction = this.db.transaction([STORES.REFLECTIONS], 'readonly');
      const store = transaction.objectStore(STORES.REFLECTIONS);
      const index = store.index('timestamp');

      const request = index.openCursor(null, 'prev');
      const results = [];

      request.onsuccess = (event) => {
        const cursor = event.target.result;
        if (cursor && results.length < limit) {
          results.push(cursor.value);
          cursor.continue();
        } else {
          resolve(results);
        }
      };

      request.onerror = () => reject(request.error);
    });
  }

  /**
   * Get reflections for a specific domain
   * @param {string} domain - Domain to filter by (e.g., 'youtube.com')
   */
  async getReflectionsByDomain(domain) {
    if (!this.db) await this.init();

    return new Promise((resolve, reject) => {
      const transaction = this.db.transaction([STORES.REFLECTIONS], 'readonly');
      const store = transaction.objectStore(STORES.REFLECTIONS);
      const index = store.index('domain');

      const request = index.getAll(domain);

      request.onsuccess = () => resolve(request.result);
      request.onerror = () => reject(request.error);
    });
  }

  /**
   * Get reflections for a specific user
   * @param {string} userId - User ID to filter by
   */
  async getReflectionsByUser(userId) {
    if (!this.db) await this.init();

    return new Promise((resolve, reject) => {
      const transaction = this.db.transaction([STORES.REFLECTIONS], 'readonly');
      const store = transaction.objectStore(STORES.REFLECTIONS);
      const index = store.index('userId');

      const request = index.getAll(userId);

      request.onsuccess = () => resolve(request.result);
      request.onerror = () => reject(request.error);
    });
  }

  /**
   * Save an embedding (vector) for a reflection
   * @param {Object} embedding - { reflectionId, vector (Float32Array), timestamp }
   */
  async saveEmbedding(embedding) {
    if (!this.db) await this.init();

    return new Promise((resolve, reject) => {
      const transaction = this.db.transaction([STORES.EMBEDDINGS], 'readwrite');
      const store = transaction.objectStore(STORES.EMBEDDINGS);

      const embeddingData = {
        reflectionId: embedding.reflectionId,
        vector: embedding.vector, // Float32Array
        timestamp: embedding.timestamp || Date.now()
      };

      const request = store.add(embeddingData);

      request.onsuccess = () => resolve(request.result);
      request.onerror = () => reject(request.error);
    });
  }

  /**
   * Get all embeddings
   */
  async getAllEmbeddings() {
    if (!this.db) await this.init();

    return new Promise((resolve, reject) => {
      const transaction = this.db.transaction([STORES.EMBEDDINGS], 'readonly');
      const store = transaction.objectStore(STORES.EMBEDDINGS);

      const request = store.getAll();

      request.onsuccess = () => resolve(request.result);
      request.onerror = () => reject(request.error);
    });
  }

  /**
   * Save a whitelist rule with expiry
   * @param {Object} rule - { domain, expiresAt (timestamp), type ('10min'|'session'|'tomorrow') }
   */
  async saveWhitelistRule(rule) {
    if (!this.db) await this.init();

    return new Promise((resolve, reject) => {
      const transaction = this.db.transaction([STORES.WHITELIST], 'readwrite');
      const store = transaction.objectStore(STORES.WHITELIST);

      const ruleData = {
        domain: rule.domain,
        expiresAt: rule.expiresAt,
        type: rule.type,
        createdAt: Date.now()
      };

      const request = store.add(ruleData);

      request.onsuccess = () => resolve(request.result);
      request.onerror = () => reject(request.error);
    });
  }

  /**
   * Get active whitelist rules (not expired)
   * @param {string} domain - Optional domain to filter by
   */
  async getActiveWhitelistRules(domain = null) {
    if (!this.db) await this.init();

    return new Promise((resolve, reject) => {
      const transaction = this.db.transaction([STORES.WHITELIST], 'readonly');
      const store = transaction.objectStore(STORES.WHITELIST);

      const request = store.getAll();

      request.onsuccess = () => {
        const now = Date.now();
        let rules = request.result.filter(rule => rule.expiresAt > now);
        
        if (domain) {
          rules = rules.filter(rule => rule.domain === domain);
        }
        
        resolve(rules);
      };

      request.onerror = () => reject(request.error);
    });
  }

  /**
   * Clean up expired whitelist rules
   */
  async cleanupExpiredRules() {
    if (!this.db) await this.init();

    return new Promise((resolve, reject) => {
      const transaction = this.db.transaction([STORES.WHITELIST], 'readwrite');
      const store = transaction.objectStore(STORES.WHITELIST);
      const index = store.index('expiresAt');

      const now = Date.now();
      const range = IDBKeyRange.upperBound(now);
      const request = index.openCursor(range);

      request.onsuccess = (event) => {
        const cursor = event.target.result;
        if (cursor) {
          cursor.delete();
          cursor.continue();
        } else {
          resolve();
        }
      };

      request.onerror = () => reject(request.error);
    });
  }

  /**
   * Save or update a setting
   * @param {string} key - Setting key
   * @param {any} value - Setting value
   */
  async saveSetting(key, value) {
    if (!this.db) await this.init();

    return new Promise((resolve, reject) => {
      const transaction = this.db.transaction([STORES.SETTINGS], 'readwrite');
      const store = transaction.objectStore(STORES.SETTINGS);

      const request = store.put({ key, value });

      request.onsuccess = () => resolve(request.result);
      request.onerror = () => reject(request.error);
    });
  }

  /**
   * Get a setting by key
   * @param {string} key - Setting key
   */
  async getSetting(key) {
    if (!this.db) await this.init();

    return new Promise((resolve, reject) => {
      const transaction = this.db.transaction([STORES.SETTINGS], 'readonly');
      const store = transaction.objectStore(STORES.SETTINGS);

      const request = store.get(key);

      request.onsuccess = () => resolve(request.result ? request.result.value : null);
      request.onerror = () => reject(request.error);
    });
  }

  /**
   * Save daily analytics
   * @param {Object} analytics - { date (YYYY-MM-DD), distractionCount, focusTime, reflectionCount }
   */
  async saveAnalytics(analytics) {
    if (!this.db) await this.init();

    return new Promise((resolve, reject) => {
      const transaction = this.db.transaction([STORES.ANALYTICS], 'readwrite');
      const store = transaction.objectStore(STORES.ANALYTICS);

      const request = store.put(analytics);

      request.onsuccess = () => resolve(request.result);
      request.onerror = () => reject(request.error);
    });
  }

  /**
   * Get analytics for a date range
   * @param {string} startDate - Start date (YYYY-MM-DD)
   * @param {string} endDate - End date (YYYY-MM-DD)
   */
  async getAnalytics(startDate, endDate) {
    if (!this.db) await this.init();

    return new Promise((resolve, reject) => {
      const transaction = this.db.transaction([STORES.ANALYTICS], 'readonly');
      const store = transaction.objectStore(STORES.ANALYTICS);

      const range = IDBKeyRange.bound(startDate, endDate);
      const request = store.getAll(range);

      request.onsuccess = () => resolve(request.result);
      request.onerror = () => reject(request.error);
    });
  }

  /**
   * Find similar reflections using cosine similarity on embeddings
   * @param {number[]} queryEmbedding - The embedding vector to compare against
   * @param {number} limit - Maximum number of results to return
   * @param {number} threshold - Minimum similarity score (0-1)
   * @returns {Promise<Array>} Array of similar reflections with similarity scores
   */
  async findSimilarReflections(queryEmbedding, limit = 5, threshold = 0.7) {
    if (!this.db) await this.init();

    // Get all embeddings
    const embeddings = await this.getAllEmbeddings();
    
    if (embeddings.length === 0) {
      return [];
    }

    // Calculate cosine similarity for each embedding
    const similarities = embeddings.map(emb => {
      const similarity = this.cosineSimilarity(queryEmbedding, emb.embedding);
      return {
        ...emb,
        similarity
      };
    });

    // Filter by threshold and sort by similarity (descending)
    const filtered = similarities
      .filter(item => item.similarity >= threshold)
      .sort((a, b) => b.similarity - a.similarity)
      .slice(0, limit);

    // Get corresponding reflections
    const reflectionPromises = filtered.map(async (item) => {
      return new Promise((resolve, reject) => {
        const transaction = this.db.transaction([STORES.REFLECTIONS], 'readonly');
        const store = transaction.objectStore(STORES.REFLECTIONS);
        const index = store.index('domain');
        const request = index.getAll(item.domain);

        request.onsuccess = () => {
          // Find the reflection closest to the embedding timestamp
          const reflections = request.result;
          const closest = reflections.reduce((prev, curr) => {
            return Math.abs(curr.timestamp - item.timestamp) < Math.abs(prev.timestamp - item.timestamp)
              ? curr
              : prev;
          }, reflections[0] || {});
          
          resolve({
            ...closest,
            similarity: item.similarity
          });
        };
        request.onerror = () => reject(request.error);
      });
    });

    return Promise.all(reflectionPromises);
  }

  /**
   * Calculate cosine similarity between two vectors
   * @param {number[]} vecA - First vector
   * @param {number[]} vecB - Second vector
   * @returns {number} Similarity score between 0 and 1
   */
  cosineSimilarity(vecA, vecB) {
    if (!vecA || !vecB || vecA.length !== vecB.length) {
      return 0;
    }

    let dotProduct = 0;
    let normA = 0;
    let normB = 0;

    for (let i = 0; i < vecA.length; i++) {
      dotProduct += vecA[i] * vecB[i];
      normA += vecA[i] * vecA[i];
      normB += vecB[i] * vecB[i];
    }

    const magnitude = Math.sqrt(normA) * Math.sqrt(normB);
    
    if (magnitude === 0) {
      return 0;
    }

    return dotProduct / magnitude;
  }

  /**
   * Clear all data (for testing or reset)
   */
  async clearAllData() {
    if (!this.db) await this.init();

    const stores = Object.values(STORES);
    const promises = stores.map(storeName => {
      return new Promise((resolve, reject) => {
        const transaction = this.db.transaction([storeName], 'readwrite');
        const store = transaction.objectStore(storeName);
        const request = store.clear();

        request.onsuccess = () => resolve();
        request.onerror = () => reject(request.error);
      });
    });

    return Promise.all(promises);
  }
}

// Create singleton instance
const storageManager = new StorageManager();

// Initialize on load
storageManager.init().catch(console.error);

// Export for use in other scripts
if (typeof window !== 'undefined') {
  window.storageManager = storageManager;
}
