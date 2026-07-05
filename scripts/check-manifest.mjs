/**
 * Manifest schema check (DS-6, PRO-232).
 *
 * Validates manifest.json against the ccm-ds/manifest@1 shape without a
 * schema-library dependency:
 *   - top-level: schema id, name, description, non-empty doctrine[], entries[]
 *   - per entry: name/kind/description/since required; kind in the enum;
 *     unique names; `path` present and existing on disk for non-skip entries;
 *     `useInstead` present for skip entries; props/slots/antiPatterns shaped
 *     correctly when present
 *   - coverage: every app/components/*.vue has a component entry, and every
 *     component entry points at a real file (no stale or missing entries)
 *
 * Exits 1 with a list of problems; silent-ish success otherwise.
 */
import { existsSync, readdirSync, readFileSync } from 'node:fs'
import { dirname, join } from 'node:path'
import { fileURLToPath } from 'node:url'

const root = join(dirname(fileURLToPath(import.meta.url)), '..')
const manifestPath = join(root, 'manifest.json')

const KINDS = ['component', 'composable', 'util', 'data', 'skip']
const errors = []

const manifest = JSON.parse(readFileSync(manifestPath, 'utf8'))

if (manifest.schema !== 'ccm-ds/manifest@1') {
  errors.push(`schema must be 'ccm-ds/manifest@1', got '${manifest.schema}'`)
}
for (const key of ['name', 'description']) {
  if (typeof manifest[key] !== 'string' || !manifest[key]) errors.push(`top-level '${key}' must be a non-empty string`)
}
if (!Array.isArray(manifest.doctrine) || manifest.doctrine.length === 0 || !manifest.doctrine.every(r => typeof r === 'string' && r)) {
  errors.push('doctrine must be a non-empty array of strings')
}
if (!Array.isArray(manifest.entries) || manifest.entries.length === 0) {
  errors.push('entries must be a non-empty array')
}

const seen = new Set()
for (const entry of manifest.entries ?? []) {
  const id = entry?.name ?? '<unnamed>'
  const where = `entry '${id}'`
  for (const key of ['name', 'kind', 'description', 'since']) {
    if (typeof entry?.[key] !== 'string' || !entry[key]) errors.push(`${where}: '${key}' must be a non-empty string`)
  }
  if (seen.has(entry?.name)) errors.push(`${where}: duplicate name`)
  seen.add(entry?.name)
  if (!KINDS.includes(entry?.kind)) errors.push(`${where}: kind '${entry?.kind}' not in ${KINDS.join('|')}`)

  if (entry?.kind === 'skip') {
    if (typeof entry.useInstead !== 'string' || !entry.useInstead) errors.push(`${where}: skip entries must say 'useInstead'`)
    if (entry.path) errors.push(`${where}: skip entries must not have a 'path'`)
  }
  else {
    if (typeof entry?.path !== 'string' || !entry.path) errors.push(`${where}: non-skip entries need a 'path'`)
    else if (!existsSync(join(root, entry.path))) errors.push(`${where}: path '${entry.path}' does not exist`)
  }

  if (entry?.props !== undefined) {
    if (!Array.isArray(entry.props)) errors.push(`${where}: props must be an array`)
    else {
      for (const prop of entry.props) {
        if (typeof prop?.name !== 'string' || typeof prop?.type !== 'string' || typeof prop?.description !== 'string') {
          errors.push(`${where}: prop '${prop?.name ?? '<unnamed>'}' needs string name/type/description`)
        }
        if (!('default' in (prop ?? {}))) errors.push(`${where}: prop '${prop?.name}' needs an explicit 'default' (use null for none)`)
      }
    }
  }
  if (entry?.slots !== undefined && (!Array.isArray(entry.slots) || !entry.slots.every(s => typeof s?.name === 'string' && typeof s?.description === 'string'))) {
    errors.push(`${where}: slots must be [{name, description}]`)
  }
  if (entry?.antiPatterns !== undefined && (!Array.isArray(entry.antiPatterns) || !entry.antiPatterns.every(a => typeof a === 'string' && a))) {
    errors.push(`${where}: antiPatterns must be an array of strings`)
  }
}

// Bidirectional component coverage.
const componentFiles = readdirSync(join(root, 'app/components')).filter(f => f.endsWith('.vue'))
const componentEntries = (manifest.entries ?? []).filter(e => e.kind === 'component')
for (const file of componentFiles) {
  if (!componentEntries.some(e => e.path === `app/components/${file}`)) {
    errors.push(`app/components/${file} has no manifest entry`)
  }
}

const skips = (manifest.entries ?? []).filter(e => e.kind === 'skip').map(e => e.name)
const REQUIRED_SKIPS = ['Icon', 'Imposter', 'Box', 'Center', 'Container', 'Sidebar']
for (const name of REQUIRED_SKIPS) {
  if (!skips.includes(name)) errors.push(`missing Every Layout skip entry '${name}'`)
}

if (errors.length > 0) {
  console.error(`manifest.json failed validation (${errors.length} problem${errors.length === 1 ? '' : 's'}):`)
  for (const error of errors) console.error(`  - ${error}`)
  process.exit(1)
}
console.log(`manifest.json OK — ${manifest.entries.length} entries (${componentEntries.length} components, ${skips.length} skips), doctrine x${manifest.doctrine.length}`)
