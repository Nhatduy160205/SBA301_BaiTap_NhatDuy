import React, { useMemo } from "react";
import { Container, Row, Col, Form, InputGroup, Button, Nav } from "react-bootstrap";
import { useSearchParams } from "react-router-dom";
import { orchidService } from "../services/orchidService";
import OrchidCard from "../components/OrchidCard";

function OrchidsPage({ favs, onToggleFav, onOpenModal }) {
  const [searchParams, setSearchParams] = useSearchParams();
  const allOrchids = orchidService.getAllOrchids();
  const categories = orchidService.getCategories();

  const selectedCategory = searchParams.get("category") || "All";
  const keyword = searchParams.get("q") || "";
  const onlySpecial = searchParams.get("special") === "true";

  const filtered = useMemo(() => {
    return orchidService.filterOrchids(allOrchids, {
      category: selectedCategory,
      keyword,
      onlySpecial
    });
  }, [allOrchids, selectedCategory, keyword, onlySpecial]);

  const updateParam = (key, val) => {
    const next = new URLSearchParams(searchParams);
    if (!val || val === "All" || val === false || val === "") {
      next.delete(key);
    } else {
      next.set(key, String(val));
    }
    setSearchParams(next);
  };

  const handleReset = () => {
    setSearchParams(new URLSearchParams());
  };

  return (
    <Container className="py-4 mb-5">
      <div className="mb-4">
        <h1 className="fw-bold mb-1">Botanical Orchid Gallery</h1>
        <p className="text-muted">Query parameter driven dynamic search and filtering</p>
      </div>

      {/* Category Pills */}
      <div className="category-scroll mb-3">
        <Nav variant="pills" className="gap-2">
          {categories.map((cat) => (
            <Nav.Item key={cat}>
              <Nav.Link
                active={selectedCategory === cat}
                onClick={() => updateParam("category", cat)}
                className="cursor-pointer"
              >
                {cat}
              </Nav.Link>
            </Nav.Item>
          ))}
        </Nav>
      </div>

      {/* Filter and Search controls */}
      <div className="filter-card p-3 rounded-3 shadow-sm bg-white border mb-4">
        <Row className="g-3 align-items-center">
          <Col md={7}>
            <InputGroup>
              <InputGroup.Text>🔎</InputGroup.Text>
              <Form.Control
                type="text"
                placeholder="Search orchids by name, origin, color..."
                value={keyword}
                onChange={(e) => updateParam("q", e.target.value)}
              />
              {keyword && (
                <Button variant="outline-secondary" onClick={() => updateParam("q", "")}>
                  ✕
                </Button>
              )}
            </InputGroup>
          </Col>

          <Col md={3}>
            <Form.Check
              type="checkbox"
              id="specials-only"
              label="Special hybrids only"
              checked={onlySpecial}
              onChange={(e) => updateParam("special", e.target.checked)}
              className="fw-semibold small"
            />
          </Col>

          <Col md={2} className="text-end">
            <Button variant="outline-secondary" size="sm" onClick={handleReset} className="w-100">
              ↺ Reset
            </Button>
          </Col>
        </Row>
      </div>

      {/* Gallery Cards Grid */}
      {filtered.length === 0 ? (
        <div className="text-center py-5 bg-white rounded-3 shadow-sm border">
          <div className="display-6 mb-2">🌸</div>
          <h4 className="fw-bold">No Orchids Found</h4>
          <p className="text-muted small">No specimen matches your query parameters.</p>
          <Button variant="primary" size="sm" onClick={handleReset}>
            Reset All Filters
          </Button>
        </div>
      ) : (
        <Row xs={1} sm={2} md={3} className="g-4">
          {filtered.map((o) => (
            <Col key={o.id}>
              <OrchidCard
                orchid={o}
                isFav={favs.includes(o.id)}
                onToggleFav={onToggleFav}
                onOpenModal={onOpenModal}
              />
            </Col>
          ))}
        </Row>
      )}
    </Container>
  );
}

export default OrchidsPage;
