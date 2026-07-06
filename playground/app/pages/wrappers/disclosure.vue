<template>
  <CcmStack as="main" space="l" class="mx-auto max-w-4xl px-4 py-l">
    <header class="flex items-center justify-between gap-4">
      <h1 class="text-step-3 font-semibold">
        Disclosure
      </h1>
      <UColorModeButton data-testid="disclosure-color-mode" />
    </header>

    <section class="flex flex-col gap-4" data-testid="disclosure-default">
      <h2 class="text-step-1 font-semibold">
        Default <code class="text-muted text-step--1">summary + count, collapsed</code>
      </h2>
      <CcmDisclosure summary="Advanced options" :count="3">
        <CcmStack space="2xs">
          <p>Collapsed by default; works without JavaScript.</p>
          <p>Toggling is the native details behavior — no handlers.</p>
          <p>Keyboard: focus the summary, press Enter or Space.</p>
        </CcmStack>
      </CcmDisclosure>
    </section>

    <section class="flex flex-col gap-4" data-testid="disclosure-open">
      <h2 class="text-step-1 font-semibold">
        Default-open <code class="text-muted text-step--1">native `open` attribute + summary slot</code>
      </h2>
      <CcmDisclosure open>
        <template #summary>
          Rendered <em>open</em> via attribute fallthrough
        </template>
        <p>
          No `defaultOpen` prop — the native attribute falls through to the
          details root.
        </p>
      </CcmDisclosure>
    </section>

    <section class="flex flex-col gap-4" data-testid="disclosure-grid-content">
      <h2 class="text-step-1 font-semibold">
        Grid content <code class="text-muted text-step--1">closed-state guard</code>
      </h2>
      <p class="text-muted text-step--1">
        The content below is a <code>CcmGrid</code> (display: grid). Author
        CSS like this defeats the UA stylesheet's closed-state hiding — the
        wrapper's <code>:not([open])</code> guard keeps it collapsed anyway.
      </p>
      <CcmDisclosure summary="Asset grid" :count="4">
        <CcmGrid min="8rem" space="2xs">
          <div class="bg-elevated rounded-md p-4">one</div>
          <div class="bg-elevated rounded-md p-4">two</div>
          <div class="bg-elevated rounded-md p-4">three</div>
          <div class="bg-elevated rounded-md p-4">four</div>
        </CcmGrid>
      </CcmDisclosure>
    </section>
  </CcmStack>
</template>
