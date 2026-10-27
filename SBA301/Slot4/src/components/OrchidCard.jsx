import React from "react";
import { Card, Badge, Button } from "react-bootstrap";
import { useOrchidContext } from "../context/OrchidContext";

function OrchidCard({ orchid }) {
  const { favorites, handleToggleFavorite, handleOpenDetail } = useOrchidContext();
  const isFav = favorites.has(orchid.id);

  return (
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
          <Badge bg="danger" className="position-absolute top-0 end-0 m-2 shadow-sm">
            ★ Special
          </Badge>
        )}
        <Button
          variant={isFav ? "danger" : "light"}
          size="sm"
          className="position-absolute top-0 start-0 m-2 btn-fav shadow-sm"
          onClick={() => handleToggleFavorite(orchid.id)}
          title={isFav ? "Remove from Favorites" : "Add to Favorites"}
        >
          {isFav ? "❤️" : "🤍"}
        </Button>
        <Badge bg="dark" className="position-absolute bottom-0 start-0 m-2 bg-opacity-75">
          {orchid.category}
        </Badge>
      </div>

      <Card.Body className="d-flex flex-column">
        <div className="d-flex justify-content-between align-items-start mb-2">
          <Card.Title className="fw-bold fs-6 mb-0">{orchid.orchidName}</Card.Title>
          <span className="text-warning fw-bold small">
            ★ {orchid.rating}
          </span>
        </div>

        <div className="text-muted small mb-2">
          <span>📍 {orchid.origin}</span> • <span>🎨 {orchid.color}</span>
        </div>

        <Card.Text className="text-secondary small flex-grow-1 text-truncate-2">
          {orchid.description}
        </Card.Text>

        <Button
          variant="outline-primary"
          size="sm"
          className="w-100 mt-2"
          onClick={() => handleOpenDetail(orchid)}
        >
          Quick View Details
        </Button>
      </Card.Body>
    </Card>
  );
}

export default OrchidCard;
