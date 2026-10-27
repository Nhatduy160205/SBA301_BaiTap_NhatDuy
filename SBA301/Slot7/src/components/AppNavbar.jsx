import React from "react";
import { Navbar, Container, Nav } from "react-bootstrap";
import { NavLink } from "react-router-dom";

function AppNavbar() {
  return (
    <Navbar bg="dark" variant="dark" expand="lg" sticky="top" className="shadow-sm">
      <Container>
        <Navbar.Brand as={NavLink} to="/" className="fw-bold d-flex align-items-center gap-2">
          🧭 <span>Event Navigator</span>
        </Navbar.Brand>
        <Navbar.Toggle aria-controls="nav-router" />
        <Navbar.Collapse id="nav-router">
          <Nav className="ms-auto">
            <Nav.Link as={NavLink} to="/" end>
              Home
            </Nav.Link>
            <Nav.Link as={NavLink} to="/events">
              All Events
            </Nav.Link>
            <Nav.Link as={NavLink} to="/about">
              About & Routing
            </Nav.Link>
          </Nav>
        </Navbar.Collapse>
      </Container>
    </Navbar>
  );
}

export default AppNavbar;
