/**
 * Service Layer: Product Management Business Logic & Validations
 * Adheres to MVC Layered Architecture
 */
class ProductService {
  /**
   * Validates product fields before create or update
   */
  validateProduct(productData) {
    const errors = {};

    if (!productData.name || productData.name.trim() === "") {
      errors.name = "Product name cannot be empty.";
    }

    if (!productData.category || productData.category.trim() === "") {
      errors.category = "Please select or provide a category.";
    }

    const price = Number(productData.price);
    if (isNaN(price) || price <= 0) {
      errors.price = "Price must be a positive number greater than 0.";
    }

    const quantity = Number(productData.quantity);
    if (isNaN(quantity) || quantity < 0) {
      errors.quantity = "Quantity must be a non-negative integer.";
    }

    return {
      isValid: Object.keys(errors).length === 0,
      errors
    };
  }

  /**
   * Adds product with immutable state update
   */
  createProduct(currentProducts, productData) {
    const validation = this.validateProduct(productData);
    if (!validation.isValid) {
      throw new Error("Validation failed: " + JSON.stringify(validation.errors));
    }

    const nextId = currentProducts.length > 0 ? Math.max(...currentProducts.map((p) => p.id)) + 1 : 1;
    const newProduct = {
      id: nextId,
      name: productData.name.trim(),
      category: productData.category.trim(),
      price: Number(productData.price),
      quantity: Number(productData.quantity)
    };

    return [...currentProducts, newProduct];
  }

  /**
   * Updates an existing product with immutable map
   */
  updateProduct(currentProducts, id, productData) {
    const validation = this.validateProduct(productData);
    if (!validation.isValid) {
      throw new Error("Validation failed: " + JSON.stringify(validation.errors));
    }

    return currentProducts.map((p) =>
      p.id === Number(id)
        ? {
            ...p,
            name: productData.name.trim(),
            category: productData.category.trim(),
            price: Number(productData.price),
            quantity: Number(productData.quantity)
          }
        : p
    );
  }

  /**
   * Removes a product with immutable filter
   */
  deleteProduct(currentProducts, id) {
    return currentProducts.filter((p) => p.id !== Number(id));
  }

  /**
   * Filters and searches products
   */
  filterProducts(products, { searchKeyword = "", selectedCategory = "All", sortBy = "name" }) {
    let result = [...products];

    if (searchKeyword.trim() !== "") {
      const q = searchKeyword.trim().toLowerCase();
      result = result.filter(
        (p) => p.name.toLowerCase().includes(q) || p.category.toLowerCase().includes(q)
      );
    }

    if (selectedCategory && selectedCategory !== "All") {
      result = result.filter((p) => p.category.toLowerCase() === selectedCategory.toLowerCase());
    }

    result.sort((a, b) => {
      if (sortBy === "price-desc") return b.price - a.price;
      if (sortBy === "price-asc") return a.price - b.price;
      if (sortBy === "quantity") return b.quantity - a.quantity;
      return a.name.localeCompare(b.name);
    });

    return result;
  }

  /**
   * Extracts distinct categories
   */
  getCategories(products) {
    return ["All", ...Array.from(new Set(products.map((p) => p.category)))];
  }

  /**
   * Computes inventory analytics
   */
  calculateStats(products) {
    const totalCount = products.length;
    const totalQuantity = products.reduce((sum, p) => sum + p.quantity, 0);
    const totalValuation = products.reduce((sum, p) => sum + p.price * p.quantity, 0);
    const avgPrice = totalCount > 0 ? totalValuation / totalQuantity || 0 : 0;
    const lowStockCount = products.filter((p) => p.quantity < 5).length;

    return {
      totalCount,
      totalQuantity,
      totalValuation,
      avgPrice: Math.round(avgPrice),
      lowStockCount
    };
  }
}

export const productService = new ProductService();
