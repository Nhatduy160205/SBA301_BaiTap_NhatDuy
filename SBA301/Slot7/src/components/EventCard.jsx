import React from "react";
import { Card, Badge, Button } from "react-bootstrap";
import { Link } from "react-router-dom";

function EventCard({ event }) {
  return (
    <Card className="h-100 shadow-sm border-0 event-card overflow-hidden">
      <div className="position-relative event-card-img-wrap">
        <Card.Img
          variant="top"
          src={event.image}
          alt={event.title}
          className="event-card-img"
        />
        {event.featured && (
          <Badge bg="warning" text="dark" className="position-absolute top-0 end-0 m-2 fw-bold">
            ★ Featured
          </Badge>
        )}
        <Badge bg="primary" className="position-absolute bottom-0 start-0 m-2">
          {event.category}
        </Badge>
      </div>

      <Card.Body className="d-flex flex-column">
        <div className="text-muted small mb-1">
          📅 {event.date} • 📍 {event.location}
        </div>

        <Card.Title className="fw-bold fs-6 mb-2 text-dark">{event.title}</Card.Title>

        <Card.Text className="text-secondary small flex-grow-1">
          {event.description}
        </Card.Text>

        <div className="mt-3 pt-2 border-top d-flex justify-content-between align-items-center">
          <span className="small text-muted">👥 {event.seats} seats</span>
          <Button as={Link} to={`/events/${event.id}`} variant="outline-primary" size="sm">
            View Details →
          </Button>
        </div>
      </Card.Body>
    </Card>
  );
}

export default EventCard;
