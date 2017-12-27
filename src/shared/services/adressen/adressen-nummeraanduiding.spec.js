import fetchByUri, {
  fetchByPandId,
  fetchByLigplaatsId,
  fetchHoofdadresByLigplaatsId,
  fetchByStandplaatsId,
  fetchHoofdadresByStandplaatsId
} from './adressen-nummeraanduiding';
import verblijfsobject from './adressen-verblijfsobject';

jest.mock('./adressen-verblijfsobject');

describe('The adressen nummeraanduiding resource', () => {
  afterEach(() => {
    fetch.mockReset();
  });

  describe('By uri', () => {
    it('can fetch a nummeraanduiding by uri', () => {
      const uri = 'https://acc.api.data.amsterdam.nl/bag/nummeraanduiding/123456';

      fetch.mockResponseOnce(JSON.stringify({
        _display: 'Address display name 1',
        landelijk_id: 'abc123',
        verblijfsobject: 'https://acc.api.data.amsterdam.nl/bag/verblijfsobject/345678'
      }));
      verblijfsobject.mockImplementation(() => ({ label: 'Verblijfsobject' }));

      fetchByUri(uri).then((response) => {
        expect(response).toEqual({ label: 'Verblijfsobject' });
        expect(verblijfsobject).toHaveBeenCalledWith('https://acc.api.data.amsterdam.nl/bag/verblijfsobject/345678');
      });

      expect(fetch.mock.calls[0][0]).toBe(uri);
    });

    it('fetches without \'verblijfsobject\'', () => {
      const uri = 'https://acc.api.data.amsterdam.nl/bag/nummeraanduiding/123456';

      fetch.mockResponseOnce(JSON.stringify({
        _display: 'Address display name 1',
        landelijk_id: 'abc123'
      }));

      fetchByUri(uri).then((response) => {
        expect(response).toEqual({
          _display: 'Address display name 1',
          label: 'Address display name 1',
          landelijk_id: 'abc123'
        });
      });

      expect(fetch.mock.calls[0][0]).toBe(uri);
    });

    it('fetches with empty result object', () => {
      const uri = 'https://acc.api.data.amsterdam.nl/bag/nummeraanduiding/123456';

      fetch.mockResponseOnce(JSON.stringify({}));

      fetchByUri(uri).then((response) => {
        expect(response).toEqual({ label: undefined });
      });

      expect(fetch.mock.calls[0][0]).toBe(uri);
    });
  });

  it('can fetch nummeraanduidingen by pand id', () => {
    fetch.mockResponseOnce(JSON.stringify({ results: [
      {
        _display: 'Address display name 1',
        landelijk_id: 'abc123'
      }, {
        _display: 'Address display name 2',
        landelijk_id: 'xyz456'
      }
    ] }));

    fetchByPandId(1).then((response) => {
      expect(response
      ).toEqual([
        {
          _display: 'Address display name 1',
          landelijk_id: 'abc123'
        }, {
          _display: 'Address display name 2',
          landelijk_id: 'xyz456'
        }
      ]);
    });

    expect(fetch.mock.calls[0][0]).toContain('pand=1');
  });

  it('can fetch nummeraanduidingen by ligplaats id, adds `id` attribute', () => {
    fetch.mockResponseOnce(JSON.stringify({ results: [
      {
        _display: 'Address display name 1',
        landelijk_id: 'abc123'
      }, {
        _display: 'Address display name 2',
        landelijk_id: 'xyz456'
      }
    ] }));

    fetchByLigplaatsId('abc123').then((response) => {
      expect(response
      ).toEqual([
        {
          _display: 'Address display name 1',
          landelijk_id: 'abc123',
          id: 'abc123'
        }, {
          _display: 'Address display name 2',
          landelijk_id: 'xyz456',
          id: 'xyz456'
        }
      ]);
    });

    expect(fetch.mock.calls[0][0]).toContain('ligplaats=abc123');
  });

  it('can fetch the hoofdadres by ligplaats id', () => {
    fetch.mockResponseOnce(JSON.stringify({ results: [
      {
        _display: 'Address display name 1',
        landelijk_id: '123'
      }, {
        _display: 'Address display name 2',
        landelijk_id: '456',
        hoofdadres: {}
      }, {
        _display: 'Address display name 3',
        landelijk_id: '789'
      }
    ] }));

    fetchHoofdadresByLigplaatsId('abc123').then((response) => {
      expect(response
      ).toEqual({
        _display: 'Address display name 2',
        landelijk_id: '456',
        id: '456',
        hoofdadres: {}
      });
    });

    expect(fetch.mock.calls[0][0]).toContain('ligplaats=abc123');
    fetch.mockReset();

    fetch.mockResponseOnce(JSON.stringify({ results: [
      {
        _display: 'Address display name 1',
        landelijk_id: '123'
      }, {
        _display: 'Address display name 2',
        landelijk_id: '456'
      }
    ] }));

    fetchHoofdadresByLigplaatsId('abc123').then((response) => {
      expect(response
      ).not.toBeDefined();
    });

    expect(fetch.mock.calls[0][0]).toContain('ligplaats=abc123');
  });

  it('can fetch nummeraanduidingen by standplaats id, adds `id` attribute', () => {
    fetch.mockResponseOnce(JSON.stringify({ results: [
      {
        _display: 'Address display name 1',
        landelijk_id: 'abc123'
      }, {
        _display: 'Address display name 2',
        landelijk_id: 'xyz456'
      }
    ] }));

    fetchByStandplaatsId('abc123').then((response) => {
      expect(response
      ).toEqual([
        {
          _display: 'Address display name 1',
          landelijk_id: 'abc123',
          id: 'abc123'
        }, {
          _display: 'Address display name 2',
          landelijk_id: 'xyz456',
          id: 'xyz456'
        }
      ]);
    });

    expect(fetch.mock.calls[0][0]).toContain('standplaats=abc123');
  });

  it('can fetch the hoofdadres by standplaats id', () => {
    fetch.mockResponseOnce(JSON.stringify({ results: [
      {
        _display: 'Address display name 1',
        landelijk_id: '123'
      }, {
        _display: 'Address display name 2',
        landelijk_id: '456',
        hoofdadres: {}
      }, {
        _display: 'Address display name 3',
        landelijk_id: '789'
      }
    ] }));

    fetchHoofdadresByStandplaatsId('abc123').then((response) => {
      expect(response
      ).toEqual({
        _display: 'Address display name 2',
        landelijk_id: '456',
        id: '456',
        hoofdadres: {}
      });
    });

    expect(fetch.mock.calls[0][0]).toContain('standplaats=abc123');
    fetch.mockReset();

    fetch.mockResponseOnce(JSON.stringify({ results: [
      {
        _display: 'Address display name 1',
        landelijk_id: '123'
      }, {
        _display: 'Address display name 2',
        landelijk_id: '456'
      }
    ] }));

    fetchHoofdadresByStandplaatsId('abc123').then((response) => {
      expect(response
      ).not.toBeDefined();
    });

    expect(fetch.mock.calls[0][0]).toContain('standplaats=abc123');
  });
});
