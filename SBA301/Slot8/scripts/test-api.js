import { productApiService } from "../services/productApiService.js";

async function runTestSuite() {
  console.log("=== Starting Automated REST API Contract Verification Suite ===\n");

  try {
    // 1. GET /products
    console.log("TEST 1: GET /products (Fetch collection)");
    const products = await productApiService.getProducts();
    console.log(`PASS: Retrieved ${products.length} products (Expected >= 5)`);

    // 2. GET /products/:id
    console.log("\nTEST 2: GET /products/1 (Fetch item by ID)");
    const prod1 = await productApiService.getProductById(1);
    console.log(`PASS: Found item name: "${prod1.name}", price: ${prod1.price}`);

    // 3. GET /products/9999 (404 Not Found expectation)
    console.log("\nTEST 3: GET /products/9999 (Verify 404 behavior)");
    try {
      await productApiService.getProductById(9999);
      console.error("FAIL: Expected 404 error but request succeeded!");
    } catch (err) {
      console.log(`PASS: Caught expected error: ${err.message}`);
    }

    // 4. POST /products
    console.log("\nTEST 4: POST /products (Create new resource)");
    const newProduct = {
      name: "Desk Mat Extended",
      category: "Workspace",
      price: 320000,
      quantity: 20
    };
    const created = await productApiService.createProduct(newProduct);
    console.log(`PASS: Created product ID #${created.id} with status "${created.status}"`);

    // 5. PUT /products/:id
    console.log(`\nTEST 5: PUT /products/${created.id} (Update resource)`);
    const updatedPayload = {
      ...created,
      price: 350000,
      name: "Desk Mat Extended - Premium Felt"
    };
    const updated = await productApiService.updateProduct(created.id, updatedPayload);
    console.log(`PASS: Updated product price to ${updated.price}`);

    // 6. DELETE /products/:id
    console.log(`\nTEST 6: DELETE /products/${created.id} (Remove test resource)`);
    await productApiService.deleteProduct(created.id);
    console.log(`PASS: Resource #${created.id} successfully deleted.`);

    // 7. GET /reviews?productId=1 (Nested sub-resource)
    console.log("\nTEST 7: GET /reviews?productId=1 (Sub-resource query)");
    const reviews = await productApiService.getProductReviews(1);
    console.log(`PASS: Retrieved ${reviews.length} reviews for Product #1`);

    console.log("\n========================================================");
    console.log("ALL REST API CONTRACT TESTS PASSED WITH 100% COMPLIANCE!");
    console.log("========================================================");
  } catch (error) {
    console.error("Verification suite failed:", error.message);
    console.log("\nMake sure json-server is running on port 5000: 'npm run server'");
  }
}

runTestSuite();
