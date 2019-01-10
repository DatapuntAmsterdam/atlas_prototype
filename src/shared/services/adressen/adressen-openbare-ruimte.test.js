import fetchByUri from './adressen-openbare-ruimte';
import getCenter from '../geo-json/geo-json';
import { rdToWgs84 } from '../coordinate-reference-system/crs-converter';

import { getByUrl } from '../api/api';

jest.mock('../geo-json/geo-json');
jest.mock('../api/api');
jest.mock('../coordinate-reference-system/crs-converter');

describe('The adressen openbare ruimte resource', () => {
  afterEach(() => {
    getByUrl.mockReset();
  });

  describe('By uri', () => {
    it('fetches an openbare ruimte', () => {
      const uri = 'https://acc.api.data.amsterdam.nl/bag/openbareruimte/123456';

      getByUrl.mockReturnValueOnce(Promise.resolve({
        _display: 'Korte Oude Nieuwe Kromme Lange Hoogstraat',
        geometrie: { type: 'Point' },
        something: 'abc123',
        status: {
          code: '01',
          omschrijving: 'Status description'
        },
        naam_24_posities: 'Ko Ou Ni Kr La Hoogstr'
      }));
      getCenter.mockImplementation(() => ({ x: 1, y: 2 }));
      rdToWgs84.mockImplementation(() => ({ latitude: 3, longitude: 4 }));

      const promise = fetchByUri(uri).then((response) => {
        expect(response).toEqual({
          _display: 'Korte Oude Nieuwe Kromme Lange Hoogstraat',
          geometrie: { type: 'Point' },
          label: 'Korte Oude Nieuwe Kromme Lange Hoogstraat',
          location: { latitude: 3, longitude: 4 },
          something: 'abc123',
          status: {
            code: '01',
            description: 'Status description'
          },
          naam_24_posities: 'Ko Ou Ni Kr La Hoogstr',
          nenName: 'Ko Ou Ni Kr La Hoogstr'
        });
      });

      expect(getByUrl).toHaveBeenCalledWith(uri);
      return promise;
    });

    it('fetches with empty result object', () => {
      const uri = 'https://acc.api.data.amsterdam.nl/bag/openbareruimte/123456';

      getByUrl.mockReturnValueOnce(Promise.resolve({}));

      const promise = fetchByUri(uri).then((response) => {
        expect(response).toEqual({
          label: undefined,
          location: null,
          status: {
            code: '',
            description: ''
          },
          nenName: ''
        });
      });

      expect(getByUrl).toHaveBeenCalledWith(uri);
      return promise;
    });
  });
});
