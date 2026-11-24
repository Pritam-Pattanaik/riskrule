/// <reference types="node" />

import { PassThrough } from 'node:stream';
import { renderToPipeableStream, renderToStaticMarkup } from 'react-dom/server';
import { StaticRouter } from 'react-router-dom/server.js';
import { QueryClientProvider } from '@tanstack/react-query';
import App from './App';
import { queryClient } from './lib/queryClient';
import { getPageMetadata, publicPages } from './lib/siteMetadata';

export const publicPaths = Object.keys(publicPages);
export const publicUrls = publicPaths.map(path => getPageMetadata(path).canonical);

export function renderMetadata(path: string) {
  const { title, canonical, meta, structuredData } = getPageMetadata(path);
  return renderToStaticMarkup(
    <>
      <title>{title}</title>
      {canonical && <link data-page-metadata rel="canonical" href={canonical} />}
      {Object.entries(meta).map(([key, content]) => content && (
        <meta key={key} data-page-metadata {...(key.startsWith('og:') ? { property: key } : { name: key })} content={content} />
      ))}
      {structuredData && (
        <script
          type="application/ld+json"
          data-page-metadata
          dangerouslySetInnerHTML={{ __html: JSON.stringify(structuredData).replaceAll('<', '\\u003c') }}
        />
      )}
    </>,
  );
}

export function renderPage(path: string): Promise<string> {
  return new Promise((resolve, reject) => {
    const output = new PassThrough();
    let html = '';
    output.setEncoding('utf8');
    output.on('data', chunk => { html += chunk; });
    output.on('end', () => resolve(html));
    output.on('error', reject);

    const renderer = renderToPipeableStream(
      <QueryClientProvider client={queryClient}>
        <StaticRouter location={path}>
          <App />
        </StaticRouter>
      </QueryClientProvider>,
      {
        onAllReady: () => renderer.pipe(output),
        onError: reject,
        onShellError: reject,
      },
    );
  });
}
