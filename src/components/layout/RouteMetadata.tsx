import { useEffect } from 'react';
import { useLocation } from 'react-router-dom';
import { getPageMetadata } from '../../lib/siteMetadata';

export function RouteMetadata() {
  const { pathname } = useLocation();

  useEffect(() => {
    const { title, canonical, meta, structuredData } = getPageMetadata(pathname);
    document.title = title;
    document.head.querySelectorAll('[data-page-metadata]').forEach(tag => tag.remove());
    const tags = document.createDocumentFragment();

    for (const [key, value] of Object.entries(meta)) {
      if (!value) continue;
      const tag = document.createElement('meta');
      tag.setAttribute(key.startsWith('og:') ? 'property' : 'name', key);
      tag.content = value;
      tags.append(tag);
    }
    if (canonical) {
      const tag = document.createElement('link');
      tag.rel = 'canonical';
      tag.href = canonical;
      tags.append(tag);
    }
    if (structuredData) {
      const tag = document.createElement('script');
      tag.type = 'application/ld+json';
      tag.textContent = JSON.stringify(structuredData);
      tags.append(tag);
    }
    Array.from(tags.children).forEach(tag => tag.setAttribute('data-page-metadata', ''));
    document.head.append(tags);
  }, [pathname]);

  return null;
}
