import React from "react";
import { Row, Col, Card } from "react-bootstrap";

function ProductStats({ stats }) {
  const cards = [
    { label: "Total Items", value: stats.totalCount, icon: "📦", color: "primary" },
    { label: "Inventory Stock", value: stats.totalQuantity, icon: "📊", color: "info" },
    { label: "Total Valuation", value: `${stats.totalValuation.toLocaleString()} đ`, icon: "💰", color: "success" },
    { label: "Low Stock Alert (<5)", value: stats.lowStockCount, icon: "⚠️", color: stats.lowStockCount > 0 ? "danger" : "secondary" }
  ];

  return (
    <Row className="g-3 mb-4">
      {cards.map((c, i) => (
        <Col key={i} xs={6} md={3}>
          <Card className="h-100 shadow-sm border-0 stat-card">
            <Card.Body className="d-flex align-items-center gap-3">
              <div className="fs-2">{c.icon}</div>
              <div>
                <div className="text-muted small fw-medium">{c.label}</div>
                <div className={`fs-5 fw-bold text-${c.color}`}>{c.value}</div>
              </div>
            </Card.Body>
          </Card>
        </Col>
      ))}
    </Row>
  );
}

export default ProductStats;
