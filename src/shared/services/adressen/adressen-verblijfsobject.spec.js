import fetchByUri from './adressen-verblijfsobject';
import getCenter from '../geo-json/geo-json';
import { rdToWgs84 } from '../coordinate-reference-system/crs-converter';

jest.mock('../geo-json/geo-json');
jest.mock('../coordinate-reference-system/crs-converter');

describe('The adressen verblijfsobject resource', () => {
  afterEach(() => {
    fetch.mockReset();
  });

  describe('By uri', () => {
    it('fetches a verblijfsobject', () => {
      const uri = 'https://acc.api.data.amsterdam.nl/bag/verblijfsobject/123456';

      fetch.mockResponseOnce(JSON.stringify({
        _display: 'Verblijfsobject display name 1',
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
        geometrie: { type: 'Point' },
        oppervlakte: 23820,
        something: 'abc123',
        type_woonobject: { omschrijving: 'Type description' }
      }));
      getCenter.mockImplementation(() => ({ x: 1, y: 2 }));
      rdToWgs84.mockImplementation(() => ({ latitude: 3, longitude: 4 }));

      fetchByUri(uri).then((response) => {
        expect(response).toEqual({
          _display: 'Verblijfsobject display name 1',
          eigendomsverhouding: 'Eigendomsverhouding description',
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
          geometrie: { type: 'Point' },
          label: 'Verblijfsobject display name 1',
          location: { latitude: 3, longitude: 4 },
          oppervlakte: 23820,
          size: 23820,
          something: 'abc123',
          type_woonobject: { omschrijving: 'Type description' },
          type: 'Type description'
        });
      });

      expect(fetch.mock.calls[0][0]).toBe(uri);
    });

    it('fetches with empty result object', () => {
      const uri = 'https://acc.api.data.amsterdam.nl/bag/verblijfsobject/123456';

      fetch.mockResponseOnce(JSON.stringify({}));

      fetchByUri(uri).then((response) => {
        expect(response).toEqual({
          eigendomsverhouding: undefined,
          gebruiksdoelen: [],
          label: undefined,
          location: null,
          size: undefined,
          type: undefined
        });
      });

      expect(fetch.mock.calls[0][0]).toBe(uri);
    });
  });
});
