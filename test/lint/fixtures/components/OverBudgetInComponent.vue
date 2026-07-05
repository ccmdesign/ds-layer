<!--
  FIXTURE (must PASS ccm/class-budget): the SAME over-budget class string as
  pages/over-budget.vue, but inside a components/ directory — class strings
  are allowed where Tailwind Variants definitions live, so the budget rule's
  config scoping must exempt this path.
-->
<template>
  <div class="mx-auto flex max-w-4xl flex-col items-center gap-4 px-4 py-8">
    <slot />
  </div>
</template>
