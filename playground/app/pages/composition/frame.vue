<script setup lang="ts">
// Self-contained demo image (landscape, off-center circle) so cover-crop
// versus contain-letterbox is visible without network fetches.
const demoImage = `data:image/svg+xml;charset=utf-8,${encodeURIComponent(
  `<svg xmlns='http://www.w3.org/2000/svg' width='800' height='500' viewBox='0 0 800 500'>`
  + `<rect width='800' height='500' fill='#c7d2fe'/>`
  + `<circle cx='400' cy='250' r='190' fill='#4f46e5'/>`
  + `<rect x='0' y='230' width='800' height='40' fill='#eef2ff'/>`
  + `</svg>`,
)}`
</script>

<template>
  <CcmStack as="main" space="l" class="mx-auto max-w-4xl px-4 py-l">
    <h1 class="text-step-3 font-semibold">
      Frame
    </h1>

    <section class="flex flex-col gap-4">
      <h2 class="text-step-1 font-semibold">
        Default <code class="text-muted text-step--1">ratio="16:9"</code>
      </h2>
      <CcmFrame class="rounded-md border border-default">
        <img :src="demoImage" alt="Demo image cropped to 16:9">
      </CcmFrame>
    </section>

    <section class="flex flex-col gap-4">
      <h2 class="text-step-1 font-semibold">
        Portrait crop vs letterbox <code class="text-muted text-step--1">ratio="4:5" fit="cover|contain"</code>
      </h2>
      <p class="text-muted text-step--1">
        The Social House PostCard case: same 4:5 frame, cover crops the
        landscape image, contain letterboxes it — no more surprise crops.
      </p>
      <div class="grid max-w-xl grid-cols-2 gap-4">
        <CcmFrame ratio="4:5" class="rounded-md border border-default">
          <img :src="demoImage" alt="Demo image cropped to fill a 4:5 frame">
        </CcmFrame>
        <CcmFrame ratio="4:5" fit="contain" class="rounded-md border border-default">
          <img :src="demoImage" alt="Demo image letterboxed inside a 4:5 frame">
        </CcmFrame>
      </div>
    </section>

    <section class="flex flex-col gap-4">
      <h2 class="text-step-1 font-semibold">
        Non-media child <code class="text-muted text-step--1">ratio="21:9"</code>
      </h2>
      <CcmFrame ratio="21:9" class="bg-elevated rounded-md border border-default">
        <p class="text-step-1">centered and clipped</p>
      </CcmFrame>
    </section>
  </CcmStack>
</template>
