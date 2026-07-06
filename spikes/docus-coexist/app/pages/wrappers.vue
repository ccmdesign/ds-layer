<script setup lang="ts">
// PRO-235 fixture: the three DS-8a adoption wrappers rendered inside the
// docus-coexist spike — Social House's real configuration (layer + docus).
// An explicit route beats Docus's catch-all, so /wrappers renders this page
// while Docus keeps owning the markdown routes.
const details = [
  { term: 'Channel', value: 'Instagram' },
  { term: 'Format', value: 'Carousel' },
  { term: 'Schedule', value: 'Tomorrow, 9:00' },
]
</script>

<template>
  <CcmStack as="main" space="l" class="mx-auto max-w-3xl px-4 py-l">
    <header class="flex items-center justify-between gap-4">
      <h1 class="text-step-3 font-semibold">
        Adoption wrappers in the Docus coexistence spike
      </h1>
      <UColorModeButton data-testid="coexist-color-mode" />
    </header>

    <CcmCard title="Spring launch carousel" meta="Scheduled for tomorrow, 9:00" data-testid="coexist-card">
      <template #badges>
        <CcmStatusBadge status="in_buffer" />
        <CcmChannelBadge channel="instagram" />
      </template>
      <p>
        The recurring Social House card anatomy, rendered through the
        layer-plus-docus configuration.
      </p>
      <template #actions>
        <UButton variant="outline" color="neutral">
          Edit
        </UButton>
        <UButton>
          Publish now
        </UButton>
      </template>
    </CcmCard>

    <CcmKeyValue :items="details" data-testid="coexist-key-value" />

    <CcmDisclosure summary="Advanced options" :count="3" data-testid="coexist-disclosure">
      <p>Zero-JS collapsible content, styled by the DS skin.</p>
    </CcmDisclosure>
  </CcmStack>
</template>
