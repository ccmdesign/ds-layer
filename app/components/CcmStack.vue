<script setup lang="ts">
/**
 * Stack — Every Layout chapter 01.
 * Spacing between stacked siblings belongs to the context, not the elements:
 * the owl selector injects block-start margins. Layout CSS lives in
 * app/assets/css/composition.css (.ccm-stack).
 */
import { computed } from 'vue'
import { isSpaceToken, spaceVar, type SpaceToken } from '../utils/composition'

const props = withDefaults(defineProps<{
  /** Element (or component) to render. */
  as?: string
  /** Utopia space token between siblings. Default 'm' (the book's --s1). */
  space?: SpaceToken
  /** Apply the spacing at any nesting depth, not only to direct children. */
  recursive?: boolean
  /**
   * Push everything after the nth child to the block-end edge (auto margin).
   * Enumerated 1-5 in the CSS; invalid values are ignored with a warning.
   */
  splitAfter?: number
}>(), {
  as: 'div',
  space: 'm',
  recursive: false,
  splitAfter: undefined,
})

const style = computed(() => {
  if (props.space === 'm' || !isSpaceToken(props.space)) return undefined
  return { '--stack-space': spaceVar(props.space) }
})

const splitAfter = computed(() => {
  if (props.splitAfter === undefined) return undefined
  if (!Number.isInteger(props.splitAfter) || props.splitAfter < 1 || props.splitAfter > 5) {
    console.warn(`[CcmStack] splitAfter must be an integer between 1 and 5, got ${props.splitAfter}; ignoring.`)
    return undefined
  }
  return props.splitAfter
})
</script>

<template>
  <component
    :is="as"
    class="ccm-stack"
    :style="style"
    :data-recursive="recursive ? '' : undefined"
    :data-split-after="splitAfter"
  >
    <slot />
  </component>
</template>
