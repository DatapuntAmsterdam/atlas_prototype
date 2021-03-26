import buildDetailUrl from './buildDetailUrl'

function mockLocation(location: { pathname: string; search: string }) {
  beforeEach(() => {
    jest.spyOn(window, 'location', 'get').mockReturnValue({
      ...window.location,
      ...location,
    })
  })
}

describe('return detail panel path for paths containing "kaart"', () => {
  mockLocation({ pathname: '/kaart', search: '?foo=bar' })

  it('should return a path starting with "/kaart/" when pathname includes "kaart"', () => {
    const params = {
      type: 'foo',
      subtype: 'bar',
      id: 'baz',
    }

    const location = buildDetailUrl(params)

    expect(location.pathname).toBe('/kaart/foo/bar/baz/')
    expect(location.search).toBe('?foo=bar')
  })
})

describe('return detail panel path for paths not containing "kaart"', () => {
  mockLocation({ pathname: '', search: '?foo=bar' })

  it('should return a path starting with "/data/" when pathname does not include "kaart"', () => {
    const params = {
      type: 'foo',
      subtype: 'bar',
      id: 'baz',
    }

    const location = buildDetailUrl(params)

    expect(location.pathname).toBe('/data/foo/bar/baz/')
    expect(location.search).toBe('?foo=bar')
  })
})
