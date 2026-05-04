const fs = require('fs');
const filePath = 'c:/Users/hp/amaalsense/drizzle/schema.ts';
let content = fs.readFileSync(filePath, 'utf8');

// Convert MySQL autoincrement to SQLite primaryKey({ autoIncrement: true })
content = content.replace(/\.autoincrement\(\)\.primaryKey\(\)/g, '.primaryKey({ autoIncrement: true })');

// Ensure 'real' is imported if used (replace float)
if (content.includes('real(') && !content.includes(' real ')) {
  content = content.replace(/import { ([^}]+) } from "drizzle-orm\/sqlite-core";/, (match, imports) => {
    if (!imports.includes('real')) {
      return `import { ${imports}, real } from "drizzle-orm/sqlite-core";`;
    }
    return match;
  });
}

fs.writeFileSync(filePath, content);
console.log('Schema fixed for SQLite syntax');
