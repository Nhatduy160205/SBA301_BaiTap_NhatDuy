import React from "react";
import { Container } from "react-bootstrap";

function AppFooter() {
  return (
    <footer id="about" className="bg-dark text-light py-4 mt-5">
      <Container className="text-center">
        <p className="mb-1 fw-medium">
          🌸 Orchid Explorer Dashboard • SBA301 Single Page Application
        </p>
        <p className="text-muted small mb-0">
          Built with ReactJS, React-Bootstrap & MVC Layer Service Architecture • Slot 03 Exercise
        </p>
      </Container>
    </footer>
  );
}

export default AppFooter;
