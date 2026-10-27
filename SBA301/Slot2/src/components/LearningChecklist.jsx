import { dashboardService } from "../services/dashboardService";

function LearningChecklist() {
  const { items, totalCount, completionRate } = dashboardService.getLearningChecklist();

  return (
    <section className="card">
      <div className="card-header-flex">
        <h2>Slot 02 Learning Checklist</h2>
        <span className="badge success">{completionRate}% Ready ({totalCount} items)</span>
      </div>
      <ul className="check-list">
        {items.map((item) => (
          <li key={item}>{item}</li>
        ))}
      </ul>
    </section>
  );
}

export default LearningChecklist;
