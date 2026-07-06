<script setup lang="ts">
/**
 * Card adoption wrapper (PRO-235 / DS-8a) — encodes the recurring Social
 * House card STRUCTURE on top of `UCard` (the layer's Nuxt UI restyle
 * target): header row (title + optional trailing affordance), meta line,
 * badges row, body, and an actions row whose last action is pushed to the
 * inline-end. It composes UCard — it never rebuilds its behavior; the skin
 * still arrives via app.config.ts and the tokens.
 *
 * If this doesn't fit, drop to UCard directly — don't extend me.
 *
 * Layout CSS lives in app/assets/css/wrappers.css (.ccm-card).
 *
 * @component CcmCard
 * @category molecule
 */
import { computed, useSlots } from 'vue'

withDefaults(defineProps<{
  /** Card title (or use the `title` slot). */
  title?: string
  /** Meta/subtitle line under the title (or use the `meta` slot). */
  meta?: string
  /** UCard variant, forwarded as-is. */
  variant?: 'solid' | 'outline' | 'soft' | 'subtle'
}>(), {
  title: undefined,
  meta: undefined,
  variant: undefined,
})

const slots = useSlots()
const hasHeader = computed(() =>
  Boolean(slots.title || slots.trailing || slots.meta || slots.badges),
)
const hasActions = computed(() => Boolean(slots.actions))
</script>

<template>
  <UCard class="ccm-card" :variant="variant">
    <template v-if="title || meta || hasHeader" #header>
      <div class="ccm-card-header">
        <div v-if="title || slots.title || slots.trailing" class="ccm-card-title-row">
          <h3 class="ccm-card-title">
            <slot name="title">{{ title }}</slot>
          </h3>
          <div v-if="slots.trailing" class="ccm-card-trailing">
            <slot name="trailing" />
          </div>
        </div>
        <p v-if="meta || slots.meta" class="ccm-card-meta">
          <slot name="meta">{{ meta }}</slot>
        </p>
        <div v-if="slots.badges" class="ccm-card-badges">
          <slot name="badges" />
        </div>
      </div>
    </template>

    <slot />

    <template v-if="hasActions" #footer>
      <div class="ccm-card-actions">
        <slot name="actions" />
      </div>
    </template>
  </UCard>
</template>
