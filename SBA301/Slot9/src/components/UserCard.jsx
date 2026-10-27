import React from "react";
import { Card, Badge } from "react-bootstrap";

function UserCard({ user }) {
  return (
    <Card className="h-100 shadow-sm border-0 user-card">
      <Card.Body className="d-flex flex-column">
        <div className="d-flex justify-content-between align-items-start mb-2">
          <Badge bg="light" text="dark" className="border">
            ID #{user.id}
          </Badge>
          <span className="small text-muted">@{user.username}</span>
        </div>

        <Card.Title className="fw-bold fs-6 mb-1 text-primary">{user.name}</Card.Title>

        <div className="text-secondary small mb-3">
          🏢 <strong>{user.company}</strong>
        </div>

        <div className="small text-muted mt-auto pt-2 border-top">
          <div>✉️ {user.email}</div>
          <div>📍 {user.city}</div>
          <div>📞 {user.phone}</div>
        </div>
      </Card.Body>
    </Card>
  );
}

export default UserCard;
