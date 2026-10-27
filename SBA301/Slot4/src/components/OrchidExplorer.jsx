import React from "react";
import { Row, Col, Form, InputGroup, Button } from "react-bootstrap";
import { useOrchidContext } from "../context/OrchidContext";
import OrchidCard from "./OrchidCard";

function OrchidExplorer() {
  const {
    filteredOrchids,
    categories,
    searchKeyword,
    setSearchKeyword,
    selectedCategory,
    setSelectedCategory,
    onlySpecial,
    setOnlySpecial,
    sortBy,
    setSortBy,
    handleResetFilters
  } = useOrchidContext();

  return (
    <div className="orchid-explorer mb-5">
      {/* Search and Filters Bar */}
      <div className="filter-card p-4 rounded-4 shadow-sm bg-white mb-4 border">
        <Row className="g-3 align-items-center">
          <Col md={5}>
            <InputGroup>
              <InputGroup.Text>🔍</InputGroup.Text>
              <Form.Control
                type="text"
                placeholder="Search by name, category, origin..."
                value={searchKeyword}
                onChange={(e) => setSearchKeyword(e.target.value)}
              />
              {searchKeyword && (
                <Button variant="outline-secondary" onClick={() => setSearchKeyword("")}>
                  ✕
                </Button>
              )}
            </InputGroup>
          </Col>

          <Col md={3}>
            <Form.Select
              value={selectedCategory}
              onChange={(e) => setSelectedCategory(e.target.value)}
            >
              {categories.map((cat) => (
                <option key={cat} value={cat}>
                  Category: {cat}
                </option>
              ))}
            </Form.Select>
          </Col>

          <Col md={2}>
            <Form.Select value={sortBy} onChange={(e) => setSortBy(e.target.value)}>
              <option value="rating">Sort: Top Rated</option>
              <option value="name">Sort: A-Z Name</option>
            </Form.Select>
          </Col>

          <Col md={2} className="d-flex align-items-center justify-content-between">
            <Form.Check
              type="checkbox"
              id="special-checkbox"
              label="Special only"
              checked={onlySpecial}
              onChange={(e) => setOnlySpecial(e.target.checked)}
              className="fw-semibold small"
            />
            <Button variant="outline-secondary" size="sm" onClick={handleResetFilters} title="Reset all filters">
              ↺ Reset
            </Button>
          </Col>
        </Row>
      </div>

      {/* Grid of Orchid Cards */}
      {filteredOrchids.length === 0 ? (
        <div className="text-center py-5 bg-white rounded-4 shadow-sm border">
          <div className="display-6 mb-2">🔍</div>
          <h4 className="fw-bold">No Orchids Found</h4>
          <p className="text-muted">No specimen matches your active filters. Try adjusting your query or resetting filters.</p>
          <Button variant="primary" onClick={handleResetFilters}>
            Reset All Filters
          </Button>
        </div>
      ) : (
        <Row xs={1} sm={2} md={3} className="g-4">
          {filteredOrchids.map((orchid) => (
            <Col key={orchid.id}>
              <OrchidCard orchid={orchid} />
            </Col>
          ))}
        </Row>
      )}
    </div>
  );
}

export default OrchidExplorer;
