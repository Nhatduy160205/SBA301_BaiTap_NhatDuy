# REST API Contract - Product Management System

Base URL: `http://localhost:5000`

## 1. Resource Catalog

| Resource | URI Collection | URI Item | Description |
|---|---|---|---|
| Products | `/products` | `/products/{id}` | Catalog of tech hardware and desktop peripherals |
| Categories | `/categories` | `/categories/{id}` | Classification taxonomy |
| Reviews | `/reviews` | `/reviews/{id}` | Customer feedback ratings and testimonials |

---

## 2. API Endpoints Specification

### 2.1 GET /products
- **Method**: `GET`
- **Description**: Returns a list of products with support for filtering, full-text searching, and sorting.
- **Query Parameters**:
  - `category` (string, optional): Filter by category name (e.g. `Accessories`)
  - `q` (string, optional): Full-text search keyword across string fields
  - `_sort` (string, optional): Field to sort by (`price`, `quantity`, `name`)
  - `_order` (string, optional): `asc` or `desc`
- **Success Status**: `200 OK`
- **Response Example**:
```json
[
  {
    "id": 1,
    "name": "Mechanical Keyboard",
    "category": "Accessories",
    "price": 1490000,
    "quantity": 8,
    "status": "IN_STOCK",
    "rating": 4.8
  }
]
```

### 2.2 GET /products/{id}
- **Method**: `GET`
- **Description**: Retrieve detailed information for a single product.
- **Success Status**: `200 OK`
- **Error Status**: `404 Not Found` if `{id}` does not exist.

### 2.3 POST /products
- **Method**: `POST`
- **Description**: Create a new product.
- **Request Headers**: `Content-Type: application/json`
- **Request Body Example**:
```json
{
  "name": "Ergonomic Vertical Mouse",
  "category": "Accessories",
  "price": 850000,
  "quantity": 12
}
```
- **Success Status**: `201 Created`
- **Error Status**: `400 Bad Request` if mandatory fields are missing.

### 2.4 PUT /products/{id}
- **Method**: `PUT`
- **Description**: Complete replacement / update of the product resource.
- **Success Status**: `200 OK`
- **Error Status**: `404 Not Found`

### 2.5 DELETE /products/{id}
- **Method**: `DELETE`
- **Description**: Remove the product resource.
- **Success Status**: `200 OK` (json-server returns `{}`) or `204 No Content`
- **Error Status**: `404 Not Found`

### 2.6 GET /reviews?productId={id}
- **Method**: `GET`
- **Description**: Sub-resource retrieval for product reviews.
- **Success Status**: `200 OK`

---

## 3. HTTP Status Codes Matrix

| Code | Status | Meaning in Product API |
|---|---|---|
| **200** | OK | Successful GET, PUT, or DELETE request |
| **201** | Created | Resource successfully created via POST |
| **204** | No Content | Successful deletion without returning body |
| **400** | Bad Request | Validation failure on submitted payload |
| **404** | Not Found | Target ID does not match any resource |
| **500** | Internal Error | Unexpected server error |
