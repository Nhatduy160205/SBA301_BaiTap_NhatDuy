import { course, student, learningItems, environmentTools, groupProject } from "../data/dashboardData";

/**
 * Service Layer: Encapsulates all business logic and data processing
 * MVC Architecture - Service Pattern
 */
class DashboardService {
  /**
   * Retrieves formatted course metadata
   */
  getCourseInfo() {
    return {
      ...course,
      fullTitle: `${course.code} - ${course.name}`,
      tagline: `${course.slot} • ${course.topic}`
    };
  }

  /**
   * Retrieves student profile with computed permissions / display values
   */
  getStudentProfile() {
    return {
      ...student,
      displayName: `${student.name} (${student.studentId})`,
      isLeader: student.role.toLowerCase().includes("lead")
    };
  }

  /**
   * Retrieves learning checklist with total count and progress tracking
   */
  getLearningChecklist() {
    return {
      items: [...learningItems],
      totalCount: learningItems.length,
      completionRate: 100 // Slot 02 baseline completed
    };
  }

  /**
   * Evaluates environment tools readiness and returns aggregated health status
   */
  getEnvironmentStatus() {
    const tools = [...environmentTools];
    const allReady = tools.every((tool) => tool.status === "Ready");
    const readyCount = tools.filter((tool) => tool.status === "Ready").length;

    return {
      tools,
      isSystemReady: allReady,
      summaryText: `${readyCount}/${tools.length} Tools Ready`,
      badgeType: allReady ? "success" : "warning"
    };
  }

  /**
   * Retrieves group project roadmap and feature count
   */
  getGroupProjectSummary() {
    return {
      ...groupProject,
      featureCount: groupProject.coreFeatures.length,
      hasDefinedScope: groupProject.coreFeatures.length >= 3
    };
  }

  /**
   * Computes architecture pipeline mental model
   */
  getArchitectureFlow() {
    return [
      { step: 1, label: "index.html", desc: "HTML Host element with #root container" },
      { step: 2, label: "main.jsx", desc: "createRoot() entry point mounting React tree" },
      { step: 3, label: "App.jsx", desc: "Root component composing feature modules" },
      { step: 4, label: "Service Layer", desc: "Business logic, data retrieval & calculations" },
      { step: 5, label: "Child Components", desc: "Presentational functional components (CourseHeader, etc.)" },
      { step: 6, label: "JSX Virtual DOM", desc: "Declarative React element hierarchy" },
      { step: 7, label: "Browser DOM", desc: "Live user interface displayed to the user" }
    ];
  }
}

export const dashboardService = new DashboardService();
