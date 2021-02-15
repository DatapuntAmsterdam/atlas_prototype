import isObject from './is-object'

describe('is object', () => {
  it('returns true', () => {
    expect(isObject({ foo: 'bar' })).toBe(true)
  })

  it('returns false', () => {
    expect(isObject(null)).toBe(false)
    expect(isObject(5)).toBe(false)
    expect(isObject('')).toBe(false)
    expect(isObject([])).toBe(false)
  })
})
