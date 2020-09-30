import joinUrl from './joinUrl'

describe('joinUrl', () => {
  it('should join multiple paths together', () => {
    expect(joinUrl(['http://example.com', 'foo//', '//bar', '/baz/'])).toEqual(
      'http://example.com/foo/bar/baz/',
    )
  })

  it('should not add a trailing slash', () => {
    expect(joinUrl(['http://example.com', 'foo//', '//bar', '/baz/'], false)).toEqual(
      'http://example.com/foo/bar/baz',
    )
  })
})
