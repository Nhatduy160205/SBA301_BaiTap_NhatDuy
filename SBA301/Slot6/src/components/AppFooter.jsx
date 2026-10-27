import React from "react";
import { Container } from "react-bootstrap";

function AppFooter() {
  return (
    <footer className="bg-dark text-light py-4 mt-auto">
      <Container className="text-center">
        <p className="mb-1 fw-medium">
          📦 React Hook Product Manager • SBA301 SPA Integration
        </p>
        <p className="text-muted small mb-0">
          Stateful Hooks (useState, useEffect, useContext, useRef, Custom Hook) + Service Logic • Slot 06 Guide
        </p>
      </Container>
    </footer>
  );
}

export default AppFooter;
