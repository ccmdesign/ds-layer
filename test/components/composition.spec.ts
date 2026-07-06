import { mount } from '@vue/test-utils'
import { afterEach, describe, expect, it, vi } from 'vitest'
import CcmCluster from '../../app/components/CcmCluster.vue'
import CcmCover from '../../app/components/CcmCover.vue'
import CcmFrame from '../../app/components/CcmFrame.vue'
import CcmGrid from '../../app/components/CcmGrid.vue'
import CcmReel from '../../app/components/CcmReel.vue'
import CcmStack from '../../app/components/CcmStack.vue'
import CcmSwitcher from '../../app/components/CcmSwitcher.vue'
import { isSpaceToken, parseFrameRatio, spaceVar } from '../../app/utils/composition'

afterEach(() => {
  vi.restoreAllMocks()
})

describe('composition utils', () => {
  it('maps space tokens to generated custom properties', () => {
    expect(spaceVar('m')).toBe('var(--spacing-m)')
    expect(spaceVar('s-m')).toBe('var(--spacing-s-m)')
  })

  it('recognises the Utopia scale, including pairs', () => {
    expect(isSpaceToken('3xs')).toBe(true)
    expect(isSpaceToken('2xl-3xl')).toBe(true)
    expect(isSpaceToken('huge')).toBe(false)
  })

  it('parses W:H frame ratios and rejects anything else', () => {
    expect(parseFrameRatio('4:5')).toEqual({ n: '4', d: '5' })
    expect(parseFrameRatio('2.35:1')).toEqual({ n: '2.35', d: '1' })
    expect(parseFrameRatio('16/9')).toBeUndefined()
    expect(parseFrameRatio('wide')).toBeUndefined()
  })
})

describe('CcmStack', () => {
  it('renders a plain div stack with its slot and no inline style by default', () => {
    const wrapper = mount(CcmStack, { slots: { default: '<p>one</p><p>two</p>' } })
    const root = wrapper.get('.ccm-stack')
    expect(root.element.tagName).toBe('DIV')
    expect(root.attributes('style')).toBeUndefined()
    expect(root.attributes('data-recursive')).toBeUndefined()
    expect(root.findAll('p')).toHaveLength(2)
  })

  it('maps space to --stack-space and renders the `as` element', () => {
    const wrapper = mount(CcmStack, { props: { as: 'section', space: 'xl' } })
    expect(wrapper.get('.ccm-stack').element.tagName).toBe('SECTION')
    expect(wrapper.attributes('style')).toContain('--stack-space: var(--spacing-xl)')
  })

  it('exposes recursive and splitAfter as data attributes', () => {
    const wrapper = mount(CcmStack, { props: { recursive: true, splitAfter: 2 } })
    expect(wrapper.attributes('data-recursive')).toBe('')
    expect(wrapper.attributes('data-split-after')).toBe('2')
  })

  it('ignores an out-of-range splitAfter with a warning', () => {
    const warn = vi.spyOn(console, 'warn').mockImplementation(() => {})
    const wrapper = mount(CcmStack, { props: { splitAfter: 9 } })
    expect(wrapper.attributes('data-split-after')).toBeUndefined()
    expect(warn).toHaveBeenCalledOnce()
  })
})

describe('CcmCluster', () => {
  it('emits no inline style for the defaults', () => {
    const wrapper = mount(CcmCluster)
    expect(wrapper.attributes('style')).toBeUndefined()
  })

  it('maps space, justify and align to custom properties', () => {
    const wrapper = mount(CcmCluster, {
      props: { space: 'xs', justify: 'center', align: 'baseline' },
    })
    const style = wrapper.attributes('style')
    expect(style).toContain('--cluster-space: var(--spacing-xs)')
    expect(style).toContain('--cluster-justify: center')
    expect(style).toContain('--cluster-align: baseline')
  })
})

describe('CcmSwitcher', () => {
  it('always carries its threshold and limit data attributes (defaults s/4)', () => {
    const wrapper = mount(CcmSwitcher)
    expect(wrapper.attributes('data-threshold')).toBe('s')
    expect(wrapper.attributes('data-limit')).toBe('4')
    expect(wrapper.attributes('style')).toBeUndefined()
  })

  it('accepts a named threshold, limit and space token', () => {
    const wrapper = mount(CcmSwitcher, { props: { threshold: 'l', limit: 2, space: 's' } })
    expect(wrapper.attributes('data-threshold')).toBe('l')
    expect(wrapper.attributes('data-limit')).toBe('2')
    expect(wrapper.attributes('style')).toContain('--switcher-space: var(--spacing-s)')
  })

  it('falls back to defaults on invalid threshold/limit, warning once each', () => {
    const warn = vi.spyOn(console, 'warn').mockImplementation(() => {})
    // @ts-expect-error deliberately invalid threshold
    const wrapper = mount(CcmSwitcher, { props: { threshold: '55rem', limit: 12 } })
    expect(wrapper.attributes('data-threshold')).toBe('s')
    expect(wrapper.attributes('data-limit')).toBe('4')
    expect(warn).toHaveBeenCalledTimes(2)
  })
})

describe('CcmCover', () => {
  it('emits no inline style for the defaults', () => {
    const wrapper = mount(CcmCover, { slots: { default: '<h1>hero</h1>' } })
    expect(wrapper.attributes('style')).toBeUndefined()
    expect(wrapper.attributes('data-no-pad')).toBeUndefined()
  })

  it('maps minHeight, space and noPad', () => {
    const wrapper = mount(CcmCover, {
      props: { minHeight: '40rem', space: 'l', noPad: true },
    })
    const style = wrapper.attributes('style')
    expect(style).toContain('--cover-min-height: 40rem')
    expect(style).toContain('--cover-space: var(--spacing-l)')
    expect(wrapper.attributes('data-no-pad')).toBe('')
  })
})

describe('CcmGrid', () => {
  it('leaves the column minimum to the CSS measure default', () => {
    const wrapper = mount(CcmGrid)
    expect(wrapper.attributes('style')).toBeUndefined()
  })

  it('maps min and space to custom properties', () => {
    const wrapper = mount(CcmGrid, { props: { min: '15rem', space: '2xl' } })
    const style = wrapper.attributes('style')
    expect(style).toContain('--grid-min: 15rem')
    expect(style).toContain('--grid-space: var(--spacing-2xl)')
  })

  it('keeps auto-fit by default and flags auto-fill via data attribute', () => {
    expect(mount(CcmGrid).attributes('data-fill')).toBeUndefined()
    expect(mount(CcmGrid, { props: { fill: true } }).attributes('data-fill')).toBe('')
  })
})

describe('CcmFrame', () => {
  it('uses the 16:9 CSS default without inline style', () => {
    const wrapper = mount(CcmFrame)
    expect(wrapper.attributes('style')).toBeUndefined()
  })

  it('parses the typed ratio into numerator/denominator properties', () => {
    const wrapper = mount(CcmFrame, { props: { ratio: '4:5' } })
    const style = wrapper.attributes('style')
    expect(style).toContain('--frame-n: 4')
    expect(style).toContain('--frame-d: 5')
  })

  it('supports contain fit (the Social House no-crop case)', () => {
    const wrapper = mount(CcmFrame, { props: { ratio: '4:5', fit: 'contain' } })
    expect(wrapper.attributes('style')).toContain('--frame-fit: contain')
  })

  it('falls back to 16:9 on a malformed ratio, with a warning', () => {
    const warn = vi.spyOn(console, 'warn').mockImplementation(() => {})
    // @ts-expect-error deliberately invalid ratio
    const wrapper = mount(CcmFrame, { props: { ratio: 'wide' } })
    expect(wrapper.attributes('style')).toBeUndefined()
    expect(warn).toHaveBeenCalledOnce()
  })
})

describe('CcmReel', () => {
  it('emits no inline style or data attributes for the defaults', () => {
    const wrapper = mount(CcmReel)
    expect(wrapper.attributes('style')).toBeUndefined()
    expect(wrapper.attributes('data-no-bar')).toBeUndefined()
  })

  it('maps itemWidth, height, space and noBar', () => {
    const wrapper = mount(CcmReel, {
      props: { itemWidth: '20rem', height: '50vh', space: 'l', noBar: true },
    })
    const style = wrapper.attributes('style')
    expect(style).toContain('--reel-item-width: 20rem')
    expect(style).toContain('--reel-height: 50vh')
    expect(style).toContain('--reel-space: var(--spacing-l)')
    expect(wrapper.attributes('data-no-bar')).toBe('')
  })

  it('renders list semantics when asked (as="ul")', () => {
    const wrapper = mount(CcmReel, {
      props: { as: 'ul' },
      slots: { default: '<li>a</li><li>b</li>' },
    })
    expect(wrapper.get('.ccm-reel').element.tagName).toBe('UL')
    expect(wrapper.findAll('li')).toHaveLength(2)
  })
})
