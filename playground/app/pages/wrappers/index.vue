<script setup lang="ts">
// Adoption wrappers (PRO-235) — one demo page per wrapper, each with at
// least two prop/slot variations, reviewable in light AND dark mode.
const wrappers = [
  { to: '/wrappers/card', name: 'Card', blurb: 'Recurring card anatomy (title/meta/badges/body/actions) composed on UCard' },
  { to: '/wrappers/key-value', name: 'KeyValue', blurb: 'Native dl/dt/dd definition list — grid and stacked variants' },
  { to: '/wrappers/disclosure', name: 'Disclosure', blurb: 'Native details/summary with the DS skin — zero JS' },
]
</script>

<template>
  <CcmStack as="main" space="l" class="mx-auto max-w-4xl px-4 py-l">
    <header class="flex flex-col gap-2">
      <div class="flex items-center justify-between gap-4">
        <h1 class="text-step-3 font-semibold">
          Adoption wrappers
        </h1>
        <UColorModeButton data-testid="wrappers-color-mode" />
      </div>
      <p class="text-muted text-step-0">
        DS-8a: thin <code>Ccm*</code> wrappers that encode STRUCTURE or
        BEHAVIOR on top of Nuxt UI widgets or native elements — never
        re-implementing their behavior, never carrying style-only differences.
      </p>
    </header>

    <ul class="flex flex-col gap-2">
      <li v-for="w in wrappers" :key="w.to">
        <NuxtLink :to="w.to" class="hover:text-highlighted font-medium">
          {{ w.name }}
        </NuxtLink>
        <span class="text-muted"> — {{ w.blurb }}</span>
      </li>
    </ul>
  </CcmStack>
</template>
