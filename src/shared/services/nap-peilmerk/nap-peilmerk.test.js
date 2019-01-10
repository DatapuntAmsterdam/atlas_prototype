import fetchByUri from './nap-peilmerk';
import getCenter from '../geo-json/geo-json';
import { rdToWgs84 } from '../coordinate-reference-system/crs-converter';

import { getByUrl } from '../api/api';

jest.mock('../geo-json/geo-json');
jest.mock('../api/api');
jest.mock('../coordinate-reference-system/crs-converter');

describe('The NAP peilmerk resource', () => {
  afterEach(() => {
    getByUrl.mockReset();
  });

  describe('By uri', () => {
    it('fetches a NAP peilmerk', () => {
      const uri = 'https://acc.api.data.amsterdam.nl/nap/peilmerk/123456';

      getByUrl.mockReturnValueOnce(Promise.resolve({
        geometrie: { type: 'Point' },
        hoogte_nap: '2.1502',
        jaar: 2007,
        windrichting: 'W',
        x_muurvlak: '1',
        y_muurvlak: '2',
        omschrijving: 'NAP peilmerk description',
        peilmerkidentificatie: 'NAP peilmerk display name 1',
        something: 'abc123'
      }));
      getCenter.mockImplementation(() => ({ x: 1, y: 2 }));
      rdToWgs84.mockImplementation(() => ({ latitude: 3, longitude: 4 }));

      const promise = fetchByUri(uri).then((response) => {
        expect(response).toEqual({
          description: 'NAP peilmerk description',
          geometrie: { type: 'Point' },
          height: 2.1502,
          hoogte_nap: '2.1502',
          jaar: 2007,
          windrichting: 'W',
          x_muurvlak: '1',
          y_muurvlak: '2',
          label: 'NAP peilmerk display name 1',
          location: { latitude: 3, longitude: 4 },
          omschrijving: 'NAP peilmerk description',
          peilmerkidentificatie: 'NAP peilmerk display name 1',
          something: 'abc123',
          year: 2007,
          windDirection: 'W',
          wallCoordinates: [
            1, 2
          ]
        });
      });

      expect(getByUrl).toHaveBeenCalledWith(uri);
      return promise;
    });

    it('fetches with empty result object', () => {
      const uri = 'https://acc.api.data.amsterdam.nl/nap/peilmerk/123456';

      getByUrl.mockReturnValueOnce(Promise.resolve({}));

      const promise = fetchByUri(uri).then((response) => {
        expect(response).toEqual({
          description: undefined,
          height: NaN,
          label: undefined,
          location: null,
          year: undefined,
          windDirection: undefined,
          wallCoordinates: undefined
        });
      });

      expect(getByUrl).toHaveBeenCalledWith(uri);
      return promise;
    });
  });
});
