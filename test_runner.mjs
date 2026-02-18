import { runAllTests } from "./server/featuresIntegrationAndTesting.ts";

console.log("Starting comprehensive tests...");
const results = await runAllTests();
console.log("Tests completed!");
