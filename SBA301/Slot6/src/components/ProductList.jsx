import React from "react";
import { Row, Col } from "react-bootstrap";
import ProductCard from "./ProductCard";

function ProductList({ products, onEdit, onDelete, onReset }) {
  if (products.length === 0) {
    return (
      <div className="text-center py-5 bg-white rounded-3 shadow-sm border mb-4">
        <div className="display-6 mb-2">📦</div>
        <h4 className="fw-bold">No Products Found</h4>
        <p className="text-muted small">No items match your query. Try resetting your search filters.</p>
        <button className="btn btn-outline-primary btn-sm" onClick={onReset}>
          Reset Filters
        </button>
      </div>
    );
  }

  return (
    <Row xs={1} sm={2} md={3} lg={4} className="g-3 mb-4">
      {products.map((product) => (
        <Col key={product.id}>
          <ProductCard product={product} onEdit={onEdit} onDelete={onDelete} />
        </Col>
      ))}
    </Row>
  );
}

export default ProductList;
