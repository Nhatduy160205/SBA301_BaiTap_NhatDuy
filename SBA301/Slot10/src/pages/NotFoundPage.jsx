import React from "react";
import { Container, Button } from "react-bootstrap";
import { Link } from "react-router-dom";

function NotFoundPage() {
  return (
    <Container className="py-5 text-center my-auto">
      <div className="display-1 fw-bold text-muted mb-2">404</div>
      <h2 className="fw-bold mb-3">Page Not Found</h2>
      <p className="text-secondary mb-4">
        The route you are navigating to does not exist in the Orchid SPA.
      </p>
      <Button as={Link} to="/" variant="primary" size="lg">
        Return to Home Page
      </Button>
    </Container>
  );
}

export default NotFoundPage;
