/**
 * Lint fixture gate (DS-6, PRO-232).
 *
 * Proves the steering lint actually fires: the deliberate violations in
 * test/lint/fixtures/ MUST fail, and the clean fixtures MUST pass, both
 * through the REAL repo configs (eslint.config.mjs / stylelint.config.mjs) —
 * not rule instances configured ad hoc in this file. If someone loosens a
 * rule or breaks the config scoping, this spec goes red.
 *
 * Fixtures are excluded from the normal `pnpm lint` / `pnpm lint:style`
 * runs (config ignores) and linted here with those ignores lifted:
 * ESLint via `ignore: false` (global ignores off, per-config `ignores`
 * scoping like the components/ exemption still applies), Stylelint via the
 * imported config minus `ignoreFiles`.
 *
 * @vitest-environment node
 * (No DOM here, and jsdom rewrites import.meta.url to an http: URL.)
 */
import { fileURLToPath } from 'node:url'
import { ESLint } from 'eslint'
import stylelint from 'stylelint'
import { describe, expect, it } from 'vitest'
import stylelintConfig from '../../stylelint.config.mjs'

const root = fileURLToPath(new URL('../..', import.meta.url))
const fixture = (path: string) => `${root}test/lint/fixtures/${path}`

describe('ESLint steering gate (eslint.config.mjs)', () => {
  const eslint = new ESLint({ cwd: root, ignore: false })

  async function ccmRuleIds(file: string): Promise<string[]> {
    const [result] = await eslint.lintFiles([fixture(file)])
    return (result?.messages ?? [])
      .map(message => message.ruleId ?? '')
      .filter(ruleId => ruleId.startsWith('ccm/'))
  }

  it('fails an over-budget class attribute on a page', async () => {
    expect(await ccmRuleIds('pages/over-budget.vue')).toContain('ccm/class-budget')
  })

  it('fails raw button/input/select/table/dialog elements', async () => {
    const ruleIds = await ccmRuleIds('pages/bespoke-widgets.vue')
    expect(ruleIds.filter(id => id === 'ccm/no-bespoke-widgets')).toHaveLength(5)
  })

  it('passes a clean page that composes components', async () => {
    expect(await ccmRuleIds('pages/clean.vue')).toEqual([])
  })

  it('exempts components/ from the class budget (Tailwind Variants territory)', async () => {
    expect(await ccmRuleIds('components/OverBudgetInComponent.vue')).toEqual([])
  })
})

describe('Stylelint steering gate (stylelint.config.mjs)', () => {
  // Same rules, ignoreFiles lifted so the fixtures are reachable.
  const config = { ...(stylelintConfig as Record<string, unknown>), ignoreFiles: [] }

  async function ruleIds(file: string): Promise<string[]> {
    const { results } = await stylelint.lint({ files: [fixture(file)], config, cwd: root })
    return (results[0]?.warnings ?? []).map(warning => warning.rule)
  }

  it('fails raw hex outside token files', async () => {
    expect(await ruleIds('styles/raw-hex.css')).toContain('color-no-hex')
  })

  it('fails raw px outside token files', async () => {
    expect(await ruleIds('styles/raw-px.css')).toContain('unit-disallowed-list')
  })

  it('fails raw px inside an SFC style block', async () => {
    expect(await ruleIds('styles/raw-px.vue')).toContain('unit-disallowed-list')
  })

  it('passes plain CSS written on the tokens', async () => {
    expect(await ruleIds('styles/clean.css')).toEqual([])
  })
})
