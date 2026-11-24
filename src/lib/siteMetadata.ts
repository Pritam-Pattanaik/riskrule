const siteUrl = 'https://riskrule.app';
const previewImage = `${siteUrl}/og-image.png`;

export const publicPages = {
  '/': {
    title: 'RiskRule | Trading Journal, P&L Analytics & AI Coach',
    description: 'Import broker trades, track P&L and trading discipline, and review your trading habits with Lunar AI. Start your RiskRule trading journal for free.',
  },
  '/workspace': {
    title: 'Trading Journal Workspace | RiskRule',
    description: 'Explore how RiskRule brings trade history, performance charts, and trading reviews into one workspace.',
  },
  '/features': {
    title: 'Trading Journal Features | RiskRule',
    description: 'Explore broker imports, trade journaling, P&L analytics, and tools for reviewing your trading discipline.',
  },
  '/ai-coach': {
    title: 'Lunar AI Trading Coach | RiskRule',
    description: 'See how Lunar AI helps you review trades, identify recurring habits, and reflect on your trading decisions.',
  },
  '/prop-traders': {
    title: 'Trading Journal for Prop Traders | RiskRule',
    description: 'Use RiskRule to journal your trades, review drawdowns, and track how closely you follow your trading rules.',
  },
  '/pricing': {
    title: 'Trading Journal Plans and Pricing | RiskRule',
    description: 'Compare RiskRule plans and see which trade journaling, analytics, and coaching tools suit your workflow.',
  },
  '/faq': {
    title: 'Trading Journal FAQ | RiskRule',
    description: 'Find answers to common questions about RiskRule, broker connections, trade analytics, and account settings.',
  },
  '/changelog': {
    title: 'Product Changelog | RiskRule',
    description: 'Browse RiskRule product updates and changes to the trading journal, analytics, and coaching tools.',
  },
  '/about': {
    title: 'About RiskRule | Trading Journal and Analytics',
    description: 'Learn about RiskRule and its approach to trade journaling, performance tracking, and trading discipline.',
  },
  '/privacy': {
    title: 'Privacy Policy | RiskRule',
    description: 'Read how RiskRule handles personal information, account data, and trading records.',
  },
  '/terms': {
    title: 'Terms of Service | RiskRule',
    description: 'Read the terms that apply to RiskRule accounts and use of the trading journal.',
  },
} as const;

export function normalizePagePath(pathname: string) {
  return pathname.replace(/\/+$/, '') || '/';
}

export function getPageMetadata(pathname: string) {
  const path = normalizePagePath(pathname);
  const page = Object.hasOwn(publicPages, path) ? publicPages[path as keyof typeof publicPages] : undefined;
  if (!page) return { title: 'RiskRule', meta: { robots: 'noindex' } };

  const { title, description } = page;
  const canonical = `${siteUrl}${path}`;
  return {
    title,
    canonical,
    meta: {
      description,
      'og:type': 'website',
      'og:site_name': 'RiskRule',
      'og:title': title,
      'og:description': description,
      'og:url': canonical,
      'og:image': previewImage,
      'twitter:card': 'summary_large_image',
      'twitter:title': title,
      'twitter:description': description,
      'twitter:image': previewImage,
    },
    structuredData: path === '/' ? {
      '@context': 'https://schema.org',
      '@type': 'WebSite',
      name: 'RiskRule',
      url: canonical,
      description,
    } : undefined,
  };
}
