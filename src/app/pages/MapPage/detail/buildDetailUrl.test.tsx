import buildDetailUrl from './buildDetailUrl'

describe('return detail panel path', () => {
  const params = {
    type: 'foo',
    subtype: 'bar',
    id: 'baz',
  }

  it('should return a path starting with "/kaart/" when pathname includes "kaart"', () => {
    const locationSpy = jest
      .spyOn(window, 'location', 'get')
      .mockReturnValue({ pathname: '/kaart', search: '?foo=bar' } as Location)

    const location = buildDetailUrl(params)

    expect(location.pathname).toBe('/kaart/foo/bar/baz/')
    expect(location.search).toBe('?foo=bar')

    locationSpy.mockRestore()
  })

  it('should return a path starting with "/data/" when pathname includes "kaarten"', () => {
    const locationSpy = jest
      .spyOn(window, 'location', 'get')
      .mockReturnValue({ pathname: '/kaarten' } as Location)

    const location = buildDetailUrl(params)

    expect(location.pathname).toBe('/data/foo/bar/baz/')

    locationSpy.mockRestore()
  })

  it('should return a path starting with "/data/" when pathname does not include "kaart"', () => {
    const location = buildDetailUrl(params)

    expect(location.pathname).toBe('/data/foo/bar/baz/')
  })
})
