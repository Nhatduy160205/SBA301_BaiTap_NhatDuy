import React from "react";
import { Container, Row, Col, Button, Card } from "react-bootstrap";
import { Link } from "react-router-dom";
import { eventService } from "../services/eventService";
import EventCard from "../components/EventCard";

function Home() {
  const featured = eventService.getFeaturedEvents();
  const stats = eventService.getEventStats();

  return (
    <div>
      {/* Hero Section */}
      <div className="hero-banner py-5 text-white mb-5">
        <Container className="text-center">
          <span className="badge bg-light text-dark px-3 py-1 rounded-pill mb-3 fw-semibold">
            SPA Navigation • React Router
          </span>
          <h1 className="display-4 fw-bold mb-3">Campus Life, Connected</h1>
          <p className="lead max-w-650 mx-auto text-light opacity-90 mb-4">
            Navigate through university workshops, academic conferences, cultural nights, and athletic championships without full page reloads.
          </p>
          <div className="d-flex justify-content-center gap-3">
            <Button as={Link} to="/events" variant="primary" size="lg">
              Explore All Events ({stats.total})
            </Button>
            <Button as={Link} to="/about" variant="outline-light" size="lg">
              How Routing Works
            </Button>
          </div>
        </Container>
      </div>

      {/* Featured Section */}
      <Container className="mb-5">
        <div className="d-flex justify-content-between align-items-center mb-4">
          <div>
            <h2 className="fw-bold mb-1">🌟 Featured Events</h2>
            <p className="text-muted mb-0">High-priority events picked for you by campus leadership</p>
          </div>
          <Button as={Link} to="/events" variant="link" className="text-decoration-none">
            View All ({stats.total}) →
          </Button>
        </div>

        <Row xs={1} sm={2} md={3} lg={4} className="g-4">
          {featured.map((evt) => (
            <Col key={evt.id}>
              <EventCard event={evt} />
            </Col>
          ))}
        </Row>
      </Container>
    </div>
  );
}

export default Home;
