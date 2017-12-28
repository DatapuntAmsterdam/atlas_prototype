import fetchByUri from './maatschappelijke-activiteit';
import { getAuthHeaders } from '../auth/auth';

jest.mock('../auth/auth');

describe('The maatschappelijke activiteit resource', () => {
  beforeEach(() => {
    getAuthHeaders.mockImplementation(() => ({
      Authorization: 'Bearer 123AccessToken'
    }));
  });

  afterEach(() => {
    fetch.mockReset();
  });

  describe('By uri', () => {
    it('fetches a maatschappelijke activiteit', () => {
      const uri = 'https://acc.api.data.amsterdam.nl/handelsregister/maatschappelijkeactiviteit/123456';

      fetch.mockResponseOnce(JSON.stringify({
        _display: 'Maatschappelijke activiteit display name 1'
      }));

      const promise = fetchByUri(uri).then((response) => {
        expect(response).toEqual({
          _display: 'Maatschappelijke activiteit display name 1'
        });
      });

      expect(fetch.mock.calls[0][0]).toBe(uri);
      expect(fetch.mock.calls[0][1]).toEqual({ headers: { Authorization: 'Bearer 123AccessToken' } });
      return promise;
    });
  });
});
