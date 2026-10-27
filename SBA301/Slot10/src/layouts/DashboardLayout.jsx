import React from "react";
import { Container, Row, Col, Nav, Card } from "react-bootstrap";
import { NavLink, Outlet } from "react-router-dom";

function DashboardLayout() {
  return (
    <Container className="py-4">
      <Row className="g-4">
        <Col md={3}>
          <Card className="border-0 shadow-sm p-3 rounded-4">
            <h5 className="fw-bold mb-3 px-2">Dashboard Nav</h5>
            <Nav variant="pills" className="flex-column gap-1">
              <Nav.Item>
                <Nav.Link as={NavLink} to="/dashboard" end>
                  📊 Overview
                </Nav.Link>
              </Nav.Item>
              <Nav.Item>
                <Nav.Link as={NavLink} to="/dashboard/favorites">
                  ❤️ My Favorites
                </Nav.Link>
              </Nav.Item>
              <Nav.Item>
                <Nav.Link as={NavLink} to="/dashboard/profile">
                  👤 Student Profile
                </Nav.Link>
              </Nav.Item>
            </Nav>
          </Card>
        </Col>
        <Col md={9}>
          <Outlet />
        </Col>
      </Row>
    </Container>
  );
}

export default DashboardLayout;
