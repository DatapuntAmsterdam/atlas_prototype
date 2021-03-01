import {
  disableFeature,
  enableFeature,
  getEnabledFeatures,
  isFeatureEnabled,
  STORAGE_KEY,
} from './features'

describe('getEnabledFeatures', () => {
  beforeEach(() => localStorage.clear())

  it('gets the enabled features', () => {
    enableFeature('foo')
    enableFeature('bar')

    expect(getEnabledFeatures()).toEqual(['foo', 'bar'])
  })

  it('handles invalid values', () => {
    localStorage.setItem(STORAGE_KEY, 'NOPE')
    expect(getEnabledFeatures()).toEqual([])

    localStorage.setItem(STORAGE_KEY, JSON.stringify({ value: 'NOT AN ARRAY' }))
    expect(getEnabledFeatures()).toEqual([])
  })
})

describe('isFeatureEnabled', () => {
  beforeEach(() => localStorage.clear())

  it('detects an enabled feature', () => {
    enableFeature('foo')

    expect(isFeatureEnabled('foo')).toBe(true)
  })

  it('detects a disabled feature', () => {
    expect(isFeatureEnabled('foo')).toBe(false)
  })
})

describe('enableFeature', () => {
  beforeEach(() => localStorage.clear())

  it('enables a feature', () => {
    enableFeature('foo')
    enableFeature('foo')
    enableFeature('bar')

    expect(getEnabledFeatures()).toEqual(['foo', 'bar'])
  })
})

describe('disableFeature', () => {
  beforeEach(() => localStorage.clear())

  it('disables a feature', () => {
    enableFeature('bar')
    enableFeature('foo')
    disableFeature('bar')

    expect(getEnabledFeatures()).toEqual(['foo'])
  })
})
