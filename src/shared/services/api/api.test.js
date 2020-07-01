import { createUrlWithToken, fetchWithToken } from './api'

describe('Api service', () => {
  describe('fetchWithToken', () => {
    beforeEach(() => {
      fetch.resetMocks()
    })

    const response = {
      data: 'hello',
    }

    it('should return the response from fetch', async () => {
      fetch.mockResponseOnce(JSON.stringify(response))

      const result = await fetchWithToken(
        'http://localhost/',
        {
          entryOne: 'foo',
          entryTwo: 'bar',
        },
        undefined,
        undefined,
        undefined,
        '',
      )

      expect(result).toEqual(response)
    })

    it('should not return the response from fetch when service is unavailable', async () => {
      fetch.mockResponseOnce(JSON.stringify(response), { status: 503 })

      return expect(
        fetchWithToken(
          'http://localhost/',
          {
            entryOne: 'foo',
            entryTwo: 'bar',
          },
          undefined,
          undefined,
          undefined,
          '',
        ),
      ).rejects.toThrow('Service Unavailable')
    })

    it('should pass a signal: true to fetch options and add the token to the header', async () => {
      fetch.mockResponseOnce(JSON.stringify(response))

      const controller = new AbortController()
      const { signal } = controller

      await fetchWithToken(
        'http://localhost/',
        {
          entryOne: 'foo',
          entryTwo: 'bar',
        },
        signal,
        undefined,
        undefined,
        'token12345',
      )

      expect('signal' in fetch.mock.calls[0][1]).toBe(true)
      expect(fetch.mock.calls[0][1].headers.get('Authorization')).toEqual('Bearer token12345')
    })

    it('should pass custom headers along', async () => {
      fetch.mockResponseOnce(JSON.stringify(response))

      const headers = new Headers({
        Test: 'foo',
      })

      await fetchWithToken(
        'http://localhost/',
        undefined,
        undefined,
        undefined,
        headers,
        'token12345',
      )

      expect(fetch.mock.calls[0][1].headers.get('Test')).toEqual('foo')
    })
  })

  describe('createUrlWithToken', () => {
    it('should create an url with authorization token', () => {
      const result = createUrlWithToken('http://localhost?foo=data', 'token1234')

      expect(result).toEqual('http://localhost/?foo=data&access_token=token1234')
    })

    it('should create an url without authorization token', () => {
      const result = createUrlWithToken('http://localhost?foo=data', '')

      expect(result).toEqual('http://localhost/?foo=data')
    })
  })
})
