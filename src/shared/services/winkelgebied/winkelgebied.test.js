import fetchByUri from './winkelgebied';
import { getByUrl } from '../api/api';

jest.mock('../api/api');

describe('The oplaadpunten resource', () => {
  afterEach(() => {
    getByUrl.mockReset();
  });

  describe('By uri', () => {
    it('fetches a winkelgebied', () => {
      const uri = 'https://acc.api.data.amsterdam.nl/vsd/winkgeb/123456';
      const winkelgebiedMock = {
        _display: 'straat',
        categorie: 'String',
        categorie_naam: 'Foo',
        wkb_geometry: { type: 'Point' }
      };
      getByUrl.mockReturnValueOnce(Promise.resolve(winkelgebiedMock));

      const promise = fetchByUri(uri).then((response) => {
        expect(response).toEqual({
          label: winkelgebiedMock._display,
          category: `${winkelgebiedMock.categorie_naam} (${winkelgebiedMock.categorie})`,
          geometrie: winkelgebiedMock.wkb_geometry
        });
      });

      expect(getByUrl).toHaveBeenCalledWith(uri);
      return promise;
    });

    it('fetches with empty result object', () => {
      const uri = 'https://acc.api.data.amsterdam.nl/vsd/winkgeb/123456';

      getByUrl.mockReturnValueOnce(Promise.resolve({}));

      const promise = fetchByUri(uri).then((response) => {
        expect(response).toEqual({
          label: undefined,
          category: null,
          geometrie: undefined
        });
      });

      expect(getByUrl).toHaveBeenCalledWith(uri);
      return promise;
    });
  });
});
