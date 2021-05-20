import isIgnoredPath from './isIgnoredPath'
import * as featureToggle from '../../app/features'

describe('isIgnoredPath', () => {
  it('does not ignore paths without feature toggle enabled', () => {
    expect(isIgnoredPath('/data')).toBe(false)
    expect(isIgnoredPath('/data/geozoek')).toBe(false)
    expect(isIgnoredPath('/data/bag/adressen')).toBe(false)
    expect(isIgnoredPath('/data/hr/vestigingen')).toBe(false)
    expect(isIgnoredPath('/data/brk/kadastrale-objecten')).toBe(false)
    expect(isIgnoredPath('/data/foo/bar/baz')).toBe(false) // detail page
  })

  it('ignores paths with feature toggle enabled', () => {
    jest.spyOn(featureToggle, 'isFeatureEnabled').mockReturnValueOnce(true)
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
