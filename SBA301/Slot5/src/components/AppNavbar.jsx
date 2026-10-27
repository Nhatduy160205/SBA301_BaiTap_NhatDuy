import React from "react";
import { Navbar, Container, Nav, Badge } from "react-bootstrap";

function AppNavbar({ registeredCount }) {
  return (
    <Navbar bg="dark" variant="dark" expand="lg" sticky="top" className="shadow-sm">
      <Container>
        <Navbar.Brand href="#top" className="fw-bold d-flex align-items-center gap-2">
          🎓 <span>EventHub</span>
        </Navbar.Brand>
        <Navbar.Toggle aria-controls="eventhub-nav" />
        <Navbar.Collapse id="eventhub-nav">
          <Nav className="me-auto">
            <Nav.Link href="#top">Home</Nav.Link>
            <Nav.Link href="#events">Explore Events</Nav.Link>
            <Nav.Link href="#about">About</Nav.Link>
          </Nav>
          <div className="d-flex align-items-center">
            <Badge bg="primary" className="px-3 py-2 rounded-pill fs-7">
              🎫 My Registrations: {registeredCount}
            </Badge>
          </div>
        </Navbar.Collapse>
      </Container>
    </Navbar>
  );
}

export default AppNavbar;
