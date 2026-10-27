import React from "react";
import { Modal, Button } from "react-bootstrap";

function DeleteModal({ show, onHide, onConfirm, product }) {
  if (!product) return null;

  return (
    <Modal show={show} onHide={onHide} centered>
      <Modal.Header closeButton>
        <Modal.Title className="fw-bold text-danger">Confirm Delete</Modal.Title>
      </Modal.Header>
      <Modal.Body>
        <p>
          Are you sure you want to permanently delete <strong>{product.name}</strong>?
        </p>
        <p className="small text-muted mb-0">This action cannot be undone.</p>
      </Modal.Body>
      <Modal.Footer>
        <Button variant="secondary" onClick={onHide}>
          Cancel
        </Button>
        <Button variant="danger" onClick={onConfirm}>
          Yes, Delete Product
        </Button>
      </Modal.Footer>
    </Modal>
  );
}

export default DeleteModal;
