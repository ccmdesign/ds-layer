<template>
  <UApp>
    <header class="border-b border-default">
      <nav class="mx-auto flex max-w-4xl items-center gap-4 px-4 py-3">
        <NuxtLink to="/" class="font-semibold">
          @ccm/ds playground
        </NuxtLink>
        <NuxtLink to="/tokens" class="text-muted hover:text-highlighted">
          Tokens
        </NuxtLink>
      </nav>
    </header>
    <NuxtPage />
  </UApp>
</template>
