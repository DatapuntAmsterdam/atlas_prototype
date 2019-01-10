import fetchByUri from './adressen-pand';
import getCenter from '../geo-json/geo-json';
import { rdToWgs84 } from '../coordinate-reference-system/crs-converter';

import { getByUrl } from '../api/api';

jest.mock('../geo-json/geo-json');
jest.mock('../api/api');
jest.mock('../coordinate-reference-system/crs-converter');

describe('The adressen pand resource', () => {
  afterEach(() => {
    getByUrl.mockReset();
  });

  describe('By uri', () => {
    it('fetches a pand', () => {
      const uri = 'https://acc.api.data.amsterdam.nl/bag/pand/123456';

      getByUrl.mockReturnValueOnce(Promise.resolve({
        _display: 'Pand display name 1',
        geometrie: { type: 'Point' },
        oorspronkelijk_bouwjaar: '1893',
        pandnaam: 'Gebouw!',
        something: 'abc123',
        status: {
          code: '01',
          omschrijving: 'Status description'
        }
      }));
      getCenter.mockImplementation(() => ({ x: 1, y: 2 }));
      rdToWgs84.mockImplementation(() => ({ latitude: 3, longitude: 4 }));

      const promise = fetchByUri(uri).then((response) => {
        expect(response).toEqual({
          _display: 'Pand display name 1',
          geometrie: { type: 'Point' },
          label: 'Pand display name 1',
          pandnaam: 'Gebouw!',
          location: { latitude: 3, longitude: 4 },
          oorspronkelijk_bouwjaar: '1893',
          something: 'abc123',
          status: {
            code: '01',
            description: 'Status description'
          },
          year: '1893',
          name: 'Gebouw!'
        });
      });

      expect(getByUrl).toHaveBeenCalledWith(uri);
      return promise;
    });

    it('changes the value (indicating the year is unkown) to the empty string', () => {
      const uri = 'https://acc.api.data.amsterdam.nl/bag/pand/123456';

      getByUrl.mockReturnValueOnce(Promise.resolve({ oorspronkelijk_bouwjaar: '1005' }));

      return fetchByUri(uri).then((response) => {
        expect(response.year).toBe('');
      });
    });

    it('fetches with empty result object', () => {
      const uri = 'https://acc.api.data.amsterdam.nl/bag/pand/123456';

      getByUrl.mockReturnValueOnce(Promise.resolve({}));

      const promise = fetchByUri(uri).then((response) => {
        expect(response).toEqual({
          _display: undefined,
          label: undefined,
          location: null,
          status: {
            code: '',
            description: ''
          },
          year: undefined
        });
      });

      expect(getByUrl).toHaveBeenCalledWith(uri);
      return promise;
    });
  });
});
