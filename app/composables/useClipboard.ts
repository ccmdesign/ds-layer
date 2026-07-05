import { copyToClipboard } from '../utils/clipboard'

/**
 * Clipboard composable (PRO-231 / DS-5) — preserves the Social House call
 * site (`const { copy } = useClipboard()`); the implementation lives in
 * `app/utils/clipboard.ts` so it stays framework-agnostic and unit-testable.
 */
export function useClipboard() {
  return { copy: copyToClipboard }
}
