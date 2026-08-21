const fs = require('fs');
const path = require('path');

const indexCssPath = path.resolve(__dirname, '../../src/index.css');
const tailwindConfigPath = path.resolve(__dirname, '../../tailwind.config.js');

console.log('--- CSS & Tailwind Token Validator ---');
console.log(`Checking index.css: ${indexCssPath}`);
console.log(`Checking tailwind.config.js: ${tailwindConfigPath}\n`);

if (!fs.existsSync(indexCssPath)) {
  console.error(`Error: index.css not found at ${indexCssPath}`);
  process.exit(1);
}

if (!fs.existsSync(tailwindConfigPath)) {
  console.error(`Error: tailwind.config.js not found at ${tailwindConfigPath}`);
  process.exit(1);
}

const cssContent = fs.readFileSync(indexCssPath, 'utf8');
const configContent = fs.readFileSync(tailwindConfigPath, 'utf8');

// Helper to parse CSS variables from root and light themes
function parseCssVariables(css) {
  const vars = { root: {}, light: {} };
  
  // Extract content inside :root and .light
  const rootMatch = css.match(/:root\s*\{([^}]+)\}/);
  const lightMatch = css.match(/\.light\s*\{([^}]+)\}/);

  const varRegex = /--([\w-]+)\s*:\s*([^;]+);/g;

  if (rootMatch) {
    let match;
    const content = rootMatch[1];
    while ((match = varRegex.exec(content)) !== null) {
      vars.root[match[1]] = match[2].trim();
    }
  }

  if (lightMatch) {
    let match;
    const content = lightMatch[1];
    while ((match = varRegex.exec(content)) !== null) {
      vars.light[match[1]] = match[2].trim();
    }
  }

  return vars;
}

// Function to resolve CSS variables recursively
function resolveVariable(varName, vars, selector = 'root') {
  const scope = vars[selector];
  const rootScope = vars['root'];
  
  let val = scope[varName] || rootScope[varName];
  if (!val) return null;

  // If the value itself references another variable, e.g. var(--color-canvas)
  const refMatch = val.match(/var\(--([\w-]+)\)/);
  if (refMatch) {
    return resolveVariable(refMatch[1], vars, selector);
  }

  return val;
}

const cssVars = parseCssVariables(cssContent);
console.log(`Parsed ${Object.keys(cssVars.root).length} variables from :root`);
console.log(`Parsed ${Object.keys(cssVars.light).length} overrides from .light\n`);

// 1. Analyze invalid rgba(var(--var), alpha) patterns in index.css
console.log('--- Checking index.css for invalid rgba/rgb patterns ---');
const cssLines = cssContent.split('\n');
let cssIssuesCount = 0;

cssLines.forEach((line, index) => {
  // Look for rgb/rgba containing var(--...) followed by a comma
  const invalidRgbaRegex = /rgba?\(\s*var\(--([\w-]+)\)\s*,\s*([^)]+)\)/g;
  let match;
  while ((match = invalidRgbaRegex.exec(line)) !== null) {
    const varName = match[1];
    const resolvedRoot = resolveVariable(varName, cssVars, 'root');
    
    // Check if the resolved value is space-separated (RGB triplet)
    if (resolvedRoot && resolvedRoot.split(/\s+/).length === 3) {
      console.log(`[Line ${index + 1}] Invalid color mixing: "${match[0]}"`);
      console.log(`  Reason: --${varName} resolves to space-separated "${resolvedRoot}".`);
      console.log(`  Mixing space-separated RGB with comma-separated alpha is invalid CSS.`);
      console.log(`  Suggested Fix: Change to "rgba(var(--${varName}) / ${match[2].trim()})"\n`);
      cssIssuesCount++;
    }
  }
});

if (cssIssuesCount === 0) {
  console.log('No invalid rgba patterns found in index.css files (static scan).');
}

// 2. Parse tailwind.config.js mappings and validate
console.log('\n--- Checking tailwind.config.js for invalid mappings & unresolved variables ---');

// Extract all instances of 'var(--something)'
const varRefRegex = /var\(--([\w-]+)\)/g;
let match;
const referencedVars = new Set();
while ((match = varRefRegex.exec(configContent)) !== null) {
  referencedVars.add(match[1]);
}

console.log(`Found ${referencedVars.size} unique CSS variables referenced in tailwind.config.js.`);

// Verify if they exist in index.css
let unresolvedCount = 0;
referencedVars.forEach(v => {
  if (!cssVars.root[v] && !cssVars.light[v]) {
    console.log(`⚠️ Unresolved CSS Variable: --${v} is referenced in tailwind.config.js but not defined in index.css!`);
    unresolvedCount++;
  }
});

// Check tailwind.config.js for invalid rgba(var(--var), alpha) structures
let configIssuesCount = 0;
const configLines = configContent.split('\n');

configLines.forEach((line, index) => {
  const invalidRgbaRegex = /rgba?\(\s*var\(--([\w-]+)\)\s*,\s*([^)]+)\)/g;
  let match;
  while ((match = invalidRgbaRegex.exec(line)) !== null) {
    const varName = match[1];
    const resolvedRoot = resolveVariable(varName, cssVars, 'root');
    
    if (resolvedRoot && resolvedRoot.split(/\s+/).length === 3) {
      console.log(`[Line ${index + 1}] Invalid tailwind config color mapping: "${match[0].trim()}"`);
      console.log(`  Reason: --${varName} is space-separated "${resolvedRoot}".`);
      console.log(`  Suggested Fix: Change to "rgb(var(--${varName}) / ${match[2].trim()})"\n`);
      configIssuesCount++;
    }
  }
});

console.log(`\nSummary:`);
console.log(`- Unresolved variables in config: ${unresolvedCount}`);
console.log(`- Invalid rgba usages in index.css: ${cssIssuesCount}`);
console.log(`- Invalid rgba usages in tailwind.config.js: ${configIssuesCount}`);
