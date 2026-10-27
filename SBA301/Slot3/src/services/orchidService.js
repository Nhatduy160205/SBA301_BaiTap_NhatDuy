import { orchids, careTips } from "../data/orchids";

/**
 * Service Layer: Orchid Business Logic & Data Manipulation
 * Adheres to MVC Layered Architecture
 */
class OrchidService {
  /**
   * Retrieves all orchids
   */
  getAllOrchids() {
    return [...orchids];
  }

  /**
   * Computes dashboard quick stats based on raw orchid records
   */
  getQuickStats() {
    const total = orchids.length;
    const specialCount = orchids.filter((o) => o.isSpecial).length;
    const categories = new Set(orchids.map((o) => o.category));
    const avgRating = total > 0 ? (orchids.reduce((sum, o) => sum + o.rating, 0) / total).toFixed(1) : 0;

    return {
      totalOrchids: total,
      specialSpecies: specialCount,
      uniqueCategories: categories.size,
      averageRating: avgRating
    };
  }

  /**
   * Filters orchids by category
   */
  getOrchidsByCategory(category) {
    if (!category || category === "All") {
      return [...orchids];
    }
    return orchids.filter((o) => o.category.toLowerCase() === category.toLowerCase());
  }

  /**
   * Retrieves distinct list of categories
   */
  getCategories() {
    return ["All", ...Array.from(new Set(orchids.map((o) => o.category)))];
  }

  /**
   * Finds orchid by ID with error validation
   */
  getOrchidById(id) {
    const orchid = orchids.find((o) => o.id === Number(id));
    if (!orchid) {
      throw new Error(`Orchid with ID ${id} not found.`);
    }
    return orchid;
  }

  /**
   * Retrieves care tips
   */
  getCareTips() {
    return [...careTips];
  }
}

export const orchidService = new OrchidService();
