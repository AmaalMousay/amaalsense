const fs = require('fs');
const filePath = 'c:/Users/hp/amaalsense/drizzle/schema.ts';
let content = fs.readFileSync(filePath, 'utf8');

// Remove .onUpdateNow() as SQLite doesn't support it in Drizzle SQLite Core
content = content.replace(/\.onUpdateNow\(\)/g, '');

// Fix up result[0].insertId to result.lastInsertRowid or handle it in db.ts
// In SQLite, insert results are different.

fs.writeFileSync(filePath, content);
console.log('Schema cleanup finished');
