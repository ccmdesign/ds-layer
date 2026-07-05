/**
 * Clipboard write with a hidden-textarea + execCommand fallback (PRO-231 /
 * DS-5). Ported from Social House's `useClipboard.ts`, reshaped as a
 * framework-agnostic util: SSR safety comes from `typeof` guards instead of
 * `import.meta.client`, so it runs (and is testable) anywhere a DOM exists.
 *
 * navigator.clipboard.writeText needs a secure context; the legacy textarea
 * path covers insecure contexts, permission denials, and older browsers.
 */

/** Copy `text` to the clipboard. Resolves true on success, false otherwise. Never throws. */
export async function copyToClipboard(text: string): Promise<boolean> {
  try {
    if (typeof navigator !== 'undefined' && navigator.clipboard?.writeText) {
      await navigator.clipboard.writeText(text)
      return true
    }
  }
  catch {
    // fall through to the legacy path (insecure context, permission denied, older browser)
  }

  if (typeof document !== 'undefined' && document.body) {
    const ta = document.createElement('textarea')
    document.body.appendChild(ta)
    try {
      ta.value = text
      ta.setAttribute('readonly', '')
      ta.style.position = 'fixed'
      ta.style.top = '-9999px'
      ta.style.opacity = '0'
      ta.select()
      return document.execCommand('copy')
    }
    catch {
      return false
    }
    finally {
      // Always remove the node — even if select()/execCommand throws (e.g. some iOS WebViews).
      document.body.removeChild(ta)
    }
  }
  return false
}
