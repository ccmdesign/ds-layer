<template>
  <CcmStack as="main" space="l" class="mx-auto max-w-4xl px-4 py-l">
    <header class="flex items-center justify-between gap-4">
      <h1 class="text-step-3 font-semibold">
        Card
      </h1>
      <UColorModeButton data-testid="card-color-mode" />
    </header>

    <section class="flex flex-col gap-4" data-testid="card-full">
      <h2 class="text-step-1 font-semibold">
        Full anatomy <code class="text-muted text-step--1">title + meta + badges + body + actions</code>
      </h2>
      <CcmCard title="Spring launch carousel" meta="Scheduled for tomorrow, 9:00">
        <template #trailing>
          <UIcon name="i-lucide-arrow-up-right" />
        </template>
        <template #badges>
          <CcmStatusBadge status="in_buffer" />
          <CcmChannelBadge channel="instagram" />
        </template>
        <p>
          Five-slide product carousel with the new photography set. Copy
          approved by the client on Monday.
        </p>
        <template #actions>
          <UButton variant="ghost" color="neutral">
            Duplicate
          </UButton>
          <UButton variant="outline" color="neutral">
            Edit
          </UButton>
          <UButton>
            Publish now
          </UButton>
        </template>
      </CcmCard>
    </section>

    <section class="flex flex-col gap-4" data-testid="card-minimal">
      <h2 class="text-step-1 font-semibold">
        Minimal <code class="text-muted text-step--1">title + body only</code>
      </h2>
      <CcmCard title="Notes">
        <p>No meta, no badges, no actions — header and footer collapse away.</p>
      </CcmCard>
    </section>

    <section class="flex flex-col gap-4" data-testid="card-variant">
      <h2 class="text-step-1 font-semibold">
        Variant <code class="text-muted text-step--1">variant="soft"</code>, slot title
      </h2>
      <CcmCard variant="soft" meta="Slot-driven title and single primary action">
        <template #title>
          Custom <em>slotted</em> title
        </template>
        <p>The lone action still lands at the inline-end.</p>
        <template #actions>
          <UButton>Save</UButton>
        </template>
      </CcmCard>
    </section>
  </CcmStack>
</template>
