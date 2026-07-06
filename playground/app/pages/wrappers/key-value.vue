<script setup lang="ts">
const postDetails = [
  { term: 'Channel', value: 'Instagram' },
  { term: 'Status', value: 'Scheduled' },
  { term: 'Publish', value: 'Tomorrow, 9:00' },
  { term: 'Owner', value: 'Studio team' },
]
</script>

<template>
  <CcmStack as="main" space="l" class="mx-auto max-w-4xl px-4 py-l">
    <header class="flex items-center justify-between gap-4">
      <h1 class="text-step-3 font-semibold">
        KeyValue
      </h1>
      <UColorModeButton data-testid="key-value-color-mode" />
    </header>

    <section class="flex flex-col gap-4" data-testid="key-value-grid">
      <h2 class="text-step-1 font-semibold">
        Grid <code class="text-muted text-step--1">variant="grid" (default)</code>
      </h2>
      <CcmKeyValue :items="postDetails" class="rounded-md border border-default p-4" />
    </section>

    <section class="flex flex-col gap-4" data-testid="key-value-stacked">
      <h2 class="text-step-1 font-semibold">
        Stacked <code class="text-muted text-step--1">variant="stacked"</code>
      </h2>
      <CcmKeyValue :items="postDetails" variant="stacked" class="rounded-md border border-default p-4" />
    </section>

    <section class="flex flex-col gap-4" data-testid="key-value-slot">
      <h2 class="text-step-1 font-semibold">
        Slotted pairs <code class="text-muted text-step--1">items + default slot</code>
      </h2>
      <p class="text-muted text-step--1">
        Custom <code>&lt;dt&gt;/&lt;dd&gt;</code> children compose with the
        <code>items</code> array — including a term with several values.
      </p>
      <CcmKeyValue :items="[{ term: 'Format', value: 'Carousel' }]" class="rounded-md border border-default p-4">
        <dt>Assets</dt>
        <dd>5 slides</dd>
        <dd>1 cover render</dd>
        <dt>Approval</dt>
        <dd><CcmStatusBadge status="completed" /></dd>
      </CcmKeyValue>
    </section>
  </CcmStack>
</template>
