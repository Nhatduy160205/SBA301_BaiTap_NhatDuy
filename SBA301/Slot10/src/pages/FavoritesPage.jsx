import React from "react";
import { Row, Col, Card, Button } from "react-bootstrap";
import { Link } from "react-router-dom";
import { orchidService } from "../services/orchidService";
import OrchidCard from "../components/OrchidCard";

function FavoritesPage({ favs, onToggleFav, onOpenModal }) {
  const allOrchids = orchidService.getAllOrchids();
  const favoriteOrchids = allOrchids.filter((o) => favs.includes(o.id));

  return (
    <div>
      <h3 className="fw-bold mb-3">Saved Favorite Orchids ({favoriteOrchids.length})</h3>

      {favoriteOrchids.length === 0 ? (
        <Card className="border-0 shadow-sm rounded-4 p-5 text-center">
          <div className="display-4 text-muted mb-3">🤍</div>
          <h5 className="fw-bold">No Favorites Yet</h5>
          <p className="text-muted small mb-4">
            Click the heart icon on any orchid in the gallery to add it to your favorites list.
          </p>
          <Button as={Link} to="/orchids" variant="primary" size="sm" className="mx-auto">
            Browse Orchid Gallery
          </Button>
        </Card>
      ) : (
        <Row xs={1} sm={2} lg={3} className="g-3">
          {favoriteOrchids.map((o) => (
            <Col key={o.id}>
              <OrchidCard
                orchid={o}
                isFav={true}
                onToggleFav={onToggleFav}
                onOpenModal={onOpenModal}
              />
            </Col>
          ))}
        </Row>
      )}
    </div>
  );
}

export default FavoritesPage;
