// jsdom has neither navigator.clipboard nor document.execCommand, so both
// paths are exercised through explicit mocks.
import { afterEach, describe, expect, it, vi } from 'vitest'
import { copyToClipboard } from '../../app/utils/clipboard'
import { useClipboard } from '../../app/composables/useClipboard'

function mockClipboard(writeText: (text: string) => Promise<void>) {
  Object.defineProperty(navigator, 'clipboard', {
    value: { writeText },
    configurable: true,
  })
}

function unmockClipboard() {
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  delete (navigator as any).clipboard
}

afterEach(() => {
  unmockClipboard()
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  delete (document as any).execCommand
  vi.restoreAllMocks()
})

describe('copyToClipboard', () => {
  it('uses navigator.clipboard.writeText when available', async () => {
    const writeText = vi.fn().mockResolvedValue(undefined)
    mockClipboard(writeText)

    await expect(copyToClipboard('hello')).resolves.toBe(true)
    expect(writeText).toHaveBeenCalledWith('hello')
  })

  it('falls back to the hidden-textarea path when writeText rejects', async () => {
    mockClipboard(vi.fn().mockRejectedValue(new Error('denied')))
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    ;(document as any).execCommand = vi.fn().mockReturnValue(true)

    await expect(copyToClipboard('fallback')).resolves.toBe(true)
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    expect((document as any).execCommand).toHaveBeenCalledWith('copy')
    // the temporary textarea must not leak into the DOM
    expect(document.querySelector('textarea')).toBeNull()
  })

  it('returns false (never throws) when both paths fail', async () => {
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    ;(document as any).execCommand = vi.fn(() => {
      throw new Error('unsupported')
    })

    await expect(copyToClipboard('nope')).resolves.toBe(false)
    expect(document.querySelector('textarea')).toBeNull()
  })
})

describe('useClipboard', () => {
  it('exposes the util as `copy` (Social House call-site shape)', async () => {
    const writeText = vi.fn().mockResolvedValue(undefined)
    mockClipboard(writeText)

    const { copy } = useClipboard()
    await expect(copy('via composable')).resolves.toBe(true)
    expect(writeText).toHaveBeenCalledWith('via composable')
  })
})
