/**
 * Shared prop types for the Every Layout composition components (PRO-229).
 *
 * Space props are typed against the Utopia fluid scale generated in PRO-228
 * (tokens/space.tokens.json -> app/assets/css/tokens.css): the nine single
 * steps plus the eight one-step pairs. Every Layout's `--s0`/`--s1` defaults
 * translate to Utopia `s` (1rem) and `m` (1.5rem).
 */

export const SPACE_TOKENS = [
  '3xs',
  '2xs',
  'xs',
  's',
  'm',
  'l',
  'xl',
  '2xl',
  '3xl',
  '3xs-2xs',
  '2xs-xs',
  'xs-s',
  's-m',
  'm-l',
  'l-xl',
  'xl-2xl',
  '2xl-3xl',
] as const

export type SpaceToken = (typeof SPACE_TOKENS)[number]

export function isSpaceToken(value: unknown): value is SpaceToken {
  return typeof value === 'string' && (SPACE_TOKENS as readonly string[]).includes(value)
}

/** Map a Utopia space token to its generated custom property. */
export function spaceVar(token: SpaceToken): string {
  return `var(--spacing-${token})`
}

/**
 * Switcher container-breakpoint names. An enum (not a free length) because
 * `@container` size conditions cannot read custom properties; each name pairs
 * with a literal container width in composition.css:
 * xs=20rem, s=30rem, m=40rem, l=50rem, xl=60rem. `s` ~ the book's
 * `--measure` default threshold.
 */
export const SWITCHER_THRESHOLDS = ['xs', 's', 'm', 'l', 'xl'] as const

export type SwitcherThreshold = (typeof SWITCHER_THRESHOLDS)[number]

export function isSwitcherThreshold(value: unknown): value is SwitcherThreshold {
  return typeof value === 'string' && (SWITCHER_THRESHOLDS as readonly string[]).includes(value)
}

/**
 * Frame aspect ratio, e.g. '16:9', '4:5', '1:1'. Typed (rather than a free
 * string) because untyped ratios produced repeated 4:5 cover-crop bugs in
 * Social House's PostCard.
 */
export type FrameRatio = `${number}:${number}`

const FRAME_RATIO_RE = /^(\d+(?:\.\d+)?)\s*:\s*(\d+(?:\.\d+)?)$/

export function isFrameRatio(value: unknown): value is FrameRatio {
  return typeof value === 'string' && FRAME_RATIO_RE.test(value)
}

/** Parse 'W:H' into numerator/denominator strings, or undefined if invalid. */
export function parseFrameRatio(value: string): { n: string, d: string } | undefined {
  const match = FRAME_RATIO_RE.exec(value)
  if (!match) return undefined
  return { n: match[1]!, d: match[2]! }
}
