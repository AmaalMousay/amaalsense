const fs = require('fs');
const filePath = 'c:/Users/hp/amaalsense/server/db.ts';
let content = fs.readFileSync(filePath, 'utf8');

// Replace all onDuplicateKeyUpdate with onConflictDoUpdate
// This is a bit tricky because the target column varies.
// For countryEmotionIndices, the target is countryCode.
content = content.replace(/insert\(countryEmotionIndices\)\.values\(data\)\.onDuplicateKeyUpdate\(\{/g, 'insert(countryEmotionIndices).values(data).onConflictDoUpdate({ target: countryEmotionIndices.countryCode,');

fs.writeFileSync(filePath, content);
console.log('db.ts cleanup finished');
