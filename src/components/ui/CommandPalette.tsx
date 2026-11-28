import React, { useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { Command } from 'cmdk';
import * as Dialog from '@radix-ui/react-dialog';
import {
  LayoutDashboard, BarChart3, BookOpen, Brain, Target, Settings,
  Plus, Moon, Palette, PenTool, TrendingUp, Search, Loader2, CornerDownLeft, Globe, Zap, Handshake
} from 'lucide-react';
import { cn } from '../../lib/cn';
import { CMD_KEY } from '../../lib/osUtils';
import { useUIStore } from '../../stores/uiStore';
import { api } from '../../lib/api';

type SearchResults = { trades: any[]; notes: any[]; strategies: any[]; goals: any[]; journals: any[] };
const EMPTY: SearchResults = { trades: [], notes: [], strategies: [], goals: [], journals: [] };

const groupClass =
  'mt-1 [&_[cmdk-group-heading]]:px-3 [&_[cmdk-group-heading]]:pb-1 [&_[cmdk-group-heading]]:pt-2.5 ' +
  '[&_[cmdk-group-heading]]:text-[11px] [&_[cmdk-group-heading]]:font-semibold [&_[cmdk-group-heading]]:text-tertiary';

export function CommandPalette({ open, setOpen }: { open: boolean; setOpen: (open: boolean) => void }) {
  const navigate = useNavigate();
  const [query, setQuery] = React.useState('');
  const [results, setResults] = React.useState<SearchResults>(EMPTY);
  const [loading, setLoading] = React.useState(false);
  const toggleTheme = useUIStore(state => state.toggleTheme);

  useEffect(() => {
    if (!query.trim() || !open) {
      setLoading(false);
      setResults(EMPTY);
      return;
    }
    let current = true;
    setLoading(true);
    const timer = setTimeout(async () => {
      try {
        const data = await api.get<SearchResults>(`/search?q=${encodeURIComponent(query.trim())}`);
        if (current) setResults(data);
      } catch (e) {
        console.error(e);
      } finally {
        if (current) setLoading(false);
      }
    }, 250);
    return () => { current = false; clearTimeout(timer); };
  }, [query, open]);

  useEffect(() => {
    const down = (e: KeyboardEvent) => {
      if (e.key.toLowerCase() === 'k' && (e.metaKey || e.ctrlKey)) {
        e.preventDefault();
        setOpen(!open);
      }
    };
    document.addEventListener('keydown', down);
    return () => document.removeEventListener('keydown', down);
  }, [open, setOpen]);

  // Start fresh each time the palette opens
  useEffect(() => { if (!open) setQuery(''); }, [open]);

  const run = (command: () => void) => {
    setOpen(false);
    command();
  };
  const go = (path: string) => () => run(() => navigate(path));

  const hasRemote = Object.values(results).some(list => list.length > 0);

  return (
    <Dialog.Root open={open} onOpenChange={setOpen}>
      <Dialog.Portal>
        <Dialog.Overlay className="fixed inset-0 z-[99] bg-primary/25 backdrop-blur-[2px] data-[state=open]:animate-fade-in" />
        {/* The content IS the panel, so a click anywhere outside it closes the palette. */}
        <Dialog.Content
          aria-describedby={undefined}
          className="fixed left-1/2 top-[14vh] z-[100] w-[calc(100%-2rem)] max-w-xl -translate-x-1/2 outline-none"
        >
          <Dialog.Title className="sr-only">Search workspace</Dialog.Title>
          <Command
            label="Search workspace"
            className="animate-in flex flex-col overflow-hidden rounded-2xl border border-border bg-surface-elevated text-primary shadow-floating"
          >
            <div className="flex items-center gap-3 border-b border-border px-4">
              {loading ? <Loader2 className="h-4 w-4 shrink-0 animate-spin text-accent" /> : <Search className="h-4 w-4 shrink-0 text-tertiary" />}
              <Command.Input
                autoFocus
                value={query}
                onValueChange={setQuery}
                placeholder="Search pages, trades, notes and goals"
                className="h-14 w-full bg-transparent text-[15px] text-primary outline-none placeholder:text-muted"
              />
              <kbd className="hidden rounded border border-border bg-surface-2 px-1.5 py-0.5 font-mono text-[10px] text-tertiary sm:block">Esc</kbd>
            </div>

            <Command.List className="scrollbar-none max-h-[360px] overflow-y-auto p-2">
              <Command.Empty className="py-10 text-center text-sm text-secondary">
                {loading ? 'Searching' : query ? `Nothing found for “${query}”.` : 'No results.'}
              </Command.Empty>

              {/* Matches from your own data. forceMount keeps them visible, since the server has already matched them. */}
              {query && hasRemote && (
                <>
                  {results.trades.length > 0 && (
                    <Command.Group heading="Trades" className={groupClass} forceMount>
                      {results.trades.map(t => (
                        <Item key={t.id} forceMount icon={BarChart3} value={`trade-${t.id}`} onSelect={go('/app/trades?search=' + encodeURIComponent(t.symbol))}>
                          {t.symbol} <span className="text-tertiary">· {t.status === 'OPEN' ? 'Open' : t.netPnl > 0 ? 'Win' : t.netPnl < 0 ? 'Loss' : 'Breakeven'}</span>
                        </Item>
                      ))}
                    </Command.Group>
                  )}
                  {results.strategies.length > 0 && (
                    <Command.Group heading="Strategies" className={groupClass} forceMount>
                      {results.strategies.map(s => (
                        <Item key={s.id} forceMount icon={Target} value={`strategy-${s.id}`} onSelect={go('/app/strategies')}>{s.name}</Item>
                      ))}
                    </Command.Group>
                  )}
                  {results.journals.length > 0 && (
                    <Command.Group heading="Journal entries" className={groupClass} forceMount>
                      {results.journals.map(j => (
                        <Item key={j.id} forceMount icon={BookOpen} value={`journal-${j.id}`} onSelect={go('/app/journal')}>{new Date(j.date).toLocaleDateString('en-IN')}</Item>
                      ))}
                    </Command.Group>
                  )}
                  {results.goals.length > 0 && (
                    <Command.Group heading="Goals" className={groupClass} forceMount>
                      {results.goals.map(g => (
                        <Item key={g.id} forceMount icon={Target} value={`goal-${g.id}`} onSelect={go('/app/goals')}>{g.description}</Item>
                      ))}
                    </Command.Group>
                  )}
                  {results.notes.length > 0 && (
                    <Command.Group heading="Notes" className={groupClass} forceMount>
                      {results.notes.map(n => (
                        <Item key={n.id} forceMount icon={Brain} value={`note-${n.id}`} onSelect={go('/app/vault')}>{n.title || 'Untitled note'}</Item>
                      ))}
                    </Command.Group>
                  )}
                </>
              )}

              <Command.Group heading="Go to" className={groupClass}>
                <Item icon={LayoutDashboard} onSelect={go('/app')}>Dashboard</Item>
                <Item icon={BarChart3} onSelect={go('/app/trades')}>Trades</Item>
                <Item icon={TrendingUp} onSelect={go('/app/analytics')}>Analytics</Item>
                <Item icon={BookOpen} onSelect={go('/app/journal')}>Journal</Item>
                <Item icon={Target} onSelect={go('/app/strategies')}>Strategies</Item>
                <Item icon={Target} onSelect={go('/app/goals')}>Goals and habits</Item>
                <Item icon={Brain} onSelect={go('/app/vault')}>Knowledge vault</Item>
                <Item icon={Brain} onSelect={go('/app/ai-coach')}>Lunar AI</Item>
                <Item icon={Globe} onSelect={go('/app/markets')}>Market and news</Item>
                <Item icon={Zap} onSelect={go('/app/flow')}>Flow</Item>
                <Item icon={Handshake} onSelect={go('/app/affiliate')}>Referrals</Item>
                <Item icon={Settings} onSelect={go('/app/settings')}>Settings</Item>
                <Item icon={Palette} onSelect={go('/app/settings?tab=appearance')}>Appearance</Item>
              </Command.Group>

              <Command.Group heading="Actions" className={groupClass}>
                <Item icon={Plus} onSelect={go('/app/trades?new=1')}>Log a trade</Item>
                <Item icon={PenTool} onSelect={go('/app/journal')}>Open trading journal</Item>
                <Item icon={Moon} onSelect={() => run(toggleTheme)}>Switch light and dark theme</Item>
              </Command.Group>
            </Command.List>

            <div className="flex items-center justify-between border-t border-border bg-surface-1 px-4 py-2 text-[11px] text-tertiary">
              <span className="flex items-center gap-1.5"><CornerDownLeft className="h-3 w-3" /> to open</span>
              <span>Up and down to move · {CMD_KEY} K to close</span>
            </div>
          </Command>
        </Dialog.Content>
      </Dialog.Portal>
    </Dialog.Root>
  );
}

const Item = ({ children, icon: Icon, onSelect, value, forceMount }: {
  children: React.ReactNode;
  icon: React.ElementType;
  onSelect: () => void;
  value?: string;
  forceMount?: boolean;
}) => (
  <Command.Item
    value={value}
    forceMount={forceMount}
    onSelect={onSelect}
    className={cn(
      'group flex cursor-pointer items-center gap-3 rounded-lg px-3 py-2.5 text-sm text-secondary outline-none',
      'transition-colors duration-100 data-[selected=true]:bg-accent/10 data-[selected=true]:text-primary'
    )}
  >
    <Icon className="h-4 w-4 shrink-0 text-tertiary transition-colors group-data-[selected=true]:text-accent" />
    <span className="min-w-0 flex-1 truncate">{children}</span>
  </Command.Item>
);
