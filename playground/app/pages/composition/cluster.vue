<script setup lang="ts">
const tags = ['layout', 'css', 'design tokens', 'utopia', 'every layout', 'nuxt', 'container queries']
</script>

<template>
  <CcmStack as="main" space="l" class="mx-auto max-w-4xl px-4 py-l">
    <h1 class="text-step-3 font-semibold">
      Cluster
    </h1>

    <section class="flex flex-col gap-4">
      <h2 class="text-step-1 font-semibold">
        Default <code class="text-muted text-step--1">space="m" justify="flex-start"</code>
      </h2>
      <CcmCluster class="rounded-md border border-default p-4">
        <span v-for="tag in tags" :key="tag" class="bg-elevated rounded-md px-3 py-1">{{ tag }}</span>
      </CcmCluster>
    </section>

    <section class="flex flex-col gap-4">
      <h2 class="text-step-1 font-semibold">
        Centered, tight <code class="text-muted text-step--1">space="xs" justify="center"</code>
      </h2>
      <CcmCluster space="xs" justify="center" class="rounded-md border border-default p-4">
        <span v-for="tag in tags" :key="tag" class="bg-elevated rounded-md px-3 py-1">{{ tag }}</span>
      </CcmCluster>
    </section>

    <section class="flex flex-col gap-4">
      <h2 class="text-step-1 font-semibold">
        Vertically centered items <code class="text-muted text-step--1">align="center" justify="space-between"</code>
      </h2>
      <CcmCluster align="center" justify="space-between" class="rounded-md border border-default p-4">
        <span class="bg-elevated rounded-md px-3 py-6">tall item</span>
        <span class="bg-elevated rounded-md px-3 py-1">short item</span>
        <span class="bg-elevated rounded-md px-3 py-1">short item</span>
      </CcmCluster>
    </section>
  </CcmStack>
</template>
