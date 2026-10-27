import { INITIAL_CATEGORIES } from "../data/initialCategories";
import { INITIAL_NEWS } from "../data/initialNews";
import { INITIAL_USERS } from "../data/initialUsers";

const KEYS = {
  CATEGORIES: "funews_categories_v1",
  NEWS: "funews_news_v1",
  USERS: "funews_users_v1",
  AUTH: "funews_auth_v1",
  THEME: "funews_theme_v1"
};

export const storageService = {
  // Categories
  getCategories: () => {
    try {
      const data = localStorage.getItem(KEYS.CATEGORIES);
      if (!data) {
        localStorage.setItem(KEYS.CATEGORIES, JSON.stringify(INITIAL_CATEGORIES));
        return INITIAL_CATEGORIES;
      }
      return JSON.parse(data);
    } catch (err) {
      console.error("Error reading categories from localStorage:", err);
      return INITIAL_CATEGORIES;
    }
  },
  saveCategories: (categories) => {
    localStorage.setItem(KEYS.CATEGORIES, JSON.stringify(categories));
  },

  // News
  getNews: () => {
    try {
      const data = localStorage.getItem(KEYS.NEWS);
      if (!data) {
        localStorage.setItem(KEYS.NEWS, JSON.stringify(INITIAL_NEWS));
        return INITIAL_NEWS;
      }
      return JSON.parse(data);
    } catch (err) {
      console.error("Error reading news from localStorage:", err);
      return INITIAL_NEWS;
    }
  },
  saveNews: (news) => {
    localStorage.setItem(KEYS.NEWS, JSON.stringify(news));
  },

  // Users
  getUsers: () => {
    try {
      const data = localStorage.getItem(KEYS.USERS);
      if (!data) {
        localStorage.setItem(KEYS.USERS, JSON.stringify(INITIAL_USERS));
        return INITIAL_USERS;
      }
      return JSON.parse(data);
    } catch (err) {
      console.error("Error reading users from localStorage:", err);
      return INITIAL_USERS;
    }
  },
  saveUsers: (users) => {
    localStorage.setItem(KEYS.USERS, JSON.stringify(users));
  },

  // Auth session
  getAuth: () => {
    try {
      const data = localStorage.getItem(KEYS.AUTH);
      return data ? JSON.parse(data) : null;
    } catch (err) {
      console.error("Error reading auth from localStorage:", err);
      return null;
    }
  },
  saveAuth: (user) => {
    if (user) {
      localStorage.setItem(KEYS.AUTH, JSON.stringify(user));
    } else {
      localStorage.removeItem(KEYS.AUTH);
    }
  },

  // Theme preference
  getTheme: () => {
    return localStorage.getItem(KEYS.THEME) || "light";
  },
  saveTheme: (theme) => {
    localStorage.setItem(KEYS.THEME, theme);
  },

  // Reset to initial mock data (useful for demonstration and testing)
  resetAll: () => {
    localStorage.setItem(KEYS.CATEGORIES, JSON.stringify(INITIAL_CATEGORIES));
    localStorage.setItem(KEYS.NEWS, JSON.stringify(INITIAL_NEWS));
    localStorage.setItem(KEYS.USERS, JSON.stringify(INITIAL_USERS));
    return {
      categories: INITIAL_CATEGORIES,
      news: INITIAL_NEWS,
      users: INITIAL_USERS
    };
  }
};
