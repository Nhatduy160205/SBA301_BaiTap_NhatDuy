import React from "react";
import { Container } from "react-bootstrap";

function HeroSection() {
  return (
    <div className="hero-banner py-4 text-center text-white mb-4">
      <Container>
        <span className="badge bg-light text-dark px-3 py-1 rounded-pill mb-2 fw-semibold">
          SBA301 • Slot 04 Practice Guide
        </span>
        <h1 className="h2 fw-bold mb-2">Interactive Orchid Collection</h1>
        <p className="text-light opacity-90 max-w-600 mx-auto small mb-0">
          Props, State, Context & Hook Rules driven by a dedicated Service Layer with instantaneous search, multi-attribute filtering, and modal view.
        </p>
      </Container>
    </div>
  );
}

export default HeroSection;
