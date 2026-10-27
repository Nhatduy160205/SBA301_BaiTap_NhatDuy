import React from "react";
import { Card, Badge, Button } from "react-bootstrap";

function ProductCard({ product, onEdit, onDelete }) {
  const isLowStock = product.quantity < 5;

  return (
    <Card className="h-100 shadow-sm border-0 product-card">
      <Card.Body className="d-flex flex-column">
        <div className="d-flex justify-content-between align-items-start mb-2">
          <Badge bg="secondary" className="px-2 py-1">
            {product.category}
          </Badge>
          {isLowStock ? (
            <Badge bg="danger">Low Stock: {product.quantity}</Badge>
          ) : (
            <Badge bg="success">In Stock: {product.quantity}</Badge>
          )}
        </div>

        <Card.Title className="fw-bold fs-6 mb-2">{product.name}</Card.Title>

        <div className="text-primary fw-bold fs-5 mb-3">
          {product.price.toLocaleString()} đ
        </div>

        <div className="mt-auto d-flex gap-2 pt-2 border-top">
          <Button variant="outline-primary" size="sm" className="flex-grow-1" onClick={() => onEdit(product)}>
            ✏️ Edit
          </Button>
          <Button variant="outline-danger" size="sm" onClick={() => onDelete(product)}>
            🗑️
          </Button>
        </div>
      </Card.Body>
    </Card>
  );
}

export default ProductCard;
