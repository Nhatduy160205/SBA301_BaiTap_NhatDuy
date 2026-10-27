import React from "react";
import { Navbar, Container, Button, Nav } from "react-bootstrap";

function AppNavbar({ activeTab, setActiveTab, onOpenCreateModal }) {
  return (
    <Navbar bg="dark" variant="dark" expand="lg" sticky="top" className="shadow-sm">
      <Container>
        <Navbar.Brand href="#top" className="fw-bold d-flex align-items-center gap-2">
          ⚡ <span>Data Client & Cache</span>
        </Navbar.Brand>
        <Nav className="me-auto">
          <Nav.Link active={activeTab === "users"} onClick={() => setActiveTab("users")}>
            👥 User Directory
          </Nav.Link>
          <Nav.Link active={activeTab === "playground"} onClick={() => setActiveTab("playground")}>
            🧪 Async Playground
          </Nav.Link>
        </Nav>
        <div className="d-flex gap-2">
          <Button variant="outline-light" size="sm" onClick={onOpenCreateModal}>
            + Add User
          </Button>
        </div>
      </Container>
    </Navbar>
  );
}

export default AppNavbar;
