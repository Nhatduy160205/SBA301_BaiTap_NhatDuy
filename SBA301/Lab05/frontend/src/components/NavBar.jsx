import React from "react";
import { Navbar, Nav, Container } from "react-bootstrap";
import { Link } from "react-router-dom";

export default function NavBar() {
  return (
    <Navbar bg="dark" data-bs-theme="dark" expand="lg" className="shadow-sm">
      <Container>
        <Navbar.Brand as={Link} to="/" className="fw-bold">
          🌸 Orchid Management
        </Navbar.Brand>
        <Navbar.Toggle aria-controls="basic-navbar-nav" />
        <Navbar.Collapse id="basic-navbar-nav">
          <Nav className="me-auto">
            <Nav.Link as={Link} to="/">
              Danh sách (List)
            </Nav.Link>
            <Nav.Link as={Link} to="/orchids/new">
              Tạo mới (Create Orchid)
            </Nav.Link>
          </Nav>
          <Navbar.Text className="text-secondary small">
            SBA301 Lab 05 • FE <code>:5173</code> ↔ BE <code>:8080</code>
          </Navbar.Text>
        </Navbar.Collapse>
      </Container>
    </Navbar>
  );
}
