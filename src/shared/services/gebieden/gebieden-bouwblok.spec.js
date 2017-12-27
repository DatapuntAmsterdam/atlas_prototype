import fetchByUri from './gebieden-bouwblok';
import getCenter from '../geo-json/geo-json';
import { rdToWgs84 } from '../coordinate-reference-system/crs-converter';

jest.mock('../geo-json/geo-json');
jest.mock('../coordinate-reference-system/crs-converter');

describe('The gebieden bouwblok resource', () => {
  afterEach(() => {
    fetch.mockReset();
  });

  describe('By uri', () => {
    it('fetches a bouwblok', () => {
      const uri = 'https://acc.api.data.amsterdam.nl/gebieden/bouwblok/123456';

      fetch.mockResponseOnce(JSON.stringify({
        _display: 'Bouwblok display name 1',
        geometrie: { type: 'Point' },
        something: 'abc123'
      }));
      getCenter.mockImplementation(() => ({ x: 1, y: 2 }));
      rdToWgs84.mockImplementation(() => ({ latitude: 3, longitude: 4 }));

      fetchByUri(uri).then((response) => {
        expect(response).toEqual({
          _display: 'Bouwblok display name 1',
          geometrie: { type: 'Point' },
          label: 'Bouwblok display name 1',
          location: { latitude: 3, longitude: 4 },
          something: 'abc123'
        });
      });

      expect(fetch.mock.calls[0][0]).toBe(uri);
    });

    it('fetches with empty result object', () => {
      const uri = 'https://acc.api.data.amsterdam.nl/gebieden/bouwblok/123456';

      fetch.mockResponseOnce(JSON.stringify({}));

      fetchByUri(uri).then((response) => {
        expect(response).toEqual({
          label: undefined,
          location: null
        });
      });

      expect(fetch.mock.calls[0][0]).toBe(uri);
    });
  });
});
