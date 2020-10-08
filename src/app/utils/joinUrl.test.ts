import joinUrl from './joinUrl'

describe('joinUrl', () => {
  it('joins multiple paths together', () => {
    expect(joinUrl(['http://example.com', 'foo//', '//bar', '/baz/'])).toEqual(
      'http://example.com/foo/bar/baz',
    )
  })

  it('adds a trailing slash at the end', () => {
    expect(joinUrl(['http://example.com', 'foo//', '//bar', '/baz/'], true)).toEqual(
      'http://example.com/foo/bar/baz/',
    )
  })
})
