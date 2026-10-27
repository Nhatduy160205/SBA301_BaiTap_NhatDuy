import React, { useState } from "react";
import { Button, Form, Modal, Alert } from "react-bootstrap";
import { createOrchid } from "../api/orchidApi";

const initialForm = {
  orchidName: "",
  isNatural: true,
  orchidDescription: "",
  orchidCategory: "",
  isAttractive: false,
  orchidURL: "",
};

export default function OrchidForm({ show, onHide, onCreated }) {
  const [form, setForm] = useState(initialForm);
  const [error, setError] = useState("");
  const [submitting, setSubmitting] = useState(false);

  function handleChange(e) {
    const { name, value, type, checked } = e.target;
    setForm((current) => ({
      ...current,
      [name]: type === "checkbox" ? checked : value,
    }));
  }

  async function handleSubmit(e) {
    e.preventDefault();
    if (!form.orchidName.trim()) {
      setError("Orchid name is required and cannot be blank");
      return;
    }
    try {
      setSubmitting(true);
      setError("");
      await createOrchid(form);
      setForm(initialForm);
      onHide();
      await onCreated();
    } catch (err) {
      setError(err.response?.data?.message ?? "Create failed");
    } finally {
      setSubmitting(false);
    }
  }

  return (
    <Modal show={show} onHide={onHide} centered>
      <Form onSubmit={handleSubmit}>
        <Modal.Header closeButton className="bg-light">
          <Modal.Title className="fw-bold">➕ Create New Orchid</Modal.Title>
        </Modal.Header>
        <Modal.Body>
          {error && <Alert variant="danger">⚠️ {error}</Alert>}
          <Form.Group className="mb-3">
            <Form.Label className="fw-semibold">Tên hoa lan (Name) <span className="text-danger">*</span></Form.Label>
            <Form.Control
              name="orchidName"
              value={form.orchidName}
              onChange={handleChange}
              placeholder="VD: Cattleya Lab05, Dendrobium..."
              required
            />
          </Form.Group>
          <Form.Group className="mb-3">
            <Form.Label className="fw-semibold">Danh mục (Category)</Form.Label>
            <Form.Control
              name="orchidCategory"
              value={form.orchidCategory}
              onChange={handleChange}
              placeholder="VD: Cattleya, Phalaenopsis..."
            />
          </Form.Group>
          <Form.Group className="mb-3">
            <Form.Label className="fw-semibold">Mô tả (Description)</Form.Label>
            <Form.Control
              as="textarea"
              rows={3}
              name="orchidDescription"
              value={form.orchidDescription}
              onChange={handleChange}
              placeholder="Nhập mô tả về hoa lan..."
            />
          </Form.Group>
          <Form.Group className="mb-3">
            <Form.Label className="fw-semibold">Đường dẫn ảnh (Image URL)</Form.Label>
            <Form.Control
              name="orchidURL"
              value={form.orchidURL}
              onChange={handleChange}
              placeholder="https://example.com/orchid.jpg"
            />
          </Form.Group>
          <div className="d-flex gap-4 p-2 bg-light rounded">
            <Form.Check
              type="checkbox"
              id="naturalCheck"
              name="isNatural"
              label="🌿 Tự nhiên (Natural)"
              checked={form.isNatural}
              onChange={handleChange}
            />
            <Form.Check
              type="checkbox"
              id="attractiveCheck"
              name="isAttractive"
              label="✨ Quyến rũ (Attractive)"
              checked={form.isAttractive}
              onChange={handleChange}
            />
          </div>
        </Modal.Body>
        <Modal.Footer>
          <Button variant="secondary" onClick={onHide}>
            Hủy bỏ
          </Button>
          <Button type="submit" variant="primary" disabled={submitting}>
            {submitting ? "Đang lưu..." : "💾 Lưu hoa lan (Save)"}
          </Button>
        </Modal.Footer>
      </Form>
    </Modal>
  );
}
