export const APPEARANCE_STORAGE_KEY = 'riskrule-workspace-appearance';
export const SYSTEM_COLOR_QUERY = '(prefers-color-scheme: dark)';

type Mode = 'light' | 'dark';

export const WORKSPACE_THEMES = {
  light: {
    name: 'RiskRule Light', mode: 'light',
    canvas: '#F8FAFC', surface: '#FFFFFF', raised: '#F1F5F9', control: '#E2E8F0', edge: '#CBD5E1',
    text: '#0F172A', secondary: '#475569', tertiary: '#64748B',
    accent: '#047857', hover: '#065F46', risk: '#0F172A',
  },
  dark: {
    name: 'RiskRule Dark', mode: 'dark',
    canvas: '#0F172A', surface: '#141E31', raised: '#1E293B', control: '#334155', edge: '#475569',
    text: '#F8FAFC', secondary: '#CBD5E1', tertiary: '#94A3B8',
    accent: '#22C55E', hover: '#4ADE80', risk: '#0F172A',
  },
  midnight: {
    name: 'Midnight', mode: 'dark',
    canvas: '#0A1220', surface: '#111C2E', raised: '#19283E', control: '#243751', edge: '#394F6E',
    text: '#F1F5F9', secondary: '#C0CDE0', tertiary: '#B0BFD3',
    accent: '#60A5FA', hover: '#93C5FD', risk: '#19283E',
  },
  warm: {
    name: 'Warm Slate', mode: 'light',
    canvas: '#F8F5EF', surface: '#FFFCF6', raised: '#F3ECE2', control: '#E9DED0', edge: '#D4C6B6',
    text: '#292524', secondary: '#57534E', tertiary: '#625951',
    accent: '#6D28D9', hover: '#5B21B6', risk: '#292524',
  },
} as const;

export const CHART_SCHEMES = {
  classic: {
    name: 'Green / Red',
    light: { up: '#047857', down: '#B91C1C' },
    dark: { up: '#4ADE80', down: '#F87171' },
  },
  blueOrange: {
    name: 'Blue / Orange',
    light: { up: '#1D4ED8', down: '#9A3412' },
    dark: { up: '#60A5FA', down: '#FB923C' },
  },
  inverted: {
    name: 'Red / Green',
    light: { up: '#B91C1C', down: '#047857' },
    dark: { up: '#F87171', down: '#4ADE80' },
  },
} as const;

export type WorkspaceTheme = keyof typeof WORKSPACE_THEMES | 'system';
export type ChartScheme = keyof typeof CHART_SCHEMES;

export interface WorkspaceAppearance {
  theme: WorkspaceTheme;
  accent: string | null;
  chart: ChartScheme;
}

export const DEFAULT_WORKSPACE_APPEARANCE: WorkspaceAppearance = {
  theme: 'light',
  accent: null,
  chart: 'classic',
};

export function parseAccent(value: unknown): string | null {
  if (typeof value !== 'string') return null;
  const hex = value.trim().replace(/^#/, '');
  if (/^[a-f\d]{6}$/i.test(hex)) return '#' + hex.toUpperCase();
  if (/^[a-f\d]{3}$/i.test(hex)) return '#' + [...hex.toUpperCase()].map(char => char + char).join('');
  return null;
}

export function readWorkspaceAppearance(saved: string | null, fallback: Mode): WorkspaceAppearance {
  const defaults = { ...DEFAULT_WORKSPACE_APPEARANCE, theme: fallback };
  if (saved === null) return defaults;

  try {
    const choice = JSON.parse(saved);
    if (!choice || typeof choice !== 'object') return defaults;
    return {
      theme: choice.theme === 'system' || Object.hasOwn(WORKSPACE_THEMES, choice.theme) ? choice.theme : fallback,
      accent: parseAccent(choice.accent),
      chart: Object.hasOwn(CHART_SCHEMES, choice.chart) ? choice.chart : defaults.chart,
    };
  } catch {
    return defaults;
  }
}

export function isWorkspacePath(path: string): boolean {
  return /^\/app(?:\/|$)/i.test(path) && !/^\/app\/admin(?:\/|$)/i.test(path);
}

export function resolveWorkspaceTheme(theme: WorkspaceTheme, prefersDark: boolean) {
  return theme === 'system' ? (prefersDark ? 'dark' : 'light') : theme;
}

function rgbChannels(hex: string) {
  return [1, 3, 5].map(index => parseInt(hex.slice(index, index + 2), 16));
}

function luminance(hex: string) {
  const [r, g, b] = rgbChannels(hex).map(channel => {
    const value = channel / 255;
    return value <= 0.04045 ? value / 12.92 : ((value + 0.055) / 1.055) ** 2.4;
  });
  return r * 0.2126 + g * 0.7152 + b * 0.0722;
}

export function contrastRatio(first: string, second: string) {
  const a = luminance(first);
  const b = luminance(second);
  return (Math.max(a, b) + 0.05) / (Math.min(a, b) + 0.05);
}

function mix(from: string, toward: string, amount: number) {
  const target = rgbChannels(toward);
  return '#' + rgbChannels(from)
    .map((channel, index) => Math.round(channel + (target[index] - channel) * amount).toString(16).padStart(2, '0'))
    .join('').toUpperCase();
}

function readableAccent(color: string, palette: (typeof WORKSPACE_THEMES)[keyof typeof WORKSPACE_THEMES]) {
  const ink = palette.mode === 'light' ? '#000000' : '#FFFFFF';
  const surfaces = [palette.canvas, palette.surface, palette.raised, palette.control];
  for (let step = 0; step < 40; step++) {
    const candidate = step === 0 ? color : mix(color, ink, step / 40);
    if (surfaces.every(surface => contrastRatio(candidate, surface) >= 4.5)) return candidate;
  }
  return ink;
}

function filledText(background: string) {
  return contrastRatio(background, '#FFFFFF') >= 4.5 ? '#FFFFFF' : '#000000';
}

export function getWorkspacePalette(appearance: WorkspaceAppearance, prefersDark: boolean) {
  const theme = resolveWorkspaceTheme(appearance.theme, prefersDark);
  const palette = WORKSPACE_THEMES[theme];
  const accent = appearance.accent ? readableAccent(appearance.accent, palette) : palette.accent;
  const brandAction = !appearance.accent && (theme === 'light' || theme === 'dark');
  const action = brandAction ? '#22C55E' : accent;
  const actionText = brandAction ? '#0F172A' : filledText(action);
  const alternate = actionText === '#FFFFFF' ? '#000000' : '#FFFFFF';
  return {
    ...palette,
    accent,
    hover: appearance.accent ? mix(accent, palette.mode === 'light' ? '#000000' : '#FFFFFF', 0.14) : palette.hover,
    action,
    actionText,
    actionHover: brandAction ? '#0E9F6E' : mix(action, alternate, 0.14),
    chart: CHART_SCHEMES[appearance.chart][palette.mode],
  };
}

export function workspaceCssTokens(palette: ReturnType<typeof getWorkspacePalette>) {
  const tokens = {
    canvas: palette.canvas, surface: palette.surface, raised: palette.raised, control: palette.control, edge: palette.edge,
    text: palette.text, secondary: palette.secondary, tertiary: palette.tertiary,
    accent: palette.accent, 'accent-hover': palette.hover,
  };
  return {
    ...Object.fromEntries(Object.entries(tokens).map(([name, hex]) => ['--workspace-' + name, rgbChannels(hex).join(' ')])),
    '--workspace-action': palette.action,
    '--workspace-action-hover': palette.actionHover,
    '--workspace-action-text': palette.actionText,
    '--workspace-accent-text': filledText(palette.accent),
    '--workspace-risk-background': palette.risk,
    '--workspace-chart-up': palette.chart.up,
    '--workspace-chart-down': palette.chart.down,
  };
}
