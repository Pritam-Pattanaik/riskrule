import { useState, type CSSProperties } from 'react';
import { ArrowDownRight, ArrowUpRight, Check, Monitor, RotateCcw } from 'lucide-react';
import {
  CHART_SCHEMES, DEFAULT_WORKSPACE_APPEARANCE, WORKSPACE_THEMES, getWorkspacePalette, parseAccent,
  type ChartScheme, type WorkspaceAppearance, type WorkspaceTheme,
} from '../../lib/workspaceAppearance';
import { useUIStore } from '../../stores/uiStore';
import { cn } from '../../lib/cn';
import { Button } from '../ui/Button';

const themeChoices: WorkspaceTheme[] = ['light', 'dark', 'midnight', 'warm', 'system'];
const chartChoices = Object.keys(CHART_SCHEMES) as ChartScheme[];
const accents = [
  { name: 'Emerald', hex: '#047857' },
  { name: 'Blue', hex: '#2563EB' },
  { name: 'Purple', hex: '#7C3AED' },
  { name: 'Amber', hex: '#B45309' },
  { name: 'Teal', hex: '#0F766E' },
];

function WorkspacePreview({ palette }: { palette: ReturnType<typeof getWorkspacePalette> }) {
  const colors = {
    backgroundColor: palette.canvas,
    color: palette.text,
    colorScheme: palette.mode,
  } satisfies CSSProperties;

  return (
    <figure className="rounded-xl border border-border bg-surface p-4 sm:p-5">
      <figcaption className="mb-3 text-sm font-semibold text-primary">Live preview</figcaption>
      <div className="rounded-lg border p-3 text-sm sm:p-4" style={{ ...colors, borderColor: palette.edge }}>
        <div className="mb-3 flex flex-wrap items-center justify-between gap-2">
          <span className="font-semibold">Trading dashboard</span>
          <span className="rounded-md px-2.5 py-1.5 text-xs font-semibold" style={{ backgroundColor: palette.action, color: palette.actionText }}>
            Log trade
          </span>
        </div>
        <div className="rounded-md border p-3" style={{ backgroundColor: palette.surface, borderColor: palette.edge }}>
          <div className="flex flex-wrap items-center justify-between gap-2">
            <span className="font-medium">Nifty 50</span>
            <span className="text-xs" style={{ color: palette.secondary }}>Sample chart</span>
          </div>
          <div className="mt-3 flex h-16 items-end gap-2 overflow-hidden border-b pb-1" aria-hidden="true" style={{ borderColor: palette.edge }}>
            {[32, 43, 34, 51, 45, 57, 51, 61, 54, 64].map((height, index, values) => (
              <div key={index} className="flex-1 rounded-t-sm" style={{
                height,
                backgroundColor: height >= (values[index - 1] ?? 0) ? palette.chart.up : palette.chart.down,
              }} />
            ))}
          </div>
          <div className="mt-3 flex flex-wrap gap-x-4 gap-y-1 text-xs font-semibold">
            <span className="inline-flex items-center gap-1" style={{ color: palette.chart.up }}><ArrowUpRight size={14} aria-hidden="true" /> Up</span>
            <span className="inline-flex items-center gap-1" style={{ color: palette.chart.down }}><ArrowDownRight size={14} aria-hidden="true" /> Down</span>
          </div>
        </div>
      </div>
      <p className="mt-3 text-xs text-secondary">Canvas <code>{palette.canvas}</code> · Accent <code>{palette.accent}</code></p>
    </figure>
  );
}

export default function AppearanceSettings() {
  const appearance = useUIStore(state => state.appearance);
  const systemDark = useUIStore(state => state.systemDark);
  const saveAppearance = useUIStore(state => state.saveAppearance);
  const [draft, setDraft] = useState<WorkspaceAppearance | null>(null);
  const [hexInput, setHexInput] = useState<string | null>(null);
  const [status, setStatus] = useState('');
  const selection = draft ?? appearance;
  const rawAccent = hexInput ?? selection.accent ?? '';
  const accent = parseAccent(rawAccent);
  const invalid = rawAccent.trim() !== '' && !accent;
  const preview = getWorkspacePalette({ ...selection, accent }, systemDark);
  const adjusted = accent && accent !== preview.accent;
  const dirty = invalid || selection.theme !== appearance.theme || selection.chart !== appearance.chart || accent !== appearance.accent;

  function commit(value: WorkspaceAppearance) {
    const saved = saveAppearance(value);
    setDraft(null);
    setHexInput(null);
    setStatus(saved ? 'Appearance saved' : 'Applied for this session. Browser storage is unavailable.');
  }

  return (
    <section aria-labelledby="appearance-title" className="space-y-5">
      <div>
        <h2 id="appearance-title" className="text-xl font-semibold text-primary">Appearance</h2>
        <p className="mt-1 text-sm text-secondary">Choose how your trading workspace looks on this browser.</p>
      </div>

      <div className="grid items-start gap-5 xl:grid-cols-[minmax(0,1.45fr)_minmax(280px,1fr)]">
        <div className="space-y-5 rounded-xl border border-border bg-surface p-4 sm:p-5">
          <fieldset>
            <legend className="mb-3 text-sm font-semibold text-primary">Workspace theme</legend>
            <div className="grid gap-2 sm:grid-cols-2">
              {themeChoices.map(theme => {
                const palette = getWorkspacePalette({ ...DEFAULT_WORKSPACE_APPEARANCE, theme }, systemDark);
                const selected = selection.theme === theme;
                return (
                  <label key={theme} className="relative min-w-0 cursor-pointer">
                    <input type="radio" className="peer sr-only" name="workspace-theme" checked={selected}
                      onChange={() => { setDraft({ ...selection, theme }); setStatus(''); }} />
                    <span className={cn(
                      'flex min-h-12 items-center gap-3 rounded-lg border px-3 py-2 text-sm font-medium text-primary hover:bg-surface-1 peer-focus-visible:outline peer-focus-visible:outline-2 peer-focus-visible:outline-offset-2 peer-focus-visible:outline-accent',
                      selected ? 'border-accent bg-surface-1' : 'border-border',
                    )}>
                      {theme === 'system' ? <Monitor size={20} className="shrink-0 text-secondary" aria-hidden="true" /> : (
                        <span aria-hidden="true" className="flex h-6 w-8 shrink-0 items-end justify-end rounded border p-1"
                          style={{ backgroundColor: palette.canvas, borderColor: palette.edge }}>
                          <span className="h-2 w-3 rounded-sm" style={{ backgroundColor: palette.action }} />
                        </span>
                      )}
                      <span className="flex-1">{theme === 'system' ? 'Match system' : palette.name}</span>
                      {selected && <Check size={16} className="shrink-0 text-accent" aria-hidden="true" />}
                    </span>
                  </label>
                );
              })}
            </div>
          </fieldset>

          <div className="space-y-2 border-t border-border pt-4">
            <label htmlFor="appearance-accent" className="block text-sm font-semibold text-primary">Accent color</label>
            <div className="flex flex-wrap items-center gap-2">
              {accents.map(({ name, hex }) => (
                <button key={hex} type="button" aria-label={name} aria-pressed={accent === hex}
                  className={cn('grid size-10 place-items-center rounded-md border border-border p-1.5 hover:bg-surface-2', accent === hex && 'border-accent bg-surface-1')}
                  onClick={() => { setHexInput(hex); setStatus(''); }}>
                  <span className="grid size-full place-items-center rounded-sm text-white" style={{ backgroundColor: hex }} aria-hidden="true">
                    {accent === hex && <Check size={14} />}
                  </span>
                </button>
              ))}
              <button type="button" className="min-h-10 rounded-md px-2 text-xs font-medium text-accent hover:bg-surface-1"
                onClick={() => { setHexInput(''); setStatus(''); }}>
                Use preset accent
              </button>
            </div>
            <div className="flex flex-wrap items-center gap-2">
              <input id="appearance-accent" type="text" spellCheck={false} autoComplete="off" maxLength={7}
                aria-invalid={invalid} aria-describedby="appearance-accent-help" value={rawAccent} placeholder={preview.accent}
                onChange={event => { setHexInput(event.target.value); setStatus(''); }}
                className="h-10 w-28 rounded-md border border-border bg-canvas px-2 font-mono text-sm text-primary" />
              <input type="color" aria-label="Choose accent color" value={accent ?? preview.accent}
                onChange={event => { setHexInput(event.target.value.toUpperCase()); setStatus(''); }}
                className="h-10 w-12 cursor-pointer rounded-md border border-border bg-surface p-1" />
            </div>
            <p id="appearance-accent-help" className={cn('text-xs', invalid ? 'text-danger' : 'text-secondary')}>
              {invalid ? 'Enter a hex color like #2563EB.' : adjusted ? `Adjusted to ${preview.accent} for better contrast.` : 'Choose a swatch, use the picker, or enter a hex color.'}
            </p>
          </div>

          <div className="border-t border-border pt-4">
            <label htmlFor="appearance-chart" className="block text-sm font-semibold text-primary">Market chart colors</label>
            <select id="appearance-chart" value={selection.chart} aria-describedby="appearance-chart-help"
              onChange={event => { setDraft({ ...selection, chart: event.target.value as ChartScheme }); setStatus(''); }}
              className="mt-2 min-h-10 w-full max-w-xs rounded-md border border-border bg-canvas px-2 text-sm text-primary">
              {chartChoices.map(chart => <option key={chart} value={chart}>{CHART_SCHEMES[chart].name}</option>)}
            </select>
            <p id="appearance-chart-help" className="mt-2 text-xs text-secondary">Colors are listed in up / down order. Ledger and risk colors keep their usual meaning.</p>
          </div>
        </div>

        <WorkspacePreview palette={preview} />
      </div>

      <div className="flex flex-wrap items-center gap-2">
        <Button onClick={() => commit({ ...selection, accent })} disabled={!dirty || invalid}>Apply</Button>
        <Button variant="secondary" disabled={!dirty} onClick={() => { setDraft(null); setHexInput(null); setStatus(''); }}>Cancel</Button>
        <Button variant="ghost" onClick={() => commit(DEFAULT_WORKSPACE_APPEARANCE)}><RotateCcw size={15} aria-hidden="true" /> Restore default</Button>
        <p role="status" className="text-sm text-secondary">{status}</p>
      </div>
    </section>
  );
}
