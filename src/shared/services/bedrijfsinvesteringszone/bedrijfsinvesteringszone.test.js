import fetchByUri from './bedrijfsinvesteringszone';
import getCenter from '../geo-json/geo-json';
import { rdToWgs84 } from '../coordinate-reference-system/crs-converter';

import { getByUrl } from '../api/api';

jest.mock('../geo-json/geo-json');
jest.mock('../api/api');
jest.mock('../coordinate-reference-system/crs-converter');

describe('The bedrijfsinvesteringszone resource', () => {
  afterEach(() => {
    getByUrl.mockReset();
  });

  describe('By uri', () => {
    it('fetches a bedrijfsinvesteringszone', () => {
      const uri = 'https://acc.api.data.amsterdam.nl/vsd/biz/123456';

      getByUrl.mockReturnValue(Promise.resolve({
        _display: 'Bedrijfsinvesteringszone display name 1',
        bijdrageplichtigen: 'Bedrijfsinvesteringszone heffingsplichtigen',
        biz_type: 'Bedrijfsinvesteringszone type',
        geometrie: { type: 'Point' },
        heffing_display: 'Bedrijfsinvesteringszone heffingLabel',
        something: 'abc123'
      }));
      getCenter.mockImplementation(() => ({ x: 1, y: 2 }));
      rdToWgs84.mockImplementation(() => ({ latitude: 3, longitude: 4 }));

      const promise = fetchByUri(uri).then((response) => {
        expect(response).toEqual({
          _display: 'Bedrijfsinvesteringszone display name 1',
          bijdrageplichtigen: 'Bedrijfsinvesteringszone heffingsplichtigen',
          biz_type: 'Bedrijfsinvesteringszone type',
          heffing_display: 'Bedrijfsinvesteringszone heffingLabel',
          heffingLabel: 'Bedrijfsinvesteringszone heffingLabel',
          heffingsplichtigen: 'Bedrijfsinvesteringszone heffingsplichtigen',
          geometrie: { type: 'Point' },
          label: 'Bedrijfsinvesteringszone display name 1',
          location: { latitude: 3, longitude: 4 },
          type: 'Bedrijfsinvesteringszone type',
          something: 'abc123'
        });
      });

      expect(getByUrl).toHaveBeenCalledWith(uri);
      return promise;
    });

    it('fetches with empty result object', () => {
      const uri = 'https://acc.api.data.amsterdam.nl/vsd/biz/123456';

      getByUrl.mockReturnValue(Promise.resolve({}));

      const promise = fetchByUri(uri).then((response) => {
        expect(response).toEqual({
          heffingLabel: undefined,
          heffingsplichtigen: undefined,
          label: undefined,
          location: null,
          type: undefined
        });
      });

      expect(getByUrl).toHaveBeenCalledWith(uri);
      return promise;
    });
  });
});
