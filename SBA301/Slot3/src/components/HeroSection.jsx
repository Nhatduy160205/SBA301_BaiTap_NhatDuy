import React from "react";
import { Container, Button } from "react-bootstrap";

function HeroSection() {
  return (
    <div className="hero-banner py-5 text-center text-white mb-4">
      <Container>
        <span className="badge bg-light text-dark px-3 py-2 rounded-pill mb-3 fw-semibold">
          SBA301 • Slot 03 Architecture
        </span>
        <h1 className="display-4 fw-bold mb-3">Discover Rare & Exotic Orchids</h1>
        <p className="lead max-w-700 mx-auto text-light opacity-90 mb-4">
          Explore botanical diversity through clean React component architecture, React-Bootstrap responsive grid, and service-driven business logic.
        </p>
        <div className="d-flex justify-content-center gap-3">
          <Button variant="primary" size="lg" href="#gallery">
            Browse Gallery
          </Button>
          <Button variant="outline-light" size="lg" href="#care">
            Growing Guide
          </Button>
        </div>
      </Container>
    </div>
  );
}

export default HeroSection;
