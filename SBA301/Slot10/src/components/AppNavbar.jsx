import React from "react";
import { Navbar, Container, Nav, Badge } from "react-bootstrap";
import { NavLink } from "react-router-dom";

function AppNavbar({ favCount }) {
  return (
    <Navbar bg="dark" variant="dark" expand="lg" sticky="top" className="shadow-sm">
      <Container>
        <Navbar.Brand as={NavLink} to="/" className="fw-bold d-flex align-items-center gap-2">
          🌸 <span>Orchid SPA</span>
        </Navbar.Brand>
        <Navbar.Toggle aria-controls="slot10-nav" />
        <Navbar.Collapse id="slot10-nav">
          <Nav className="me-auto">
            <Nav.Link as={NavLink} to="/" end>
              Home
            </Nav.Link>
            <Nav.Link as={NavLink} to="/orchids">
              Orchid Gallery
            </Nav.Link>
            <Nav.Link as={NavLink} to="/dashboard">
              Dashboard (Nested)
            </Nav.Link>
            <Nav.Link as={NavLink} to="/about">
              About
            </Nav.Link>
            <Nav.Link as={NavLink} to="/contact">
              Contact
            </Nav.Link>
          </Nav>
          <Nav>
            <Nav.Link as={NavLink} to="/dashboard/favorites" className="d-flex align-items-center">
              <Badge bg="danger" className="px-3 py-2 rounded-pill">
                ❤️ Favorites ({favCount})
              </Badge>
            </Nav.Link>
          </Nav>
        </Navbar.Collapse>
      </Container>
    </Navbar>
  );
}

export default AppNavbar;
