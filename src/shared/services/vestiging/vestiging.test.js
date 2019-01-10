import fetchByUri, { fetchByPandId, fetchByAddressId } from './vestiging';
import { getByUrl } from '../api/api';
import getCenter from '../geo-json/geo-json';
import { rdToWgs84 } from '../coordinate-reference-system/crs-converter';
import maatschappelijkeActiviteit from '../maatschappelijke-activiteit/maatschappelijke-activiteit';

jest.mock('../api/api');
jest.mock('../geo-json/geo-json');
jest.mock('../coordinate-reference-system/crs-converter');
jest.mock('../maatschappelijke-activiteit/maatschappelijke-activiteit');

describe('The vestiging resource', () => {
  afterEach(() => {
    getByUrl.mockReset();
    maatschappelijkeActiviteit.mockReset();
  });

  describe('By uri', () => {
    it('fetches a vestiging', () => {
      const uri = 'https://acc.api.data.amsterdam.nl/handelsregister/vestiging/123456';

      getByUrl.mockReturnValueOnce(Promise.resolve({
        activiteiten: [{
          sbi_code: '01',
          sbi_omschrijving: 'Activity 1 description',
          something: 'other'
        }, {
          sbi_code: '04',
          sbi_omschrijving: 'Activity 2 description',
          something: 'more'
        }],
        _bijzondere_rechts_toestand: {
          faillissement: true,
          status: 'Status'
        },
        _display: 'Vestiging display name 1',
        geometrie: { type: 'Point' },
        vestigingsnummer: '0001',
        maatschappelijke_activiteit:
          'https://acc.api.data.amsterdam.nl/handelsregister/maatschappelijkeactiviteit/345678',
        something: 'abc123'
      }));
      getCenter.mockImplementation(() => ({ x: 1, y: 2 }));
      rdToWgs84.mockImplementation(() => ({ latitude: 3, longitude: 4 }));
      maatschappelijkeActiviteit.mockImplementation(() => (
        new Promise((resolve) => {
          resolve({ kvk_nummer: 'KvK number' });
        })
      ));

      const promise = fetchByUri(uri).then((response) => {
        expect(response).toEqual({
          _display: 'Vestiging display name 1',
          activiteiten: [{
            sbi_code: '01',
            sbi_omschrijving: 'Activity 1 description',
            something: 'other'
          }, {
            sbi_code: '04',
            sbi_omschrijving: 'Activity 2 description',
            something: 'more'
          }],
          activities: [{
            sbi_code: '01',
            sbi_omschrijving: 'Activity 1 description',
            sbiCode: '01',
            sbiDescription: 'Activity 1 description',
            something: 'other'
          }, {
            sbi_code: '04',
            sbi_omschrijving: 'Activity 2 description',
            sbiCode: '04',
            sbiDescription: 'Activity 2 description',
            something: 'more'
          }],
          _bijzondere_rechts_toestand: {
            faillissement: true,
            status: 'Status'
          },
          bijzondereRechtstoestand: {
            faillissement: true,
            status: 'Status',
            surseanceVanBetaling: false
          },
          geometrie: { type: 'Point' },
          kvkNumber: 'KvK number',
          label: 'Vestiging display name 1',
          location: { latitude: 3, longitude: 4 },
          vestigingsnummer: '0001',
          maatschappelijke_activiteit:
            'https://acc.api.data.amsterdam.nl/handelsregister/maatschappelijkeactiviteit/345678',
          something: 'abc123',
          visitingAddress: undefined
        });
        expect(getCenter).toHaveBeenCalledWith({ type: 'Point' });
        expect(maatschappelijkeActiviteit).toHaveBeenCalledWith(
          'https://acc.api.data.amsterdam.nl/handelsregister/maatschappelijkeactiviteit/345678');
      });

      expect(getByUrl).toHaveBeenCalledWith(uri);
      return promise;
    });

    it('fetches with visiting address coordinates', () => {
      const uri = 'https://acc.api.data.amsterdam.nl/handelsregister/vestiging/123456';

      getByUrl.mockReturnValueOnce(Promise.resolve({
        bezoekadres: {
          geometrie: { type: 'Point' },
          something: 'else'
        },
        vestigingsnummer: '0001',
        maatschappelijke_activiteit:
          'https://acc.api.data.amsterdam.nl/handelsregister/maatschappelijkeactiviteit/345678'
      }));
      getCenter.mockImplementation(() => ({ x: 1, y: 2 }));
      rdToWgs84.mockImplementation(() => ({ latitude: 3, longitude: 4 }));
      maatschappelijkeActiviteit.mockImplementation(() => (
        new Promise((resolve) => {
          resolve({});
        })
      ));

      const promise = fetchByUri(uri).then((response) => {
        expect(response).toEqual({
          activities: [],
          bezoekadres: {
            geometrie: { type: 'Point' },
            something: 'else'
          },
          bijzondereRechtstoestand: {
            surseanceVanBetaling: false
          },
          kvkNumber: undefined,
          label: undefined,
          location: { latitude: 3, longitude: 4 },
          vestigingsnummer: '0001',
          maatschappelijke_activiteit:
            'https://acc.api.data.amsterdam.nl/handelsregister/maatschappelijkeactiviteit/345678',
          visitingAddress: {
            geometrie: { type: 'Point' },
            something: 'else'
          }
        });
        expect(getCenter).toHaveBeenCalledWith({ type: 'Point' });
        expect(maatschappelijkeActiviteit).toHaveBeenCalledWith(
          'https://acc.api.data.amsterdam.nl/handelsregister/maatschappelijkeactiviteit/345678');
      });

      expect(getByUrl).toHaveBeenCalledWith(uri);
      return promise;
    });

    it('marks `surseanceVanBetaling` when `bijzondereRechtstoestand` is `voorlopig` ', () => {
      const uri = 'https://acc.api.data.amsterdam.nl/handelsregister/vestiging/123456';

      getByUrl.mockReturnValueOnce(Promise.resolve({
        _bijzondere_rechts_toestand: {
          faillissement: true,
          status: 'Voorlopig'
        },
        maatschappelijke_activiteit:
          'https://acc.api.data.amsterdam.nl/handelsregister/maatschappelijkeactiviteit/345678'
      }));
      maatschappelijkeActiviteit.mockImplementation(() => (
        new Promise((resolve) => {
          resolve({});
        })
      ));

      const promise = fetchByUri(uri).then((response) => {
        expect(response).toEqual({
          activities: [],
          _bijzondere_rechts_toestand: {
            faillissement: true,
            status: 'Voorlopig'
          },
          bijzondereRechtstoestand: {
            faillissement: true,
            status: 'Voorlopig',
            surseanceVanBetaling: true
          },
          kvkNumber: undefined,
          label: undefined,
          location: null,
          maatschappelijke_activiteit:
            'https://acc.api.data.amsterdam.nl/handelsregister/maatschappelijkeactiviteit/345678',
          visitingAddress: undefined
        });
      });

      expect(getByUrl).toHaveBeenCalledWith(uri);
      return promise;
    });

    it('marks `surseanceVanBetaling` when `bijzondereRechtstoestand` is `definitief` ', () => {
      const uri = 'https://acc.api.data.amsterdam.nl/handelsregister/vestiging/123456';

      getByUrl.mockReturnValueOnce(Promise.resolve({
        _bijzondere_rechts_toestand: {
          faillissement: false,
          status: 'Definitief'
        },
        maatschappelijke_activiteit:
          'https://acc.api.data.amsterdam.nl/handelsregister/maatschappelijkeactiviteit/345678'
      }));
      maatschappelijkeActiviteit.mockImplementation(() => (
        new Promise((resolve) => {
          resolve({});
        })
      ));

      const promise = fetchByUri(uri).then((response) => {
        expect(response).toEqual({
          activities: [],
          _bijzondere_rechts_toestand: {
            faillissement: false,
            status: 'Definitief'
          },
          bijzondereRechtstoestand: {
            faillissement: false,
            status: 'Definitief',
            surseanceVanBetaling: true
          },
          kvkNumber: undefined,
          label: undefined,
          location: null,
          maatschappelijke_activiteit:
            'https://acc.api.data.amsterdam.nl/handelsregister/maatschappelijkeactiviteit/345678',
          visitingAddress: undefined
        });
      });

      expect(getByUrl).toHaveBeenCalledWith(uri);
      return promise;
    });

    it('fetches with empty result object', () => {
      const uri = 'https://acc.api.data.amsterdam.nl/handelsregister/vestiging/123456';

      getByUrl.mockReturnValueOnce(Promise.resolve({
        maatschappelijke_activiteit:
          'https://acc.api.data.amsterdam.nl/handelsregister/maatschappelijkeactiviteit/345678'
      }));
      maatschappelijkeActiviteit.mockImplementation(() => (
        new Promise((resolve) => {
          resolve({});
        })
      ));

      const promise = fetchByUri(uri).then((response) => {
        expect(response).toEqual({
          activities: [],
          bijzondereRechtstoestand: {
            surseanceVanBetaling: false
          },
          kvkNumber: undefined,
          label: undefined,
          location: null,
          maatschappelijke_activiteit:
            'https://acc.api.data.amsterdam.nl/handelsregister/maatschappelijkeactiviteit/345678',
          visitingAddress: undefined
        });
      });

      expect(getByUrl).toHaveBeenCalledWith(uri);
      return promise;
    });

    it('fetches without maatschappelijke activiteit', () => {
      const uri = 'https://acc.api.data.amsterdam.nl/handelsregister/vestiging/123456';

      getByUrl.mockReturnValueOnce(Promise.resolve({
        geometrie: { type: 'Point' },
        something: 'abc123'
      }));

      const promise = fetchByUri(uri).then((response) => {
        expect(response).toEqual({
          geometrie: { type: 'Point' },
          location: { latitude: 3, longitude: 4 },
          something: 'abc123'
        });
        expect(maatschappelijkeActiviteit).not.toHaveBeenCalled();
      });

      expect(getByUrl).toHaveBeenCalledWith(uri);
      return promise;
    });

    it('fetches without maatschappelijke activiteit, with empty result object', () => {
      const uri = 'https://acc.api.data.amsterdam.nl/handelsregister/vestiging/123456';

      getByUrl.mockReturnValueOnce(Promise.resolve({}));

      const promise = fetchByUri(uri).then((response) => {
        expect(response).toEqual({
          location: null
        });
      });

      expect(getByUrl).toHaveBeenCalledWith(uri);
      return promise;
    });
  });

  it('can fetch a vestiging by pand id', () => {
    getByUrl.mockReturnValueOnce(Promise.resolve({ results: [
      {
        _display: 'Vestiging display name 1',
        id: 'abc123'
      }, {
        _display: 'Vestiging display name 2',
        id: 'xyz456'
      }
    ] }));

    const promise = fetchByPandId(1).then((response) => {
      expect(response
      ).toEqual([
        {
          _display: 'Vestiging display name 1',
          id: 'abc123'
        }, {
          _display: 'Vestiging display name 2',
          id: 'xyz456'
        }
      ]);
    });

    expect(getByUrl.mock.calls[0][0]).toContain('pand=1');
    return promise;
  });

  it('can fetch a vestiging by address id', () => {
    getByUrl.mockReturnValueOnce(Promise.resolve({ results: [
      {
        _display: 'Vestiging display name 1',
        id: 'abc123'
      }, {
        _display: 'Vestiging display name 2',
        id: 'xyz456'
      }
    ] }));

    const promise = fetchByAddressId(0).then((response) => {
      expect(response
      ).toEqual([
        {
          _display: 'Vestiging display name 1',
          id: 'abc123'
        }, {
          _display: 'Vestiging display name 2',
          id: 'xyz456'
        }
      ]);
    });

    expect(getByUrl.mock.calls[0][0]).toContain('nummeraanduiding=0');
    return promise;
  });
});
