import React from "react";
import { Container } from "react-bootstrap";

function AppFooter() {
  return (
    <footer className="bg-dark text-light py-4 mt-auto">
      <Container className="text-center">
        <p className="mb-1 fw-medium">
          🧭 Campus Event Navigator • SBA301 React Router & Navigation
        </p>
        <p className="text-muted small mb-0">
          Client-Side Routing, Route Parameters, Browser History & Service Layer • Slot 07 Guide
        </p>
      </Container>
    </footer>
  );
}

export default AppFooter;
