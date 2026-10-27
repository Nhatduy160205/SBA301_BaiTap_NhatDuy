import React from "react";
import { Container } from "react-bootstrap";

function AppFooter() {
  return (
    <footer className="bg-dark text-light py-4 mt-auto">
      <Container className="text-center">
        <p className="mb-1 fw-medium">
          🌸 Orchid Gallery SPA • SBA301 React Router & Single Page Application
        </p>
        <p className="text-muted small mb-0">
          Nested Routing, Dynamic Route Parameters, Lab 02 Bridge & Service Layer • Slot 10 Guide
        </p>
      </Container>
    </footer>
  );
}

export default AppFooter;
