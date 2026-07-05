<script setup lang="ts">
/**
 * Skin gallery (PRO-230) — makes the Social House skin reviewable by humans.
 * Everything rendered here is themed exclusively by the layer: tokens from
 * DS-2 (app/assets/css/tokens.css) + the semantic map in app/app.config.ts.
 * No inline :ui overrides, no @apply — if something looks wrong here, the fix
 * belongs in tokens/ or app/app.config.ts, never on this page.
 */
const toast = useToast()

const semanticColors = ['primary', 'secondary', 'info', 'success', 'warning', 'error', 'neutral'] as const
const buttonVariants = ['solid', 'outline', 'soft', 'subtle', 'ghost', 'link'] as const
const badgeVariants = ['solid', 'outline', 'soft', 'subtle'] as const
const sizes = ['xs', 'sm', 'md', 'lg', 'xl'] as const
const shades = ['50', '100', '200', '300', '400', '500', '600', '700', '800', '900', '950']
const palettes = ['indigo', 'slate'] as const
const fontWeights = [
  { class: 'font-normal', label: 'Regular 400' },
  { class: 'font-medium', label: 'Medium 500' },
  { class: 'font-bold', label: 'Bold 700' },
] as const
const typeSteps = ['step-3', 'step-2', 'step-1', 'step-0', 'step--1'] as const

const input = ref('')
const selected = ref('Instagram')
const selectItems = ['Instagram', 'LinkedIn', 'TikTok', 'YouTube']

function fireToast(color: 'success' | 'error') {
  toast.add({
    title: color === 'success' ? 'Post scheduled' : 'Publish failed',
    description: color === 'success'
      ? 'The carousel goes live tomorrow at 9:00.'
      : 'The channel token expired — reconnect the account.',
    color,
  })
}

// Fidelity reference: current Social House pages, captured light + dark.
const references = [
  { src: '/reference/social-house-home-light.png', caption: 'Dashboard — light' },
  { src: '/reference/social-house-home-dark.png', caption: 'Dashboard — dark' },
  { src: '/reference/social-house-detail-light.png', caption: 'Post detail — light' },
  { src: '/reference/social-house-detail-dark.png', caption: 'Post detail — dark' },
]

// `--text-step--1` (negative steps carry Utopia's double dash).
const textVar = (step: string) => `var(--text-${step})`
</script>

<template>
  <main data-testid="gallery" class="mx-auto flex max-w-4xl flex-col gap-xl px-4 py-l">
    <header class="flex flex-col gap-2">
      <div class="flex items-center justify-between gap-4">
        <h1 class="text-step-3 font-semibold">
          Social House skin
        </h1>
        <UColorModeButton data-testid="gallery-color-mode" />
      </div>
      <p class="text-muted text-step-0">
        The layer's Nuxt UI theme, mapped from the DS-2 tokens by
        <code>app/app.config.ts</code>. Flip the color mode — every section
        must hold up in light and dark. Full scales live on
        <NuxtLink to="/tokens" class="text-primary hover:underline">/tokens</NuxtLink>.
      </p>
    </header>

    <section data-testid="gallery-colors" class="flex flex-col gap-4">
      <h2 class="text-step-1 font-semibold">
        Color
      </h2>
      <h3 class="text-step-0 font-medium">
        Semantic aliases <code class="text-muted text-step--1">app.config → ui.colors</code>
      </h3>
      <div class="flex flex-wrap gap-2">
        <div
          v-for="color in semanticColors"
          :key="color"
          :data-testid="`chip-${color}`"
          class="flex flex-col items-center gap-1"
        >
          <!-- Inline style (not a dynamic class): Tailwind can't see `bg-${color}`
               at scan time; the semantic custom properties are always present. -->
          <div
            class="border-default size-14 rounded-md border"
            :style="{ backgroundColor: color === 'neutral' ? 'var(--ui-bg-inverted)' : `var(--ui-${color})` }"
          />
          <code class="text-dimmed text-step--1">{{ color }}</code>
        </div>
      </div>
      <h3 class="text-step-0 font-medium">
        Brand scales <code class="text-muted text-step--1">tokens/color.tokens.json</code>
      </h3>
      <div v-for="palette in palettes" :key="palette" class="flex flex-col gap-1">
        <code class="text-dimmed text-step--1">{{ palette }}</code>
        <div class="flex gap-1">
          <div
            v-for="shade in shades"
            :key="shade"
            :style="{ backgroundColor: `var(--color-${palette}-${shade})` }"
            :title="`${palette}-${shade}`"
            class="h-8 flex-1 rounded-sm"
          />
        </div>
      </div>
    </section>

    <section data-testid="gallery-typography" class="flex flex-col gap-4">
      <h2 class="text-step-1 font-semibold">
        Typography — Satoshi
      </h2>
      <div class="flex flex-wrap items-baseline gap-x-8 gap-y-2">
        <span
          v-for="weight in fontWeights"
          :key="weight.class"
          :class="weight.class"
          class="text-step-1"
        >{{ weight.label }}</span>
      </div>
      <div class="flex flex-col gap-1">
        <span
          v-for="step in typeSteps"
          :key="step"
          :style="{ fontSize: textVar(step) }"
          class="truncate"
        >Strategy that survives contact with the feed</span>
      </div>
    </section>

    <section data-testid="gallery-buttons" class="flex flex-col gap-4">
      <h2 class="text-step-1 font-semibold">
        Button
      </h2>
      <div class="flex flex-col gap-3">
        <div
          v-for="variant in buttonVariants"
          :key="variant"
          class="flex flex-wrap items-center gap-2"
        >
          <code class="text-dimmed w-16 shrink-0 text-step--1">{{ variant }}</code>
          <UButton
            v-for="color in semanticColors"
            :key="color"
            :color="color"
            :variant="variant"
            :label="color"
          />
        </div>
        <div class="flex flex-wrap items-center gap-2">
          <code class="text-dimmed w-16 shrink-0 text-step--1">sizes</code>
          <UButton
            v-for="size in sizes"
            :key="size"
            :size="size"
            :label="size"
          />
          <UButton icon="i-lucide-calendar-plus" label="Schedule" />
          <UButton icon="i-lucide-settings" aria-label="Settings" color="neutral" variant="outline" />
        </div>
      </div>
    </section>

    <section data-testid="gallery-badges" class="flex flex-col gap-4">
      <h2 class="text-step-1 font-semibold">
        Badge
      </h2>
      <div
        v-for="variant in badgeVariants"
        :key="variant"
        class="flex flex-wrap items-center gap-2"
      >
        <code class="text-dimmed w-16 shrink-0 text-step--1">{{ variant }}</code>
        <UBadge
          v-for="color in semanticColors"
          :key="color"
          :color="color"
          :variant="variant"
          :label="color"
        />
      </div>
    </section>

    <section data-testid="gallery-cards" class="flex flex-col gap-4">
      <h2 class="text-step-1 font-semibold">
        Card
      </h2>
      <div class="grid gap-4 sm:grid-cols-2">
        <UCard>
          <template #header>
            <div class="flex items-center justify-between gap-2">
              <span class="font-medium">Q3 content sprint</span>
              <UBadge color="success" variant="subtle" label="On track" />
            </div>
          </template>
          <p class="text-muted text-step-0">
            Twelve posts drafted, eight approved. The launch carousel is
            waiting on the final product shots.
          </p>
          <template #footer>
            <div class="flex items-center justify-end gap-2">
              <UButton color="neutral" variant="ghost" label="Dismiss" />
              <UButton label="Review posts" />
            </div>
          </template>
        </UCard>
        <UCard variant="subtle">
          <template #header>
            <span class="font-medium">Subtle variant</span>
          </template>
          <p class="text-muted text-step-0">
            Muted surface for secondary content — same radius, same border
            language, one step quieter.
          </p>
        </UCard>
      </div>
    </section>

    <section data-testid="gallery-forms" class="flex flex-col gap-4">
      <h2 class="text-step-1 font-semibold">
        Input &amp; Select
      </h2>
      <div class="grid gap-4 sm:grid-cols-2">
        <UFormField label="Campaign name" help="Shown on the public dashboard.">
          <UInput v-model="input" placeholder="Autumn launch" icon="i-lucide-megaphone" class="w-full" />
        </UFormField>
        <UFormField label="Channel">
          <USelect v-model="selected" :items="selectItems" class="w-full" />
        </UFormField>
      </div>
    </section>

    <section data-testid="gallery-overlays" class="flex flex-col gap-4">
      <h2 class="text-step-1 font-semibold">
        Modal &amp; Toast
      </h2>
      <div class="flex flex-wrap items-center gap-2">
        <UModal
          title="Archive this campaign?"
          description="Posts stay in the ledger; the dashboard hides the campaign."
        >
          <UButton color="neutral" variant="outline" label="Open modal" data-testid="modal-trigger" />
          <template #footer="{ close }">
            <div class="flex w-full items-center justify-end gap-2">
              <UButton color="neutral" variant="ghost" label="Cancel" @click="close" />
              <UButton color="error" label="Archive" @click="close" />
            </div>
          </template>
        </UModal>
        <UButton color="success" variant="soft" label="Success toast" data-testid="toast-success" @click="fireToast('success')" />
        <UButton color="error" variant="soft" label="Error toast" data-testid="toast-error" @click="fireToast('error')" />
      </div>
    </section>

    <section data-testid="gallery-composition" class="flex flex-col gap-4">
      <h2 class="text-step-1 font-semibold">
        Composition — the ccm seven
      </h2>
      <p class="text-muted text-step-0">
        Every Layout primitives spaced by the Utopia tokens; full demos under
        <NuxtLink to="/composition" class="text-primary hover:underline">/composition</NuxtLink>.
      </p>

      <h3 class="text-step-0 font-medium">
        Stack <code class="text-muted text-step--1">space="s"</code>
      </h3>
      <CcmStack space="s" class="border-default rounded-md border p-4">
        <div class="bg-elevated rounded-md p-2">one</div>
        <div class="bg-elevated rounded-md p-2">two</div>
        <div class="bg-elevated rounded-md p-2">three</div>
      </CcmStack>

      <h3 class="text-step-0 font-medium">
        Cluster <code class="text-muted text-step--1">space="xs" justify="space-between"</code>
      </h3>
      <CcmCluster space="xs" justify="space-between" align="center" class="border-default rounded-md border p-4">
        <UBadge color="neutral" variant="subtle" label="12 posts" />
        <UBadge color="neutral" variant="subtle" label="3 channels" />
        <UButton size="sm" label="New post" />
      </CcmCluster>

      <h3 class="text-step-0 font-medium">
        Grid <code class="text-muted text-step--1">min="12rem"</code>
      </h3>
      <CcmGrid min="12rem" space="s" class="border-default rounded-md border p-4">
        <div v-for="n in 4" :key="n" class="bg-elevated rounded-md p-4 text-center">
          card {{ n }}
        </div>
      </CcmGrid>

      <h3 class="text-step-0 font-medium">
        Reel <code class="text-muted text-step--1">item-width="10rem"</code>
      </h3>
      <CcmReel item-width="10rem" space="xs" class="border-default rounded-md border p-4">
        <div v-for="n in 8" :key="n" class="bg-elevated rounded-md p-6 text-center">
          slide {{ n }}
        </div>
      </CcmReel>

      <h3 class="text-step-0 font-medium">
        Switcher <code class="text-muted text-step--1">threshold="m"</code>
      </h3>
      <CcmSwitcher threshold="m" space="xs" class="border-default rounded-md border p-4">
        <div class="bg-elevated rounded-md p-4">draft</div>
        <div class="bg-elevated rounded-md p-4">review</div>
        <div class="bg-elevated rounded-md p-4">published</div>
      </CcmSwitcher>

      <h3 class="text-step-0 font-medium">
        Cover <code class="text-muted text-step--1">min-height="30vh"</code>
      </h3>
      <CcmCover min-height="30vh" class="border-default rounded-md border">
        <p data-cover-centered class="text-step-1 text-center font-medium">
          Centered principal element
        </p>
      </CcmCover>

      <h3 class="text-step-0 font-medium">
        Frame <code class="text-muted text-step--1">ratio="16:9"</code>
      </h3>
      <CcmFrame ratio="16:9" class="bg-elevated max-w-md rounded-md">
        <p class="text-muted">16:9 media frame</p>
      </CcmFrame>
    </section>

    <section data-testid="gallery-reference" class="flex flex-col gap-4 pb-xl">
      <h2 class="text-step-1 font-semibold">
        Fidelity reference — Social House today
      </h2>
      <p class="text-muted text-step-0">
        Screenshots of the live Social House pages this skin must approximate
        (fonts, colors, radius, spacing rhythm). Compare against the sections
        above in the matching color mode.
      </p>
      <div class="grid gap-4 sm:grid-cols-2">
        <figure
          v-for="reference in references"
          :key="reference.src"
          class="border-default flex flex-col overflow-hidden rounded-md border"
        >
          <img
            :src="reference.src"
            :alt="`Social House reference — ${reference.caption}`"
            loading="lazy"
            class="w-full"
          >
          <figcaption class="text-muted border-default border-t px-3 py-2 text-step--1">
            {{ reference.caption }}
          </figcaption>
        </figure>
      </div>
    </section>
  </main>
</template>
