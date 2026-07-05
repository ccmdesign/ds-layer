<script setup lang="ts">
const cards = [
  'in ultrices faucibus duis et in mattis',
  'morbi id neque nisl dolor sit sed',
  'ipsum tempus commodo curae tellus primis mattis mattis posuere',
  'ligula ultrices dolor consequat eget',
  'nibh semper sodales malesuada quam',
  'erat laoreet amet varius arcu quam at efficitur',
  'primis arcu luctus ipsum id semper',
]
</script>

<template>
  <main class="mx-auto flex max-w-4xl flex-col gap-l px-4 py-l">
    <h1 class="text-step-3 font-semibold">
      Reel
    </h1>
    <p class="text-muted text-step--1">
      A CSS scroll strip, not a carousel: continuous native scrolling, no
      paging, no controls, no JavaScript. Reach for UCarousel when you need a
      paged widget.
    </p>

    <section class="flex flex-col gap-4">
      <h2 class="text-step-1 font-semibold">
        Card strip <code class="text-muted text-step--1">item-width="16rem"</code>
      </h2>
      <CcmReel item-width="16rem" class="rounded-md border border-default p-4">
        <div v-for="(card, i) in cards" :key="i" class="bg-elevated rounded-md p-4">
          {{ card }}
        </div>
      </CcmReel>
    </section>

    <section class="flex flex-col gap-4">
      <h2 class="text-step-1 font-semibold">
        Slidable link bar <code class="text-muted text-step--1">as="ul" no-bar space="2xs"</code>
      </h2>
      <CcmReel as="ul" no-bar space="2xs" class="rounded-md border border-default p-4">
        <li v-for="n in 12" :key="n" class="bg-elevated rounded-md px-4 py-2 whitespace-nowrap">
          link {{ n }}
        </li>
      </CcmReel>
    </section>

    <section class="flex flex-col gap-4">
      <h2 class="text-step-1 font-semibold">
        Fixed height <code class="text-muted text-step--1">height="8rem" space="l"</code>
      </h2>
      <CcmReel height="8rem" space="l" class="rounded-md border border-default p-4">
        <div v-for="n in 9" :key="n" class="bg-elevated w-40 shrink-0 rounded-md p-4">
          panel {{ n }}
        </div>
      </CcmReel>
    </section>
  </main>
</template>
