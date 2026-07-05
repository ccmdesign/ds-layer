<!-- FIXTURE (must FAIL unit-disallowed-list): raw px inside an SFC style block. -->
<template>
  <div class="fixture-vue-px" />
</template>

<style>
.fixture-vue-px {
  padding: 12px;
}
</style>
