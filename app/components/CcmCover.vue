<script setup lang="ts">
/**
 * Cover — Every Layout chapter 07.
 * A column flex context with one principal element vertically centered via
 * auto block margins, optionally book-ended by header/footer children.
 *
 * The centered child is `h1` (the book's default) or any child carrying the
 * `data-cover-centered` attribute — plain CSS cannot parametrize a selector
 * prop the way the book's custom element (which injects per-instance styles)
 * can. Default min height is 100svh (book: 100vh) so mobile browser chrome
 * does not force overflow. Layout CSS lives in
 * app/assets/css/composition.css (.ccm-cover).
 */
import { computed } from 'vue'
import { isSpaceToken, spaceVar, type SpaceToken } from '../utils/composition'

const props = withDefaults(defineProps<{
  /** Element (or component) to render. */
  as?: string
  /** Utopia space token between/around children. Default 'm' (the book's --s1). */
  space?: SpaceToken
  /** CSS min-block-size for the cover. */
  minHeight?: string
  /** Drop the padding on the container element. */
  noPad?: boolean
}>(), {
  as: 'div',
  space: 'm',
  minHeight: '100svh',
  noPad: false,
})

const style = computed(() => {
  const vars: Record<string, string> = {}
  if (props.space !== 'm' && isSpaceToken(props.space)) vars['--cover-space'] = spaceVar(props.space)
  if (props.minHeight !== '100svh') vars['--cover-min-height'] = props.minHeight
  return Object.keys(vars).length ? vars : undefined
})
</script>

<template>
  <component
    :is="as"
    class="ccm-cover"
    :style="style"
    :data-no-pad="noPad ? '' : undefined"
  >
    <slot />
  </component>
</template>
