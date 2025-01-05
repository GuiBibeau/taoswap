import {
  createPriceTable,
  createTokenTable,
  createPoolTable,
} from "../app/lib/dynamodb/schema";

console.log("Starting DynamoDB table migrations...");

try {
  console.log("Creating price table...");
  await createPriceTable();
  console.log("✅ Price table created successfully");
  console.log("Creating token table...");
  await createTokenTable();
  console.log("✅ Token table created successfully");
  console.log("Creating pool table...");
  await createPoolTable();
  console.log("✅ Pool table created successfully");
} catch (error) {
  console.error("❌ Failed to create price table:", error);
  process.exit(1);
}

console.log("✨ All migrations completed successfully");
