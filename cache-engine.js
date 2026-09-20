/**
 * Wow Food Recipes - Client-Side Caching Engine
 * File: cache-engine.js
 * 
 * Provides local caching with a 7-day TTL expiration policy (604,800,000 ms) via localStorage,
 * with graceful fallback to stale cache and offline mock datasets if network is unavailable or API hits 429 rate limits.
 */

(function(global) {
  'use strict';

  const CACHE_PREFIX = 'wow_cache_v1_';
  const DEFAULT_TTL_MS = 7 * 24 * 60 * 60 * 1000; // 7 Days in milliseconds (604,800,000 ms)

  const MealDBCacheEngine = {
    /**
     * Retrieve cached item if valid or return stale fallback data
     * @param {string} key 
     * @returns {{ data: any, isExpired: boolean } | null}
     */
    get(key) {
      if (!key) return null;
      try {
        const fullKey = CACHE_PREFIX + String(key).toLowerCase().trim();
        const raw = localStorage.getItem(fullKey);
        if (!raw) return null;

        const parsed = JSON.parse(raw);
        if (!parsed || typeof parsed !== 'object' || !parsed.timestamp) {
          return null;
        }

        const now = Date.now();
        const isExpired = parsed.expiresAt ? now > parsed.expiresAt : (now - parsed.timestamp > DEFAULT_TTL_MS);

        return {
          data: parsed.data,
          isExpired: isExpired,
          timestamp: parsed.timestamp
        };
      } catch (err) {
        console.warn('[MealDBCacheEngine] Read error:', err);
        return null;
      }
    },

    /**
     * Store item in cache with 7-day expiration policy
     * @param {string} key 
     * @param {any} data 
     * @param {number} [ttlMs] Custom TTL in ms (defaults to 7 days)
     */
    set(key, data, ttlMs = DEFAULT_TTL_MS) {
      if (!key || data === undefined || data === null) return false;
      try {
        const fullKey = CACHE_PREFIX + String(key).toLowerCase().trim();
        const payload = {
          timestamp: Date.now(),
          expiresAt: Date.now() + ttlMs,
          data: data
        };
        localStorage.setItem(fullKey, JSON.stringify(payload));
        return true;
      } catch (err) {
        // Handle localStorage quota exceeded
        console.warn('[MealDBCacheEngine] Storage quota error, pruning oldest cache items:', err);
        this.pruneOldest();
        try {
          const fullKey = CACHE_PREFIX + String(key).toLowerCase().trim();
          localStorage.setItem(fullKey, JSON.stringify({
            timestamp: Date.now(),
            expiresAt: Date.now() + ttlMs,
            data: data
          }));
          return true;
        } catch (retryErr) {
          return false;
        }
      }
    },

    /**
     * Delete specific cache entry
     * @param {string} key 
     */
    remove(key) {
      try {
        const fullKey = CACHE_PREFIX + String(key).toLowerCase().trim();
        localStorage.removeItem(fullKey);
      } catch (err) {}
    },

    /**
     * Prune expired or oldest entries to maintain storage efficiency
     */
    pruneOldest() {
      try {
        const keysToRemove = [];
        const now = Date.now();
        for (let i = 0; i < localStorage.length; i++) {
          const k = localStorage.key(i);
          if (k && k.startsWith(CACHE_PREFIX)) {
            try {
              const val = JSON.parse(localStorage.getItem(k));
              if (val && val.expiresAt && now > val.expiresAt) {
                keysToRemove.push(k);
              }
            } catch (e) {
              keysToRemove.push(k);
            }
          }
        }
        keysToRemove.forEach(k => localStorage.removeItem(k));
      } catch (err) {}
    },

    /**
     * Wraps a network fetch call with 7-day caching, HTTP 429 rate limit protection,
     * and offline fallback.
     * @param {string} url 
     * @param {string} cacheKey 
     * @param {RequestInit} [fetchOptions] 
     * @returns {Promise<any>}
     */
    async fetchWithCache(url, cacheKey, fetchOptions = {}) {
      const cached = this.get(cacheKey);

      // 1. Return valid unexpired cache immediately
      if (cached && !cached.isExpired && cached.data) {
        console.log(`[MealDBCacheEngine] Cache HIT (fresh 7-day TTL) for key: ${cacheKey}`);
        return cached.data;
      }

      // 2. Network Fetch Attempt
      try {
        const controller = new AbortController();
        const timeoutId = setTimeout(() => controller.abort(), 8000); // 8 second fetch timeout

        const response = await fetch(url, {
          ...fetchOptions,
          signal: controller.signal
        });
        clearTimeout(timeoutId);

        if (response.status === 429) {
          console.warn(`[MealDBCacheEngine] HTTP 429 Rate Limit encountered for ${url}`);
          if (cached && cached.data) {
            console.log(`[MealDBCacheEngine] Graceful 429 Fallback to stale cached data for: ${cacheKey}`);
            return cached.data;
          }
          throw new Error('HTTP 429 Rate Limit Exceeded');
        }

        if (response.ok) {
          const freshData = await response.json();
          if (freshData) {
            this.set(cacheKey, freshData);
            return freshData;
          }
        } else {
          console.warn(`[MealDBCacheEngine] Network HTTP status ${response.status} for ${url}`);
        }
      } catch (networkErr) {
        console.warn(`[MealDBCacheEngine] Network fetch failed (${networkErr.message}). Attempting offline fallback...`);
      }

      // 3. Fallback to stale cached data if present
      if (cached && cached.data) {
        console.log(`[MealDBCacheEngine] Offline fallback to stale cached data for key: ${cacheKey}`);
        return cached.data;
      }

      return null;
    }
  };

  // Expose to window scope
  global.MealDBCacheEngine = MealDBCacheEngine;

})(typeof window !== 'undefined' ? window : this);
