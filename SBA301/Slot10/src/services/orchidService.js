import { orchids } from "../data/orchids";

/**
 * Service Layer: Orchid Business Logic & SPA State Provider
 * MVC Layered Service Architecture
 */
class OrchidService {
  getAllOrchids() {
    return [...orchids];
  }

  getSpecialOrchids() {
    return orchids.filter((o) => o.isSpecial);
  }

  getOrchidById(id) {
    const found = orchids.find((o) => o.id === Number(id));
    if (!found) {
      throw new Error(`Orchid #${id} not found.`);
    }
    return found;
  }

  filterOrchids(list, { category = "All", keyword = "", onlySpecial = false }) {
    let result = [...list];

    if (category && category !== "All") {
      result = result.filter((o) => o.category.toLowerCase() === category.toLowerCase());
    }

    if (keyword.trim() !== "") {
      const q = keyword.trim().toLowerCase();
      result = result.filter(
        (o) =>
          o.orchidName.toLowerCase().includes(q) ||
          o.category.toLowerCase().includes(q) ||
          o.origin.toLowerCase().includes(q) ||
          o.description.toLowerCase().includes(q)
      );
    }

    if (onlySpecial) {
      result = result.filter((o) => o.isSpecial);
    }

    return result;
  }

  getCategories() {
    return ["All", ...Array.from(new Set(orchids.map((o) => o.category)))];
  }

  getStats() {
    const total = orchids.length;
    const special = orchids.filter((o) => o.isSpecial).length;
    const avg = (orchids.reduce((acc, o) => acc + o.rating, 0) / total).toFixed(1);
    return { total, special, avgRating: avg };
  }

  getFavorites() {
    try {
      const stored = localStorage.getItem("sba301_slot10_favs");
      return stored ? JSON.parse(stored) : [];
    } catch {
      return [];
    }
  }

  toggleFavorite(id) {
    const favs = this.getFavorites();
    const numId = Number(id);
    let next;
    if (favs.includes(numId)) {
      next = favs.filter((item) => item !== numId);
    } else {
      next = [...favs, numId];
    }
    try {
      localStorage.setItem("sba301_slot10_favs", JSON.stringify(next));
    } catch (err) {
      console.error("Failed to persist favorites:", err);
    }
    return next;
  }
}

export const orchidService = new OrchidService();
