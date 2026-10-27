import React from "react";
import { Container, Card, Badge, Button, Row, Col } from "react-bootstrap";
import { useParams, useNavigate, Link } from "react-router-dom";
import { eventService } from "../services/eventService";

function EventDetail() {
  const { id } = useParams();
  const navigate = useNavigate();

  let event = null;
  let error = null;

  try {
    event = eventService.getEventById(id);
  } catch (err) {
    error = err.message;
  }

  if (error || !event) {
    return (
      <Container className="py-5 text-center">
        <div className="display-4 text-danger mb-3">⚠️</div>
        <h2 className="fw-bold mb-2">Event Not Found</h2>
        <p className="text-muted mb-4">
          The requested event ID (<code>{id}</code>) does not match any current records.
        </p>
        <Button variant="primary" onClick={() => navigate("/events")}>
          ← Back to Events Directory
        </Button>
      </Container>
    );
  }

  return (
    <Container className="py-5 mb-5">
      <Button variant="outline-secondary" size="sm" className="mb-4" onClick={() => navigate(-1)}>
        ← Back
      </Button>

      <Card className="border-0 shadow-sm rounded-4 overflow-hidden">
        <div className="bg-primary text-white p-4 p-md-5 hero-banner-detail">
          <div className="d-flex gap-2 mb-3">
            <Badge bg="light" text="dark">{event.category}</Badge>
            {event.featured && <Badge bg="warning" text="dark">★ Featured Event</Badge>}
          </div>
          <h1 className="fw-bold display-6 mb-2">{event.title}</h1>
          <p className="lead text-light opacity-90 mb-0">Hosted by {event.speaker}</p>
        </div>

        <Card.Body className="p-4 p-md-5">
          <Row className="g-4">
            <Col md={8}>
              <h4 className="fw-bold mb-3">Event Overview</h4>
              <p className="text-secondary fs-6 leading-relaxed mb-4">{event.description}</p>

              <h5 className="fw-bold mb-3">Schedule & Logistics</h5>
              <div className="d-flex flex-column gap-2 text-muted">
                <div>📅 <strong>Date:</strong> {event.date}</div>
                <div>⏰ <strong>Time:</strong> {event.time}</div>
                <div>📍 <strong>Venue:</strong> {event.location}</div>
                <div>👥 <strong>Capacity:</strong> {event.seats} registered participants maximum</div>
              </div>
            </Col>

            <Col md={4}>
              <Card className="bg-light border-0 p-4 rounded-3 text-center">
                <h5 className="fw-bold mb-2">Registration</h5>
                <p className="small text-muted mb-3">Free admission for all university students and faculty.</p>
                <Button variant="primary" size="lg" className="w-100 mb-2" onClick={() => alert(`Registered for ${event.title}!`)}>
                  Reserve Ticket
                </Button>
                <Button as={Link} to="/events" variant="outline-secondary" size="sm" className="w-100">
                  Browse More Events
                </Button>
              </Card>
            </Col>
          </Row>
        </Card.Body>
      </Card>
    </Container>
  );
}

export default EventDetail;
