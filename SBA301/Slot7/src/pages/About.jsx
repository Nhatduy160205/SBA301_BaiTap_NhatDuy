import React from "react";
import { Container, Card, Table } from "react-bootstrap";

function About() {
  return (
    <Container className="py-5 mb-5">
      <div className="mb-4">
        <h1 className="fw-bold mb-2">About React Router Architecture</h1>
        <p className="text-muted">Mastering client-side routing, route trees, dynamic segments, and browser history</p>
      </div>

      <Card className="border-0 shadow-sm p-4 rounded-4 mb-4">
        <h4 className="fw-bold mb-3">Routing Table & Mental Model</h4>
        <Table responsive bordered hover className="align-middle">
          <thead className="table-light">
            <tr>
              <th>URL Pattern</th>
              <th>View Component</th>
              <th>Parameter / State</th>
              <th>Purpose</th>
            </tr>
          </thead>
          <tbody>
            <tr>
              <td><code>/</code></td>
              <td>Home</td>
              <td>Featured events subset</td>
              <td>Landing page with key stats and highlights</td>
            </tr>
            <tr>
              <td><code>/events</code></td>
              <td>EventsPage</td>
              <td>Category & search query</td>
              <td>Directory of all campus events with filter bar</td>
            </tr>
            <tr>
              <td><code>/events/:id</code></td>
              <td>EventDetail</td>
              <td><code>useParams().id</code></td>
              <td>Dynamic individual event detailed view with 404 guard</td>
            </tr>
            <tr>
              <td><code>/about</code></td>
              <td>About</td>
              <td>Static routing guide</td>
              <td>Architecture notes on SPA client-side routing</td>
            </tr>
            <tr>
              <td><code>*</code></td>
              <td>NotFound</td>
              <td>Wildcard match</td>
              <td>Catch-all 404 page for unmatched routes</td>
            </tr>
          </tbody>
        </Table>
      </Card>
    </Container>
  );
}

export default About;
