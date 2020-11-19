import { createUrlWithToken, fetchWithToken, fetchProxy } from './api'
import * as auth from '../auth/auth'

jest.mock('../auth/auth', () => jest.requireActual('../auth/auth'))

const getAuthHeadersSpy = jest.spyOn(auth, 'getAuthHeaders').mockImplementation(() => ({}))

describe('Api service', () => {
  beforeEach(global.fetch.resetMocks)

  afterEach(() => {
    getAuthHeadersSpy.mockReset()
  })

  describe('fetchWithToken', () => {
    const response = {
      data: 'hello',
    }

    it('should return the response from fetch', async () => {
      global.fetch.mockResponseOnce(JSON.stringify(response))

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
      global.fetch.mockResponseOnce(JSON.stringify(response), { status: 503 })

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
      global.fetch.mockResponseOnce(JSON.stringify(response))

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

      expect('signal' in global.fetch.mock.calls[0][1]).toBe(true)
      expect(global.fetch.mock.calls[0][1].headers.get('Authorization')).toEqual(
        'Bearer token12345',
      )
    })

    it('should pass custom headers along', async () => {
      global.fetch.mockResponseOnce(JSON.stringify(response))

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

      expect(global.fetch.mock.calls[0][1].headers.get('Test')).toEqual('foo')
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

  describe('fetchProxy', () => {
    beforeEach(() => {
      global.fetch.resetMocks()
      global.fetch.mockResponse(JSON.stringify({ foo: 'bar' }))
      getAuthHeadersSpy.mockImplementation(() => ({ Authorization: 'Bearer something' }))
    })

    it('should perform request', async () => {
      expect(global.fetch).not.toHaveBeenCalled()

      const url = 'https://www.domain.com/'
      const response = await fetchProxy(url)

      expect(global.fetch).toHaveBeenCalledWith(
        url,
        expect.objectContaining({ headers: expect.anything() }),
      )
      expect(response).toEqual({ foo: 'bar' })
    })

    it('should append query string to request URL', async () => {
      expect(global.fetch).not.toHaveBeenCalled()

      const searchParams = {
        foo: 'bar',
        qux: 'zork',
      }
      const url = 'https://www.domain2.com/'
      await fetchProxy(url, { searchParams })

      expect(global.fetch).toHaveBeenCalledWith(
        expect.stringContaining('foo=bar&qux=zork'),
        expect.objectContaining({ headers: expect.anything() }),
      )
    })

    it('should append query string to request URL with search params', async () => {
      expect(global.fetch).not.toHaveBeenCalled()

      const searchParams = {
        foo: 'bar',
        qux: 'zork',
      }
      const url = 'https://www.domain2.com?filter=a&page=1'
      await fetchProxy(url, { searchParams })

      expect(global.fetch).toHaveBeenCalledWith(
        expect.stringContaining('filter=a&page=1&foo=bar&qux=zork'),
        expect.objectContaining({ headers: expect.anything() }),
      )
    })

    it('should append auth headers to request', async () => {
      expect(global.fetch).not.toHaveBeenCalled()

      const url = 'https://www.domain3.com/'
      const rawHeaders = {
        'Content-Type': 'application/json',
      }
      await fetchProxy(url, { headers: rawHeaders })

      const headers = new Headers({ ...rawHeaders, Authorization: 'Bearer something' })
      const requestHeader = [...global.fetch.mock.calls[0][1].headers.entries()]

      expect([...headers.entries()]).toEqual(requestHeader)
      expect(global.fetch).toHaveBeenCalledWith(
        url,
        expect.objectContaining({ headers: expect.anything() }),
      )
    })
  })
})
