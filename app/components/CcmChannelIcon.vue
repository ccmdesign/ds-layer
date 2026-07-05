<template>
  <component :is="iconComponent" v-if="iconComponent" />
  <svg
    v-else
    aria-hidden="true"
    viewBox="0 0 24 24"
    fill="none"
    stroke="currentColor"
    stroke-width="2"
    stroke-linecap="round"
    stroke-linejoin="round"
    xmlns="http://www.w3.org/2000/svg"
  >
    <circle cx="12" cy="12" r="10" /><line x1="2" y1="12" x2="22" y2="12" /><path d="M12 2a15.3 15.3 0 0 1 4 10 15.3 15.3 0 0 1-4 10 15.3 15.3 0 0 1-4-10 15.3 15.3 0 0 1 4-10z" />
  </svg>
</template>

<script setup lang="ts">
/**
 * Channel id -> platform SVG mark (PRO-231 / DS-5).
 *
 * Resolves through the channel registry (case-insensitive, alias-aware:
 * 'twitter' renders the X mark) to the layer's dependency-free `CcmIcon*`
 * SFCs — no Iconify collection or network needed. Unknown channels fall back
 * to a neutral globe glyph (ported from Varro's varSocialChannelToggle).
 *
 * Nuxt UI consumers who prefer Iconify can skip this component and feed
 * `channelBrand(channel).icon` to `<UIcon>` instead.
 *
 * @component CcmChannelIcon
 * @category atom
 */
import { computed, type Component } from 'vue'
import { resolveChannel, type ChannelId } from '../utils/channels'
import CcmIconBluesky from './CcmIconBluesky.vue'
import CcmIconFacebook from './CcmIconFacebook.vue'
import CcmIconGoogleMyBusiness from './CcmIconGoogleMyBusiness.vue'
import CcmIconInstagram from './CcmIconInstagram.vue'
import CcmIconLinkedin from './CcmIconLinkedin.vue'
import CcmIconTiktok from './CcmIconTiktok.vue'
import CcmIconX from './CcmIconX.vue'
import CcmIconYoutube from './CcmIconYoutube.vue'

const ICONS: Record<ChannelId, Component> = {
  instagram: CcmIconInstagram,
  linkedin: CcmIconLinkedin,
  x: CcmIconX,
  facebook: CcmIconFacebook,
  youtube: CcmIconYoutube,
  tiktok: CcmIconTiktok,
  google_my_business: CcmIconGoogleMyBusiness,
  bluesky: CcmIconBluesky,
}

const props = defineProps<{
  /** Channel name, free-form (e.g. 'instagram', 'Twitter'). */
  channel?: string | null
}>()

const iconComponent = computed(() => {
  const info = resolveChannel(props.channel)
  return info?.id ? ICONS[info.id] : undefined
})
</script>
