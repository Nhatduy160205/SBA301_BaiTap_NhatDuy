import { storageService } from "./storageService";

export const newsService = {
  getAll: () => {
    return storageService.getNews();
  },

  getById: (id) => {
    const list = storageService.getNews();
    return list.find((n) => Number(n.id) === Number(id)) || null;
  },

  create: (newsData) => {
    const list = storageService.getNews();
    const newId = list.length > 0 ? Math.max(...list.map((n) => Number(n.id))) + 1 : 1;

    let parsedTags = [];
    if (Array.isArray(newsData.tags)) {
      parsedTags = newsData.tags;
    } else if (typeof newsData.tags === "string") {
      parsedTags = newsData.tags
        .split(",")
        .map((t) => t.trim())
        .filter(Boolean);
    }

    const newArticle = {
      id: newId,
      title: newsData.title.trim(),
      content: newsData.content.trim(),
      categoryId: Number(newsData.categoryId),
      createdBy: newsData.createdBy || "Admin",
      status: Number(newsData.status ?? 1),
      tags: parsedTags,
      createdAt: new Date().toISOString()
    };

    const updated = [newArticle, ...list];
    storageService.saveNews(updated);
    return newArticle;
  },

  update: (id, newsData) => {
    const list = storageService.getNews();
    const index = list.findIndex((n) => Number(n.id) === Number(id));
    if (index === -1) {
      throw new Error(`News article with ID ${id} not found`);
    }

    let parsedTags = [];
    if (Array.isArray(newsData.tags)) {
      parsedTags = newsData.tags;
    } else if (typeof newsData.tags === "string") {
      parsedTags = newsData.tags
        .split(",")
        .map((t) => t.trim())
        .filter(Boolean);
    }

    const updatedArticle = {
      ...list[index],
      title: newsData.title.trim(),
      content: newsData.content.trim(),
      categoryId: Number(newsData.categoryId),
      status: Number(newsData.status ?? 1),
      tags: parsedTags,
      updatedAt: new Date().toISOString()
    };

    const updated = list.map((item) =>
      Number(item.id) === Number(id) ? updatedArticle : item
    );
    storageService.saveNews(updated);
    return updatedArticle;
  },

  delete: (id) => {
    const list = storageService.getNews();
    const updated = list.filter((n) => Number(n.id) !== Number(id));
    storageService.saveNews(updated);
    return { success: true };
  },

  search: (newsList, query = "", categoryFilter = "all", statusFilter = "all") => {
    const normQuery = (query || "").trim().toLowerCase();
    return newsList.filter((item) => {
      const titleMatch = (item.title || "").toLowerCase().includes(normQuery);
      const contentMatch = (item.content || "").toLowerCase().includes(normQuery);
      const tagMatch = item.tags && item.tags.some((t) => t.toLowerCase().includes(normQuery));
      const matchesQuery = !normQuery || titleMatch || contentMatch || tagMatch;

      const matchesCategory =
        categoryFilter === "all" ||
        Number(item.categoryId) === Number(categoryFilter);

      const matchesStatus =
        statusFilter === "all" ||
        Number(item.status) === Number(statusFilter);

      return matchesQuery && matchesCategory && matchesStatus;
    });
  }
};
