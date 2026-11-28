import { strict as assert } from 'node:assert';
import { test } from 'node:test';
import {
  CHART_SCHEMES, DEFAULT_WORKSPACE_APPEARANCE, WORKSPACE_THEMES, contrastRatio, getWorkspacePalette,
  isWorkspacePath, parseAccent, readWorkspaceAppearance, resolveWorkspaceTheme, workspaceCssTokens,
} from '../src/lib/workspaceAppearance';

test('preserves a legacy mode and recovers from invalid browser storage', () => {
  assert.equal(readWorkspaceAppearance(null, 'dark').theme, 'dark');
  assert.equal(readWorkspaceAppearance('{broken', 'dark').theme, 'dark');
  assert.deepEqual(readWorkspaceAppearance('{"theme":"constructor","accent":"red","chart":"__proto__"}', 'light'),
    DEFAULT_WORKSPACE_APPEARANCE);
  assert.deepEqual(readWorkspaceAppearance('{"theme":"midnight","accent":"#abc","chart":"blueOrange"}', 'light'),
    { theme: 'midnight', accent: '#AABBCC', chart: 'blueOrange' });
});

test('only the trader workspace and its subroutes receive the custom appearance', () => {
  assert.equal(isWorkspacePath('/app'), true);
  assert.equal(isWorkspacePath('/app/settings'), true);
  assert.equal(isWorkspacePath('/APP/ADMIN/settings'), false);
  assert.equal(isWorkspacePath('/login'), false);
  assert.equal(isWorkspacePath('/apple'), false);
  assert.equal(resolveWorkspaceTheme('system', true), 'dark');
  assert.equal(resolveWorkspaceTheme('system', false), 'light');
  assert.equal(resolveWorkspaceTheme('midnight', false), 'midnight');
});

test('presets retain chart and action contrast without using the custom accent as a gain color', () => {
  for (const theme of ['light', 'dark', 'midnight', 'warm'] as const) {
    for (const chart of ['classic', 'blueOrange', 'inverted'] as const) {
      const palette = getWorkspacePalette({ theme, accent: null, chart }, false);
      for (const ink of [palette.text, palette.accent, palette.chart.up, palette.chart.down]) {
        assert.ok(contrastRatio(ink, palette.surface) >= 4.5, `${theme}: ${ink}`);
        assert.ok(contrastRatio(ink, palette.raised) >= 4.5, `${theme}: ${ink}`);
      }
      assert.ok(contrastRatio(palette.actionText, palette.action) >= 4.5);
      assert.ok(contrastRatio(palette.actionText, palette.actionHover) >= 4.5);
      assert.deepEqual(palette.chart, CHART_SCHEMES[chart][WORKSPACE_THEMES[theme].mode]);
    }
  }
});

test('only accepts hex and adjusts custom accents for both light and dark backgrounds', () => {
  assert.equal(parseAccent('25a3eb'), '#25A3EB');
  assert.equal(parseAccent('rgb(25, 100, 18)'), null);
  assert.equal(parseAccent('#0'), null);
  for (const theme of ['light', 'dark'] as const) {
    for (const accent of ['#FFFFFF', '#000000', '#777777', '#FFDD00']) {
      const palette = getWorkspacePalette({ theme, accent, chart: 'classic' }, false);
      for (const surface of [palette.canvas, palette.surface, palette.raised, palette.control]) {
        assert.ok(contrastRatio(palette.accent, surface) >= 4.5);
      }
      assert.ok(contrastRatio(palette.actionText, palette.action) >= 4.5);
      assert.ok(contrastRatio(palette.actionText, palette.actionHover) >= 4.5);
      assert.equal(workspaceCssTokens(palette)['--workspace-chart-up'], CHART_SCHEMES.classic[theme].up);
    }
  }
});
