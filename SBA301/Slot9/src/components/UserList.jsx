import React from "react";
import { Row, Col, Form, InputGroup, Spinner, Alert, Button } from "react-bootstrap";
import UserCard from "./UserCard";

function UserList({ users, keyword, onKeywordChange, loading, error, source, onRetry }) {
  return (
    <div>
      {/* Search Input */}
      <div className="filter-card p-3 rounded-3 shadow-sm bg-white border mb-4">
        <InputGroup>
          <InputGroup.Text>🔎</InputGroup.Text>
          <Form.Control
            type="text"
            placeholder="Search users by name, username, email, city or company..."
            value={keyword}
            onChange={(e) => onKeywordChange(e.target.value)}
          />
          {keyword && (
            <Button variant="outline-secondary" onClick={() => onKeywordChange("")}>
              ✕
            </Button>
          )}
        </InputGroup>
      </div>

      {/* Loading state */}
      {loading && (
        <div className="text-center py-5">
          <Spinner animation="border" variant="primary" />
          <p className="mt-3 text-muted">Fetching user records from network...</p>
        </div>
      )}

      {/* Error state */}
      {error && !loading && (
        <Alert variant="danger" className="d-flex justify-content-between align-items-center">
          <div>
            <strong>Error:</strong> {error}
          </div>
          <Button variant="outline-danger" size="sm" onClick={onRetry}>
            Retry Request
          </Button>
        </Alert>
      )}

      {/* Source banner */}
      {!loading && !error && source && (
        <div className="d-flex justify-content-between align-items-center mb-3">
          <span className="small text-muted">
            Found <strong>{users.length}</strong> users • Data Source:{" "}
            <span className={source === "CACHE" ? "text-success fw-bold" : "text-primary fw-bold"}>
              {source}
            </span>
          </span>
        </div>
      )}

      {/* Users Grid */}
      {!loading && (
        <Row xs={1} sm={2} md={3} lg={4} className="g-3 mb-4">
          {users.map((u) => (
            <Col key={u.id}>
              <UserCard user={u} />
            </Col>
          ))}
        </Row>
      )}
    </div>
  );
}

export default UserList;
