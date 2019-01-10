import fetchByUri from './adressen-standplaats';
import getCenter from '../geo-json/geo-json';
import { rdToWgs84 } from '../coordinate-reference-system/crs-converter';

import { getByUrl } from '../api/api';

jest.mock('../geo-json/geo-json');
jest.mock('../api/api');
jest.mock('../coordinate-reference-system/crs-converter');

describe('The adressen standplaats resource', () => {
  afterEach(() => {
    getByUrl.mockReset();
  });

  describe('By uri', () => {
    it('fetches a standplaats', () => {
      const uri = 'https://acc.api.data.amsterdam.nl/bag/standplaats/123456';

      getByUrl.mockReturnValueOnce(Promise.resolve({
        _display: 'Standplaats display name 1',
        aanduiding_in_onderzoek: true,
        geometrie: { type: 'Point' },
        indicatie_geconstateerd: false,
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
          _display: 'Standplaats display name 1',
          aanduidingInOnderzoek: true,
          aanduiding_in_onderzoek: true,
          geometrie: { type: 'Point' },
          indicatieGeconstateerd: false,
          indicatie_geconstateerd: false,
          label: 'Standplaats display name 1',
          location: { latitude: 3, longitude: 4 },
          something: 'abc123',
          status: {
            code: '01',
            description: 'Status description'
          }
        });
      });

      expect(getByUrl).toHaveBeenCalledWith(uri);
      return promise;
    });

    it('fetches with empty result object', () => {
      const uri = 'https://acc.api.data.amsterdam.nl/bag/standplaats/123456';

      getByUrl.mockReturnValueOnce(Promise.resolve({}));

      const promise = fetchByUri(uri).then((response) => {
        expect(response).toEqual({
          _display: undefined,
          aanduidingInOnderzoek: undefined,
          indicatieGeconstateerd: undefined,
          label: undefined,
          location: null,
          status: {
            code: '',
            description: ''
          }
        });
      });

      expect(getByUrl).toHaveBeenCalledWith(uri);
      return promise;
    });
  });
});
