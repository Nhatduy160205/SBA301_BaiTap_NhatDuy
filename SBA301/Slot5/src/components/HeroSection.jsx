import React from "react";
import { Container, Row, Col, Card } from "react-bootstrap";

function HeroSection({ metrics }) {
  return (
    <div className="hero-banner py-5 text-white mb-4">
      <Container>
        <div className="text-center mb-4">
          <span className="badge bg-light text-dark px-3 py-1 rounded-pill mb-2 fw-semibold">
            SBA301 • Slot 05 Reinforcement
          </span>
          <h1 className="display-5 fw-bold mb-2">Campus Event Explorer</h1>
          <p className="lead max-w-650 mx-auto text-light opacity-90 small">
            Connect with campus life, workshops, athletic events, and networking opportunities powered by reactive state and service-oriented architecture.
          </p>
        </div>

        <Row className="g-3 justify-content-center">
          <Col xs={6} md={3}>
            <Card className="text-center border-0 shadow-sm metric-card">
              <Card.Body className="py-3">
                <div className="text-muted small">Total Events</div>
                <div className="fs-3 fw-bold text-primary">{metrics.totalEvents}</div>
              </Card.Body>
            </Card>
          </Col>
          <Col xs={6} md={3}>
            <Card className="text-center border-0 shadow-sm metric-card">
              <Card.Body className="py-3">
                <div className="text-muted small">Featured Programs</div>
                <div className="fs-3 fw-bold text-warning">{metrics.featuredEvents}</div>
              </Card.Body>
            </Card>
          </Col>
          <Col xs={6} md={3}>
            <Card className="text-center border-0 shadow-sm metric-card">
              <Card.Body className="py-3">
                <div className="text-muted small">Student Capacity</div>
                <div className="fs-3 fw-bold text-success">{metrics.totalCapacity}</div>
              </Card.Body>
            </Card>
          </Col>
          <Col xs={6} md={3}>
            <Card className="text-center border-0 shadow-sm metric-card">
              <Card.Body className="py-3">
                <div className="text-muted small">Event Categories</div>
                <div className="fs-3 fw-bold text-info">{metrics.totalCategories}</div>
              </Card.Body>
            </Card>
          </Col>
        </Row>
      </Container>
    </div>
  );
}

export default HeroSection;
