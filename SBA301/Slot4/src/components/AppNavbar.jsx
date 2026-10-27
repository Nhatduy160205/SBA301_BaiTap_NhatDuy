import React from "react";
import { Navbar, Container, Badge } from "react-bootstrap";
import { useOrchidContext } from "../context/OrchidContext";

function AppNavbar() {
  const { stats } = useOrchidContext();

  return (
    <Navbar bg="dark" variant="dark" expand="lg" sticky="top" className="shadow-sm">
      <Container>
        <Navbar.Brand href="#top" className="fw-bold d-flex align-items-center gap-2">
          🌺 <span>Interactive Orchid Explorer</span>
        </Navbar.Brand>
        <div className="d-flex align-items-center gap-2 ms-auto">
          <Badge bg="danger" className="px-3 py-2 rounded-pill">
            ❤️ Favorites: {stats.favoriteCount}
          </Badge>
          <Badge bg="primary" className="px-3 py-2 rounded-pill">
            🌸 Showing: {stats.visibleCount}
          </Badge>
        </div>
      </Container>
    </Navbar>
  );
}

export default AppNavbar;
