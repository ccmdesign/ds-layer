<template>
  <main class="mx-auto flex max-w-4xl flex-col gap-l px-4 py-l">
    <h1 class="text-step-3 font-semibold">
      Grid
    </h1>

    <section class="flex flex-col gap-4">
      <h2 class="text-step-1 font-semibold">
        Default <code class="text-muted text-step--1">min = measure / 3</code>
      </h2>
      <CcmGrid class="rounded-md border border-default p-4">
        <div v-for="n in 6" :key="n" class="bg-elevated rounded-md p-4">
          card {{ n }}
        </div>
      </CcmGrid>
    </section>

    <section class="flex flex-col gap-4">
      <h2 class="text-step-1 font-semibold">
        Denser <code class="text-muted text-step--1">min="8rem" space="2xs"</code>
      </h2>
      <CcmGrid min="8rem" space="2xs" class="rounded-md border border-default p-4">
        <div v-for="n in 10" :key="n" class="bg-elevated rounded-md p-4">
          tile {{ n }}
        </div>
      </CcmGrid>
    </section>

    <section class="flex flex-col gap-4">
      <h2 class="text-step-1 font-semibold">
        Wide columns <code class="text-muted text-step--1">min="24rem" space="l"</code>
      </h2>
      <p class="text-muted text-step--1">
        Columns never shrink below the minimum — the grid collapses to a
        single column instead (min() caps at 100%).
      </p>
      <CcmGrid min="24rem" space="l" class="rounded-md border border-default p-4">
        <div v-for="n in 4" :key="n" class="bg-elevated rounded-md p-4">
          panel {{ n }}
        </div>
      </CcmGrid>
    </section>
  </main>
</template>
