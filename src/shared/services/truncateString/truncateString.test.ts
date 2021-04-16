import truncateString from './truncateString'

describe('truncateString', () => {
  it('should shorten the string is exceeds the max characters', () => {
    expect(truncateString('foofoofoo', 6)).toBe('foofoo...')
  })

  it('should return the string if it doesnt exceeds the max characters', () => {
    expect(truncateString('foofoofoo', 9)).toBe('foofoofoo')
  })
})
