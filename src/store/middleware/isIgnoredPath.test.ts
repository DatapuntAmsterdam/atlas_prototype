import isIgnoredPath from './isIgnoredPath'

describe('isIgnoredPath', () => {
  it('ignores paths', () => {
    expect(isIgnoredPath('/data')).toBe(true)
    expect(isIgnoredPath('/data/geozoek')).toBe(true)
    expect(isIgnoredPath('/data/bag/adressen')).toBe(true)
    expect(isIgnoredPath('/data/hr/vestigingen')).toBe(true)
    expect(isIgnoredPath('/data/brk/kadastrale-objecten')).toBe(true)
    expect(isIgnoredPath('/data/foo/bar/baz')).toBe(true) // detail page
  })

  it('does not ignore paths', () => {
    expect(isIgnoredPath('data/kaarten')).toBe(false)
    expect(isIgnoredPath('data/zoek')).toBe(false)
    expect(isIgnoredPath('data/artikelen/artikel/123')).toBe(false)
  })
})
