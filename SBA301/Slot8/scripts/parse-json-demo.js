/**
 * Script 1: JSON Parsing and Serialization Demonstration
 * Tests JSON.parse(), JSON.stringify() with formatting, and error handling.
 */

console.log("=== JSON.parse & JSON.stringify Demonstration ===\n");

// 1. Valid JSON String
const rawJson = '{"id": 10, "name": "Mechanical Numpad", "price": 450000, "inStock": true}';
console.log("1. Raw JSON string input:");
console.log(rawJson);

try {
  const parsedObj = JSON.parse(rawJson);
  console.log("\n2. Parsed JavaScript Object:");
  console.dir(parsedObj);
  console.log(`Product Name: ${parsedObj.name}, Formatted Price: ${parsedObj.price.toLocaleString()} VND`);
} catch (error) {
  console.error("Failed to parse valid JSON:", error);
}

// 2. Serialization with pretty-printing
const sampleData = {
  course: "SBA301",
  slot: "Slot 08",
  topic: "Client-Server Communication & REST",
  verified: true,
  timestamp: new Date().toISOString()
};

console.log("\n3. Serializing JS Object to formatted JSON string:");
const formattedJson = JSON.stringify(sampleData, null, 2);
console.log(formattedJson);

// 3. Error Handling on Malformed JSON
console.log("\n4. Testing Error Handling on Malformed JSON:");
const malformedJson = '{"name": "Broken JSON", price: 1000,}'; // Missing quotes on key, trailing comma
try {
  JSON.parse(malformedJson);
} catch (err) {
  console.log("Expected SyntaxError caught successfully:");
  console.log(`Error Message: ${err.message}`);
}

console.log("\n=== JSON Demonstration Completed Successfully ===");
