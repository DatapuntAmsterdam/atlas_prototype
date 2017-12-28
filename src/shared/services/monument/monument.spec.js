import fetchByUri, { fetchByPandId } from './monument';
import { getAuthHeaders } from '../auth/auth';
import getCenter from '../geo-json/geo-json';
import { rdToWgs84 } from '../coordinate-reference-system/crs-converter';

jest.mock('../auth/auth');
jest.mock('../geo-json/geo-json');
jest.mock('../coordinate-reference-system/crs-converter');

describe('The monument resource', () => {
  beforeEach(() => {
    getAuthHeaders.mockImplementation(() => ({
      Authorization: 'Bearer 123AccessToken'
    }));
  });

  afterEach(() => {
    fetch.mockReset();
  });

  describe('By uri', () => {
    it('fetches a monument', () => {
      const uri = 'https://acc.api.data.amsterdam.nl/monumenten/monument/123456';

      fetch.mockResponseOnce(JSON.stringify({
        _display: 'Monument display name 1',
        geometrie: { type: 'Point' },
        monumentnummer: 'Monument number',
        monumentstatus: 'Monument status',
        monumenttype: 'Monument type',
        something: 'abc123'
      }));
      getCenter.mockImplementation(() => ({ x: 1, y: 2 }));
      rdToWgs84.mockImplementation(() => ({ latitude: 3, longitude: 4 }));

      const promise = fetchByUri(uri).then((response) => {
        expect(response).toEqual({
          _display: 'Monument display name 1',
          geometrie: { type: 'Point' },
          label: 'Monument display name 1',
          location: { latitude: 3, longitude: 4 },
          monumentnummer: 'Monument number',
          monumentstatus: 'Monument status',
          monumenttype: 'Monument type',
          number: 'Monument number',
          something: 'abc123',
          status: 'Monument status',
          type: 'Monument type'
        });
      });

      expect(fetch.mock.calls[0][0]).toBe(uri);
      expect(fetch.mock.calls[0][1]).toEqual({ headers: { Authorization: 'Bearer 123AccessToken' } });
      return promise;
    });

    it('fetches with monument coordinates', () => {
      const uri = 'https://acc.api.data.amsterdam.nl/monumenten/monument/123456';

      fetch.mockResponseOnce(JSON.stringify({
        _display: 'Monument display name 1',
        monumentcoordinaten: { type: 'Point' },
        monumentnummer: 'Monument number',
        monumentstatus: 'Monument status',
        monumenttype: 'Monument type',
        something: 'abc123'
      }));
      getCenter.mockImplementation(() => ({ x: 1, y: 2 }));
      rdToWgs84.mockImplementation(() => ({ latitude: 3, longitude: 4 }));

      const promise = fetchByUri(uri).then((response) => {
        expect(response).toEqual({
          _display: 'Monument display name 1',
          label: 'Monument display name 1',
          location: { latitude: 3, longitude: 4 },
          monumentcoordinaten: { type: 'Point' },
          monumentnummer: 'Monument number',
          monumentstatus: 'Monument status',
          monumenttype: 'Monument type',
          number: 'Monument number',
          something: 'abc123',
          status: 'Monument status',
          type: 'Monument type'
        });
      });

      expect(fetch.mock.calls[0][0]).toBe(uri);
      expect(fetch.mock.calls[0][1]).toEqual({ headers: { Authorization: 'Bearer 123AccessToken' } });
      return promise;
    });

    it('fetches with empty result object', () => {
      const uri = 'https://acc.api.data.amsterdam.nl/monumenten/monument/123456';

      fetch.mockResponseOnce(JSON.stringify({}));

      const promise = fetchByUri(uri).then((response) => {
        expect(response).toEqual({
          label: undefined,
          location: null,
          number: undefined,
          status: undefined,
          type: undefined
        });
      });

      expect(fetch.mock.calls[0][0]).toBe(uri);
      return promise;
    });
  });

  it('can fetch monumenten by pand id', () => {
    fetch.mockResponseOnce(JSON.stringify({ results: [
      {
        _display: 'Monument display name 1',
        nummer: 'abc123'
      }, {
        _display: 'Monument display name 2',
        nummer: 'xyz456'
      }
    ] }));

    const promise = fetchByPandId(1).then((response) => {
      expect(response).toEqual([
        {
          _display: 'Monument display name 1',
          nummer: 'abc123'
        }, {
          _display: 'Monument display name 2',
          nummer: 'xyz456'
        }
      ]);
    });

    expect(fetch.mock.calls[0][0]).toContain('betreft_pand=1');
    expect(fetch.mock.calls[0][1]).toEqual({ headers: { Authorization: 'Bearer 123AccessToken' } });
    return promise;
  });
});
