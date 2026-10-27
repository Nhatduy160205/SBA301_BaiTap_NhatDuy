import React from "react";
import { Container, Row, Col, Button, Card, Badge } from "react-bootstrap";
import { Link } from "react-router-dom";
import { orchidService } from "../services/orchidService";

function HomePage({ favs, onToggleFav, onOpenModal }) {
  const specials = orchidService.getSpecialOrchids();
  const stats = orchidService.getStats();

  return (
    <div>
      <div className="hero-banner py-5 text-white mb-5 text-center">
        <Container>
          <Badge bg="light" text="dark" className="px-3 py-2 rounded-pill mb-3">
            SBA301 • Slot 10 React Router & Lab 02 Bridge
          </Badge>
          <h1 className="display-4 fw-bold mb-3">Exquisite Orchid Sanctuary</h1>
          <p className="lead max-w-650 mx-auto text-light opacity-90 mb-4">
            A comprehensive Single Page Application featuring nested layouts, dynamic routes, query parameter filters, and the Lab 02 Modal Bridge.
          </p>
          <div className="d-flex justify-content-center gap-3">
            <Button as={Link} to="/orchids" variant="primary" size="lg">
              View All Orchids ({stats.total})
            </Button>
            <Button as={Link} to="/dashboard" variant="outline-light" size="lg">
              Open Dashboard
            </Button>
          </div>
        </Container>
      </div>

      <Container className="mb-5">
        <div className="d-flex justify-content-between align-items-center mb-4">
          <div>
            <h2 className="fw-bold mb-1">🌟 Rare & Special Orchids</h2>
            <p className="text-muted mb-0">Handpicked rare varieties for connoisseurs</p>
          </div>
          <Button as={Link} to="/orchids?special=true" variant="link" className="text-decoration-none">
            Filter Specials Only →
          </Button>
        </div>

        <Row xs={1} sm={2} md={3} className="g-4">
          {specials.map((o) => (
            <Col key={o.id}>
              <Card className="h-100 shadow-sm border-0 rounded-4 overflow-hidden orchid-card">
                <img
                  src={o.image}
                  alt={o.orchidName}
                  style={{ height: "200px", objectFit: "cover" }}
                  onError={(e) => {
                    e.target.src = "https://images.unsplash.com/photo-1525310072745-f49212b5ac6d?w=600&auto=format&fit=crop&q=80";
                  }}
                />
                <Card.Body>
                  <Badge bg="danger" className="mb-2">Special</Badge>
                  <Card.Title className="fw-bold">{o.orchidName}</Card.Title>
                  <Card.Text className="small text-muted">{o.description}</Card.Text>
                  <Button as={Link} to={`/orchids/${o.id}`} variant="outline-primary" size="sm" className="w-100">
                    Explore Details →
                  </Button>
                </Card.Body>
              </Card>
            </Col>
          ))}
        </Row>
      </Container>
    </div>
  );
}

export default HomePage;
