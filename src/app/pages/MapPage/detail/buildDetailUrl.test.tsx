import buildDetailUrl from './buildDetailUrl'

describe('return detail panel path', () => {
  it('should return a path starting with "/kaart/" when pathname includes "kaart"', () => {
    const locationSpy = jest.spyOn(window, 'location', 'get').mockReturnValue({
      ...window.location,
      ...{ pathname: '/kaart', search: '?foo=bar' },
    })

    const params = {
      type: 'foo',
      subtype: 'bar',
      id: 'baz',
    }

    const location = buildDetailUrl(params)

    expect(location.pathname).toBe('/kaart/foo/bar/baz/')
    expect(location.search).toBe('?foo=bar')

    locationSpy.mockRestore()
  })

  it('should return a path starting with "/data/" when pathname includes "kaarten"', () => {
    const locationSpy = jest.spyOn(window, 'location', 'get').mockReturnValue({
      ...window.location,
      ...{ pathname: '/kaarten' },
    })

    const params = {
      type: 'foo',
      subtype: 'bar',
      id: 'baz',
    }

    const location = buildDetailUrl(params)

    expect(location.pathname).toBe('/data/foo/bar/baz/')

    locationSpy.mockRestore()
  })

  it('should return a path starting with "/data/" when pathname does not include "kaart"', () => {
    const params = {
      type: 'foo',
      subtype: 'bar',
      id: 'baz',
    }

    const location = buildDetailUrl(params)

    expect(location.pathname).toBe('/data/foo/bar/baz/')
  })
})
