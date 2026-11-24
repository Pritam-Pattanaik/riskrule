import { useState } from 'react';
import { useSearchParams } from 'react-router-dom';
import MarketOverviewHero from '../components/markets/MarketOverviewHero';
import InteractiveMarketChart from '../components/markets/InteractiveMarketChart';
import LiveAISummary from '../components/markets/LiveAISummary';
import MarketBreadth from '../components/markets/MarketBreadth';
import LiveSectorHeatmap from '../components/markets/LiveSectorHeatmap';
import EnhancedEconomicCalendar from '../components/markets/EnhancedEconomicCalendar';
import BreakingNewsTimeline, { type NewsItem } from '../components/markets/BreakingNewsTimeline';
import MarketIntelligenceCenter from '../components/markets/MarketIntelligenceCenter';
import { NewsEngineFeed } from '../components/markets/NewsEngineFeed';
import { DigestPanel } from '../components/markets/DigestPanel';
import LiveWatchlist from '../components/markets/LiveWatchlist';

const tabs = { overview: 'Overview', engine: 'News', calendar: 'Calendar', digest: 'Daily digest' };

export default function Markets() {
  const [params, setParams] = useSearchParams();
  const [symbol, setSymbol] = useState('nifty');
  const [article, setArticle] = useState<NewsItem | null>(null);
  const requested = params.get('tab') || 'overview';
  const active = Object.hasOwn(tabs, requested) ? requested : 'overview';
  if (article) return <div className="space-y-4">
    <button className="desk-link" onClick={() => setArticle(null)}>← Back to market &amp; news</button>
    <MarketIntelligenceCenter article={{ id: article.id, headline: article.title, source: article.source, url: article.url || '', publishedAt: Date.parse(article.publishedAt) / 1000, summary: article.title }} />
  </div>;
  return <div className="space-y-5">
    <header><h1>Market &amp; news</h1><p className="desk-description">Follow an index, read the headlines behind the move, and check upcoming economic events.</p></header>
    <div className="desk-tabs" role="group" aria-label="Market view">{Object.entries(tabs).map(([id, label]) =>
      <button key={id} aria-pressed={id === active} onClick={() => setParams({tab: id})}>{label}</button>)}</div>
    <MarketOverviewHero activeSymbol={symbol} onSelectSymbol={value => {
      setSymbol(value);
      if (active !== 'overview') setParams({tab: 'overview'});
    }} />
    {active === 'overview' && <div className="grid items-start gap-5 xl:grid-cols-[minmax(0,1.8fr)_minmax(260px,1fr)]">
      <div className="min-w-0 space-y-5"><InteractiveMarketChart symbol={symbol} onSymbolChange={setSymbol} /></div>
      <div className="min-w-0 space-y-5"><BreakingNewsTimeline onAnalyze={setArticle} /><div className="h-72"><LiveWatchlist onSelect={setSymbol} /></div></div>
      <div className="min-w-0 space-y-5"><LiveSectorHeatmap /><MarketBreadth /></div><div className="min-w-0"><LiveAISummary /></div>
    </div>}
    {active === 'engine' && <section className="desk-panel"><NewsEngineFeed /></section>}
    {active === 'calendar' && <EnhancedEconomicCalendar />}
    {active === 'digest' && <section className="desk-panel max-w-4xl"><DigestPanel /></section>}
  </div>;
}
