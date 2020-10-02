import toSlug from './toSlug'

describe('toSlug', () => {
  it('should return a sluggified version from a string', () => {
    expect(toSlug('A title ? With (special) 0 characters ! - #')).toBe(
      'a-title-with-special-0-characters',
    )

    expect(toSlug('-A string with --- multiple -- dashes-')).toBe('a-string-with-multiple-dashes')
    expect(toSlug(' A string with a leading space')).toBe('a-string-with-a-leading-space')
  })
})
