import React from "react";
import { Alert } from "react-bootstrap";

function LearningAlert() {
  return (
    <Alert variant="info" className="d-flex align-items-center gap-3 shadow-sm border-0 mb-4">
      <div className="fs-3">💡</div>
      <div>
        <Alert.Heading className="fs-6 fw-bold mb-1">
          Slot 03 Architectural Milestone: Separation of Concerns
        </Alert.Heading>
        <p className="mb-0 small text-secondary">
          UI components strictly focus on presentation, while data manipulation and business rules are encapsulated in <code>orchidService.js</code>.
        </p>
      </div>
    </Alert>
  );
}

export default LearningAlert;
