import React from "react";
import { Row, Col, Form, InputGroup, Button, Nav } from "react-bootstrap";
import EventCard from "./EventCard";

function EventList({
  events,
  categories,
  selectedCategory,
  onSelectCategory,
  keyword,
  onChangeKeyword,
  onlyFeatured,
  onToggleFeatured,
  onSelectEvent,
  registeredEventIds,
  onReset
}) {
  return (
    <section id="events" className="mb-5">
      {/* Category Tabs */}
      <div className="category-scroll mb-3">
        <Nav variant="pills" className="gap-2">
          {categories.map((cat) => (
            <Nav.Item key={cat}>
              <Nav.Link
                active={selectedCategory === cat}
                onClick={() => onSelectCategory(cat)}
                className="cursor-pointer"
              >
                {cat}
              </Nav.Link>
            </Nav.Item>
          ))}
        </Nav>
      </div>

      {/* Search and Filter Bar */}
      <div className="filter-box p-3 bg-white rounded-3 shadow-sm border mb-4">
        <Row className="g-3 align-items-center">
          <Col md={8}>
            <InputGroup>
              <InputGroup.Text>🔎</InputGroup.Text>
              <Form.Control
                type="text"
                placeholder="Search campus events by title, keyword, or venue..."
                value={keyword}
                onChange={(e) => onChangeKeyword(e.target.value)}
              />
              {keyword && (
                <Button variant="outline-secondary" onClick={() => onChangeKeyword("")}>
                  ✕
                </Button>
              )}
            </InputGroup>
          </Col>
          <Col md={4} className="d-flex align-items-center justify-content-between">
            <Form.Check
              type="checkbox"
              id="featured-only"
              label="Featured only"
              checked={onlyFeatured}
              onChange={(e) => onToggleFeatured(e.target.checked)}
              className="fw-semibold small"
            />
            <Button variant="outline-secondary" size="sm" onClick={onReset}>
              ↺ Reset
            </Button>
          </Col>
        </Row>
      </div>

      {/* Grid of Events */}
      {events.length === 0 ? (
        <div className="text-center py-5 bg-white rounded-3 shadow-sm border">
          <div className="display-6 mb-2">🗓️</div>
          <h4 className="fw-bold">No Events Found</h4>
          <p className="text-muted small">No campus event matches your search criteria.</p>
          <Button variant="primary" size="sm" onClick={onReset}>
            Reset All Filters
          </Button>
        </div>
      ) : (
        <Row xs={1} sm={2} md={3} lg={4} className="g-4">
          {events.map((evt) => (
            <Col key={evt.id}>
              <EventCard
                event={evt}
                onSelect={onSelectEvent}
                isRegistered={registeredEventIds.has(evt.id)}
              />
            </Col>
          ))}
        </Row>
      )}
    </section>
  );
}

export default EventList;
