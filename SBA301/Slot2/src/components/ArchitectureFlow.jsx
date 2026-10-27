import { dashboardService } from "../services/dashboardService";

function ArchitectureFlow() {
  const steps = dashboardService.getArchitectureFlow();

  return (
    <section className="card full-width">
      <h2>MVC & React Architecture Pipeline</h2>
      <p className="architecture-subtitle">
        Visualizing the request, logic handling and render flow across layers:
      </p>
      <div className="flow-container">
        {steps.map((st) => (
          <div key={st.step} className="flow-step">
            <div className="step-number">{st.step}</div>
            <div className="step-content">
              <h4>{st.label}</h4>
              <p>{st.desc}</p>
            </div>
            {st.step < steps.length && <div className="flow-arrow">→</div>}
          </div>
        ))}
      </div>
    </section>
  );
}

export default ArchitectureFlow;
