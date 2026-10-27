# REST API Contract - FUNewsManagementSystem (Slot 12)

Base URL: `http://localhost:8080/api`

## 1. Resource Catalog

| Resource | URI Collection | URI Item | Description |
|---|---|---|---|
| News Articles | `/news` | `/news/{id}` | News publishing entity |
| Categories | `/categories` | `/categories/{id}` | News topic taxonomy |
| System Hello | `/hello` | N/A | Service health & architecture metadata |

---

## 2. Endpoints & Operations

### 2.1 News Endpoints

- **`GET /api/news`**: Retrieves all news articles. Optional query parameters `keyword` and `categoryId`. Status: `200 OK`.
- **`GET /api/news/{id}`**: Retrieves single article by ID. Status: `200 OK` or `404 Not Found`.
- **`POST /api/news`**: Creates a new article. Status: `201 Created` with `Location` header.
- **`PUT /api/news/{id}`**: Updates an article. Status: `200 OK` or `404 Not Found`.
- **`DELETE /api/news/{id}`**: Removes an article. Status: `204 No Content` or `404 Not Found`.

### 2.2 Category Endpoints

- **`GET /api/categories`**: Retrieves all categories. Status: `200 OK`.
- **`GET /api/categories/{id}`**: Retrieves single category by ID. Status: `200 OK` or `404 Not Found`.
- **`POST /api/categories`**: Creates category. Status: `201 Created`.

---

## 3. Standard Unified Response Wrapper (`ApiResponse<T>`)

```json
{
  "success": true,
  "message": "Retrieved news articles successfully.",
  "data": [
    {
      "id": 1,
      "title": "Welcome to SBA301 Spring Boot",
      "content": "Fundamentals of REST APIs and 3-layer architecture.",
      "author": "Prof. Phuc",
      "categoryId": 1,
      "publishedAt": "2026-10-02T14:30:00",
      "status": "PUBLISHED"
    }
  ],
  "timestamp": "2026-10-02T14:30:00"
}
```
