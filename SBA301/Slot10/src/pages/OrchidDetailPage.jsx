import React from "react";
import { Container, Card, Badge, Button, Row, Col } from "react-bootstrap";
import { useParams, useNavigate } from "react-router-dom";
import { orchidService } from "../services/orchidService";

function OrchidDetailPage({ favs, onToggleFav }) {
  const { id } = useParams();
  const navigate = useNavigate();

  let orchid = null;
  let error = null;

  try {
    orchid = orchidService.getOrchidById(id);
  } catch (err) {
    error = err.message;
  }

  if (error || !orchid) {
    return (
      <Container className="py-5 text-center">
        <div className="display-4 text-danger mb-3">⚠️</div>
        <h2 className="fw-bold mb-2">Orchid Not Found</h2>
        <p className="text-muted mb-4">
          The requested orchid ID (<code>{id}</code>) does not exist in our catalog.
        </p>
        <Button variant="primary" onClick={() => navigate("/orchids")}>
          ← Back to Orchid Gallery
        </Button>
      </Container>
    );
  }

  const isFav = favs.includes(orchid.id);

  return (
    <Container className="py-5 mb-5">
      <Button variant="outline-secondary" size="sm" className="mb-4" onClick={() => navigate(-1)}>
        ← Back
      </Button>

      <Card className="border-0 shadow-sm rounded-4 overflow-hidden">
        <Row className="g-0">
          <Col md={6}>
            <img
              src={orchid.image}
              alt={orchid.orchidName}
              className="w-100 h-100"
              style={{ minHeight: "380px", objectFit: "cover" }}
              onError={(e) => {
                e.target.src = "https://images.unsplash.com/photo-1525310072745-f49212b5ac6d?w=600&auto=format&fit=crop&q=80";
              }}
            />
          </Col>
          <Col md={6} className="p-4 p-md-5 d-flex flex-column justify-content-between">
            <div>
              <div className="d-flex justify-content-between align-items-center mb-3">
                <Badge bg="primary">{orchid.category}</Badge>
                {orchid.isSpecial && <Badge bg="danger">★ Special Hybrid</Badge>}
              </div>

              <h1 className="fw-bold display-6 mb-2">{orchid.orchidName}</h1>

              <div className="text-warning fw-bold fs-5 mb-3">
                ⭐ {orchid.rating} / 5.0 Rating
              </div>

              <ul className="list-unstyled text-muted mb-4">
                <li className="mb-2">📍 <strong>Origin Country:</strong> {orchid.origin}</li>
                <li className="mb-2">🎨 <strong>Color Spectrum:</strong> {orchid.color}</li>
                <li className="mb-2">🌿 <strong>Care Difficulty:</strong> Moderate Indirect Light</li>
              </ul>

              <p className="text-secondary leading-relaxed mb-4">{orchid.description}</p>
            </div>

            <div className="d-flex gap-3">
              <Button
                variant={isFav ? "danger" : "outline-danger"}
                className="flex-grow-1"
                onClick={() => onToggleFav(orchid.id)}
              >
                {isFav ? "❤️ In Favorites" : "🤍 Add to Favorites"}
              </Button>
              <Button variant="outline-secondary" onClick={() => navigate("/orchids")}>
                Browse All
              </Button>
            </div>
          </Col>
        </Row>
      </Card>
    </Container>
  );
}

export default OrchidDetailPage;
