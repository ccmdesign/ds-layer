<script setup lang="ts">
/**
 * Reel — Every Layout chapter 10.
 * A CSS scroll strip: a single-file flex row that scrolls horizontally on
 * overflow, with native scrollbar affordance. No JavaScript. Layout CSS
 * lives in app/assets/css/composition.css (.ccm-reel).
 *
 * BOUNDARY vs UCarousel (metadata for DS-6): CcmReel is continuous CSS
 * overflow scrolling — no paging, no snap points, no dots/arrows/autoplay,
 * no JS. Reach for Nuxt UI's UCarousel when you need a paged widget with
 * navigation controls; reach for CcmReel for browsable strips (card rows,
 * image rails, slidable link bars) where native scrolling is the whole
 * interaction.
 */
import { computed } from 'vue'
import { isSpaceToken, spaceVar, type SpaceToken } from '../utils/composition'

const props = withDefaults(defineProps<{
  /** Element (or component) to render. */
  as?: string
  /** Utopia space token between items. Default 's' (the book's --s0). */
  space?: SpaceToken
  /** CSS width for each item; 'auto' leaves items their intrinsic width. */
  itemWidth?: string
  /** CSS block-size for the reel; 'auto' tracks the tallest item. */
  height?: string
  /** Hide the scrollbar (keep for a11y-neutral strips like link bars). */
  noBar?: boolean
}>(), {
  as: 'div',
  space: 's',
  itemWidth: 'auto',
  height: 'auto',
  noBar: false,
})

const style = computed(() => {
  const vars: Record<string, string> = {}
  if (props.space !== 's' && isSpaceToken(props.space)) vars['--reel-space'] = spaceVar(props.space)
  if (props.itemWidth !== 'auto') vars['--reel-item-width'] = props.itemWidth
  if (props.height !== 'auto') vars['--reel-height'] = props.height
  return Object.keys(vars).length ? vars : undefined
})
</script>

<template>
  <component
    :is="as"
    class="ccm-reel"
    :style="style"
    :data-no-bar="noBar ? '' : undefined"
  >
    <slot />
  </component>
</template>
