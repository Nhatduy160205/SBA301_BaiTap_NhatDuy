import { storageService } from "./storageService";

export const categoryService = {
  getAll: () => {
    return storageService.getCategories();
  },

  getById: (id) => {
    const list = storageService.getCategories();
    return list.find((c) => Number(c.id) === Number(id)) || null;
  },

  create: (categoryData) => {
    const list = storageService.getCategories();
    const newId = list.length > 0 ? Math.max(...list.map((c) => Number(c.id))) + 1 : 1;
    const newCategory = {
      id: newId,
      name: categoryData.name.trim(),
      description: (categoryData.description || "").trim(),
      status: Number(categoryData.status ?? 1),
      createdAt: new Date().toISOString()
    };
    const updated = [newCategory, ...list];
    storageService.saveCategories(updated);
    return newCategory;
  },

  update: (id, categoryData) => {
    const list = storageService.getCategories();
    const index = list.findIndex((c) => Number(c.id) === Number(id));
    if (index === -1) {
      throw new Error(`Category with ID ${id} not found`);
    }

    const updatedCategory = {
      ...list[index],
      name: categoryData.name.trim(),
      description: (categoryData.description || "").trim(),
      status: Number(categoryData.status ?? 1),
      updatedAt: new Date().toISOString()
    };

    const updated = list.map((item) =>
      Number(item.id) === Number(id) ? updatedCategory : item
    );
    storageService.saveCategories(updated);
    return updatedCategory;
  },

  delete: (id) => {
    const numId = Number(id);
    const allNews = storageService.getNews();
    const hasNewsReferencing = allNews.some((n) => Number(n.categoryId) === numId);

    if (hasNewsReferencing) {
      const affectedCount = allNews.filter((n) => Number(n.categoryId) === numId).length;
      return {
        success: false,
        error: `Không thể xóa chuyên mục này vì đang có ${affectedCount} bài viết tin tức thuộc chuyên mục. Vui lòng chuyển danh mục bài viết trước khi xóa.`
      };
    }

    const list = storageService.getCategories();
    const updated = list.filter((c) => Number(c.id) !== numId);
    storageService.saveCategories(updated);
    return { success: true };
  },

  search: (categories, query = "", statusFilter = "all") => {
    const normQuery = (query || "").trim().toLowerCase();
    return categories.filter((item) => {
      const matchesQuery = !normQuery || item.name.toLowerCase().includes(normQuery) || (item.description && item.description.toLowerCase().includes(normQuery));
      const matchesStatus =
        statusFilter === "all" ||
        Number(item.status) === Number(statusFilter);
      return matchesQuery && matchesStatus;
    });
  }
};
