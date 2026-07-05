<template>
  <span
    class="ccm-status-badge"
    :data-status="normalized"
    :data-status-color="color"
  >{{ displayLabel }}</span>
</template>

<script setup lang="ts">
/**
 * Status badge (PRO-231 / DS-5) — renders the layer's ONE status-coloring
 * mechanism: the JS `STATUS_COLORS` map resolves the semantic color, and the
 * scoped CSS below maps that semantic onto the `--ui-*` variables PRO-230
 * themed. There is deliberately no per-status CSS: adding a status is a
 * registry edit, never a stylesheet edit.
 *
 * i18n: the default label comes from the exported locale dictionaries via
 * `statusLabel(status, locale)`; pass `label` to override with an
 * already-translated string (e.g. vue-i18n's `$t(statusLabelKey(status))`).
 *
 * @component CcmStatusBadge
 * @category atom
 */
import { computed } from 'vue'
import { normalizeStatus, statusColor, statusLabel } from '../utils/status'

const props = withDefaults(defineProps<{
  /** Status id, free-form ('published', 'In Buffer', 'draft'). */
  status?: string | null
  /** Already-translated label override (takes precedence over `locale`). */
  label?: string
  /** Locale for the built-in dictionaries (en/pt). */
  locale?: string
}>(), {
  status: null,
  label: undefined,
  locale: 'en',
})

const normalized = computed(() => normalizeStatus(props.status) || undefined)
const color = computed(() => statusColor(props.status))
const displayLabel = computed(() => props.label ?? statusLabel(props.status, props.locale))
</script>

<style scoped>
.ccm-status-badge {
  /* neutral is the default; the semantic states override --status-color below */
  --status-color: var(--ui-text-muted);

  display: inline-flex;
  align-items: center;
  gap: var(--spacing-3xs);
  padding: 0.2em 0.6em;
  border-radius: var(--radius-full);
  background-color: color-mix(in srgb, var(--status-color) 15%, transparent);
  color: var(--status-color);

  /* Utopia negative steps carry a double dash (same exemption as tokens.css) */
  /* stylelint-disable-next-line custom-property-pattern */
  font-size: var(--text-step--1);
  font-weight: 500;
  line-height: 1.2;
  letter-spacing: 0.01em;
  white-space: nowrap;
}

.ccm-status-badge[data-status-color='success'] {
  --status-color: var(--ui-success);
}

.ccm-status-badge[data-status-color='info'] {
  --status-color: var(--ui-info);
}

.ccm-status-badge[data-status-color='warning'] {
  --status-color: var(--ui-warning);
}

.ccm-status-badge[data-status-color='error'] {
  --status-color: var(--ui-error);
}
</style>
