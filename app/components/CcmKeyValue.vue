<script setup lang="ts">
/**
 * Key/value adoption wrapper (PRO-235 / DS-8a) — a definition list on the
 * native `<dl>/<dt>/<dd>` elements. Pairs arrive as an `items` array and/or
 * as custom `<dt>/<dd>` children through the default slot (both compose).
 * Two structural variants: `grid` (label column sized
 * `minmax(3.5rem, max-content)`, values fill the rest) and `stacked`
 * (label above value). Styling lives in app/assets/css/wrappers.css
 * (.ccm-key-value).
 *
 * @component CcmKeyValue
 * @category molecule
 */
export interface KeyValueItem {
  /** The term (label) — rendered in a `<dt>`. */
  term: string
  /** The value — rendered in a `<dd>`. */
  value?: string
}

withDefaults(defineProps<{
  /** Term/value pairs to render (before any slotted pairs). */
  items?: KeyValueItem[]
  /** Layout: label/value grid or stacked label-above-value. */
  variant?: 'grid' | 'stacked'
}>(), {
  items: () => [],
  variant: 'grid',
})
</script>

<template>
  <dl class="ccm-key-value" :data-variant="variant">
    <template v-for="(item, index) in items" :key="`${item.term}-${index}`">
      <dt>{{ item.term }}</dt>
      <dd>{{ item.value }}</dd>
    </template>
    <slot />
  </dl>
</template>
