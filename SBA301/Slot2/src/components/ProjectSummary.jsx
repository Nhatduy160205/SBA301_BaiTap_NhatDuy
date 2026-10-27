import { dashboardService } from "../services/dashboardService";

function ProjectSummary() {
  const project = dashboardService.getGroupProjectSummary();

  return (
    <section className="card">
      <h2>Group Project Overview</h2>
      <p><strong>Project Name:</strong> {project.name}</p>
      <p><strong>Target Users:</strong> {project.targetUsers}</p>
      <div className="features-section">
        <strong>Core Features ({project.featureCount}):</strong>
        <ul className="feature-list">
          {project.coreFeatures.map((feat, idx) => (
            <li key={idx}>{feat}</li>
          ))}
        </ul>
      </div>
    </section>
  );
}

export default ProjectSummary;
