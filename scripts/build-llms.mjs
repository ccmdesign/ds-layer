/**
 * llms.txt generator (DS-6, PRO-232).
 *
 * Renders llms.txt at the repo root purely from manifest.json — no
 * timestamps, no environment reads, stable authored order — so the output is
 * byte-deterministic and CI can enforce "regenerate and diff" the same way it
 * does for the design tokens. Edit manifest.json, then `pnpm build:llms`.
 */
import { readFileSync, writeFileSync } from 'node:fs'
import { dirname, join } from 'node:path'
import { fileURLToPath } from 'node:url'

const root = join(dirname(fileURLToPath(import.meta.url)), '..')
const manifest = JSON.parse(readFileSync(join(root, 'manifest.json'), 'utf8'))

const lines = []
const push = (...items) => lines.push(...items)

push(`# ${manifest.name}`)
push('')
push(`> ${manifest.description}`)
push('')
push('Machine-readable source of truth: manifest.json (schema ccm-ds/manifest@1). This file is GENERATED from it by scripts/build-llms.mjs — do not edit by hand.')
push('')
push('## Doctrine')
push('')
for (const rule of manifest.doctrine) push(`- ${rule}`)

const byKind = kind => manifest.entries.filter(e => e.kind === kind)

function renderEntry(entry) {
  push(`### ${entry.name}`)
  push('')
  push(entry.description)
  if (entry.whenToUse) {
    push('')
    push(`When to use: ${entry.whenToUse}`)
  }
  if (entry.props?.length) {
    push('')
    push('Props:')
    for (const prop of entry.props) {
      const def = prop.default === null ? 'no default' : `default: ${JSON.stringify(prop.default)}`
      push(`- \`${prop.name}\` (${prop.type}, ${def}) — ${prop.description}`)
    }
  }
  if (entry.slots?.length) {
    push('')
    push('Slots:')
    for (const slot of entry.slots) push(`- \`${slot.name}\` — ${slot.description}`)
  }
  if (entry.antiPatterns?.length) {
    push('')
    push('Anti-patterns:')
    for (const anti of entry.antiPatterns) push(`- ${anti}`)
  }
  push('')
  if (entry.path) push(`Source: ${entry.path}`)
  push('')
}

const sections = [
  ['## Components', 'component'],
  ['## Composables', 'composable'],
  ['## Utilities', 'util'],
  ['## Data', 'data'],
]
for (const [heading, kind] of sections) {
  const entries = byKind(kind)
  if (entries.length === 0) continue
  push('', heading, '')
  for (const entry of entries) renderEntry(entry)
}

const skips = byKind('skip')
if (skips.length > 0) {
  push('', '## Deliberately not shipped (do not reintroduce)', '')
  push('Every Layout primitives (and near relatives) the layer intentionally omits:', '')
  for (const skip of skips) {
    push(`- **${skip.name}** — ${skip.description} Use instead: ${skip.useInstead}`)
  }
}

// Collapse the double blank lines the section loop produces and end with one newline.
const out = `${lines.join('\n').replaceAll(/\n{3,}/g, '\n\n').trim()}\n`
writeFileSync(join(root, 'llms.txt'), out)
console.log(`llms.txt written — ${out.split('\n').length} lines from ${manifest.entries.length} manifest entries`)
