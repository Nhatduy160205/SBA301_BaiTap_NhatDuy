import React from "react";
import { Card, ListGroup } from "react-bootstrap";

function ProfilePage() {
  return (
    <div>
      <h3 className="fw-bold mb-3">Student & System Profile</h3>
      <Card className="border-0 shadow-sm rounded-4 p-4">
        <div className="d-flex align-items-center gap-3 mb-4">
          <div className="bg-primary text-white fs-3 rounded-circle d-flex align-items-center justify-content-center" style={{ width: "60px", height: "60px" }}>
            🎓
          </div>
          <div>
            <h5 className="fw-bold mb-0">Nguyen Van A</h5>
            <span className="text-muted small">Student ID: SE191024 • Class: SE1910</span>
          </div>
        </div>

        <ListGroup variant="flush">
          <ListGroup.Item className="d-flex justify-content-between px-0">
            <strong>Course:</strong>
            <span>SBA301 - Integrate SPA with Spring Boot</span>
          </ListGroup.Item>
          <ListGroup.Item className="d-flex justify-content-between px-0">
            <strong>Active Module:</strong>
            <span>Slot 10: React Router & Lab 02 Bridge</span>
          </ListGroup.Item>
          <ListGroup.Item className="d-flex justify-content-between px-0">
            <strong>Architecture:</strong>
            <span>MVC Layer Service with Nested Routes</span>
          </ListGroup.Item>
          <ListGroup.Item className="d-flex justify-content-between px-0">
            <strong>Persistence:</strong>
            <span>localStorage (Favorites Sync)</span>
          </ListGroup.Item>
        </ListGroup>
      </Card>
    </div>
  );
}

export default ProfilePage;
