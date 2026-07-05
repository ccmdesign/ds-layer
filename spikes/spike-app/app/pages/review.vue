<script setup lang="ts">
/**
 * PRO-233 representative page — RUNNER-BUILT STAND-IN.
 *
 * Gate 3 (unprompted agent compliance) could not run in the pipeline
 * environment (claude CLI auth expired — see docs/solutions/PRO-233-go-no-go.md).
 * This page was composed by the pipeline runner following skills/ccm-ds
 * exactly, so Gates 1–2 (cascade + skin fidelity) still judge a real
 * representative page: form + validation, modal, card grid, composition
 * primitives. When Gate 3 runs (scripts/gate3-attempt.sh), the agent's page
 * replaces this file verbatim.
 */

const channelItems = ['Instagram', 'LinkedIn', 'YouTube', 'TikTok']

const state = reactive({
  title: '',
  caption: '',
  channel: undefined as string | undefined,
  date: '',
})

type FormError = { name: string, message: string }

function validate(current: typeof state): FormError[] {
  const errors: FormError[] = []
  if (!current.title.trim()) errors.push({ name: 'title', message: 'Give the post a title.' })
  if (!current.caption.trim()) errors.push({ name: 'caption', message: 'A caption is required.' })
  if (current.caption.length > 280) errors.push({ name: 'caption', message: 'Captions max out at 280 characters.' })
  if (!current.channel) errors.push({ name: 'channel', message: 'Pick a channel.' })
  if (!current.date) errors.push({ name: 'date', message: 'Pick a publish date.' })
  return errors
}

const confirmOpen = ref(false)
const toast = useToast()

function onSubmit() {
  confirmOpen.value = true
}

function confirmSchedule() {
  confirmOpen.value = false
  toast.add({
    title: 'Post scheduled',
    description: `“${state.title}” goes out on ${formatDate(state.date)}.`,
    color: 'success',
  })
  state.title = ''
  state.caption = ''
  state.channel = undefined
  state.date = ''
}

const posts = [
  { title: 'Spring launch teaser', channel: 'Instagram', status: 'scheduled', date: '2026-07-08' },
  { title: 'Founder AMA recap', channel: 'LinkedIn', status: 'draft', date: '2026-07-10' },
  { title: 'Behind the scenes reel', channel: 'Instagram', status: 'scheduled', date: '2026-07-12' },
  { title: 'Product demo short', channel: 'YouTube', status: 'review', date: '2026-07-14' },
  { title: 'Hiring: design engineer', channel: 'LinkedIn', status: 'published', date: '2026-06-30' },
  { title: 'Community spotlight', channel: 'TikTok', status: 'scheduled', date: '2026-07-18' },
]
</script>

<template>
  <CcmStack as="main" space="xl" class="mx-auto max-w-5xl px-4 py-l">
    <CcmStack as="section" space="m" data-testid="schedule-form">
      <h1 class="text-step-3 font-semibold">
        Schedule a post
      </h1>
      <UForm :state="state" :validate="validate" @submit="onSubmit">
        <CcmStack space="s">
          <UFormField label="Post title" name="title" required>
            <UInput v-model="state.title" placeholder="What are we posting?" class="w-full" />
          </UFormField>
          <UFormField
            label="Caption"
            name="caption"
            required
            :help="`${state.caption.length}/280 characters`"
          >
            <UTextarea v-model="state.caption" :rows="4" placeholder="Write the caption…" class="w-full" />
          </UFormField>
          <CcmSwitcher threshold="m" space="s">
            <UFormField label="Channel" name="channel" required>
              <USelect v-model="state.channel" :items="channelItems" placeholder="Select a channel" class="w-full" />
            </UFormField>
            <UFormField label="Publish date" name="date" required>
              <UInput v-model="state.date" type="date" class="w-full" />
            </UFormField>
          </CcmSwitcher>
          <CcmCluster space="s" justify="end">
            <UButton type="submit" data-testid="submit-post">
              Schedule post
            </UButton>
          </CcmCluster>
        </CcmStack>
      </UForm>
    </CcmStack>

    <UModal v-model:open="confirmOpen" title="Schedule this post?" data-testid="confirm-modal">
      <template #body>
        <CcmStack space="s">
          <p class="text-step-0">
            <strong>{{ state.title }}</strong> will be scheduled.
          </p>
          <CcmCluster space="s" align="center">
            <CcmChannelBadge :channel="state.channel" />
            <span class="text-muted text-step-0">{{ formatDate(state.date) }}</span>
          </CcmCluster>
          <p class="text-muted text-step-0">
            {{ state.caption }}
          </p>
        </CcmStack>
      </template>
      <template #footer>
        <CcmCluster space="s" justify="end" class="w-full">
          <UButton color="neutral" variant="ghost" data-testid="cancel-schedule" @click="confirmOpen = false">
            Cancel
          </UButton>
          <UButton data-testid="confirm-schedule" @click="confirmSchedule">
            Confirm
          </UButton>
        </CcmCluster>
      </template>
    </UModal>

    <CcmStack as="section" space="m" data-testid="planned-posts">
      <h2 class="text-step-2 font-semibold">
        Planned posts
      </h2>
      <CcmGrid as="ul" min="16rem" space="m" class="list-none p-0">
        <li v-for="post in posts" :key="post.title">
          <UCard>
            <CcmStack space="xs">
              <CcmCluster space="2xs" align="center">
                <CcmChannelBadge :channel="post.channel" />
                <CcmStatusBadge :status="post.status" />
              </CcmCluster>
              <h3 class="text-step-1 font-medium">
                {{ post.title }}
              </h3>
              <p class="text-muted text-step-0">
                {{ formatDate(post.date) }}
              </p>
            </CcmStack>
          </UCard>
        </li>
      </CcmGrid>
    </CcmStack>
  </CcmStack>
</template>
