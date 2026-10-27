import React, { useState, useMemo } from "react";
import { Container, Row, Col, Form, InputGroup, Button, Nav } from "react-bootstrap";
import { eventService } from "../services/eventService";
import EventCard from "../components/EventCard";

function EventsPage() {
  const [allEvents] = useState(() => eventService.getAllEvents());
  const [selectedCategory, setSelectedCategory] = useState("All");
  const [keyword, setKeyword] = useState("");

  const categories = useMemo(() => eventService.getCategories(), []);

  const filteredEvents = useMemo(() => {
    return eventService.filterEvents(allEvents, {
      category: selectedCategory,
      keyword
    });
  }, [allEvents, selectedCategory, keyword]);

  const handleReset = () => {
    setSelectedCategory("All");
    setKeyword("");
  };

  return (
    <Container className="py-4 mb-5">
      <div className="mb-4">
        <h1 className="fw-bold mb-2">Campus Events Directory</h1>
        <p className="text-muted">Browse and search through all upcoming university events</p>
      </div>

      {/* Category Pills */}
      <div className="category-scroll mb-3">
        <Nav variant="pills" className="gap-2">
          {categories.map((cat) => (
            <Nav.Item key={cat}>
              <Nav.Link
                active={selectedCategory === cat}
                onClick={() => setSelectedCategory(cat)}
                className="cursor-pointer"
              >
                {cat}
              </Nav.Link>
            </Nav.Item>
          ))}
        </Nav>
      </div>

      {/* Search Bar */}
      <div className="filter-card p-3 bg-white rounded-3 shadow-sm border mb-4">
        <Row className="g-3 align-items-center">
          <Col md={10}>
            <InputGroup>
              <InputGroup.Text>🔎</InputGroup.Text>
              <Form.Control
                type="text"
                placeholder="Search events by title, location, or description..."
                value={keyword}
                onChange={(e) => setKeyword(e.target.value)}
              />
              {keyword && (
                <Button variant="outline-secondary" onClick={() => setKeyword("")}>
                  ✕
                </Button>
              )}
            </InputGroup>
          </Col>
          <Col md={2} className="text-end">
            <Button variant="outline-secondary" className="w-100" onClick={handleReset}>
              ↺ Reset
            </Button>
          </Col>
        </Row>
      </div>

      {/* Events Grid */}
      {filteredEvents.length === 0 ? (
        <div className="text-center py-5 bg-white rounded-3 shadow-sm border">
          <div className="display-6 mb-2">🗓️</div>
          <h4 className="fw-bold">No Events Found</h4>
          <p className="text-muted small">No event matches your criteria.</p>
          <Button variant="primary" size="sm" onClick={handleReset}>
            Reset Filters
          </Button>
        </div>
      ) : (
        <Row xs={1} sm={2} md={3} lg={4} className="g-4">
          {filteredEvents.map((evt) => (
            <Col key={evt.id}>
              <EventCard event={evt} />
            </Col>
          ))}
        </Row>
      )}
    </Container>
  );
}

export default EventsPage;
