/**
 * Status conventions (PRO-231 / DS-5) — ONE mechanism for badge coloring.
 *
 * The JS map below is the single source of truth: a status id maps to one of
 * the five semantic colors PRO-230 already themed through Nuxt UI. Consumers
 * either pass `statusColor(id)` straight into a Nuxt UI `color` prop (the
 * Social House pattern) or render `<CcmStatusBadge>`, which maps the same
 * value onto the `--ui-*` CSS variables (the Varro visual, without its
 * per-status CSS selector fork). Pure-CSS `[data-status]` styling was
 * rejected because it can't be unit-tested or enumerated by the manifest.
 *
 * i18n: labels live in exported locale dictionaries (EN/PT), never inline in
 * components. vue-i18n consumers can ignore the dictionaries and use
 * `statusLabelKey()` against their own message catalogs.
 *
 * Vocabulary = union of both products: Varro topic statuses (draft, pending,
 * processing, completed, failed, rejected) + Social House record statuses
 * (published, in_buffer, not_added). Unknown status -> neutral.
 */

export type StatusColor = 'success' | 'info' | 'warning' | 'error' | 'neutral'

export const STATUS_COLORS = {
  draft: 'warning',
  pending: 'info',
  processing: 'neutral',
  completed: 'success',
  failed: 'error',
  rejected: 'neutral',
  published: 'success',
  in_buffer: 'info',
  not_added: 'neutral',
} as const satisfies Record<string, StatusColor>

export type StatusId = keyof typeof STATUS_COLORS

/**
 * User-facing labels per locale. EN mirrors what each product renders today;
 * PT covers Varro's second locale. Consumers with their own i18n setup can
 * merge these into their catalogs (keys via `statusLabelKey`).
 */
export const STATUS_MESSAGES: Record<'en' | 'pt', Record<StatusId, string>> = {
  en: {
    draft: 'Draft',
    pending: 'Pending',
    processing: 'Processing',
    completed: 'Completed',
    failed: 'Failed',
    rejected: 'Rejected',
    published: 'Published',
    in_buffer: 'In Buffer',
    not_added: 'Not yet added to Buffer',
  },
  pt: {
    draft: 'Rascunho',
    pending: 'Pendente',
    processing: 'Em processamento',
    completed: 'Concluído',
    failed: 'Falhou',
    rejected: 'Rejeitado',
    published: 'Publicado',
    in_buffer: 'No Buffer',
    not_added: 'Ainda não adicionado ao Buffer',
  },
}

/** Normalize free-form status input ('In Buffer', 'in-buffer') to id shape. */
export function normalizeStatus(status: string | null | undefined): string {
  return (status ?? '').trim().toLowerCase().replace(/[\s-]+/g, '_')
}

function asStatusId(status: string | null | undefined): StatusId | undefined {
  const key = normalizeStatus(status)
  return key in STATUS_COLORS ? (key as StatusId) : undefined
}

/** Semantic badge color for a status; unknown/absent -> 'neutral'. */
export function statusColor(status: string | null | undefined): StatusColor {
  const id = asStatusId(status)
  return id ? STATUS_COLORS[id] : 'neutral'
}

/**
 * Human label for a status in the given locale. Unknown locale falls back to
 * EN; unknown status echoes the caller's input (no hardcoded fallback word).
 */
export function statusLabel(status: string | null | undefined, locale: string = 'en'): string {
  const id = asStatusId(status)
  if (!id) return (status ?? '').trim()
  const lang = locale.slice(0, 2).toLowerCase()
  const messages = lang in STATUS_MESSAGES ? STATUS_MESSAGES[lang as keyof typeof STATUS_MESSAGES] : STATUS_MESSAGES.en
  return messages[id]
}

/** i18n message key for a status, e.g. 'status.in_buffer' (vue-i18n consumers). */
export function statusLabelKey(status: string | null | undefined): string {
  return `status.${normalizeStatus(status)}`
}

/** All known status ids, in registry order. */
export function statusIds(): StatusId[] {
  return Object.keys(STATUS_COLORS) as StatusId[]
}
