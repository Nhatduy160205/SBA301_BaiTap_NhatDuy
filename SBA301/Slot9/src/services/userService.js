import { createUserModel } from "../models/userModel";

/**
 * Service Layer: Data Fetching, In-Memory Caching Policy, Abort Handling & Filtering
 * MVC Layered Service Architecture
 */
class UserService {
  constructor() {
    this.cache = null;
    this.cacheTimestamp = null;
    this.cacheTTL = 60 * 1000; // 60 seconds Time-to-Live
    this.cacheHits = 0;
    this.networkRequests = 0;
    this.apiUrl = "https://jsonplaceholder.typicode.com/users";
  }

  /**
   * Retrieves users from cache if fresh, otherwise performs network fetch
   */
  async getUsers({ forceRefresh = false, signal } = {}) {
    const now = Date.now();
    const isCacheValid = this.cache && this.cacheTimestamp && now - this.cacheTimestamp < this.cacheTTL;

    if (!forceRefresh && isCacheValid) {
      this.cacheHits++;
      return {
        data: this.cache,
        source: "CACHE",
        timestamp: this.cacheTimestamp,
        cacheHits: this.cacheHits,
        networkRequests: this.networkRequests
      };
    }

    // Network request
    try {
      this.networkRequests++;
      const response = await fetch(this.apiUrl, { signal });

      if (!response.ok) {
        throw new Error(`HTTP ${response.status}: Failed to fetch users from server.`);
      }

      const rawList = await response.json();
      const sanitized = rawList.map(createUserModel);

      // Store in Cache
      this.cache = sanitized;
      this.cacheTimestamp = Date.now();

      return {
        data: sanitized,
        source: "NETWORK",
        timestamp: this.cacheTimestamp,
        cacheHits: this.cacheHits,
        networkRequests: this.networkRequests
      };
    } catch (err) {
      if (err.name === "AbortError") {
        throw new Error("Request was cancelled by user (AbortController).");
      }
      // If network fails but stale cache exists, serve stale as fallback
      if (this.cache) {
        return {
          data: this.cache,
          source: "STALE_CACHE_FALLBACK",
          timestamp: this.cacheTimestamp,
          cacheHits: this.cacheHits,
          networkRequests: this.networkRequests,
          warning: "Network failed; showing stale cached data."
        };
      }
      throw err;
    }
  }

  /**
   * Clears the current cache
   */
  clearCache() {
    this.cache = null;
    this.cacheTimestamp = null;
  }

  /**
   * Filters user list based on search keyword
   */
  filterUsers(users, keyword) {
    if (!keyword || keyword.trim() === "") return users;
    const q = keyword.trim().toLowerCase();
    return users.filter(
      (u) =>
        u.name.toLowerCase().includes(q) ||
        u.username.toLowerCase().includes(q) ||
        u.email.toLowerCase().includes(q) ||
        u.company.toLowerCase().includes(q) ||
        u.city.toLowerCase().includes(q)
    );
  }

  /**
   * Adds a new user and updates cached collection
   */
  async createUser(userData) {
    // Validate
    if (!userData.name || !userData.email) {
      throw new Error("Name and Email are mandatory fields.");
    }

    // Network POST simulation to JSONPlaceholder
    const response = await fetch(this.apiUrl, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(userData)
    });

    const createdRaw = await response.json();
    const newUser = createUserModel({
      ...userData,
      id: this.cache ? Math.max(...this.cache.map((u) => u.id), 0) + 1 : createdRaw.id
    });

    if (this.cache) {
      this.cache = [newUser, ...this.cache];
      this.cacheTimestamp = Date.now();
    }

    return newUser;
  }

  /**
   * Gets current caching diagnostic stats
   */
  getDiagnostics() {
    const ageSeconds = this.cacheTimestamp ? Math.round((Date.now() - this.cacheTimestamp) / 1000) : null;
    return {
      hasCache: Boolean(this.cache),
      cacheHits: this.cacheHits,
      networkRequests: this.networkRequests,
      ageSeconds,
      ttlSeconds: this.cacheTTL / 1000,
      isExpired: ageSeconds !== null && ageSeconds > this.cacheTTL / 1000
    };
  }
}

export const userService = new UserService();
