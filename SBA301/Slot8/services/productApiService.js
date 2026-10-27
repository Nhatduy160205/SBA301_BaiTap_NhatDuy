/**
 * Service Layer: Product REST API Client & Business Validator
 * MVC Layered Service Architecture
 */
export class ProductApiService {
  constructor(baseUrl = "http://localhost:5000") {
    this.baseUrl = baseUrl;
  }

  /**
   * Validates product entity prior to network submission
   */
  validate(product) {
    if (!product.name || typeof product.name !== "string" || product.name.trim() === "") {
      throw new Error("Validation Error: Product name is required.");
    }
    if (typeof product.price !== "number" || product.price <= 0) {
      throw new Error("Validation Error: Price must be a positive number.");
    }
    if (typeof product.quantity !== "number" || product.quantity < 0) {
      throw new Error("Validation Error: Quantity must be non-negative.");
    }
    return true;
  }

  /**
   * Retrieves products with optional filters
   */
  async getProducts({ category, q, sortBy, order = "asc" } = {}) {
    const params = new URLSearchParams();
    if (category) params.append("category", category);
    if (q) params.append("q", q);
    if (sortBy) {
      params.append("_sort", sortBy);
      params.append("_order", order);
    }

    const url = `${this.baseUrl}/products?${params.toString()}`;
    const res = await fetch(url);
    if (!res.ok) throw new Error(`HTTP Error ${res.status}: Failed to fetch products`);
    return await res.json();
  }

  /**
   * Retrieves single product by ID
   */
  async getProductById(id) {
    const res = await fetch(`${this.baseUrl}/products/${id}`);
    if (res.status === 404) {
      throw new Error(`Product #${id} not found (404 Not Found)`);
    }
    if (!res.ok) throw new Error(`HTTP Error ${res.status}`);
    return await res.json();
  }

  /**
   * Creates a new product (POST)
   */
  async createProduct(productData) {
    this.validate(productData);

    const payload = {
      ...productData,
      status: productData.quantity > 5 ? "IN_STOCK" : productData.quantity > 0 ? "LOW_STOCK" : "OUT_OF_STOCK"
    };

    const res = await fetch(`${this.baseUrl}/products`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(payload)
    });

    if (!res.ok) throw new Error(`HTTP Error ${res.status}: Failed to create product`);
    return await res.json();
  }

  /**
   * Full update of a product (PUT)
   */
  async updateProduct(id, productData) {
    this.validate(productData);

    const res = await fetch(`${this.baseUrl}/products/${id}`, {
      method: "PUT",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(productData)
    });

    if (!res.ok) throw new Error(`HTTP Error ${res.status}: Failed to update product`);
    return await res.json();
  }

  /**
   * Deletes a product (DELETE)
   */
  async deleteProduct(id) {
    const res = await fetch(`${this.baseUrl}/products/${id}`, {
      method: "DELETE"
    });

    if (!res.ok) throw new Error(`HTTP Error ${res.status}: Failed to delete product`);
    return true;
  }

  /**
   * Retrieves reviews for a specific product
   */
  async getProductReviews(productId) {
    const res = await fetch(`${this.baseUrl}/reviews?productId=${productId}`);
    if (!res.ok) throw new Error(`HTTP Error ${res.status}`);
    return await res.json();
  }
}

export const productApiService = new ProductApiService();
