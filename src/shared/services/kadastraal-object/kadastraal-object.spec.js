import fetchByUri from './kadastraal-object';
import getCenter from '../geo-json/geo-json';
import { rdToWgs84 } from '../coordinate-reference-system/crs-converter';

jest.mock('../geo-json/geo-json');
jest.mock('../coordinate-reference-system/crs-converter');

describe('The kadastraal object resource', () => {
  afterEach(() => {
    fetch.mockReset();
  });

  describe('By uri', () => {
    it('fetches a kadastraal object', () => {
      const uri = 'https://acc.api.data.amsterdam.nl/brk/object/123456';

      fetch.mockResponseOnce(JSON.stringify({
        _display: 'Kadastraal object display name 1',
        geometrie: { type: 'Point' },
        grootte: 172,
        kadastrale_gemeente: {
          _display: 'Kadastrale gemeente display name',
          naam: 'Kadastrale gemeente name',
          something: 'else'
        },
        objectnummer: '6444',
        something: 'abc123'
      }));
      getCenter.mockImplementation(() => ({ x: 1, y: 2 }));
      rdToWgs84.mockImplementation(() => ({ latitude: 3, longitude: 4 }));

      const promise = fetchByUri(uri).then((response) => {
        expect(response).toEqual({
          _display: 'Kadastraal object display name 1',
          geometrie: { type: 'Point' },
          grootte: 172,
          kadastrale_gemeente: {
            _display: 'Kadastrale gemeente display name',
            naam: 'Kadastrale gemeente name',
            something: 'else'
          },
          kadastraleGemeente: {
            _display: 'Kadastrale gemeente display name',
            label: 'Kadastrale gemeente display name',
            naam: 'Kadastrale gemeente name',
            name: 'Kadastrale gemeente name',
            something: 'else'
          },
          label: 'Kadastraal object display name 1',
          location: { latitude: 3, longitude: 4 },
          objectNumber: '6444',
          objectnummer: '6444',
          size: 172,
          something: 'abc123'
        });
      });

      expect(fetch.mock.calls[0][0]).toBe(uri);
      return promise;
    });

    it('fetches with empty result object', () => {
      const uri = 'https://acc.api.data.amsterdam.nl/brk/object/123456';

      fetch.mockResponseOnce(JSON.stringify({}));

      const promise = fetchByUri(uri).then((response) => {
        expect(response).toEqual({
          kadastraleGemeente: {
            label: undefined,
            name: undefined
          },
          label: undefined,
          location: null,
          objectNumber: undefined,
          size: undefined
        });
      });

      expect(fetch.mock.calls[0][0]).toBe(uri);
      return promise;
    });
  });
});
