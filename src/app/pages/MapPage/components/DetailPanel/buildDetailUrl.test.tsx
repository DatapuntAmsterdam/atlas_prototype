import buildDetailUrl from './buildDetailUrl'

describe('buildDetailUrl', () => {
  it('preserves the search query', () => {
    const search = '?foo=bar'
    const locationSpy = jest
      .spyOn(window, 'location', 'get')
      .mockReturnValue({ pathname: '', search } as Location)

    const params = {
      type: 'foo',
      subtype: 'bar',
      id: 'baz',
    }

    expect(buildDetailUrl(params).search).toBe(search)

    locationSpy.mockRestore()
  })
})
