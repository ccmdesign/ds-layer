<template>
  <main class="mx-auto max-w-4xl px-6 py-12">
    <CcmStack space="xl">
      <CcmStack space="2xs">
        <h1 class="text-2xl font-semibold">
          Domain foundations
        </h1>
        <p class="text-muted">
          PRO-231 — channel registry, status conventions and locale-aware utils,
          rendered straight from the layer's registries.
        </p>
      </CcmStack>

      <section data-testid="channel-badges">
        <CcmStack space="s">
          <h2 class="text-xl font-semibold">
            Channel registry
          </h2>
          <p class="text-muted text-sm">
            One <code>CcmChannelBadge</code> per registry entry — brand hex lives only in
            <code>app/utils/channels.ts</code> (the sanctioned token exception). The last badge
            shows the neutral fallback for an unknown channel.
          </p>
          <CcmCluster space="2xs">
            <CcmChannelBadge
              v-for="id in channelIds()"
              :key="id"
              :channel="id"
              :data-testid="`channel-badge-${id}`"
            />
            <CcmChannelBadge channel="myspace" data-testid="channel-badge-unknown" />
          </CcmCluster>
          <h3 class="font-medium">
            Marks only (<code>CcmChannelIcon</code>, alias-aware)
          </h3>
          <CcmCluster space="s" align="center">
            <CcmChannelIcon
              v-for="id in channelIds()"
              :key="id"
              :channel="id"
              class="size-6"
            />
            <CcmChannelIcon channel="twitter" class="size-6" data-testid="channel-icon-alias" />
            <CcmChannelIcon channel="unknown" class="size-6 text-muted" />
          </CcmCluster>
        </CcmStack>
      </section>

      <section data-testid="status-badges">
        <CcmStack space="s">
          <h2 class="text-xl font-semibold">
            Status conventions
          </h2>
          <p class="text-muted text-sm">
            One mechanism: the <code>STATUS_COLORS</code> JS map resolves a semantic color,
            <code>CcmStatusBadge</code> maps it onto the themed <code>--ui-*</code> variables.
            Same registry, EN and PT dictionaries.
          </p>
          <CcmCluster space="2xs">
            <CcmStatusBadge
              v-for="id in statusIds()"
              :key="id"
              :status="id"
              :data-testid="`status-badge-${id}`"
            />
            <CcmStatusBadge status="archived" data-testid="status-badge-unknown" />
          </CcmCluster>
          <CcmCluster space="2xs" data-testid="status-badges-pt">
            <CcmStatusBadge
              v-for="id in statusIds()"
              :key="id"
              :status="id"
              locale="pt"
            />
          </CcmCluster>
        </CcmStack>
      </section>

      <section data-testid="domain-utils">
        <CcmStack space="s">
          <h2 class="text-xl font-semibold">
            Utils
          </h2>
          <ul class="text-sm space-y-1">
            <li>
              <code>formatDate('2024-05-22T14:30:00Z')</code> →
              <strong data-testid="format-date-en">{{ formatDate('2024-05-22T14:30:00Z') }}</strong>
            </li>
            <li>
              <code>formatDate('2024-05-22', { locale: 'pt' })</code> →
              <strong data-testid="format-date-pt">{{ formatDate('2024-05-22', { locale: 'pt' }) }}</strong>
            </li>
            <li>
              <code>formatDate('2024-01-05', { style: 'long' })</code> →
              <strong>{{ formatDate('2024-01-05', { style: 'long' }) }}</strong>
            </li>
          </ul>
          <CcmCluster space="2xs" align="center">
            <UButton
              size="sm"
              variant="soft"
              data-testid="copy-button"
              @click="copyExample"
            >
              useClipboard() demo
            </UButton>
            <span v-if="copied" class="text-sm text-muted" data-testid="copy-result">copied ✓</span>
          </CcmCluster>
        </CcmStack>
      </section>
    </CcmStack>
  </main>
</template>

<script setup lang="ts">
// Registry + utils auto-imported from the layer (app/utils, app/composables).
const { copy } = useClipboard()
const copied = ref(false)

async function copyExample() {
  copied.value = await copy(formatDate('2024-05-22'))
}
</script>
