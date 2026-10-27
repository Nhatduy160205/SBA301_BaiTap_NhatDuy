import { events } from "../data/events";

/**
 * Service Layer: Event Business Logic & Route Data Provider
 * MVC Layered Service Architecture
 */
class EventService {
  getAllEvents() {
    return [...events];
  }

  getFeaturedEvents() {
    return events.filter((e) => e.featured);
  }

  getEventById(id) {
    const numId = Number(id);
    const event = events.find((e) => e.id === numId);
    if (!event) {
      throw new Error(`Event with ID "${id}" could not be found.`);
    }
    return event;
  }

  filterEvents(list, { category = "All", keyword = "" }) {
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

    return result;
  }

  getCategories() {
    return ["All", ...Array.from(new Set(events.map((e) => e.category)))];
  }

  getEventStats() {
    return {
      total: events.length,
      featured: events.filter((e) => e.featured).length,
      categoriesCount: new Set(events.map((e) => e.category)).size
    };
  }
}

export const eventService = new EventService();
