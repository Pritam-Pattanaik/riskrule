import { readFile, writeFile } from 'node:fs/promises';

process.env.NODE_ENV = 'production';
const { renderMetadata, renderPage, publicPaths, publicUrls } = await import(
  '../node_modules/.cache/riskrule-ssr/entry-prerender.mjs'
);

const dist = new URL('../dist/', import.meta.url);
const template = await readFile(new URL('index.html', dist), 'utf8');
const metadataSlot = /<title>RiskRule<\/title>\s*<!-- page-metadata -->/;
const rootSlot = '<div id="root"></div>';

if (!metadataSlot.test(template) || !template.includes(rootSlot)) {
  throw new Error('The built HTML is missing a prerender slot.');
}

const withMetadata = path => template.replace(metadataSlot, () => renderMetadata(path));
await writeFile(new URL('spa.html', dist), withMetadata('/app'));

for (const path of publicPaths) {
  const file = path === '/' ? 'index.html' : `${path.slice(1)}.html`;
  const app = await renderPage(path);
  const html = withMetadata(path).replace(rootSlot, () => `<div id="root" data-prerender-path="${path}">${app}</div>`);
  await writeFile(new URL(file, dist), html);
}

const urls = publicUrls.map(url => `  <url><loc>${url}</loc></url>`).join('\n');
await writeFile(new URL('sitemap.xml', dist),
  `<?xml version="1.0" encoding="UTF-8"?>\n<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">\n${urls}\n</urlset>\n`);
console.log(`Prerendered ${publicPaths.length} public pages and generated sitemap.xml`);
