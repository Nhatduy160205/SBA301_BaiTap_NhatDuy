import { dashboardService } from "../services/dashboardService";

function CourseHeader() {
  const course = dashboardService.getCourseInfo();

  return (
    <header className="hero">
      <p className="eyebrow">{course.tagline}</p>
      <h1>{course.code}</h1>
      <p className="course-name">{course.name}</p>
    </header>
  );
}

export default CourseHeader;
