<template>
  <main class="mx-auto flex max-w-4xl flex-col gap-l px-4 py-l">
    <h1 class="text-step-3 font-semibold">
      Stack
    </h1>

    <section class="flex flex-col gap-4">
      <h2 class="text-step-1 font-semibold">
        Default <code class="text-muted text-step--1">space="m"</code>
      </h2>
      <CcmStack class="rounded-md border border-default p-4">
        <div class="bg-elevated rounded-md p-4">first</div>
        <div class="bg-elevated rounded-md p-4">second</div>
        <div class="bg-elevated rounded-md p-4">third</div>
      </CcmStack>
    </section>

    <section class="flex flex-col gap-4">
      <h2 class="text-step-1 font-semibold">
        Tight <code class="text-muted text-step--1">space="2xs"</code>
      </h2>
      <CcmStack space="2xs" class="rounded-md border border-default p-4">
        <div class="bg-elevated rounded-md p-4">first</div>
        <div class="bg-elevated rounded-md p-4">second</div>
        <div class="bg-elevated rounded-md p-4">third</div>
      </CcmStack>
    </section>

    <section class="flex flex-col gap-4">
      <h2 class="text-step-1 font-semibold">
        Split <code class="text-muted text-step--1">split-after="2"</code>
      </h2>
      <p class="text-muted text-step--1">
        Everything after the second child is pushed to the bottom of the
        fixed-height parent (card pattern).
      </p>
      <div class="h-80 rounded-md border border-default p-4">
        <CcmStack space="2xs" :split-after="2">
          <div class="bg-elevated rounded-md p-4">title</div>
          <div class="bg-elevated rounded-md p-4">body</div>
          <div class="bg-elevated rounded-md p-4">footer, pushed down</div>
        </CcmStack>
      </div>
    </section>
  </main>
</template>
