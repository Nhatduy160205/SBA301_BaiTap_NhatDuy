import React from "react";
import { Container, Button } from "react-bootstrap";
import { Link } from "react-router-dom";

function NotFound() {
  return (
    <Container className="py-5 text-center my-auto">
      <div className="display-1 fw-bold text-muted mb-2">404</div>
      <h2 className="fw-bold mb-3">Page Not Found</h2>
      <p className="text-secondary max-w-500 mx-auto mb-4">
        The route you are navigating to does not exist in this Single Page Application.
      </p>
      <Button as={Link} to="/" variant="primary" size="lg">
        Return to Home Page
      </Button>
    </Container>
  );
}

export default NotFound;
