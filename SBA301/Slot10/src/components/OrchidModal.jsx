import React from "react";
import { Modal, Button, Badge } from "react-bootstrap";
import { useNavigate } from "react-router-dom";

function OrchidModal({ orchid, show, onHide, isFav, onToggleFav }) {
  const navigate = useNavigate();

  if (!orchid) return null;

  return (
    <Modal show={show} onHide={onHide} centered size="lg">
      <Modal.Header closeButton>
        <Modal.Title className="fw-bold d-flex align-items-center gap-2">
          {orchid.orchidName}
          {orchid.isSpecial && <Badge bg="danger">★ Special</Badge>}
        </Modal.Title>
      </Modal.Header>
      <Modal.Body>
        <div className="row g-4">
          <div className="col-md-6">
            <img
              src={orchid.image}
              alt={orchid.orchidName}
              className="img-fluid rounded shadow-sm w-100"
              style={{ maxHeight: "300px", objectFit: "cover" }}
              onError={(e) => {
                e.target.src = "https://images.unsplash.com/photo-1525310072745-f49212b5ac6d?w=600&auto=format&fit=crop&q=80";
              }}
            />
          </div>
          <div className="col-md-6 d-flex flex-column">
            <h5 className="text-primary mb-3">{orchid.category} Orchid</h5>
            <ul className="list-unstyled mb-3 small">
              <li className="mb-2"><strong>Origin:</strong> {orchid.origin}</li>
              <li className="mb-2"><strong>Color:</strong> {orchid.color}</li>
              <li className="mb-2"><strong>Rating:</strong> ⭐ {orchid.rating} / 5.0</li>
              <li className="mb-2"><strong>Classification:</strong> {orchid.isSpecial ? "Special Exotic" : "Standard"}</li>
            </ul>
            <p className="text-secondary small mb-4">{orchid.description}</p>
            <div className="mt-auto d-flex gap-2">
              <Button
                variant={isFav ? "danger" : "outline-danger"}
                size="sm"
                onClick={() => onToggleFav(orchid.id)}
              >
                {isFav ? "❤️ Favorited" : "🤍 Favorite"}
              </Button>
              <Button
                variant="primary"
                size="sm"
                onClick={() => {
                  onHide();
                  navigate(`/orchids/${orchid.id}`);
                }}
              >
                Open Full Detail Page →
              </Button>
            </div>
          </div>
        </div>
      </Modal.Body>
      <Modal.Footer>
        <Button variant="secondary" onClick={onHide}>
          Close Modal
        </Button>
      </Modal.Footer>
    </Modal>
  );
}

export default OrchidModal;
