import isIgnoredPath from './isIgnoredPath'

describe('isIgnoredPath', () => {
  it('ignores paths', () => {
    expect(isIgnoredPath('/kaart/someting')).toBe(true)
    expect(isIgnoredPath('/bouwdossiers/something')).toBe(true)
  })

  it('does not ignore paths with "kaarten"', () => {
    expect(isIgnoredPath('kaart/kaarten')).toBe(false)
  })
})
