const fs = require('fs');
const path = require('path');

const CSS_PATH = path.resolve(__dirname, '../../src/index.css');
const TAILWIND_PATH = path.resolve(__dirname, '../../tailwind.config.js');

function loadFiles() {
  if (!fs.existsSync(CSS_PATH)) {
    console.error(`CSS file not found at: ${CSS_PATH}`);
    process.exit(1);
  }
  if (!fs.existsSync(TAILWIND_PATH)) {
    console.error(`Tailwind config not found at: ${TAILWIND_PATH}`);
    process.exit(1);
  }

  const cssContent = fs.readFileSync(CSS_PATH, 'utf8');
  const tailwindContent = fs.readFileSync(TAILWIND_PATH, 'utf8');
  return { cssContent, tailwindContent };
}

function verifyCSSVariables(css) {
  console.log('--- Verifying CSS Variable Definitions in src/index.css ---');
  
  // Extract content of :root
  const rootMatch = css.match(/:root\s*\{([^}]+)\}/);
  if (!rootMatch) {
    console.error('FAIL: :root block not found in src/index.css');
    return false;
  }
  const rootVars = rootMatch[1];

  // Extract content of .light
  const lightMatch = css.match(/\.light\s*\{([^}]+)\}/);
  if (!lightMatch) {
    console.error('FAIL: .light block not found in src/index.css');
    return false;
  }
  const lightVars = lightMatch[1];

  const requiredRootVars = [
    '--font-sans', '--font-mono',
    '--text-xs', '--text-sm', '--text-base', '--text-lg', '--text-xl', '--text-2xl', '--text-3xl', '--text-4xl', '--text-5xl',
    '--font-regular', '--font-medium', '--font-semibold',
    '--color-canvas', '--color-surface', '--color-surface-hover', '--color-surface-elevated', '--color-surface-inset',
    '--color-text-primary', '--color-text-secondary', '--color-text-tertiary', '--color-text-disabled', '--color-text-inverse',
    '--color-accent', '--color-accent-hover', '--color-accent-subtle',
    '--color-success', '--color-success-subtle',
    '--color-danger', '--color-danger-subtle',
    '--color-warning', '--color-warning-subtle',
    '--color-info',
    '--color-border', '--color-border-hover', '--color-border-focus', '--color-divider',
    '--radius-none', '--radius-sm', '--radius-md', '--radius-lg', '--radius-xl', '--radius-full',
    '--shadow-none', '--shadow-sm', '--shadow-md', '--shadow-lg',
    '--space-0', '--space-0.5', '--space-1', '--space-1.5', '--space-2', '--space-3', '--space-4', '--space-5', '--space-6', '--space-8', '--space-10', '--space-12', '--space-16', '--space-20', '--space-24',
    '--z-base', '--z-above', '--z-sidebar', '--z-header', '--z-dropdown', '--z-modal-backdrop', '--z-modal', '--z-toast',
    '--opacity-0', '--opacity-5', '--opacity-10', '--opacity-20', '--opacity-50', '--opacity-100',
    '--duration-instant', '--duration-fast', '--duration-normal', '--duration-slow', '--duration-x-slow',
    '--ease-out', '--ease-in', '--ease-in-out'
  ];

  let missingRoot = 0;
  for (const v of requiredRootVars) {
    if (!rootVars.includes(v)) {
      console.error(`FAIL: CSS variable ${v} is missing from :root`);
      missingRoot++;
    }
  }

  const requiredLightVars = [
    '--color-canvas', '--color-surface', '--color-surface-hover', '--color-surface-elevated', '--color-surface-inset',
    '--color-text-primary', '--color-text-secondary', '--color-text-tertiary', '--color-text-disabled', '--color-text-inverse',
    '--color-accent', '--color-accent-hover', '--color-accent-subtle',
    '--color-success', '--color-success-subtle',
    '--color-danger', '--color-danger-subtle',
    '--color-warning', '--color-warning-subtle',
    '--color-info',
    '--color-border', '--color-border-hover', '--color-border-focus', '--color-divider'
  ];

  let missingLight = 0;
  for (const v of requiredLightVars) {
    if (!lightVars.includes(v)) {
      console.error(`FAIL: CSS variable ${v} is missing from .light overrides`);
      missingLight++;
    }
  }

  if (missingRoot === 0 && missingLight === 0) {
    console.log('PASS: All required CSS variables are present in :root and .light blocks.');
    return true;
  }
  return false;
}

function verifyTailwindMappings(tailwind) {
  console.log('--- Verifying Tailwind Configuration Mappings in tailwind.config.js ---');
  
  const mappings = [
    { name: 'canvas', ref: '--color-canvas' },
    { name: 'surface', ref: '--color-surface' },
    { name: 'surface-hover', ref: '--color-surface-hover' },
    { name: 'surface-elevated', ref: '--color-surface-elevated' },
    { name: 'surface-inset', ref: '--color-surface-inset' },
    { name: 'accent', ref: '--color-accent' },
    { name: 'success', ref: '--color-success' },
    { name: 'danger', ref: '--color-danger' },
    { name: 'warning', ref: '--color-warning' },
    { name: 'info', ref: '--color-info' },
    { name: 'border', ref: '--color-border' },
    { name: 'divider', ref: '--color-divider' },
    { name: 'primary', ref: '--color-text-primary' },
    { name: 'secondary', ref: '--color-text-secondary' },
    { name: 'tertiary', ref: '--color-text-tertiary' },
    { name: 'disabled', ref: '--color-text-disabled' },
    { name: 'inverse', ref: '--color-text-inverse' },
    { name: 'sans', ref: '--font-sans' },
    { name: 'mono', ref: '--font-mono' },
    { name: 'xs', ref: '--text-xs' },
    { name: 'sm', ref: '--text-sm' },
    { name: 'base', ref: '--text-base' },
    { name: 'lg', ref: '--text-lg' },
    { name: 'xl', ref: '--text-xl' },
    { name: '2xl', ref: '--text-2xl' },
    { name: '3xl', ref: '--text-3xl' },
    { name: '4xl', ref: '--text-4xl' },
    { name: '5xl', ref: '--text-5xl' },
    { name: 'regular', ref: '--font-regular' },
    { name: 'medium', ref: '--font-medium' },
    { name: 'semibold', ref: '--font-semibold' },
    { name: 'none', ref: '--radius-none' },
    { name: 'sm', ref: '--radius-sm' },
    { name: 'md', ref: '--radius-md' },
    { name: 'lg', ref: '--radius-lg' },
    { name: 'xl', ref: '--radius-xl' },
    { name: 'full', ref: '--radius-full' },
    { name: 'none', ref: '--shadow-none' },
    { name: 'sm', ref: '--shadow-sm' },
    { name: 'md', ref: '--shadow-md' },
    { name: 'lg', ref: '--shadow-lg' },
    { name: 'space-0', ref: '--space-0' },
    { name: 'space-24', ref: '--space-24' },
    { name: 'base', ref: '--z-base' },
    { name: 'toast', ref: '--z-toast' },
    { name: 'instant', ref: '--duration-instant' },
    { name: 'x-slow', ref: '--duration-x-slow' },
    { name: 'out', ref: '--ease-out' },
    { name: 'in-out', ref: '--ease-in-out' }
  ];

  let missingMappings = 0;
  for (const m of mappings) {
    if (!tailwind.includes(m.ref)) {
      console.error(`FAIL: Tailwind config does not map key '${m.name}' using CSS variable '${m.ref}'`);
      missingMappings++;
    }
  }

  if (missingMappings === 0) {
    console.log('PASS: All design system variable mappings are present in tailwind.config.js.');
    return true;
  }
  return false;
}

function verifyKeyframeCollisions(css, tailwind) {
  console.log('--- Verifying Keyframe Collisions ---');
  
  // Look for fadeIn keyframe in CSS
  const cssFadeInMatch = css.match(/@keyframes\s+fadeIn\b/);
  if (cssFadeInMatch) {
    console.error('FAIL: @keyframes fadeIn is defined in src/index.css, which overrides and collides with Tailwind config.');
    return false;
  }

  // Look for pageFadeIn in CSS
  const cssPageFadeInMatch = css.match(/@keyframes\s+pageFadeIn\b/);
  if (!cssPageFadeInMatch) {
    console.error('FAIL: @keyframes pageFadeIn is NOT defined in src/index.css.');
    return false;
  }

  // Verify that page-enter and stagger classes in index.css use pageFadeIn
  const classesToVerify = ['.page-enter', '.stagger-1', '.stagger-2', '.stagger-3', '.stagger-4', '.stagger-5'];
  let animationErrors = 0;
  for (const cls of classesToVerify) {
    const classRegex = new RegExp(`\\${cls}\\s*\\{[^}]*animation:[^;]*pageFadeIn[^;]*\\}`);
    if (!css.match(classRegex)) {
      console.error(`FAIL: Class ${cls} does not correctly reference animation 'pageFadeIn' in src/index.css`);
      animationErrors++;
    }
  }

  // Verify Tailwind config defines fadeIn
  if (!tailwind.includes('fadeIn: {')) {
    console.error('FAIL: Tailwind config is missing the fadeIn keyframe definition.');
    return false;
  }

  if (animationErrors === 0) {
    console.log('PASS: Keyframe collision verified and resolved (pageFadeIn used for custom page transitions, fadeIn preserved for Tailwind).');
    return true;
  }
  return false;
}

function verifyRadialGradientsAndLightMode(css) {
  console.log('--- Verifying Radial Gradients and Light Mode Inputs ---');
  let pass = true;

  // Verify body radial gradients in index.css
  const bodyMatch = css.match(/body\s*\{([^}]+)\}/);
  if (bodyMatch) {
    const bodyStyles = bodyMatch[1];
    if (!bodyStyles.includes('rgba(var(--color-accent) / 0.06)') || !bodyStyles.includes('rgba(var(--color-success) / 0.04)')) {
      console.error('FAIL: body background radial gradients do not correctly reference var(--color-accent) and var(--color-success) dynamic variables in dark mode.');
      pass = false;
    }
  } else {
    console.error('FAIL: body style block not found in src/index.css');
    pass = false;
  }

  // Verify .light body radial gradients
  const lightBodyMatch = css.match(/\.light\s+body\s*\{([^}]+)\}/);
  if (lightBodyMatch) {
    const lightBodyStyles = lightBodyMatch[1];
    if (!lightBodyStyles.includes('rgba(var(--color-accent) / 0.03)') || !lightBodyStyles.includes('rgba(var(--color-success) / 0.02)')) {
      console.error('FAIL: .light body background radial gradients do not correctly reference var(--color-accent) and var(--color-success) dynamic variables.');
      pass = false;
    }
  } else {
    console.error('FAIL: .light body style block not found in src/index.css');
    pass = false;
  }

  // Verify .light .input-base background
  const lightInputBaseMatch = css.match(/\.light\s+\.input-base\s*\{([^}]+)\}/);
  if (lightInputBaseMatch) {
    const lightInputBaseStyles = lightInputBaseMatch[1];
    if (!lightInputBaseStyles.includes('rgba(var(--color-surface) / 0.8)')) {
      console.error('FAIL: .light .input-base background does not dynamically reference var(--color-surface). Found instead:', lightInputBaseStyles.trim());
      pass = false;
    }
  } else {
    console.error('FAIL: .light .input-base style block not found in src/index.css');
    pass = false;
  }

  // Verify text gradients simplified to solid colors
  const textGradientProfitMatch = css.match(/\.text-gradient-profit\s*\{([^}]+)\}/);
  if (textGradientProfitMatch) {
    if (!textGradientProfitMatch[1].includes('rgb(var(--color-success))')) {
      console.error('FAIL: .text-gradient-profit is not redefined to use solid --color-success.');
      pass = false;
    }
  } else {
    console.error('FAIL: .text-gradient-profit block not found in src/index.css');
    pass = false;
  }

  const textGradientLossMatch = css.match(/\.text-gradient-loss\s*\{([^}]+)\}/);
  if (textGradientLossMatch) {
    if (!textGradientLossMatch[1].includes('rgb(var(--color-danger))')) {
      console.error('FAIL: .text-gradient-loss is not redefined to use solid --color-danger.');
      pass = false;
    }
  } else {
    console.error('FAIL: .text-gradient-loss block not found in src/index.css');
    pass = false;
  }

  const textGradientAccentMatch = css.match(/\.text-gradient-accent\s*\{([^}]+)\}/);
  if (textGradientAccentMatch) {
    if (!textGradientAccentMatch[1].includes('rgb(var(--color-accent-hover))')) {
      console.error('FAIL: .text-gradient-accent is not redefined to use solid --color-accent-hover.');
      pass = false;
    }
  } else {
    console.error('FAIL: .text-gradient-accent block not found in src/index.css');
    pass = false;
  }

  if (pass) {
    console.log('PASS: Radial gradients and light-mode inputs successfully reference dynamic custom properties.');
  }
  return pass;
}

function run() {
  const { cssContent, tailwindContent } = loadFiles();
  const v1 = verifyCSSVariables(cssContent);
  const v2 = verifyTailwindMappings(tailwindContent);
  const v3 = verifyKeyframeCollisions(cssContent, tailwindContent);
  const v4 = verifyRadialGradientsAndLightMode(cssContent);

  console.log('\n--- FINAL VERDICT ---');
  if (v1 && v2 && v3 && v4) {
    console.log('VERDICT: CLEAN');
    process.exit(0);
  } else {
    console.log('VERDICT: FAIL');
    process.exit(1);
  }
}

run();
