const fs = require('fs');
const path = require('path');

const moveMap = {
  'db': '_core/db',
  'validation': 'utils/validation',
  'storage': 'utils/storage',
  'simpleCache': 'utils/simpleCache',
  'analyticsStorage': 'utils/analyticsStorage',
  'cacheManager': 'utils/cacheManager',
  'unifiedDataCollector': 'services/unifiedDataCollector'
};

// Add Service, Engine, Analyzer, Router mappings
const files = fs.readdirSync(__dirname, { recursive: true });
const tsFiles = files.filter(f => f.endsWith('.ts'));

// Map original filename (without .ts) to new relative path from server root
const fileLocations = {};
for (const file of tsFiles) {
  const baseName = path.basename(file, '.ts');
  // Normalize path to use forward slashes
  fileLocations[baseName] = file.replace(/\\/g, '/').replace(/\.ts$/, '');
}

function getRelativePath(fromPath, toPath) {
  const fromDir = path.dirname(fromPath);
  let rel = path.relative(fromDir, toPath).replace(/\\/g, '/');
  if (!rel.startsWith('.')) {
    rel = './' + rel;
  }
  return rel;
}

for (const file of tsFiles) {
  const filePath = path.join(__dirname, file);
  let content = fs.readFileSync(filePath, 'utf8');
  let changed = false;

  // Regex to match imports: import ... from './something' or '../something'
  const importRegex = /from\s+['"]([^'"]+)['"]/g;
  
  content = content.replace(importRegex, (match, importPath) => {
    if (!importPath.startsWith('.')) return match; // Skip node_modules
    
    // Resolve absolute path of the import
    const currentDir = path.dirname(file);
    const resolvedImport = path.join(currentDir, importPath).replace(/\\/g, '/');
    
    // Extract base name
    const baseName = path.basename(resolvedImport);
    
    if (fileLocations[baseName] && resolvedImport !== fileLocations[baseName]) {
      // The file has moved, calculate new relative path
      const newRelPath = getRelativePath(file, fileLocations[baseName]);
      changed = true;
      return `from '${newRelPath}'`;
    }
    
    return match;
  });

  if (changed) {
    fs.writeFileSync(filePath, content, 'utf8');
    console.log(`Updated imports in ${file}`);
  }
}
