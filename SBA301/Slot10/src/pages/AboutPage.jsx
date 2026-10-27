import React from "react";
import { Container, Card, Table } from "react-bootstrap";

function AboutPage() {
  return (
    <Container className="py-5 mb-5">
      <h1 className="fw-bold mb-2">About Orchid Gallery SPA</h1>
      <p className="text-muted mb-4">React Router Architecture & Lab 02 Integration Bridge</p>

      <Card className="border-0 shadow-sm p-4 rounded-4 mb-4">
        <h4 className="fw-bold mb-3">Architectural Bridge Summary</h4>
        <p className="text-secondary">
          In Lab 02, the requirement specifies a responsive orchid gallery with modal view. In Slot 10, we bridge Lab 02 with full Single Page Application routing:
        </p>
        <ul>
          <li><strong>Modal Quick View</strong>: Retains the instant modal inspection from Lab 02.</li>
          <li><strong>Dynamic Route Detail (<code>/orchids/:id</code>)</strong>: Extension providing shareable deep links, browser back/forward history navigation, and dedicated specimen page.</li>
          <li><strong>Nested Dashboard (<code>/dashboard/*</code>)</strong>: Demonstrates nested routes and sub-layouts.</li>
          <li><strong>Service Layer</strong>: Encapsulates all orchid retrieval, category grouping, and localStorage favorites logic.</li>
        </ul>
      </Card>
    </Container>
  );
}

export default AboutPage;
