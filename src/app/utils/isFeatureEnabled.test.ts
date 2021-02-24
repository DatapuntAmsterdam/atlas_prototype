import isFeatureEnabled from './isFeatureEnabled'

describe('isFeatureEnabled', () => {
  beforeEach(() => localStorage.clear())

  it('detects an enabled feature', () => {
    localStorage.setItem('features', JSON.stringify(['foo']))
    expect(isFeatureEnabled('foo')).toBe(true)
  })

  it('detects a disabled feature', () => {
    expect(isFeatureEnabled('foo')).toBe(false)
  })

  it('handles invalid values', () => {
    localStorage.setItem('features', 'NOPE')
    expect(isFeatureEnabled('foo')).toBe(false)

    localStorage.setItem('features', JSON.stringify({ value: 'NOT AN ARRAY' }))
    expect(isFeatureEnabled('foo')).toBe(false)
  })
})
