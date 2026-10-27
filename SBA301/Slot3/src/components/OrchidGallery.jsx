import React from "react";
import { Row, Col, Card, Badge, Button } from "react-bootstrap";
import { orchidService } from "../services/orchidService";

function OrchidGallery() {
  const orchids = orchidService.getAllOrchids();

  return (
    <section id="gallery" className="mb-5">
      <div className="d-flex justify-content-between align-items-center mb-4">
        <div>
          <h2 className="fw-bold mb-1">Featured Orchid Collection</h2>
          <p className="text-muted mb-0">Showcasing premium specimens curated by botanical experts</p>
        </div>
        <Badge bg="secondary" className="px-3 py-2 fs-6">
          {orchids.length} Species Available
        </Badge>
      </div>

      <Row xs={1} md={2} lg={3} className="g-4">
        {orchids.map((orchid) => (
          <Col key={orchid.id}>
            <Card className="h-100 shadow-sm border-0 orchid-card overflow-hidden">
              <div className="position-relative card-img-wrapper">
                <Card.Img
                  variant="top"
                  src={orchid.image}
                  alt={orchid.orchidName}
                  className="orchid-card-img"
                  onError={(e) => {
                    e.target.src = "https://images.unsplash.com/photo-1525310072745-f49212b5ac6d?w=600&auto=format&fit=crop&q=80";
                  }}
                />
                {orchid.isSpecial && (
                  <Badge bg="danger" className="position-absolute top-0 end-0 m-3 px-3 py-2 shadow-sm">
                    ★ Special
                  </Badge>
                )}
                <Badge bg="dark" className="position-absolute bottom-0 start-0 m-3 bg-opacity-75">
                  {orchid.category}
                </Badge>
              </div>

              <Card.Body className="d-flex flex-column">
                <div className="d-flex justify-content-between align-items-start mb-2">
                  <Card.Title className="fw-bold fs-5 mb-0">{orchid.orchidName}</Card.Title>
                  <span className="text-warning fw-bold fs-6">
                    ★ {orchid.rating}
                  </span>
                </div>

                <div className="text-muted small mb-2">
                  <span>📍 Origin: {orchid.origin}</span> • <span>🎨 Color: {orchid.color}</span>
                </div>

                <Card.Text className="text-secondary small flex-grow-1">
                  {orchid.description}
                </Card.Text>

                <Button variant="outline-primary" size="sm" className="w-100 mt-3">
                  View Specimen Details
                </Button>
              </Card.Body>
            </Card>
          </Col>
        ))}
      </Row>
    </section>
  );
}

export default OrchidGallery;
