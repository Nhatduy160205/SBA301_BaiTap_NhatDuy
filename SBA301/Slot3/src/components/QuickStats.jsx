import React from "react";
import { Row, Col, Card } from "react-bootstrap";
import { orchidService } from "../services/orchidService";

function QuickStats() {
  const stats = orchidService.getQuickStats();

  const statItems = [
    { label: "Total Species", value: stats.totalOrchids, icon: "🌺", bg: "primary" },
    { label: "Special Varieties", value: stats.specialSpecies, icon: "⭐", bg: "warning" },
    { label: "Genera / Categories", value: stats.uniqueCategories, icon: "🌿", bg: "success" },
    { label: "Average Rating", value: `${stats.averageRating} / 5.0`, icon: "🏆", bg: "info" }
  ];

  return (
    <Row className="g-3 mb-5">
      {statItems.map((item, idx) => (
        <Col key={idx} xs={6} md={3}>
          <Card className="h-100 shadow-sm border-0 stat-card">
            <Card.Body className="d-flex align-items-center gap-3">
              <div className="stat-icon fs-2">{item.icon}</div>
              <div>
                <div className="text-muted small fw-medium">{item.label}</div>
                <div className="fs-4 fw-bold text-dark">{item.value}</div>
              </div>
            </Card.Body>
          </Card>
        </Col>
      ))}
    </Row>
  );
}

export default QuickStats;
