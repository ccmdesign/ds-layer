<script setup lang="ts">
// Token reference stub (PRO-228). Renders the generated theme
// (app/assets/css/tokens.css) so the fluid scales can be checked by eye —
// resize between 360 and 1240px and the type/space samples interpolate.
const typeSteps = ['-2', '-1', '0', '1', '2', '3', '4', '5']
const spaceSteps = ['3xs', '2xs', 'xs', 's', 'm', 'l', 'xl', '2xl', '3xl']
const spacePairs = ['3xs-2xs', '2xs-xs', 'xs-s', 's-m', 'm-l', 'l-xl', 'xl-2xl', '2xl-3xl']
const shades = ['50', '100', '200', '300', '400', '500', '600', '700', '800', '900', '950']
const palettes = ['indigo', 'slate']
const radii = ['xs', 'sm', 'md', 'lg', 'xl', '2xl', '3xl', '4xl', 'full']
const shadows = ['2xs', 'xs', 'sm', 'md', 'lg', 'xl', '2xl', 'inner']

// `--text-step--1` (negative steps carry Utopia's double dash).
const textVar = (step: string) => `var(--text-step-${step.startsWith('-') ? `-${step.slice(1)}` : step})`
</script>

<template>
  <CcmStack as="main" space="l" class="mx-auto max-w-4xl px-4 py-l">
    <header class="flex flex-col gap-2">
      <h1 class="text-step-3 font-semibold">
        Design tokens
      </h1>
      <p class="text-muted text-step-0">
        Compiled from the DTCG source in <code>tokens/</code> by
        <code>pnpm build:tokens</code>. Fluid values interpolate between
        360 and 1240px viewports — resize to see the scales move.
      </p>
    </header>

    <section class="flex flex-col gap-4">
      <h2 class="text-step-1 font-semibold">
        Fluid type scale <code class="text-muted text-step--1">--text-step-*</code>
      </h2>
      <div
        v-for="step in typeSteps"
        :key="step"
        class="flex items-baseline gap-4"
      >
        <code class="text-dimmed w-24 shrink-0 text-sm">step {{ step }}</code>
        <span
          :data-testid="`type-step-${step}`"
          :style="{ fontSize: textVar(step) }"
          class="truncate"
        >Fluid by design</span>
      </div>
    </section>

    <section class="flex flex-col gap-4">
      <h2 class="text-step-1 font-semibold">
        Fluid space scale <code class="text-muted text-step--1">--spacing-3xs…3xl</code>
      </h2>
      <p class="text-muted text-sm">
        Utopia steps carry macro rhythm; Tailwind's numeric scale
        (<code>p-4</code>, <code>gap-2</code>) stays for intra-component spacing.
      </p>
      <div
        v-for="step in spaceSteps"
        :key="step"
        class="flex items-center gap-4"
      >
        <code class="text-dimmed w-24 shrink-0 text-sm">{{ step }}</code>
        <div
          :data-testid="`space-${step}`"
          :style="{ width: `var(--spacing-${step})` }"
          class="bg-primary h-4 rounded-xs"
        />
      </div>
      <h3 class="text-step-0 font-medium">
        One-up pairs
      </h3>
      <div
        v-for="pair in spacePairs"
        :key="pair"
        class="flex items-center gap-4"
      >
        <code class="text-dimmed w-24 shrink-0 text-sm">{{ pair }}</code>
        <div
          :style="{ width: `var(--spacing-${pair})` }"
          class="bg-primary/60 h-4 rounded-xs"
        />
      </div>
    </section>

    <section class="flex flex-col gap-4">
      <h2 class="text-step-1 font-semibold">
        OKLCH palette <code class="text-muted text-step--1">--color-indigo/slate-*</code>
      </h2>
      <div v-for="palette in palettes" :key="palette" class="flex flex-col gap-2">
        <code class="text-dimmed text-sm">{{ palette }}</code>
        <div class="flex gap-1">
          <div
            v-for="shade in shades"
            :key="shade"
            :data-testid="`swatch-${palette}-${shade}`"
            :style="{ backgroundColor: `var(--color-${palette}-${shade})` }"
            :title="`${palette}-${shade}`"
            class="h-10 flex-1 rounded-sm"
          />
        </div>
      </div>
    </section>

    <section class="flex flex-col gap-4">
      <h2 class="text-step-1 font-semibold">
        Radius <code class="text-muted text-step--1">--radius-*</code>
      </h2>
      <div class="flex flex-wrap gap-4">
        <div
          v-for="r in radii"
          :key="r"
          :style="{ borderRadius: `var(--radius-${r})` }"
          class="border-accented bg-elevated grid size-20 place-items-center border"
        >
          <code class="text-sm">{{ r }}</code>
        </div>
      </div>
    </section>

    <section class="flex flex-col gap-4 pb-xl">
      <h2 class="text-step-1 font-semibold">
        Shadows <code class="text-muted text-step--1">--shadow-*</code>
      </h2>
      <div class="flex flex-wrap gap-6">
        <div
          v-for="s in shadows"
          :key="s"
          :style="{ boxShadow: `var(--shadow-${s})` }"
          class="bg-default flex size-24 items-center justify-center rounded-lg"
        >
          <code class="text-sm">{{ s }}</code>
        </div>
      </div>
    </section>
  </CcmStack>
</template>
