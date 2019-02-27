import fetchByUri from './parkeervak';
import getCenter from '../geo-json/geo-json';
import { rdToWgs84 } from '../coordinate-reference-system/crs-converter';

import { getByUrl } from '../api/api';

jest.mock('../geo-json/geo-json');
jest.mock('../api/api');
jest.mock('../coordinate-reference-system/crs-converter');

fdescribe('The parkeervak resource', () => {
  afterEach(() => {
    getByUrl.mockReset();
  });

  describe('By uri', () => {
    it('fetches a parkeervak', () => {
      const uri = 'https://acc.api.data.amsterdam.nl/parkeervakken/parkeervakken/123456';
      const parkeervakMock = {
        straatnaam: 'straat',
        type: 'type',
        bord: 'bord',
        geometrie: { type: 'Point' }
      };
      getByUrl.mockReturnValueOnce(Promise.resolve(parkeervakMock));
      getCenter.mockImplementation(() => ({ x: 1, y: 2 }));
      rdToWgs84.mockImplementation(() => ({ latitude: 3, longitude: 4 }));

      const promise = fetchByUri(uri).then((response) => {
        expect(response).toEqual({
          ...parkeervakMock,
          location: { latitude: 3, longitude: 4 }
        });
      });

      expect(getByUrl).toHaveBeenCalledWith(uri);
      return promise;
    });

    it('fetches with empty result object', () => {
      const uri = 'https://acc.api.data.amsterdam.nl/parkeervakken/parkeervakken/123456';

      getByUrl.mockReturnValueOnce(Promise.resolve({}));

      const promise = fetchByUri(uri).then((response) => {
        expect(response).toEqual({
          straatnaam: undefined,
          type: undefined,
          bord: undefined,
          location: null
        });
      });

      expect(getByUrl).toHaveBeenCalledWith(uri);
      return promise;
    });
  });
});
