import { describe, expect, it } from 'vitest'
import { CHANNEL_IDS, channelBrand, channelIds, resolveChannel } from '../../app/utils/channels'

describe('channel registry', () => {
  it('covers the union of both products (8 platforms)', () => {
    expect(channelIds()).toEqual([
      'instagram',
      'linkedin',
      'x',
      'facebook',
      'youtube',
      'tiktok',
      'google_my_business',
      'bluesky',
    ])
  })

  it('gives every entry a complete, well-formed identity', () => {
    for (const id of CHANNEL_IDS) {
      const info = channelBrand(id)
      expect(info.id).toBe(id)
      expect(info.label.length).toBeGreaterThan(0)
      expect(info.brandColor).toMatch(/^#[0-9A-Fa-f]{6}$/)
      expect(info.fg).toMatch(/^#[0-9A-Fa-f]{6}$/)
      expect(info.icon).toMatch(/^i-/)
    }
  })

  it('keeps the sanctioned brand hex values', () => {
    expect(channelBrand('instagram').brandColor).toBe('#E4405F')
    expect(channelBrand('linkedin').brandColor).toBe('#0A66C2')
    expect(channelBrand('youtube').brandColor).toBe('#FF0000')
    expect(channelBrand('facebook').brandColor).toBe('#1877F2')
    expect(channelBrand('bluesky').brandColor).toBe('#0285FF')
    expect(channelBrand('google_my_business').brandColor).toBe('#4285F4')
  })

  it('flags near-black marks as monochrome for dark-mode handling', () => {
    expect(channelBrand('x').monochrome).toBe(true)
    expect(channelBrand('tiktok').monochrome).toBe(true)
    expect(channelBrand('instagram').monochrome).toBe(false)
  })

  it('resolves case-insensitively and through separators', () => {
    expect(resolveChannel('Instagram')?.id).toBe('instagram')
    expect(resolveChannel('  LINKEDIN  ')?.id).toBe('linkedin')
    expect(resolveChannel('Google My Business')?.id).toBe('google_my_business')
    expect(resolveChannel('google-my-business')?.id).toBe('google_my_business')
  })

  it('maps legacy aliases to canonical ids', () => {
    expect(resolveChannel('twitter')?.id).toBe('x')
    expect(resolveChannel('Twitter')?.label).toBe('X')
    expect(resolveChannel('gmb')?.id).toBe('google_my_business')
  })

  it('returns undefined for unknown channels on strict resolve', () => {
    expect(resolveChannel('myspace')).toBeUndefined()
    expect(resolveChannel(null)).toBeUndefined()
    expect(resolveChannel('')).toBeUndefined()
  })

  it('does not leak prototype-chain keys from the plain-object registry', () => {
    expect(resolveChannel('constructor')).toBeUndefined()
    expect(resolveChannel('toString')).toBeUndefined()
    expect(channelBrand('constructor').id).toBeNull()
  })

  it('falls back to a neutral identity echoing the input (no hardcoded label)', () => {
    const unknown = channelBrand('myspace')
    expect(unknown.id).toBeNull()
    expect(unknown.label).toBe('myspace')
    expect(unknown.brandColor).toBe('#6b7280')
    expect(unknown.fg).toBe('#ffffff')

    expect(channelBrand(null).label).toBe('')
    expect(channelBrand(undefined).label).toBe('')
  })
})
