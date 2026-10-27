import React, { useState, useEffect, useRef } from "react";
import { Modal, Button, Form, Alert } from "react-bootstrap";
import { productService } from "../services/productService";

function ProductForm({ show, onHide, onSave, editingProduct }) {
  const [formData, setFormData] = useState({
    name: "",
    category: "Accessories",
    price: "",
    quantity: ""
  });
  const [errors, setErrors] = useState({});
  const nameInputRef = useRef(null);

  useEffect(() => {
    if (editingProduct) {
      setFormData({
        name: editingProduct.name,
        category: editingProduct.category,
        price: editingProduct.price,
        quantity: editingProduct.quantity
      });
    } else {
      setFormData({
        name: "",
        category: "Accessories",
        price: "",
        quantity: ""
      });
    }
    setErrors({});
  }, [editingProduct, show]);

  useEffect(() => {
    if (show && nameInputRef.current) {
      setTimeout(() => nameInputRef.current.focus(), 150);
    }
  }, [show]);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
    if (errors[name]) {
      setErrors((prev) => ({ ...prev, [name]: null }));
    }
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    const validation = productService.validateProduct(formData);
    if (!validation.isValid) {
      setErrors(validation.errors);
      return;
    }

    onSave(formData);
    onHide();
  };

  return (
    <Modal show={show} onHide={onHide} centered>
      <Form onSubmit={handleSubmit}>
        <Modal.Header closeButton>
          <Modal.Title className="fw-bold">
            {editingProduct ? "Edit Product" : "Add New Product"}
          </Modal.Title>
        </Modal.Header>
        <Modal.Body>
          {Object.keys(errors).length > 0 && (
            <Alert variant="danger" className="py-2 small">
              Please fix the errors below before submitting.
            </Alert>
          )}

          <Form.Group className="mb-3">
            <Form.Label>Product Name</Form.Label>
            <Form.Control
              type="text"
              name="name"
              ref={nameInputRef}
              value={formData.name}
              onChange={handleChange}
              isInvalid={Boolean(errors.name)}
              placeholder="e.g. Ergonomic Office Chair"
            />
            <Form.Control.Feedback type="invalid">{errors.name}</Form.Control.Feedback>
          </Form.Group>

          <Form.Group className="mb-3">
            <Form.Label>Category</Form.Label>
            <Form.Select
              name="category"
              value={formData.category}
              onChange={handleChange}
              isInvalid={Boolean(errors.category)}
            >
              <option value="Accessories">Accessories</option>
              <option value="Display">Display</option>
              <option value="Connectivity">Connectivity</option>
              <option value="Workspace">Workspace</option>
              <option value="Audio">Audio</option>
              <option value="Storage">Storage</option>
            </Form.Select>
            <Form.Control.Feedback type="invalid">{errors.category}</Form.Control.Feedback>
          </Form.Group>

          <div className="row g-3">
            <div className="col-md-6">
              <Form.Group className="mb-3">
                <Form.Label>Price (VND)</Form.Label>
                <Form.Control
                  type="number"
                  name="price"
                  value={formData.price}
                  onChange={handleChange}
                  isInvalid={Boolean(errors.price)}
                  placeholder="e.g. 1500000"
                />
                <Form.Control.Feedback type="invalid">{errors.price}</Form.Control.Feedback>
              </Form.Group>
            </div>
            <div className="col-md-6">
              <Form.Group className="mb-3">
                <Form.Label>Quantity</Form.Label>
                <Form.Control
                  type="number"
                  name="quantity"
                  value={formData.quantity}
                  onChange={handleChange}
                  isInvalid={Boolean(errors.quantity)}
                  placeholder="e.g. 10"
                />
                <Form.Control.Feedback type="invalid">{errors.quantity}</Form.Control.Feedback>
              </Form.Group>
            </div>
          </div>
        </Modal.Body>
        <Modal.Footer>
          <Button variant="secondary" onClick={onHide}>
            Cancel
          </Button>
          <Button variant="primary" type="submit">
            {editingProduct ? "Save Changes" : "Create Product"}
          </Button>
        </Modal.Footer>
      </Form>
    </Modal>
  );
}

export default ProductForm;
