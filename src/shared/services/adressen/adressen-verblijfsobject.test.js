import fetchByUri from './adressen-verblijfsobject';
import getCenter from '../geo-json/geo-json';
import { rdToWgs84 } from '../coordinate-reference-system/crs-converter';

import { getByUrl } from '../api/api';

jest.mock('../geo-json/geo-json');
jest.mock('../api/api');
jest.mock('../coordinate-reference-system/crs-converter');

describe('The adressen verblijfsobject resource', () => {
  afterEach(() => {
    getByUrl.mockReset();
  });

  describe('By uri', () => {
    it('fetches a verblijfsobject', () => {
      const uri = 'https://acc.api.data.amsterdam.nl/bag/verblijfsobject/123456';

      getByUrl.mockReturnValueOnce(Promise.resolve({
        _display: 'Verblijfsobject display name 1',
        aanduiding_in_onderzoek: true,
        eigendomsverhouding: { omschrijving: 'Eigendomsverhouding description' },
        gebruiksdoelen: [{
          code: '01',
          omschrijving: 'Gebruiksdoel 1 description'
        }, {
          code: '04',
          omschrijving: 'Gebruiksdoel 2 description',
          code_plus: '0400',
          omschrijving_plus: 'Gebruiksdoel 2 description plus'
        }],
        gebruik: {
          code: 14,
          omschrijving: 'horeca'
        },
        geometrie: { type: 'Point' },
        indicatie_geconstateerd: false,
        oppervlakte: 23820,
        something: 'abc123',
        type_woonobject: { omschrijving: 'Type description' },
        status: { omschrijving: 'Status omschrijving', code: '01' }
      }));
      getCenter.mockImplementation(() => ({ x: 1, y: 2 }));
      rdToWgs84.mockImplementation(() => ({ latitude: 3, longitude: 4 }));

      const promise = fetchByUri(uri).then((response) => {
        expect(response).toEqual({
          _display: 'Verblijfsobject display name 1',
          aanduidingInOnderzoek: true,
          aanduiding_in_onderzoek: true,
          eigendomsverhouding: 'Eigendomsverhouding description',
          status: {
            code: '01',
            description: 'Status omschrijving'
          },
          gebruiksdoelen: [{
            code: '01',
            omschrijving: 'Gebruiksdoel 1 description',
            description: 'Gebruiksdoel 1 description'
          }, {
            code: '04',
            omschrijving: 'Gebruiksdoel 2 description',
            code_plus: '0400',
            omschrijving_plus: 'Gebruiksdoel 2 description plus',
            description: 'Gebruiksdoel 2 description',
            descriptionPlus: 'Gebruiksdoel 2 description plus'
          }],
          gebruik: {
            code: 14,
            omschrijving: 'horeca'
          },
          use: {
            code: 14,
            description: 'horeca'
          },
          geometrie: { type: 'Point' },
          indicatieGeconstateerd: false,
          indicatie_geconstateerd: false,
          label: 'Verblijfsobject display name 1',
          location: { latitude: 3, longitude: 4 },
          oppervlakte: 23820,
          size: 23820,
          something: 'abc123',
          type_woonobject: { omschrijving: 'Type description' },
          type: 'Type description'
        });
      });

      expect(getByUrl).toHaveBeenCalledWith(uri);
      return promise;
    });

    describe('size', () => {
      it('Changes one to zero', () => {
        const uri = 'https://acc.api.data.amsterdam.nl/bag/verblijfsobject/123456';

        getByUrl.mockReturnValueOnce(Promise.resolve({ oppervlakte: 1 }));

        return fetchByUri(uri).then((response) => {
          expect(response.size).toBe(0);
        });
      });

      it('Keeps a zero as a zero', () => {
        const uri = 'https://acc.api.data.amsterdam.nl/bag/verblijfsobject/123456';

        getByUrl.mockReturnValueOnce(Promise.resolve({ oppervlakte: 0 }));

        return fetchByUri(uri).then((response) => {
          expect(response.size).toBe(0);
        });
      });

      it('Uses zero for negative values', () => {
        const uri = 'https://acc.api.data.amsterdam.nl/bag/verblijfsobject/123456';

        getByUrl.mockReturnValueOnce(Promise.resolve({ oppervlakte: -1 }));

        return fetchByUri(uri).then((response) => {
          expect(response.size).toBe(0);
        });
      });
    });

    it('fetches with empty result object', () => {
      const uri = 'https://acc.api.data.amsterdam.nl/bag/verblijfsobject/123456';

      getByUrl.mockReturnValueOnce(Promise.resolve({}));

      const promise = fetchByUri(uri).then((response) => {
        expect(response).toEqual({
          aanduidingInOnderzoek: undefined,
          eigendomsverhouding: undefined,
          gebruiksdoelen: [],
          indicatieGeconstateerd: undefined,
          label: undefined,
          location: null,
          size: 0,
          status: {
            code: '',
            description: ''
          },
          use: {
            code: '',
            description: ''
          },
          type: undefined
        });
      });

      expect(getByUrl).toHaveBeenCalledWith(uri);
      return promise;
    });
  });
});
