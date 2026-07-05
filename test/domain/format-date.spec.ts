import { describe, expect, it } from 'vitest'
import { formatDate } from '../../app/utils/format-date'

describe('formatDate', () => {
  it('renders a datetime as its date-only label', () => {
    expect(formatDate('2024-05-22T14:30:00Z')).toBe('May 22, 2024')
  })

  it('keeps a bare date UTC-stable (no timezone day shift)', () => {
    // A local-midnight parse of '2024-05-22' renders May 21 west of UTC;
    // the UTC pinning makes this stable regardless of the runner's TZ.
    expect(formatDate('2024-05-22')).toBe('May 22, 2024')
  })

  it('pins the written calendar day even for offset datetimes', () => {
    // 23:30-05:00 is already May 23 in UTC — the WRITTEN day (22) wins.
    expect(formatDate('2024-05-22T23:30:00-05:00')).toBe('May 22, 2024')
  })

  it('is locale-aware (Varro is EN/PT)', () => {
    expect(formatDate('2024-05-22', { locale: 'pt' })).toMatch(/mai/i)
    expect(formatDate('2024-05-22', { locale: 'pt' })).toContain('2024')
    expect(formatDate('2024-01-05', { locale: 'pt-BR', style: 'long' })).toMatch(/janeiro/i)
  })

  it('supports short/medium/long styles', () => {
    expect(formatDate('2024-01-05', { style: 'short' })).toBe('1/5/2024')
    expect(formatDate('2024-01-05', { style: 'medium' })).toBe('Jan 5, 2024')
    expect(formatDate('2024-01-05', { style: 'long' })).toBe('January 5, 2024')
  })

  it('accepts Date objects and epoch numbers (formatted in UTC)', () => {
    const utcNoon = Date.UTC(2024, 4, 22, 12, 0, 0)
    expect(formatDate(new Date(utcNoon))).toBe('May 22, 2024')
    expect(formatDate(utcNoon)).toBe('May 22, 2024')
  })

  it('is defensive: empty-ish input -> empty string', () => {
    expect(formatDate('')).toBe('')
    expect(formatDate('   ')).toBe('')
    expect(formatDate(null)).toBe('')
    expect(formatDate(undefined)).toBe('')
  })

  it('passes unparseable strings through unchanged (no hardcoded error label)', () => {
    expect(formatDate('not a date')).toBe('not a date')
  })

  it('returns empty for invalid Date/number inputs', () => {
    expect(formatDate(new Date(Number.NaN))).toBe('')
    expect(formatDate(Number.NaN)).toBe('')
  })
})
