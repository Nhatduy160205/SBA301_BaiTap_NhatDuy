import React, { useEffect, useState } from "react";
import { Alert, Button, Container, Form, Spinner } from "react-bootstrap";
import { useNavigate, useParams, Link } from "react-router-dom";
import { getOrchidById, updateOrchid } from "../api/orchidApi";

export default function EditOrchid() {
  const { id } = useParams();
  const navigate = useNavigate();
  const [form, setForm] = useState(null);
  const [error, setError] = useState("");
  const [submitting, setSubmitting] = useState(false);

  useEffect(() => {
    let ignore = false;
    (async () => {
      try {
        const response = await getOrchidById(id);
        if (!ignore) {
          const d = response.data;
          setForm({
            orchidName: d.orchidName ?? "",
            orchidCategory: d.orchidCategory ?? "",
            orchidDescription: d.orchidDescription ?? "",
            orchidURL: d.orchidURL ?? "",
            isNatural: !!(d.isNatural ?? d.natural),
            isAttractive: !!(d.isAttractive ?? d.attractive),
          });
        }
      } catch (err) {
        if (!ignore) setError(err.response?.data?.message ?? "Không thể tải thông tin hoa lan");
      }
    })();
    return () => {
      ignore = true;
    };
  }, [id]);

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
      setError("Tên hoa lan không được để trống");
      return;
    }
    try {
      setSubmitting(true);
      await updateOrchid(id, form);
      navigate("/orchids");
    } catch (err) {
      setError(err.response?.data?.message ?? "Update failed");
    } finally {
      setSubmitting(false);
    }
  }

  if (!form && !error) {
    return (
      <Container className="text-center py-5">
        <Spinner animation="border" variant="primary" />
        <p className="mt-2 text-muted">Đang tải thông tin hoa lan #{id}...</p>
      </Container>
    );
  }

  return (
    <Container style={{ maxWidth: "720px" }}>
      <div className="card shadow-sm border-0 p-4">
        <div className="d-flex justify-content-between align-items-center mb-3 pb-2 border-bottom">
          <h2 className="fw-bold mb-0">✏️ Chỉnh Sửa Hoa Lan #{id}</h2>
          <Button as={Link} to="/orchids" variant="outline-secondary" size="sm">
            ← Quay lại
          </Button>
        </div>

        {error && <Alert variant="danger">⚠️ {error}</Alert>}

        {form && (
          <Form onSubmit={handleSubmit}>
            <Form.Group className="mb-3">
              <Form.Label className="fw-semibold">Tên hoa lan (Name) <span className="text-danger">*</span></Form.Label>
              <Form.Control
                name="orchidName"
                value={form.orchidName ?? ""}
                onChange={handleChange}
                required
              />
            </Form.Group>

            <Form.Group className="mb-3">
              <Form.Label className="fw-semibold">Danh mục (Category)</Form.Label>
              <Form.Control
                name="orchidCategory"
                value={form.orchidCategory ?? ""}
                onChange={handleChange}
              />
            </Form.Group>

            <Form.Group className="mb-3">
              <Form.Label className="fw-semibold">Mô tả (Description)</Form.Label>
              <Form.Control
                as="textarea"
                rows={3}
                name="orchidDescription"
                value={form.orchidDescription ?? ""}
                onChange={handleChange}
              />
            </Form.Group>

            <Form.Group className="mb-3">
              <Form.Label className="fw-semibold">Đường dẫn ảnh (Image URL)</Form.Label>
              <Form.Control
                name="orchidURL"
                value={form.orchidURL ?? ""}
                onChange={handleChange}
              />
            </Form.Group>

            <div className="d-flex gap-4 p-3 bg-light rounded mb-4">
              <Form.Check
                type="checkbox"
                id="editNatural"
                name="isNatural"
                label="🌿 Tự nhiên (Natural)"
                checked={!!form.isNatural}
                onChange={handleChange}
              />
              <Form.Check
                type="checkbox"
                id="editAttractive"
                name="isAttractive"
                label="✨ Quyến rũ (Attractive)"
                checked={!!form.isAttractive}
                onChange={handleChange}
              />
            </div>

            <div className="d-flex justify-content-end gap-2">
              <Button as={Link} to="/orchids" variant="secondary">
                Hủy bỏ
              </Button>
              <Button variant="success" type="submit" disabled={submitting} className="px-4">
                {submitting ? "Đang lưu..." : "💾 Lưu Thay Đổi (Save Changes)"}
              </Button>
            </div>
          </Form>
        )}
      </div>
    </Container>
  );
}
