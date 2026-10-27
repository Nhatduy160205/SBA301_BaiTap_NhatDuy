import React from "react";
import { Container } from "react-bootstrap";

function AppFooter() {
  return (
    <footer className="bg-dark text-light py-4 mt-auto">
      <Container className="text-center">
        <p className="mb-1 fw-medium">
          ⚡ Fetching & Caching Data Client • SBA301 SPA Integration
        </p>
        <p className="text-muted small mb-0">
          In-Memory TTL Caching, AbortController, Microtask Event Loop & Service Layer • Slot 09 Guide
        </p>
      </Container>
    </footer>
  );
}

export default AppFooter;
