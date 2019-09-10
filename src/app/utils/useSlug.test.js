import useSlug from './useSlug'

describe('useSlug', () => {
  it('should return a sluggified version from a string', () => {
    expect(useSlug('A title ? With (special) 0 characters ! - #')).toBe(
      'a-title-with-special-0-characters',
    )

    expect(useSlug('-A string with --- multiple -- slashes-')).toBe(
      'a-string-with-multiple-slashes',
    )
    expect(useSlug(' A string with a leading space')).toBe('a-string-with-a-leading-space')
  })
})
