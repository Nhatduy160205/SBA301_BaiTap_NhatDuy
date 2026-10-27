import { events } from "../data/events";

/**
 * Service Layer: EventHub Business Logic & Calculations
 * MVC Layered Service Architecture
 */
class EventService {
  /**
   * Retrieves all campus events
   */
  getAllEvents() {
    return [...events];
  }

  /**
   * Filters events according to search criteria and category
   */
  filterEvents(list, { category = "All", keyword = "", onlyFeatured = false }) {
    let result = [...list];

    if (category && category !== "All") {
      result = result.filter((e) => e.category.toLowerCase() === category.toLowerCase());
    }

    if (keyword.trim() !== "") {
      const q = keyword.trim().toLowerCase();
      result = result.filter(
        (e) =>
          e.title.toLowerCase().includes(q) ||
          e.location.toLowerCase().includes(q) ||
          e.category.toLowerCase().includes(q) ||
          e.description.toLowerCase().includes(q)
      );
    }

    if (onlyFeatured) {
      result = result.filter((e) => e.featured);
    }

    return result;
  }

  /**
   * Extracts distinct categories for tabs/dropdowns
   */
  getCategories(list) {
    return ["All", ...Array.from(new Set(list.map((e) => e.category)))];
  }

  /**
   * Finds event by ID with business validation
   */
  getEventById(id) {
    const event = events.find((e) => e.id === Number(id));
    if (!event) {
      throw new Error(`Event with ID #${id} does not exist.`);
    }
    return event;
  }

  /**
   * Computes campus summary metrics
   */
  getMetrics(list) {
    const total = list.length;
    const featured = list.filter((e) => e.featured).length;
    const totalSeats = list.reduce((acc, e) => acc + (e.seats || 0), 0);
    const categoriesCount = new Set(list.map((e) => e.category)).size;

    return {
      totalEvents: total,
      featuredEvents: featured,
      totalCapacity: totalSeats,
      totalCategories: categoriesCount
    };
  }

  /**
   * Business validation for event registration
   */
  registerForEvent(registeredEventIds, eventId) {
    if (registeredEventIds.has(eventId)) {
      return { success: false, message: "You have already registered for this event." };
    }
    const nextSet = new Set(registeredEventIds);
    nextSet.add(eventId);
    return {
      success: true,
      registeredSet: nextSet,
      message: "Registration successful! Confirmation has been sent to your student portal."
    };
  }
}

export const eventService = new EventService();
