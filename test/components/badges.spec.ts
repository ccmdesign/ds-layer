import { mount } from '@vue/test-utils'
import { describe, expect, it } from 'vitest'
import CcmChannelBadge from '../../app/components/CcmChannelBadge.vue'
import CcmChannelIcon from '../../app/components/CcmChannelIcon.vue'
import CcmIconInstagram from '../../app/components/CcmIconInstagram.vue'
import CcmStatusBadge from '../../app/components/CcmStatusBadge.vue'

describe('CcmChannelIcon', () => {
  it('renders the platform mark for a known channel', () => {
    const wrapper = mount(CcmChannelIcon, { props: { channel: 'instagram' } })
    expect(wrapper.findComponent(CcmIconInstagram).exists()).toBe(true)
  })

  it('resolves aliases (twitter -> X mark)', () => {
    const twitter = mount(CcmChannelIcon, { props: { channel: 'Twitter' } })
    const x = mount(CcmChannelIcon, { props: { channel: 'x' } })
    expect(twitter.html()).toBe(x.html())
  })

  it('falls back to the neutral globe for unknown channels', () => {
    const wrapper = mount(CcmChannelIcon, { props: { channel: 'myspace' } })
    expect(wrapper.find('circle').exists()).toBe(true)
  })
})

describe('CcmChannelBadge', () => {
  it('renders label, brand color and fg from the registry', () => {
    const wrapper = mount(CcmChannelBadge, { props: { channel: 'instagram' } })
    expect(wrapper.text()).toContain('Instagram')
    expect(wrapper.attributes('data-channel')).toBe('instagram')
    const style = wrapper.attributes('style') ?? ''
    expect(style).toContain('--channel-bg: #E4405F')
    expect(style).toContain('--channel-fg: #ffffff')
  })

  it('echoes unknown channels with the neutral fallback color', () => {
    const wrapper = mount(CcmChannelBadge, { props: { channel: 'myspace' } })
    expect(wrapper.text()).toContain('myspace')
    expect(wrapper.attributes('data-channel')).toBeUndefined()
    expect(wrapper.attributes('style') ?? '').toContain('--channel-bg: #6b7280')
  })

  it('accepts a label override', () => {
    const wrapper = mount(CcmChannelBadge, { props: { channel: 'x', label: 'X / Twitter' } })
    expect(wrapper.text()).toContain('X / Twitter')
  })
})

describe('CcmStatusBadge', () => {
  it('maps status -> semantic color and EN label by default', () => {
    const wrapper = mount(CcmStatusBadge, { props: { status: 'published' } })
    expect(wrapper.text()).toBe('Published')
    expect(wrapper.attributes('data-status')).toBe('published')
    expect(wrapper.attributes('data-status-color')).toBe('success')
  })

  it('normalizes free-form statuses (Social House labels)', () => {
    const wrapper = mount(CcmStatusBadge, { props: { status: 'In Buffer' } })
    expect(wrapper.attributes('data-status')).toBe('in_buffer')
    expect(wrapper.attributes('data-status-color')).toBe('info')
  })

  it('resolves the PT dictionary via the locale prop', () => {
    const wrapper = mount(CcmStatusBadge, { props: { status: 'draft', locale: 'pt' } })
    expect(wrapper.text()).toBe('Rascunho')
    expect(wrapper.attributes('data-status-color')).toBe('warning')
  })

  it('prefers an already-translated label override', () => {
    const wrapper = mount(CcmStatusBadge, { props: { status: 'draft', label: 'Entwurf' } })
    expect(wrapper.text()).toBe('Entwurf')
  })

  it('renders unknown statuses neutrally, echoing the raw value', () => {
    const wrapper = mount(CcmStatusBadge, { props: { status: 'archived' } })
    expect(wrapper.text()).toBe('archived')
    expect(wrapper.attributes('data-status-color')).toBe('neutral')
  })
})
