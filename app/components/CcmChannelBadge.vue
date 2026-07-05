<template>
  <span
    class="ccm-channel-badge"
    :data-channel="brand.id ?? undefined"
    :style="badgeStyle"
  >
    <CcmChannelIcon class="ccm-channel-badge-icon" :channel="channel" />
    <span v-if="displayLabel">{{ displayLabel }}</span>
  </span>
</template>

<script setup lang="ts">
/**
 * Brand-colored channel badge (PRO-231 / DS-5) — the prominent, color-coded
 * platform chip (Social House dashboard-card pattern), driven entirely by the
 * channel registry. The brand hex reaches CSS through the registry only (the
 * sanctioned token-system exception); unknown channels get the registry's
 * neutral fallback and echo the raw channel name.
 *
 * @component CcmChannelBadge
 * @category molecule
 */
import { computed } from 'vue'
import { channelBrand } from '../utils/channels'
import CcmChannelIcon from './CcmChannelIcon.vue'

const props = defineProps<{
  /** Channel name, free-form (e.g. 'instagram', 'Twitter'). */
  channel?: string | null
  /** Optional label override (platform names are proper nouns — rarely needed). */
  label?: string
}>()

const brand = computed(() => channelBrand(props.channel))
const displayLabel = computed(() => props.label ?? brand.value.label)
const badgeStyle = computed(() => ({
  '--channel-bg': brand.value.brandColor,
  '--channel-fg': brand.value.fg,
}))
</script>

<style scoped>
.ccm-channel-badge {
  display: inline-flex;
  align-items: center;
  gap: var(--spacing-3xs);
  padding: 0.25em 0.6em;
  border-radius: var(--radius-full);
  background-color: var(--channel-bg);
  color: var(--channel-fg);

  /* Utopia negative steps carry a double dash (same exemption as tokens.css) */
  /* stylelint-disable-next-line custom-property-pattern */
  font-size: var(--text-step--1);
  font-weight: 500;
  line-height: 1.2;
  white-space: nowrap;
}

.ccm-channel-badge-icon {
  width: 1em;
  height: 1em;
  flex-shrink: 0;
}
</style>
