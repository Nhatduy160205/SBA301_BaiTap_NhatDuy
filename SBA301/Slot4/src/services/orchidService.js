import { orchids } from "../data/orchids";

/**
 * Service Layer: Orchid Business Logic, Filtering, Searching, and State Management
 * MVC Architecture - Service Pattern
 */
class OrchidService {
  /**
   * Retrieves all initial orchid items
   */
  getInitialOrchids() {
    return [...orchids];
  }

  /**
   * Business logic for filtering and searching orchids
   */
  filterOrchids(list, { searchKeyword = "", selectedCategory = "All", onlySpecial = false, sortBy = "rating" }) {
    let result = [...list];

    // Filter by search keyword
    if (searchKeyword.trim() !== "") {
      const kw = searchKeyword.trim().toLowerCase();
      result = result.filter(
        (o) =>
          o.orchidName.toLowerCase().includes(kw) ||
          o.category.toLowerCase().includes(kw) ||
          o.origin.toLowerCase().includes(kw) ||
          o.description.toLowerCase().includes(kw)
      );
    }

    // Filter by category
    if (selectedCategory && selectedCategory !== "All") {
      result = result.filter((o) => o.category.toLowerCase() === selectedCategory.toLowerCase());
    }

    // Filter by special flag
    if (onlySpecial) {
      result = result.filter((o) => o.isSpecial);
    }

    // Sort orchids
    result.sort((a, b) => {
      if (sortBy === "rating") {
        return b.rating - a.rating; // Highest rating first
      }
      if (sortBy === "name") {
        return a.orchidName.localeCompare(b.orchidName);
      }
      return a.id - b.id;
    });

    return result;
  }

  /**
   * Extracts distinct categories for filter buttons
   */
  getCategories(list) {
    return ["All", ...Array.from(new Set(list.map((o) => o.category)))];
  }

  /**
   * Business logic for toggling favorite state
   */
  toggleFavorite(favoritesSet, orchidId) {
    const nextSet = new Set(favoritesSet);
    if (nextSet.has(orchidId)) {
      nextSet.delete(orchidId);
    } else {
      nextSet.add(orchidId);
    }
    return nextSet;
  }

  /**
   * Finds orchid by ID
   */
  getOrchidById(id) {
    const found = orchids.find((o) => o.id === Number(id));
    if (!found) {
      throw new Error(`Orchid #${id} not found.`);
    }
    return found;
  }

  /**
   * Computes dynamic statistics based on current active list & favorites
   */
  calculateExplorerStats(filteredList, favoritesSet) {
    return {
      visibleCount: filteredList.length,
      favoriteCount: favoritesSet.size,
      specialCount: filteredList.filter((o) => o.isSpecial).length
    };
  }
}

export const orchidService = new OrchidService();
