import fetchByUri from './gebieden-buurt';
import getCenter from '../geo-json/geo-json';
import { rdToWgs84 } from '../coordinate-reference-system/crs-converter';

import { getByUrl } from '../api/api';

jest.mock('../geo-json/geo-json');
jest.mock('../api/api');
jest.mock('../coordinate-reference-system/crs-converter');

describe('The gebieden buurt resource', () => {
  afterEach(() => {
    getByUrl.mockReset();
  });

  describe('By uri', () => {
    it('fetches a buurt', () => {
      const uri = 'https://acc.api.data.amsterdam.nl/gebieden/buurt/123456';

      getByUrl.mockReturnValueOnce(Promise.resolve({
        geometrie: { type: 'Point' },
        naam: 'Buurt display name 1',
        volledige_code: 'A',
        something: 'abc123'
      }));
      getCenter.mockImplementation(() => ({ x: 1, y: 2 }));
      rdToWgs84.mockImplementation(() => ({ latitude: 3, longitude: 4 }));

      const promise = fetchByUri(uri).then((response) => {
        expect(response).toEqual({
          geometrie: { type: 'Point' },
          label: 'Buurt display name 1',
          location: { latitude: 3, longitude: 4 },
          naam: 'Buurt display name 1',
          volledige_code: 'A',
          volledigeCode: 'A',
          something: 'abc123'
        });
      });

      expect(getByUrl).toHaveBeenCalledWith(uri);
      return promise;
    });

    it('fetches with empty result object', () => {
      const uri = 'https://acc.api.data.amsterdam.nl/gebieden/buurt/123456';

      getByUrl.mockReturnValueOnce(Promise.resolve({}));

      const promise = fetchByUri(uri).then((response) => {
        expect(response).toEqual({
          label: undefined,
          volledigeCode: undefined,
          location: null
        });
      });

      expect(getByUrl).toHaveBeenCalledWith(uri);
      return promise;
    });
  });
});
