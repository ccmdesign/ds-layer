<template>
  <UApp>
    <header class="border-b border-default">
      <CcmCluster as="nav" space="s" align="center" class="mx-auto max-w-5xl px-4 py-3">
        <NuxtLink to="/" class="font-semibold">
          Spike app
        </NuxtLink>
        <!-- Gate 2 reviews every page in light AND dark. -->
        <UColorModeButton data-testid="color-mode-toggle" class="ms-auto" />
      </CcmCluster>
    </header>
    <NuxtPage />
  </UApp>
</template>
