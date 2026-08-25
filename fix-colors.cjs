const fs = require('fs');
const path = require('path');

const dir = path.join(__dirname, 'src/components/markets');
const files = fs.readdirSync(dir).filter(f => f.endsWith('.tsx'));

for (const file of files) {
  const filePath = path.join(dir, file);
  let content = fs.readFileSync(filePath, 'utf8');
  
  // Replace rgba(255,255,255, X) with rgba(var(--color-border-rgb), X)
  content = content.replace(/rgba\(\s*255\s*,\s*255\s*,\s*255\s*,/g, 'rgba(var(--color-border-rgb),');
  
  // Replace text-white/X with text-primary/X (or just text-primary if no opacity)
  content = content.replace(/text-white\/(\d+)/g, 'text-primary/$1');
  
  // Replace text-white with text-primary
  content = content.replace(/text-white([^/a-zA-Z0-9_-])/g, 'text-primary$1');

  // Replace '#fff' or '#ffffff' with 'rgb(var(--color-text-primary))'
  content = content.replace(/'#fff'/g, "'rgb(var(--color-text-primary))'");
  content = content.replace(/'#ffffff'/g, "'rgb(var(--color-text-primary))'");

  fs.writeFileSync(filePath, content, 'utf8');
}
console.log('Replacements completed.');
