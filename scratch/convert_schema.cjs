const fs = require('fs');
const path = require('path');

const filePath = 'c:/Users/hp/amaalsense/drizzle/schema.ts';
let content = fs.readFileSync(filePath, 'utf8');

// Global replacements for SQLite compatibility
content = content.replace(/mysqlTable/g, 'sqliteTable');
content = content.replace(/\bint\(/g, 'integer(');
content = content.replace(/\bint\b/g, 'integer');
content = content.replace(/varchar\("[^"]+",\s*\{[^}]+\}\)/g, (match) => {
  const name = match.match(/"([^"]+)"/)[1];
  return `text("${name}")`;
});
content = content.replace(/mysqlEnum\("([^"]+)",\s*\[[^\]]+\]\)/g, 'text("$1")');
content = content.replace(/timestamp\("([^"]+)"\)/g, 'integer("$1", { mode: "timestamp" })');
content = content.replace(/timestamp\("([^"]+)"\)\.defaultNow\(\)\.onUpdateNow\(\)/g, 'integer("$1", { mode: "timestamp" }).default(sql`CURRENT_TIMESTAMP`)');
content = content.replace(/\.defaultNow\(\)/g, '.default(sql`CURRENT_TIMESTAMP`)');
content = content.replace(/float\(/g, 'real(');
content = content.replace(/mysqlBoolean\(/g, 'integer(');

// Remove .autoincrement() from primary keys if they are not integer primary keys (SQLite specific)
// Actually in Drizzle SQLite, integer primary key with autoincrement is fine.

fs.writeFileSync(filePath, content);
console.log('Schema converted to SQLite');
