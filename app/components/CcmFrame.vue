<script setup lang="ts">
/**
 * Frame — Every Layout chapter 09.
 * Holds any child to a fixed aspect ratio; replaced children (img/video)
 * fill the frame and crop via object-fit, anything else is centered and
 * clipped. Layout CSS lives in app/assets/css/composition.css (.ccm-frame).
 *
 * `ratio` is typed (`${number}:${number}`) and `fit` exists ('cover' crops,
 * 'contain' letterboxes) because untyped ratios produced repeated 4:5
 * cover-crop bugs in Social House's PostCard.
 */
import { computed } from 'vue'
import { parseFrameRatio, type FrameRatio } from '../utils/composition'

const props = withDefaults(defineProps<{
  /** Element (or component) to render. */
  as?: string
  /** Aspect ratio as 'width:height', e.g. '16:9', '4:5', '1:1'. */
  ratio?: FrameRatio
  /** How replaced children fill the frame: crop or letterbox. */
  fit?: 'cover' | 'contain'
}>(), {
  as: 'div',
  ratio: '16:9',
  fit: 'cover',
})

const style = computed(() => {
  const vars: Record<string, string> = {}
  if (props.ratio !== '16:9') {
    const parsed = parseFrameRatio(props.ratio)
    if (parsed) {
      vars['--frame-n'] = parsed.n
      vars['--frame-d'] = parsed.d
    }
    else {
      console.warn(`[CcmFrame] ratio must match 'width:height' (e.g. '4:5'), got ${props.ratio}; falling back to 16:9.`)
    }
  }
  if (props.fit !== 'cover') vars['--frame-fit'] = props.fit
  return Object.keys(vars).length ? vars : undefined
})
</script>

<template>
  <component :is="as" class="ccm-frame" :style="style">
    <slot />
  </component>
</template>
