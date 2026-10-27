import { dashboardService } from "../services/dashboardService";

function EnvironmentStatus() {
  const { tools, summaryText } = dashboardService.getEnvironmentStatus();

  return (
    <section className="card">
      <div className="card-header-flex">
        <h2>Environment & Tools Status</h2>
        <span className="badge info">{summaryText}</span>
      </div>
      <div className="tools-grid">
        {tools.map((tool) => (
          <div key={tool.name} className="tool-item">
            <span className="tool-name">{tool.name}</span>
            <span className="tool-version">{tool.version}</span>
            <span className={`status-pill ${tool.status.toLowerCase()}`}>
              {tool.status}
            </span>
          </div>
        ))}
      </div>
    </section>
  );
}

export default EnvironmentStatus;
