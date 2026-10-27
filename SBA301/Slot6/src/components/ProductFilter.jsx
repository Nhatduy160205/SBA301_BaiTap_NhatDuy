import React from "react";
import { Row, Col, Form, InputGroup, Button } from "react-bootstrap";

function ProductFilter({
  categories,
  selectedCategory,
  onSelectCategory,
  searchKeyword,
  onSearchChange,
  sortBy,
  onSortChange,
  onReset
}) {
  return (
    <div className="filter-card p-3 rounded-3 shadow-sm bg-white border mb-4">
      <Row className="g-3 align-items-center">
        <Col md={5}>
          <InputGroup>
            <InputGroup.Text>🔍</InputGroup.Text>
            <Form.Control
              type="text"
              placeholder="Search product name or category..."
              value={searchKeyword}
              onChange={(e) => onSearchChange(e.target.value)}
            />
            {searchKeyword && (
              <Button variant="outline-secondary" onClick={() => onSearchChange("")}>
                ✕
              </Button>
            )}
          </InputGroup>
        </Col>

        <Col md={3}>
          <Form.Select
            value={selectedCategory}
            onChange={(e) => onSelectCategory(e.target.value)}
          >
            {categories.map((cat) => (
              <option key={cat} value={cat}>
                Category: {cat}
              </option>
            ))}
          </Form.Select>
        </Col>

        <Col md={3}>
          <Form.Select value={sortBy} onChange={(e) => onSortChange(e.target.value)}>
            <option value="name">Sort: Name (A-Z)</option>
            <option value="price-asc">Sort: Price (Low to High)</option>
            <option value="price-desc">Sort: Price (High to Low)</option>
            <option value="quantity">Sort: Stock Quantity</option>
          </Form.Select>
        </Col>

        <Col md={1} className="text-end">
          <Button variant="outline-secondary" size="sm" onClick={onReset} title="Reset filters">
            ↺ Reset
          </Button>
        </Col>
      </Row>
    </div>
  );
}

export default ProductFilter;
