import React from "react";
import { Modal, Button, Badge } from "react-bootstrap";
import { useOrchidContext } from "../context/OrchidContext";

function OrchidModal() {
  const { selectedOrchid, showModal, handleCloseDetail, favorites, handleToggleFavorite } = useOrchidContext();

  if (!selectedOrchid) return null;

  const isFav = favorites.has(selectedOrchid.id);

  return (
    <Modal show={showModal} onHide={handleCloseDetail} centered size="lg">
      <Modal.Header closeButton>
        <Modal.Title className="fw-bold d-flex align-items-center gap-2">
          {selectedOrchid.orchidName}
          {selectedOrchid.isSpecial && <Badge bg="danger">★ Special</Badge>}
        </Modal.Title>
      </Modal.Header>
      <Modal.Body>
        <div className="row g-4">
          <div className="col-md-6">
            <img
              src={selectedOrchid.image}
              alt={selectedOrchid.orchidName}
              className="img-fluid rounded shadow-sm w-100"
              style={{ maxHeight: "320px", objectFit: "cover" }}
              onError={(e) => {
                e.target.src = "https://images.unsplash.com/photo-1525310072745-f49212b5ac6d?w=600&auto=format&fit=crop&q=80";
              }}
            />
          </div>
          <div className="col-md-6 d-flex flex-column">
            <h5 className="text-primary mb-3">{selectedOrchid.category} Orchid</h5>
            <ul className="list-unstyled mb-3">
              <li className="mb-2"><strong>Origin:</strong> {selectedOrchid.origin}</li>
              <li className="mb-2"><strong>Color Profile:</strong> {selectedOrchid.color}</li>
              <li className="mb-2"><strong>Customer Rating:</strong> ⭐ {selectedOrchid.rating} / 5.0</li>
              <li className="mb-2"><strong>Status:</strong> {selectedOrchid.isSpecial ? "Special High-Value Hybrid" : "Standard Cultivar"}</li>
            </ul>
            <p className="text-secondary small mb-4">{selectedOrchid.description}</p>
            <div className="mt-auto d-flex gap-2">
              <Button
                variant={isFav ? "danger" : "outline-danger"}
                onClick={() => handleToggleFavorite(selectedOrchid.id)}
                className="flex-grow-1"
              >
                {isFav ? "❤️ In Favorites" : "🤍 Add to Favorites"}
              </Button>
            </div>
          </div>
        </div>
      </Modal.Body>
      <Modal.Footer>
        <Button variant="secondary" onClick={handleCloseDetail}>
          Close
        </Button>
      </Modal.Footer>
    </Modal>
  );
}

export default OrchidModal;
