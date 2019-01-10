import fetchByUri from './gebieden-grootstedelijk';
import getCenter from '../geo-json/geo-json';
import { rdToWgs84 } from '../coordinate-reference-system/crs-converter';

import { getByUrl } from '../api/api';

jest.mock('../geo-json/geo-json');
jest.mock('../api/api');
jest.mock('../coordinate-reference-system/crs-converter');

describe('The gebieden grootstedelijk resource', () => {
  afterEach(() => {
    getByUrl.mockReset();
  });

  describe('By uri', () => {
    it('fetches a grootstedelijk', () => {
      const uri = 'https://acc.api.data.amsterdam.nl/gebieden/grootstedelijk/123456';

      getByUrl.mockReturnValueOnce(Promise.resolve({
        _display: 'Grootstedelijk display name 1',
        geometrie: { type: 'Point' },
        something: 'abc123'
      }));
      getCenter.mockImplementation(() => ({ x: 1, y: 2 }));
      rdToWgs84.mockImplementation(() => ({ latitude: 3, longitude: 4 }));

      const promise = fetchByUri(uri).then((response) => {
        expect(response).toEqual({
          _display: 'Grootstedelijk display name 1',
          geometrie: { type: 'Point' },
          label: 'Grootstedelijk display name 1',
          location: { latitude: 3, longitude: 4 },
          something: 'abc123'
        });
      });

      expect(getByUrl).toHaveBeenCalledWith(uri);
      return promise;
    });

    it('fetches with empty result object', () => {
      const uri = 'https://acc.api.data.amsterdam.nl/gebieden/grootstedelijk/123456';

      getByUrl.mockReturnValueOnce(Promise.resolve({}));

      const promise = fetchByUri(uri).then((response) => {
        expect(response).toEqual({
          label: undefined,
          location: null
        });
      });

      expect(getByUrl).toHaveBeenCalledWith(uri);
      return promise;
    });
  });
});
