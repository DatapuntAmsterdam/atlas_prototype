import fetchByUri from './explosieven-gevrijwaard-gebied';
import getCenter from '../geo-json/geo-json';
import { rdToWgs84 } from '../coordinate-reference-system/crs-converter';

import { getByUrl } from '../api/api';

jest.mock('../geo-json/geo-json');
jest.mock('../api/api');
jest.mock('../coordinate-reference-system/crs-converter');

describe('The explosieven gevrijwaard gebied resource', () => {
  afterEach(() => {
    getByUrl.mockReset();
  });

  describe('By uri', () => {
    it('fetches a gevrijwaard gebied', () => {
      const uri = 'https://acc.api.data.amsterdam.nl/explosieven/gevrijwaardgebied/123456';

      getByUrl.mockReturnValueOnce(Promise.resolve({
        bron: 'source',
        datum: '1918-05-21',
        _display: 'GevrijwaardGebied display name 1',
        geometrie: { type: 'Point' },
        opmerkingen: 'Remarks',
        something: 'abc123'
      }));
      getCenter.mockImplementation(() => ({ x: 1, y: 2 }));
      rdToWgs84.mockImplementation(() => ({ latitude: 3, longitude: 4 }));

      const promise = fetchByUri(uri).then((response) => {
        expect(response).toEqual({
          bron: 'source',
          date: new Date('1918-05-21'),
          datum: '1918-05-21',
          _display: 'GevrijwaardGebied display name 1',
          geometrie: { type: 'Point' },
          label: 'GevrijwaardGebied display name 1',
          location: { latitude: 3, longitude: 4 },
          opmerkingen: 'Remarks',
          remarks: 'Remarks',
          something: 'abc123',
          source: 'source'
        });
      });

      expect(getByUrl).toHaveBeenCalledWith(uri);
      return promise;
    });

    it('fetches with empty result object', () => {
      const uri = 'https://acc.api.data.amsterdam.nl/explosieven/gevrijwaardgebied/123456';

      getByUrl.mockReturnValueOnce(Promise.resolve({}));

      const promise = fetchByUri(uri).then((response) => {
        expect(response).toEqual({
          date: null,
          label: undefined,
          location: null,
          remarks: undefined,
          source: undefined
        });
      });

      expect(getByUrl).toHaveBeenCalledWith(uri);
      return promise;
    });
  });
});
