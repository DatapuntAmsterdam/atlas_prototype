import fetchByUri from './winkelgebied';
import getCenter from '../geo-json/geo-json';
import { rdToWgs84 } from '../coordinate-reference-system/crs-converter';

import { getByUrl } from '../api/api';

jest.mock('../geo-json/geo-json');
jest.mock('../api/api');
jest.mock('../coordinate-reference-system/crs-converter');

describe('The winkelgebied resource', () => {
  afterEach(() => {
    getByUrl.mockReset();
  });

  describe('By uri', () => {
    it('fetches a winkelgebied', () => {
      const uri = 'https://acc.api.data.amsterdam.nl/vsd/winkgeb/123456';
      const winkelgebiedMock = {
        _display: 'straat',
        categorie: 'String',
        categorie_naam: 'Foo',
        wkb_geometry: { type: 'Point' }
      };
      getByUrl.mockReturnValueOnce(Promise.resolve(winkelgebiedMock));
      getCenter.mockImplementation(() => ({ x: 1, y: 2 }));
      rdToWgs84.mockImplementation(() => ({ latitude: 3, longitude: 4 }));

      const promise = fetchByUri(uri).then((response) => {
        expect(response).toEqual({
          label: winkelgebiedMock._display,
          category: `${winkelgebiedMock.categorie_naam} (${winkelgebiedMock.categorie})`,
          location: { latitude: 3, longitude: 4 },
          geometrie: winkelgebiedMock.wkb_geometry
        });
      });

      expect(getByUrl).toHaveBeenCalledWith(uri);
      return promise;
    });

    it('fetches with empty result object', () => {
      const uri = 'https://acc.api.data.amsterdam.nl/vsd/winkgeb/123456';

      getByUrl.mockReturnValueOnce(Promise.resolve({}));

      const promise = fetchByUri(uri).then((response) => {
        expect(response).toEqual({
          label: undefined,
          category: null,
          location: null,
          geometrie: undefined
        });
      });

      expect(getByUrl).toHaveBeenCalledWith(uri);
      return promise;
    });
  });
});
