import React from "react";
import { Modal, Button, Badge } from "react-bootstrap";

function EventModal({ event, show, onHide, onRegister, isRegistered }) {
  if (!event) return null;

  return (
    <Modal show={show} onHide={onHide} centered size="lg">
      <Modal.Header closeButton>
        <Modal.Title className="fw-bold d-flex align-items-center gap-2">
          {event.title}
          {event.featured && <Badge bg="warning" text="dark">★ Featured</Badge>}
        </Modal.Title>
      </Modal.Header>
      <Modal.Body>
        <div className="row g-4">
          <div className="col-md-5">
            <img
              src={event.image}
              alt={event.title}
              className="img-fluid rounded shadow-sm w-100"
              style={{ maxHeight: "240px", objectFit: "cover" }}
            />
          </div>
          <div className="col-md-7 d-flex flex-column">
            <div className="mb-3">
              <Badge bg="primary" className="me-2">{event.category}</Badge>
              {isRegistered && <Badge bg="success">✓ You are registered</Badge>}
            </div>
            <ul className="list-unstyled mb-3 small">
              <li className="mb-2"><strong>📅 Date:</strong> {event.date}</li>
              <li className="mb-2"><strong>📍 Venue:</strong> {event.location}</li>
              <li className="mb-2"><strong>👥 Available Seats:</strong> {event.seats} seats</li>
            </ul>
            <p className="text-secondary small">{event.description}</p>
          </div>
        </div>
      </Modal.Body>
      <Modal.Footer>
        <Button variant="secondary" onClick={onHide}>
          Close
        </Button>
        <Button
          variant={isRegistered ? "success" : "primary"}
          onClick={() => onRegister(event.id)}
          disabled={isRegistered}
        >
          {isRegistered ? "✓ Registered" : "Register Now"}
        </Button>
      </Modal.Footer>
    </Modal>
  );
}

export default EventModal;
