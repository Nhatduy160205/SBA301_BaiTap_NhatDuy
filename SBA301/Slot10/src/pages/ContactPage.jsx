import React, { useState } from "react";
import { Container, Card, Form, Button, Alert } from "react-bootstrap";

function ContactPage() {
  const [submitted, setSubmitted] = useState(false);

  const handleSubmit = (e) => {
    e.preventDefault();
    setSubmitted(true);
  };

  return (
    <Container className="py-5 mb-5 max-w-600">
      <Card className="border-0 shadow-sm p-4 p-md-5 rounded-4">
        <h2 className="fw-bold mb-2">Get in Touch</h2>
        <p className="text-muted small mb-4">Have botanical questions or need assistance with your orchid collection?</p>

        {submitted ? (
          <Alert variant="success">
            Thank you! Your message has been received. Our orchid specialist will contact you shortly.
          </Alert>
        ) : (
          <Form onSubmit={handleSubmit}>
            <Form.Group className="mb-3">
              <Form.Label>Your Name</Form.Label>
              <Form.Control required type="text" placeholder="e.g. Maria Tran" />
            </Form.Group>

            <Form.Group className="mb-3">
              <Form.Label>Email Address</Form.Label>
              <Form.Control required type="email" placeholder="e.g. maria@example.com" />
            </Form.Group>

            <Form.Group className="mb-3">
              <Form.Label>Inquiry Subject</Form.Label>
              <Form.Control required type="text" placeholder="e.g. Cattleya repotting advice" />
            </Form.Group>

            <Form.Group className="mb-4">
              <Form.Label>Message</Form.Label>
              <Form.Control as="textarea" rows={4} required placeholder="Write your question..." />
            </Form.Group>

            <Button variant="primary" type="submit" className="w-100">
              Send Message
            </Button>
          </Form>
        )}
      </Card>
    </Container>
  );
}

export default ContactPage;
