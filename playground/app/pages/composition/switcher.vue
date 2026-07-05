<template>
  <main class="mx-auto flex max-w-4xl flex-col gap-l px-4 py-l">
    <h1 class="text-step-3 font-semibold">
      Switcher
    </h1>
    <p class="text-muted text-step--1">
      Container-query implementation: resize the bordered containers (or the
      viewport) to see the switch — the breakpoint is the container's width,
      not the viewport's.
    </p>

    <section class="flex flex-col gap-4">
      <h2 class="text-step-1 font-semibold">
        Default <code class="text-muted text-step--1">threshold="s"</code> (30rem)
      </h2>
      <CcmSwitcher class="rounded-md border border-default p-4">
        <div class="bg-elevated rounded-md p-4">one</div>
        <div class="bg-elevated rounded-md p-4">two</div>
        <div class="bg-elevated rounded-md p-4">three</div>
      </CcmSwitcher>
    </section>

    <section class="flex flex-col gap-4">
      <h2 class="text-step-1 font-semibold">
        Early switch <code class="text-muted text-step--1">threshold="xs"</code> (20rem) in a narrow parent
      </h2>
      <div class="grid grid-cols-2 gap-4">
        <CcmSwitcher threshold="xs" space="2xs" class="rounded-md border border-default p-4">
          <div class="bg-elevated rounded-md p-4">one</div>
          <div class="bg-elevated rounded-md p-4">two</div>
        </CcmSwitcher>
        <CcmSwitcher threshold="xl" space="2xs" class="rounded-md border border-default p-4">
          <div class="bg-elevated rounded-md p-4">one</div>
          <div class="bg-elevated rounded-md p-4">two</div>
        </CcmSwitcher>
      </div>
      <p class="text-muted text-step--1">
        Same parent width: the left switcher (xs) goes horizontal, the right
        one (xl) stays stacked.
      </p>
    </section>

    <section class="flex flex-col gap-4">
      <h2 class="text-step-1 font-semibold">
        Quantity threshold <code class="text-muted text-step--1">limit="4"</code> with five children
      </h2>
      <CcmSwitcher class="rounded-md border border-default p-4">
        <div class="bg-elevated rounded-md p-4">one</div>
        <div class="bg-elevated rounded-md p-4">two</div>
        <div class="bg-elevated rounded-md p-4">three</div>
        <div class="bg-elevated rounded-md p-4">four</div>
        <div class="bg-elevated rounded-md p-4">five</div>
      </CcmSwitcher>
      <p class="text-muted text-step--1">
        More children than the limit — stays vertical at any width.
      </p>
    </section>
  </main>
</template>
