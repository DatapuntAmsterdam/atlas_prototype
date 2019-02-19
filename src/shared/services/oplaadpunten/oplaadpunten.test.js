import fetchByUri from './oplaadpunten';
import getCenter from '../geo-json/geo-json';
import { rdToWgs84 } from '../coordinate-reference-system/crs-converter';

import { getByUrl } from '../api/api';

jest.mock('../geo-json/geo-json');
jest.mock('../api/api');
jest.mock('../coordinate-reference-system/crs-converter');

describe('The oplaadpunten resource', () => {
  afterEach(() => {
    getByUrl.mockReset();
  });

  describe('By uri', () => {
    it('fetches a oplaadpunt', () => {
      const uri = 'https://acc.api.data.amsterdam.nl/vsd/oplaadpunten/123456';
      const oplaadpuntMock = {
        street: 'straat',
        city: 'amsterdam',
        housenumber: '1',
        housenumberext: 'a',
        charging_capability: '1000',
        charging_cap_max: 10,
        charging_point: 1,
        connector_type: 'type',
        status: 'Available',
        _display: 'label',
        wkb_geometry: { type: 'Point' }
      };
      getByUrl.mockReturnValueOnce(Promise.resolve(oplaadpuntMock));
      getCenter.mockImplementation(() => ({ x: 1, y: 2 }));
      rdToWgs84.mockImplementation(() => ({ latitude: 3, longitude: 4 }));

      const promise = fetchByUri(uri).then((response) => {
        expect(response).toEqual({
          address: 'straat 1 a, amsterdam',
          capacity: oplaadpuntMock.charging_capability,
          connectorType: oplaadpuntMock.connector_type,
          geometrie: oplaadpuntMock.wkb_geometry,
          label: oplaadpuntMock._display,
          currentStatus: 'Beschikbaar',
          location: { latitude: 3, longitude: 4 },
          quantity: oplaadpuntMock.charging_point.toString(),
          type: 'Gewoon laadpunt'
        });
      });

      expect(getByUrl).toHaveBeenCalledWith(uri);
      return promise;
    });

    it('fetches with empty result object', () => {
      const uri = 'https://acc.api.data.amsterdam.nl/vsd/oplaadpunten/123456';

      getByUrl.mockReturnValueOnce(Promise.resolve({}));

      const promise = fetchByUri(uri).then((response) => {
        expect(response).toEqual({
          address: null,
          capacity: undefined,
          connectorType: undefined,
          currentStatus: 'Niet beschikbaar',
          geometrie: undefined,
          label: undefined,
          location: null,
          quantity: undefined,
          type: null
        });
      });

      expect(getByUrl).toHaveBeenCalledWith(uri);
      return promise;
    });
  });
});
