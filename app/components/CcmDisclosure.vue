<script setup lang="ts">
/**
 * Disclosure adoption wrapper (PRO-235 / DS-8a) — native
 * `<details>/<summary>` with the DS skin. Works without JavaScript and is
 * collapsed by default; for default-open, pass the native `open` attribute
 * (it falls through to the `<details>` root). The closed state hides content
 * regardless of author CSS on the children — wrappers.css guards with
 * `.ccm-disclosure:not([open]) > :not(summary) { display: none }`, so an
 * inner `display: grid` can't defeat the UA hiding.
 *
 * Paged/animated/controlled accordions are Nuxt UI's UAccordion — this
 * wrapper is the zero-JS structural case only.
 *
 * @component CcmDisclosure
 * @category molecule
 */
withDefaults(defineProps<{
  /** Summary label (or use the `summary` slot). */
  summary?: string
  /** Optional count/badge affordance rendered after the label. */
  count?: number | string
}>(), {
  summary: undefined,
  count: undefined,
})
</script>

<template>
  <details class="ccm-disclosure">
    <summary class="ccm-disclosure-summary">
      <span class="ccm-disclosure-label">
        <slot name="summary">{{ summary }}</slot>
      </span>
      <span v-if="count !== undefined" class="ccm-disclosure-count">{{ count }}</span>
    </summary>
    <div class="ccm-disclosure-content">
      <slot />
    </div>
  </details>
</template>
