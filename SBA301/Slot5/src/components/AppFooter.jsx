import React from "react";
import { Container } from "react-bootstrap";

function AppFooter() {
  return (
    <footer id="about" className="bg-dark text-light py-4 mt-auto">
      <Container className="text-center">
        <p className="mb-1 fw-medium">
          🎓 EventHub Campus Explorer • SBA301 SPA Integration
        </p>
        <p className="text-muted small mb-0">
          Architecture: Model-View-Controller with Service Business Layer • Slot 05 Guide
        </p>
      </Container>
    </footer>
  );
}

export default AppFooter;
