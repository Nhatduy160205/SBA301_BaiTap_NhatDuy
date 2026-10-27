import React from "react";
import { Accordion, Card } from "react-bootstrap";
import { orchidService } from "../services/orchidService";

function CareTips() {
  const tips = orchidService.getCareTips();

  return (
    <section id="care" className="mb-5">
      <Card className="border-0 shadow-sm p-4">
        <div className="mb-4">
          <h2 className="fw-bold mb-1">Essential Orchid Care Guidelines</h2>
          <p className="text-muted">Master the art of keeping your delicate blooms thriving and reblooming</p>
        </div>

        <Accordion defaultActiveKey="0" flush>
          {tips.map((tip, idx) => (
            <Accordion.Item key={tip.id} eventKey={String(idx)}>
              <Accordion.Header className="fw-semibold">
                🌿 {tip.title}
              </Accordion.Header>
              <Accordion.Body className="text-secondary">
                {tip.content}
              </Accordion.Body>
            </Accordion.Item>
          ))}
        </Accordion>
      </Card>
    </section>
  );
}

export default CareTips;
