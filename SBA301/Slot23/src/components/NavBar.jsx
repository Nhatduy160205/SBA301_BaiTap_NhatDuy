import React from "react";
import { Container, Navbar, Nav } from "react-bootstrap";
import { Link } from "react-router-dom";

export default function NavBar() {
  return (
    <Navbar bg="dark" data-bs-theme="dark" expand="lg" className="mb-4 shadow-sm">
      <Container>
        <Navbar.Brand as={Link} to="/orchids" className="fw-bold">
          🌸 SBA301 Slot 23 - Orchid Management
        </Navbar.Brand>
        <Navbar.Toggle aria-controls="basic-nav" />
        <Navbar.Collapse id="basic-nav">
          <Nav className="me-auto">
            <Nav.Link as={Link} to="/orchids">Danh sách hoa lan (Orchids)</Nav.Link>
          </Nav>
          <Navbar.Text className="text-secondary small">
            Part B: React CRUD Client • Axios • Forms • UI State
          </Navbar.Text>
        </Navbar.Collapse>
      </Container>
    </Navbar>
  );
}
