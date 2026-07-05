<script setup lang="ts">
/**
 * Switcher — Every Layout chapter 06.
 * Switches between a horizontal and a vertical flex layout at a
 * container-based breakpoint.
 *
 * DEVIATION (settled in PRO-229): implemented with container queries, not
 * the book's `flex-basis: calc((threshold - 100%) * 999)` hack. Because
 * `@container` size conditions cannot read custom properties, `threshold`
 * is an enumerated scale (xs=20rem, s=30rem, m=40rem, l=50rem, xl=60rem)
 * rather than a free CSS length. Layout CSS lives in
 * app/assets/css/composition.css (.ccm-switcher).
 */
import { computed } from 'vue'
import {
  isSpaceToken,
  isSwitcherThreshold,
  spaceVar,
  type SpaceToken,
  type SwitcherThreshold,
} from '../utils/composition'

const props = withDefaults(defineProps<{
  /** Element (or component) to render. */
  as?: string
  /**
   * Named container breakpoint below which children stack vertically.
   * Default 's' (30rem, ~ the book's --measure default).
   */
  threshold?: SwitcherThreshold
  /** Utopia space token for the gap. Default 'm' (the book's --s1). */
  space?: SpaceToken
  /**
   * Quantity threshold: with more than this many children the layout stays
   * vertical regardless of width. Enumerated 1-6; the book's default is 4.
   */
  limit?: number
}>(), {
  as: 'div',
  threshold: 's',
  space: 'm',
  limit: 4,
})

const threshold = computed(() => {
  if (isSwitcherThreshold(props.threshold)) return props.threshold
  console.warn(`[CcmSwitcher] threshold must be one of xs|s|m|l|xl, got ${props.threshold}; falling back to 's'.`)
  return 's'
})

const limit = computed(() => {
  if (Number.isInteger(props.limit) && props.limit >= 1 && props.limit <= 6) return props.limit
  console.warn(`[CcmSwitcher] limit must be an integer between 1 and 6, got ${props.limit}; falling back to 4.`)
  return 4
})

const style = computed(() => {
  if (props.space === 'm' || !isSpaceToken(props.space)) return undefined
  return { '--switcher-space': spaceVar(props.space) }
})
</script>

<template>
  <component
    :is="as"
    class="ccm-switcher"
    :style="style"
    :data-threshold="threshold"
    :data-limit="limit"
  >
    <slot />
  </component>
</template>
