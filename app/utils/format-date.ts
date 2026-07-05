/**
 * Unified date formatter (PRO-231 / DS-5) — merges Social House's UTC-stable
 * `format-date.mjs` with Varro's locale-aware `formatDate.ts`.
 *
 * Intl.DateTimeFormat instead of date-fns: locale data ships with every
 * modern runtime (EN/PT both covered), so the dependency buys nothing here.
 * Varro's arbitrary-pattern parameter and its hardcoded 'Invalid Date'
 * return (an untranslatable user-facing string) are intentionally dropped.
 *
 * UTC stability: ledgers carry dates as either a full timestamp
 * ('2024-05-22T14:30:00Z') or a bare date ('2024-05-22'). Only the calendar
 * day written in the string matters, so the first 10 chars are parsed as UTC
 * midnight and formatted with timeZone: 'UTC' — the displayed day never
 * shifts with the viewer's timezone (a local-midnight parse of '2024-05-22'
 * renders as May 21 west of UTC).
 *
 * Defensive: null/undefined/'' -> ''; an unparseable string passes through
 * unchanged; an invalid Date/number -> ''.
 *
 * Pure: no I/O, no DOM.
 */

export type FormatDateStyle = 'short' | 'medium' | 'long'

export type FormatDateOptions = {
  /** BCP-47 locale, e.g. 'en', 'pt', 'pt-BR'. Default 'en'. */
  locale?: string
  /** 'short' -> 5/22/2024 · 'medium' -> May 22, 2024 · 'long' -> May 22, 2024 spelled out. */
  style?: FormatDateStyle
}

const STYLE_OPTIONS: Record<FormatDateStyle, Intl.DateTimeFormatOptions> = {
  short: { year: 'numeric', month: 'numeric', day: 'numeric' },
  medium: { year: 'numeric', month: 'short', day: 'numeric' },
  long: { year: 'numeric', month: 'long', day: 'numeric' },
}

export function formatDate(
  value: string | number | Date | null | undefined,
  options: FormatDateOptions = {},
): string {
  const { locale = 'en', style = 'medium' } = options

  let date: Date
  let passthrough: string | undefined

  if (value == null) return ''
  if (typeof value === 'string') {
    const iso = value.trim()
    if (iso === '') return ''
    // Bare date or datetime string: pin the written calendar day to UTC.
    const m = iso.match(/^\d{4}-\d{2}-\d{2}/)
    date = new Date(m ? `${m[0]}T00:00:00Z` : iso)
    passthrough = iso
  }
  else {
    date = value instanceof Date ? value : new Date(value)
  }

  if (Number.isNaN(date.getTime())) return passthrough ?? ''

  return new Intl.DateTimeFormat(locale, { ...STYLE_OPTIONS[style], timeZone: 'UTC' }).format(date)
}
