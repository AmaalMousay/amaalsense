const fs = require('fs');
const path = require('path');

const srcDir = path.join(__dirname, 'src');
const files = fs.readdirSync(srcDir, { recursive: true });
const tsFiles = files.filter(f => f.endsWith('.tsx') || f.endsWith('.ts'));

const connectedComponents = [
  'WorldMapConnected',
  'DCFTVisualizationConnected',
  'EventVectorDisplayConnected',
  'RegionalHeatMapConnected',
  'ResponseExplainabilityConnected',
  'ResponseFeedbackConnected',
  'TopicAnalysisDisplayConnected'
];

for (const file of tsFiles) {
  const filePath = path.join(srcDir, file);
  let content = fs.readFileSync(filePath, 'utf8');
  let changed = false;

  for (const comp of connectedComponents) {
    const originalName = comp.replace('Connected', '');
    // Replace "from './WorldMapConnected'" with "from './WorldMap'"
    const regex = new RegExp(`from\\s+['"]([^'"]*)${comp}['"]`, 'g');
    if (regex.test(content)) {
      content = content.replace(regex, (match, p1) => {
        changed = true;
        return `from '${p1}${originalName}'`;
      });
    }
    
    // Also replace component usage if it was imported as the Connected version
    const usageRegex = new RegExp(`<${comp}`, 'g');
    if (usageRegex.test(content)) {
      content = content.replace(usageRegex, `<${originalName}`);
      changed = true;
    }
    
    const closeUsageRegex = new RegExp(`</${comp}>`, 'g');
    if (closeUsageRegex.test(content)) {
      content = content.replace(closeUsageRegex, `</${originalName}>`);
      changed = true;
    }
  }

  if (changed) {
    fs.writeFileSync(filePath, content, 'utf8');
    console.log(`Updated imports/usage in ${file}`);
  }
}
