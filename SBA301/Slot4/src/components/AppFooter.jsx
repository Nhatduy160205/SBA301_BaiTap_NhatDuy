import React from "react";
import { Container } from "react-bootstrap";

function AppFooter() {
  return (
    <footer className="bg-dark text-light py-4 mt-auto">
      <Container className="text-center">
        <p className="mb-1 fw-medium">
          🌺 Interactive Orchid Explorer • SBA301 Single Page Application
        </p>
        <p className="text-muted small mb-0">
          State-driven reactive UI powered by React Hooks, Context & Service Layer • Slot 04 Guide
        </p>
      </Container>
    </footer>
  );
}

export default AppFooter;
