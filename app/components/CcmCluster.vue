<script setup lang="ts">
/**
 * Cluster — Every Layout chapter 04.
 * A wrapping flex row for groups of variable-length items (tags, buttons,
 * nav links) spaced with `gap`. Layout CSS lives in
 * app/assets/css/composition.css (.ccm-cluster).
 */
import { computed } from 'vue'
import { isSpaceToken, spaceVar, type SpaceToken } from '../utils/composition'

const props = withDefaults(defineProps<{
  /** Element (or component) to render. */
  as?: string
  /** Utopia space token for the gap. Default 'm' (the book's --s1). */
  space?: SpaceToken
  /** CSS justify-content value. */
  justify?: string
  /** CSS align-items value. */
  align?: string
}>(), {
  as: 'div',
  space: 'm',
  justify: 'flex-start',
  align: 'flex-start',
})

const style = computed(() => {
  const vars: Record<string, string> = {}
  if (props.space !== 'm' && isSpaceToken(props.space)) vars['--cluster-space'] = spaceVar(props.space)
  if (props.justify !== 'flex-start') vars['--cluster-justify'] = props.justify
  if (props.align !== 'flex-start') vars['--cluster-align'] = props.align
  return Object.keys(vars).length ? vars : undefined
})
</script>

<template>
  <component :is="as" class="ccm-cluster" :style="style">
    <slot />
  </component>
</template>
