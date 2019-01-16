import { generateParams, createUrlWithToken, getWithToken } from './api';

describe('Api service', () => {
  describe('generateParams', () => {
    it('should create a url query from an object', () => {
      expect(generateParams({
        entryOne: 'foo',
        entryTwo: 'bar'
      })).toEqual('entryOne=foo&entryTwo=bar');
    });
  });

  describe('getWithToken', () => {
    beforeEach(() => {
      fetch.resetMocks();
    });

    const response = {
      data: 'hello'
    };

    it('should return the response from fetch', async () => {
      fetch.mockResponseOnce(JSON.stringify(response));

      const result = await getWithToken(
        'http://localhost/',
        {
          entryOne: 'foo',
          entryTwo: 'bar'
        },
        false,
        'token12345'
      );

      expect(result).toEqual(response);
    });

    it('should not return the response from fetch when service is unavailable', async () => {
      fetch.mockResponseOnce(JSON.stringify(response), { status: 503 });

      expect(getWithToken(
        'http://localhost/',
        {
          entryOne: 'foo',
          entryTwo: 'bar'
        },
        false,
        'token12345'
      )).rejects.toThrow('Service Unavailable');
    });

    it('should pass a signal: true to fetch options and add the token to the header', async () => {
      fetch.mockResponseOnce(JSON.stringify(response));

      await getWithToken(
        'http://localhost/',
        {
          entryOne: 'foo',
          entryTwo: 'bar'
        },
        true,
        'token12345'
      );

      expect('signal' in fetch.mock.calls[0][1]).toBe(true);
      expect(fetch.mock.calls[0][1].headers).toEqual({
        Authorization: 'Bearer token12345'
      });
    });
  });

  describe('createUrlWithToken', () => {
    it('should create an url with authorization token', () => {
      const result = createUrlWithToken('http://localhost?foo=data', 'token1234');

      expect(result).toEqual('http://localhost?foo=data&access_token=token1234');
    });

    it('should create an url without authorization token', () => {
      const result = createUrlWithToken('http://localhost?foo=data', '');

      expect(result).toEqual('http://localhost?foo=data');
    });
  });
});
