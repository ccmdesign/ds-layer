<script setup lang="ts">
// Every Layout composition primitives (PRO-229) — one demo page per
// primitive, each with at least two prop variations.
const primitives = [
  { to: '/composition/stack', name: 'Stack', blurb: 'Block-direction spacing via the owl selector' },
  { to: '/composition/cluster', name: 'Cluster', blurb: 'Wrapping flex row with gap' },
  { to: '/composition/switcher', name: 'Switcher', blurb: 'Horizontal ↔ vertical at a container breakpoint (container queries)' },
  { to: '/composition/cover', name: 'Cover', blurb: 'Vertically centered principal element with header/footer slots' },
  { to: '/composition/grid', name: 'Grid', blurb: 'Auto-filling columns, container-intrinsic via min()' },
  { to: '/composition/frame', name: 'Frame', blurb: 'Typed aspect-ratio cropping (cover/contain)' },
  { to: '/composition/reel', name: 'Reel', blurb: 'CSS scroll strip — not a carousel' },
]
</script>

<template>
  <main class="mx-auto flex max-w-4xl flex-col gap-l px-4 py-l">
    <header class="flex flex-col gap-2">
      <h1 class="text-step-3 font-semibold">
        Composition primitives
      </h1>
      <p class="text-muted text-step-0">
        The Every Layout seven as <code>Ccm*</code> components: thin Vue
        wrappers over plain CSS in the Tailwind components layer, spaced with
        the Utopia tokens.
      </p>
    </header>

    <ul class="flex flex-col gap-2">
      <li v-for="p in primitives" :key="p.to">
        <NuxtLink :to="p.to" class="hover:text-highlighted font-medium">
          {{ p.name }}
        </NuxtLink>
        <span class="text-muted"> — {{ p.blurb }}</span>
      </li>
    </ul>
  </main>
</template>
