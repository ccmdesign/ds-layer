import { mount } from '@vue/test-utils'
import { describe, expect, it } from 'vitest'
import CcmCard from '../../app/components/CcmCard.vue'
import CcmDisclosure from '../../app/components/CcmDisclosure.vue'
import CcmKeyValue from '../../app/components/CcmKeyValue.vue'

// Component tests mount the SFCs directly (no Nuxt runtime), so UCard is
// stubbed with a slot-rendering shell: CcmCard's contract under test is the
// STRUCTURE it puts into UCard's slots, not UCard itself.
const UCardStub = {
  props: ['variant'],
  template: `
    <div class="u-card-stub" :data-variant="variant">
      <div v-if="$slots.header" class="u-card-stub__header"><slot name="header" /></div>
      <div v-if="$slots.default" class="u-card-stub__body"><slot /></div>
      <div v-if="$slots.footer" class="u-card-stub__footer"><slot name="footer" /></div>
    </div>
  `,
}

const mountCard = (options: Record<string, unknown> = {}) =>
  mount(CcmCard, { global: { stubs: { UCard: UCardStub } }, ...options })

describe('CcmCard', () => {
  it('renders title, meta, badges, body and actions into the card anatomy', () => {
    const wrapper = mountCard({
      props: { title: 'Spring launch', meta: 'Tomorrow, 9:00' },
      slots: {
        badges: '<span class="badge">Instagram</span>',
        default: '<p>body copy</p>',
        actions: '<button type="button">Edit</button><button type="button">Publish</button>',
      },
    })
    expect(wrapper.get('.ccm-card-title').text()).toBe('Spring launch')
    expect(wrapper.get('.ccm-card-meta').text()).toBe('Tomorrow, 9:00')
    expect(wrapper.get('.ccm-card-badges .badge').text()).toBe('Instagram')
    expect(wrapper.get('.u-card-stub__body').text()).toContain('body copy')
    expect(wrapper.get('.ccm-card-actions').findAll('button')).toHaveLength(2)
  })

  it('collapses header and footer away when they have no content', () => {
    const wrapper = mountCard({ slots: { default: '<p>only a body</p>' } })
    expect(wrapper.find('.u-card-stub__header').exists()).toBe(false)
    expect(wrapper.find('.u-card-stub__footer').exists()).toBe(false)
    expect(wrapper.find('.ccm-card-title-row').exists()).toBe(false)
  })

  it('renders no body element for a header-only card', () => {
    const wrapper = mountCard({
      props: { title: 'Header only', meta: 'no body content' },
    })
    expect(wrapper.find('.u-card-stub__header').exists()).toBe(true)
    expect(wrapper.find('.u-card-stub__body').exists()).toBe(false)
  })

  it('forwards the variant and prefers slotted title/meta over props', () => {
    const wrapper = mountCard({
      props: { title: 'prop title', variant: 'soft' },
      slots: { title: 'slot title', trailing: '<span class="arrow">→</span>' },
    })
    expect(wrapper.get('.u-card-stub').attributes('data-variant')).toBe('soft')
    expect(wrapper.get('.ccm-card-title').text()).toBe('slot title')
    expect(wrapper.get('.ccm-card-trailing .arrow').exists()).toBe(true)
  })
})

describe('CcmKeyValue', () => {
  it('renders items as dt/dd pairs in a dl, grid variant by default', () => {
    const wrapper = mount(CcmKeyValue, {
      props: { items: [{ term: 'Channel', value: 'Instagram' }, { term: 'Status', value: 'Draft' }] },
    })
    const dl = wrapper.get('dl.ccm-key-value')
    expect(dl.attributes('data-variant')).toBe('grid')
    expect(wrapper.findAll('dt').map(node => node.text())).toEqual(['Channel', 'Status'])
    expect(wrapper.findAll('dd').map(node => node.text())).toEqual(['Instagram', 'Draft'])
  })

  it('exposes the stacked variant', () => {
    const wrapper = mount(CcmKeyValue, { props: { variant: 'stacked' } })
    expect(wrapper.get('dl').attributes('data-variant')).toBe('stacked')
  })

  it('composes items with slotted custom pairs', () => {
    const wrapper = mount(CcmKeyValue, {
      props: { items: [{ term: 'Format', value: 'Carousel' }] },
      slots: { default: '<dt>Assets</dt><dd>5 slides</dd><dd>1 cover</dd>' },
    })
    expect(wrapper.findAll('dt')).toHaveLength(2)
    expect(wrapper.findAll('dd')).toHaveLength(3)
    expect(wrapper.findAll('dt')[1]!.text()).toBe('Assets')
  })
})

describe('CcmDisclosure', () => {
  it('renders native details/summary, collapsed by default', () => {
    const wrapper = mount(CcmDisclosure, {
      props: { summary: 'Advanced options' },
      slots: { default: '<p>hidden until opened</p>' },
    })
    const details = wrapper.get('details.ccm-disclosure')
    expect(details.attributes('open')).toBeUndefined()
    expect(wrapper.get('summary .ccm-disclosure-label').text()).toBe('Advanced options')
    expect(wrapper.get('.ccm-disclosure-content p').text()).toBe('hidden until opened')
  })

  it('shows the count affordance only when provided (0 included)', () => {
    const withCount = mount(CcmDisclosure, { props: { summary: 'Filters', count: 0 } })
    expect(withCount.get('.ccm-disclosure-count').text()).toBe('0')
    const withoutCount = mount(CcmDisclosure, { props: { summary: 'Filters' } })
    expect(withoutCount.find('.ccm-disclosure-count').exists()).toBe(false)
  })

  it('supports the summary slot and the native open attribute fallthrough', () => {
    const wrapper = mount(CcmDisclosure, {
      attrs: { open: true },
      slots: { summary: '<em>Slotted</em> label' },
    })
    expect(wrapper.get('details').attributes('open')).toBeDefined()
    expect(wrapper.get('.ccm-disclosure-label em').text()).toBe('Slotted')
  })
})
