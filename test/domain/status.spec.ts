import { describe, expect, it } from 'vitest'
import {
  STATUS_COLORS,
  STATUS_MESSAGES,
  normalizeStatus,
  statusColor,
  statusIds,
  statusLabel,
  statusLabelKey,
} from '../../app/utils/status'

describe('status color map', () => {
  it('carries the union of both products with the documented colors', () => {
    // Varro topic statuses
    expect(statusColor('draft')).toBe('warning')
    expect(statusColor('pending')).toBe('info')
    expect(statusColor('processing')).toBe('neutral')
    expect(statusColor('completed')).toBe('success')
    expect(statusColor('failed')).toBe('error')
    expect(statusColor('rejected')).toBe('neutral')
    // Social House record statuses
    expect(statusColor('published')).toBe('success')
    expect(statusColor('in_buffer')).toBe('info')
    expect(statusColor('not_added')).toBe('neutral')
  })

  it('normalizes case and separators before lookup', () => {
    expect(statusColor('Published')).toBe('success')
    expect(statusColor('In Buffer')).toBe('info')
    expect(statusColor('in-buffer')).toBe('info')
    expect(normalizeStatus('  Not Added ')).toBe('not_added')
  })

  it('falls back to neutral for unknown or absent statuses', () => {
    expect(statusColor('archived')).toBe('neutral')
    expect(statusColor(null)).toBe('neutral')
    expect(statusColor('')).toBe('neutral')
  })

  it('does not leak prototype-chain keys from the plain-object map', () => {
    expect(statusColor('constructor')).toBe('neutral')
    expect(statusLabel('constructor')).toBe('constructor')
  })

  it('has a color and both locale labels for every status id', () => {
    for (const id of statusIds()) {
      expect(STATUS_COLORS[id]).toMatch(/^(success|info|warning|error|neutral)$/)
      expect(STATUS_MESSAGES.en[id].length).toBeGreaterThan(0)
      expect(STATUS_MESSAGES.pt[id].length).toBeGreaterThan(0)
    }
  })
})

describe('status labels (i18n)', () => {
  it('resolves EN and PT labels from the dictionaries', () => {
    expect(statusLabel('published')).toBe('Published')
    expect(statusLabel('published', 'pt')).toBe('Publicado')
    expect(statusLabel('draft', 'pt')).toBe('Rascunho')
    expect(statusLabel('in_buffer')).toBe('In Buffer')
  })

  it('accepts region-qualified locales and falls back to EN for unknown ones', () => {
    expect(statusLabel('completed', 'pt-BR')).toBe('Concluído')
    expect(statusLabel('completed', 'fr')).toBe('Completed')
  })

  it('echoes unknown statuses instead of inventing a label', () => {
    expect(statusLabel('archived')).toBe('archived')
    expect(statusLabel(null)).toBe('')
  })

  it('builds vue-i18n message keys from normalized ids', () => {
    expect(statusLabelKey('published')).toBe('status.published')
    expect(statusLabelKey('In Buffer')).toBe('status.in_buffer')
  })
})
