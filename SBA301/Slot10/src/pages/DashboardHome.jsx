import React from "react";
import { Card, Row, Col } from "react-bootstrap";
import { orchidService } from "../services/orchidService";

function DashboardHome({ favCount }) {
  const stats = orchidService.getStats();

  const cards = [
    { title: "Total Collection", value: stats.total, icon: "🌺", color: "primary" },
    { title: "Special Hybrids", value: stats.special, icon: "⭐", color: "danger" },
    { title: "Average Rating", value: `${stats.avgRating} / 5.0`, icon: "🏆", color: "warning" },
    { title: "My Favorites", value: favCount, icon: "❤️", color: "danger" }
  ];

  return (
    <div>
      <h3 className="fw-bold mb-3">Dashboard Overview</h3>
      <Row className="g-3 mb-4">
        {cards.map((c, i) => (
          <Col key={i} sm={6}>
            <Card className="border-0 shadow-sm rounded-4 p-3 h-100">
              <Card.Body className="d-flex align-items-center gap-3">
                <div className="fs-1">{c.icon}</div>
                <div>
                  <div className="text-muted small">{c.title}</div>
                  <div className={`fs-4 fw-bold text-${c.color}`}>{c.value}</div>
                </div>
              </Card.Body>
            </Card>
          </Col>
        ))}
      </Row>
      <Card className="border-0 shadow-sm rounded-4 p-4">
        <h5 className="fw-bold mb-2">Welcome to your Botanical Dashboard</h5>
        <p className="text-muted small mb-0">
          This nested view demonstrates React Router child routes rendered within <code>&lt;DashboardLayout /&gt;</code> using <code>&lt;Outlet /&gt;</code>.
        </p>
      </Card>
    </div>
  );
}

export default DashboardHome;
