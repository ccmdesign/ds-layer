<script setup lang="ts">
/**
 * Grid — Every Layout chapter 08.
 * Auto-filling column grid: `minmax(min(<min>, 100%), 1fr)` caps the column
 * minimum at the container width, so the layout is container-intrinsic in
 * pure CSS (single column below the minimum, no media queries, no
 * ResizeObserver — the book's final solution). Layout CSS lives in
 * app/assets/css/composition.css (.ccm-grid).
 */
import { computed } from 'vue'
import { isSpaceToken, spaceVar, type SpaceToken } from '../utils/composition'

const props = withDefaults(defineProps<{
  /** Element (or component) to render. */
  as?: string
  /**
   * CSS length for the minimum column width. Defaults (in CSS) to a third
   * of the measure — calc(var(--measure) / 3), the chapter's card example.
   */
  min?: string
  /** Utopia space token for the gap. Default 'm' (the book's --s1). */
  space?: SpaceToken
}>(), {
  as: 'div',
  min: undefined,
  space: 'm',
})

const style = computed(() => {
  const vars: Record<string, string> = {}
  if (props.min !== undefined) vars['--grid-min'] = props.min
  if (props.space !== 'm' && isSpaceToken(props.space)) vars['--grid-space'] = spaceVar(props.space)
  return Object.keys(vars).length ? vars : undefined
})
</script>

<template>
  <component :is="as" class="ccm-grid" :style="style">
    <slot />
  </component>
</template>
