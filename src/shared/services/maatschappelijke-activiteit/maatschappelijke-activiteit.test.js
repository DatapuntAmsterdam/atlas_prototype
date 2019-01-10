import fetchByUri from './maatschappelijke-activiteit';
import { getByUrl } from '../api/api';

jest.mock('../api/api');

describe('The maatschappelijke activiteit resource', () => {
  afterEach(() => {
    getByUrl.mockReset();
  });

  describe('By uri', () => {
    it('fetches a maatschappelijke activiteit', () => {
      const uri = 'https://acc.api.data.amsterdam.nl/handelsregister/maatschappelijkeactiviteit/123456';

      getByUrl.mockReturnValueOnce(Promise.resolve({
        _display: 'Maatschappelijke activiteit display name 1'
      }));

      const promise = fetchByUri(uri).then((response) => {
        expect(response).toEqual({
          _display: 'Maatschappelijke activiteit display name 1'
        });
      });

      expect(getByUrl).toHaveBeenCalledWith(uri);
      return promise;
    });
  });
});
