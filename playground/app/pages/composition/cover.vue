<template>
  <CcmStack as="main" space="l" class="mx-auto max-w-4xl px-4 py-l">
    <h1 class="text-step-3 font-semibold">
      Cover
    </h1>

    <section class="flex flex-col gap-4">
      <h2 class="text-step-1 font-semibold">
        Header + centered + footer <code class="text-muted text-step--1">min-height="45vh"</code>
      </h2>
      <CcmCover min-height="45vh" class="rounded-md border border-default">
        <div class="bg-elevated rounded-md p-4">header</div>
        <p data-cover-centered class="text-step-2 text-center font-semibold">
          The principal element gravitates to the center
        </p>
        <div class="bg-elevated rounded-md p-4">footer</div>
      </CcmCover>
    </section>

    <section class="flex flex-col gap-4">
      <h2 class="text-step-1 font-semibold">
        Centered only, unpadded <code class="text-muted text-step--1">min-height="30vh" no-pad space="xl"</code>
      </h2>
      <CcmCover min-height="30vh" no-pad space="xl" class="rounded-md border border-default">
        <p data-cover-centered class="text-step-1 text-center">
          No header, no footer, no padding — still centered
        </p>
      </CcmCover>
    </section>
  </CcmStack>
</template>
