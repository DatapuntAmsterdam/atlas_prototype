import fetchByUri from './explosieven-uitgevoerd-onderzoek';
import getCenter from '../geo-json/geo-json';
import { rdToWgs84 } from '../coordinate-reference-system/crs-converter';

jest.mock('../geo-json/geo-json');
jest.mock('../coordinate-reference-system/crs-converter');

describe('The explosieven uitgevoerd onderzoek resource', () => {
  afterEach(() => {
    fetch.mockReset();
  });

  describe('By uri', () => {
    it('fetches a uitgevoerd onderzoek', () => {
      const uri = 'https://acc.api.data.amsterdam.nl/explosieven/gevrijwaardgebied/123456';

      fetch.mockResponseOnce(JSON.stringify({
        datum: '1918-05-21',
        _display: 'UitgevoerdOnderzoek display name 1',
        geometrie: { type: 'Point' },
        something: 'abc123',
        verdacht_gebied: 'Verdacht gebied'
      }));
      getCenter.mockImplementation(() => ({ x: 1, y: 2 }));
      rdToWgs84.mockImplementation(() => ({ latitude: 3, longitude: 4 }));

      const promise = fetchByUri(uri).then((response) => {
        expect(response).toEqual({
          date: new Date('1918-05-21'),
          datum: '1918-05-21',
          _display: 'UitgevoerdOnderzoek display name 1',
          geometrie: { type: 'Point' },
          label: 'UitgevoerdOnderzoek display name 1',
          location: { latitude: 3, longitude: 4 },
          something: 'abc123',
          verdacht_gebied: 'Verdacht gebied',
          verdachtGebied: 'Verdacht gebied'
        });
      });

      expect(fetch.mock.calls[0][0]).toBe(uri);
      return promise;
    });

    it('fetches with empty result object', () => {
      const uri = 'https://acc.api.data.amsterdam.nl/explosieven/gevrijwaardgebied/123456';

      fetch.mockResponseOnce(JSON.stringify({}));

      const promise = fetchByUri(uri).then((response) => {
        expect(response).toEqual({
          date: null,
          label: undefined,
          location: null,
          verdachtGebied: undefined
        });
      });

      expect(fetch.mock.calls[0][0]).toBe(uri);
      return promise;
    });
  });
});
