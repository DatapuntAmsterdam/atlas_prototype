import * as address from './adressen-nummeraanduiding';

describe('The address resource', () => {
  afterEach(() => {
    fetch.mockReset();
  });

  it('can fetch an address by pand id', () => {
    fetch.mockResponseOnce(JSON.stringify({ results: [
      {
        _display: 'Address display name 1',
        landelijk_id: 'abc123'
      }, {
        _display: 'Address display name 2',
        landelijk_id: 'xyz456'
      }
    ] }));

    address.fetchByPandId(1).then((response) => {
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

  it('can fetch an address by ligplaats id, adds `id` attribute', () => {
    fetch.mockResponseOnce(JSON.stringify({ results: [
      {
        _display: 'Address display name 1',
        landelijk_id: 'abc123'
      }, {
        _display: 'Address display name 2',
        landelijk_id: 'xyz456'
      }
    ] }));

    address.fetchByLigplaatsId('abc123').then((response) => {
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

    address.fetchHoofdadresByLigplaatsId('abc123').then((response) => {
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

    address.fetchHoofdadresByLigplaatsId('abc123').then((response) => {
      expect(response
      ).not.toBeDefined();
    });

    expect(fetch.mock.calls[0][0]).toContain('ligplaats=abc123');
  });

  it('can fetch an address by standplaats id, adds `id` attribute', () => {
    fetch.mockResponseOnce(JSON.stringify({ results: [
      {
        _display: 'Address display name 1',
        landelijk_id: 'abc123'
      }, {
        _display: 'Address display name 2',
        landelijk_id: 'xyz456'
      }
    ] }));

    address.fetchByStandplaatsId('abc123').then((response) => {
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

    address.fetchHoofdadresByStandplaatsId('abc123').then((response) => {
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

    address.fetchHoofdadresByStandplaatsId('abc123').then((response) => {
      expect(response
      ).not.toBeDefined();
    });

    expect(fetch.mock.calls[0][0]).toContain('standplaats=abc123');
  });
});
