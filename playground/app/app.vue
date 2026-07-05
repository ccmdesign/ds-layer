<template>
  <UApp>
    <header class="border-b border-default">
      <nav class="mx-auto flex max-w-4xl items-center gap-4 px-4 py-3">
        <NuxtLink to="/" class="font-semibold">
          @ccm/ds playground
        </NuxtLink>
        <NuxtLink to="/gallery" class="text-muted hover:text-highlighted">
          Gallery
        </NuxtLink>
        <NuxtLink to="/tokens" class="text-muted hover:text-highlighted">
          Tokens
        </NuxtLink>
        <NuxtLink to="/composition" class="text-muted hover:text-highlighted">
          Composition
        </NuxtLink>
        <!-- Every page must review in light AND dark (PRO-230). -->
        <UColorModeButton data-testid="color-mode-toggle" class="ms-auto" />
      </nav>
    </header>
    <NuxtPage />
  </UApp>
</template>
