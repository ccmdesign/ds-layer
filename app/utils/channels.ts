/**
 * Social-channel registry (PRO-231 / DS-5) — the single source of truth for
 * platform identity across CCM products. Ports and unifies Social House's
 * `channel-brand.mjs` and Varro's inline `CHANNEL_LOGOS` map.
 *
 * Brand colors are fixed hex ON PURPOSE — the sanctioned exception to the
 * token system: a platform's mark must read identically in light and dark
 * mode. This file is the ONLY place brand hex may live; everything else
 * consumes the registry.
 *
 * Icons come in two flavors so both products are covered:
 * - `icon`: an Iconify name (`i-simple-icons-*`) for Nuxt UI consumers
 *   (`UIcon`, `UBadge` — the Social House pattern).
 * - `CcmIcon*` SFCs (ported Varro SVGs) resolved via `<CcmChannelIcon>`,
 *   dependency-free (no Iconify collection/network needed).
 *
 * Pure: no I/O, no DOM. Lookups are case-insensitive and alias-aware.
 */

export const CHANNEL_IDS = [
  'instagram',
  'linkedin',
  'x',
  'facebook',
  'youtube',
  'tiktok',
  'google_my_business',
  'bluesky',
] as const

export type ChannelId = (typeof CHANNEL_IDS)[number]

export type ChannelInfo = {
  /** Canonical registry id, or null for the unknown-channel fallback. */
  id: ChannelId | null
  /** Platform name — a brand proper noun, deliberately not translated. */
  label: string
  /** Fixed brand hex (sanctioned token-system exception). */
  brandColor: string
  /** Legible foreground on `brandColor`. */
  fg: string
  /** True when the mark is near-black — needs a dark-mode treatment. */
  monochrome: boolean
  /** Iconify icon name for Nuxt UI consumers. */
  icon: string
}

const CHANNELS: Record<ChannelId, ChannelInfo> = {
  instagram: { id: 'instagram', label: 'Instagram', brandColor: '#E4405F', fg: '#ffffff', monochrome: false, icon: 'i-simple-icons-instagram' },
  linkedin: { id: 'linkedin', label: 'LinkedIn', brandColor: '#0A66C2', fg: '#ffffff', monochrome: false, icon: 'i-simple-icons-linkedin' },
  x: { id: 'x', label: 'X', brandColor: '#000000', fg: '#ffffff', monochrome: true, icon: 'i-simple-icons-x' },
  facebook: { id: 'facebook', label: 'Facebook', brandColor: '#1877F2', fg: '#ffffff', monochrome: false, icon: 'i-simple-icons-facebook' },
  youtube: { id: 'youtube', label: 'YouTube', brandColor: '#FF0000', fg: '#ffffff', monochrome: false, icon: 'i-simple-icons-youtube' },
  tiktok: { id: 'tiktok', label: 'TikTok', brandColor: '#000000', fg: '#ffffff', monochrome: true, icon: 'i-simple-icons-tiktok' },
  google_my_business: { id: 'google_my_business', label: 'Google My Business', brandColor: '#4285F4', fg: '#ffffff', monochrome: false, icon: 'i-simple-icons-google' },
  bluesky: { id: 'bluesky', label: 'Bluesky', brandColor: '#0285FF', fg: '#ffffff', monochrome: false, icon: 'i-simple-icons-bluesky' },
}

/** Legacy / alternate spellings -> canonical id. */
const CHANNEL_ALIASES: Record<string, ChannelId> = {
  twitter: 'x',
  gmb: 'google_my_business',
}

/**
 * Neutral fallback for unknown channels. Gray instead of a brand color; the
 * label is intentionally NOT a hardcoded English word (i18n) — `channelBrand`
 * echoes the caller's input so the raw channel name still shows.
 */
const FALLBACK: Omit<ChannelInfo, 'label'> = {
  id: null,
  brandColor: '#6b7280',
  fg: '#ffffff',
  monochrome: false,
  icon: 'i-lucide-megaphone',
}

/** Normalize free-form channel input to a registry key shape. */
function normalizeChannel(channel: string | null | undefined): string {
  return (channel ?? '').trim().toLowerCase().replace(/[\s-]+/g, '_')
}

/** Strictly resolve a channel: canonical entry or undefined. */
export function resolveChannel(channel: string | null | undefined): ChannelInfo | undefined {
  const key = normalizeChannel(channel)
  const id = key in CHANNELS ? (key as ChannelId) : CHANNEL_ALIASES[key]
  return id ? CHANNELS[id] : undefined
}

/**
 * Resolve a channel with a guaranteed result: unknown/absent input yields the
 * neutral fallback carrying the caller's input as label ('' when absent).
 */
export function channelBrand(channel: string | null | undefined): ChannelInfo {
  return resolveChannel(channel) ?? { ...FALLBACK, label: (channel ?? '').trim() }
}

/** All canonical channel ids, in registry order. */
export function channelIds(): readonly ChannelId[] {
  return CHANNEL_IDS
}
