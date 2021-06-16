import { listFixture as meetbouwMetingFixture } from '../../../../../../api/meetbouten/meting'
import environment from '../../../../../../environment'
import * as api from '../../../../../../shared/services/api/api'
import formatDate from '../../../../../utils/formatDate'
import {
  adressenPand,
  adressenVerblijfsobject,
  bekendmakingen,
  evenementen,
  explosieven,
  getGarbageContainersByAddress,
  getGarbageContainersByBagObject,
  grexProject,
  kadastraalObject,
  meetbout,
  meetboutTable,
  monument,
  napPeilmerk,
  oplaadpunten,
  parkeerzones,
  reclamebelasting,
  vastgoed,
  winkelgebied,
} from './normalize'
import type { PotentialApiResult } from '../../types/details'

jest.mock('../../../../../utils/formatDate')
jest.mock('../../../../../../shared/services/api/api')

const YEAR_UNKNOWN = 1005

const societalActivities = (result: Partial<PotentialApiResult>) => {
  const additionalFields = {
    activities: (result.activiteiten || []).map((activity) => activity),
    bijzondereRechtstoestand: {
      /* eslint-disable no-underscore-dangle */
      ...(result._bijzondere_rechts_toestand || {}),
      surseanceVanBetaling:
        (result._bijzondere_rechts_toestand &&
          result._bijzondere_rechts_toestand.status === 'Voorlopig') ||
        (result._bijzondere_rechts_toestand &&
          result._bijzondere_rechts_toestand.status === 'Definitief'),
      /* eslint-enable no-underscore-dangle */
    },
  }

  return { ...result, ...additionalFields }
}

describe('normalize', () => {
  // This must be mocked to prevent issues with locale settings of machines
  const localeStringMock = jest.spyOn(Number.prototype, 'toLocaleString')

  describe('normalizes "oplaadpunten', () => {
    let input
    let output
    it('returns the address and geometry', () => {
      input = {
        street: 'street',
        housenumber: '1',
        housenumberext: 'A',
        city: 'city',
        wkb_geometry: 'wkb_geometry',
      } as unknown as PotentialApiResult

      output = oplaadpunten(input)

      expect(output).toMatchObject({
        address: 'street 1 A, city',
        geometry: input.wkb_geometry,
      })

      input = {
        street: 'street',
        housenumber: '1',
        city: 'city',
      } as unknown as PotentialApiResult

      output = oplaadpunten(input)

      expect(output).toMatchObject({
        address: 'street 1, city',
      })

      input = {
        street: 'street',
        city: 'city',
      } as unknown as PotentialApiResult

      output = oplaadpunten(input)

      expect(output).toMatchObject({
        address: 'street, city',
      })
    })

    it('returns the charger type', () => {
      input = {
        charging_cap_max: 1,
      } as unknown as PotentialApiResult

      output = oplaadpunten(input)
      expect(output).toMatchObject({
        type: 'Gewoon laadpunt',
      })

      input = {
        charging_cap_max: 51,
      } as unknown as PotentialApiResult

      output = oplaadpunten(input)
      expect(output).toMatchObject({
        type: 'Snellaadpunt',
      })

      input = {
        charging_cap_max: 0,
      } as unknown as PotentialApiResult

      output = oplaadpunten(input)
      expect(output).toMatchObject({
        type: null,
      })
    })

    it('returns the current status', () => {
      input = {
        status: 'Available',
        charging_point: 1,
      } as unknown as PotentialApiResult

      output = oplaadpunten(input)
      expect(output).toMatchObject({
        currentStatus: 'Beschikbaar',
      })

      input = {
        status: 'Available',
        charging_point: 2,
      } as unknown as PotentialApiResult

      output = oplaadpunten(input)
      expect(output).toMatchObject({
        currentStatus: 'Eén of meerdere beschikbaar',
      })

      input = {
        status: 'Something else',
        charging_point: 2,
      } as unknown as PotentialApiResult

      output = oplaadpunten(input)
      expect(output).toMatchObject({
        currentStatus: 'Niet beschikbaar',
      })
    })
  })

  describe('normalizes "napPeilmerk', () => {
    let input
    let output
    it('returns the wallcoordinates and height', () => {
      input = {
        x_muurvlak: 0,
        y_muurvlak: 0,
        hoogte_nap: 0,
      } as unknown as PotentialApiResult

      output = napPeilmerk(input)

      expect(output).toMatchObject({
        wallCoordinates: `0, 0`,
        height: `0 m`,
      })

      input = {
        x_muurvlak: false,
        y_muurvlak: 0,
        hoogte_nap: false,
      } as unknown as PotentialApiResult

      output = napPeilmerk(input)

      expect(output).toMatchObject({
        wallCoordinates: '',
        height: '',
      })
    })
  })

  describe('normalizes "adressenPand', () => {
    let input
    let output
    it('returns the statusLevel and year', () => {
      input = {
        status: {
          code: 26,
          omschrijving: 'a random, not normal status',
        },
        oorspronkelijk_bouwjaar: 2012,
      } as unknown as PotentialApiResult

      output = adressenPand(input)

      expect(output).toMatchObject({
        statusLevel: 'info',
        year: input.oorspronkelijk_bouwjaar,
      })

      input = {
        oorspronkelijk_bouwjaar: `${YEAR_UNKNOWN}`,
      } as unknown as PotentialApiResult

      output = adressenPand(input)

      expect(output).toMatchObject({
        statusLevel: undefined,
        year: 'onbekend',
      })
    })
  })

  describe('normalizes "adressenVerblijfsobject', () => {
    let input
    let output
    it('returns the statusLevel', () => {
      input = {
        status: {
          code: 22,
          omschrijving: 'a random, not normal status',
        },
        hoofdadres: {
          type_adres: 'foo',
        },
        oppervlakte: 0,
      } as unknown as PotentialApiResult

      output = adressenVerblijfsobject(input)

      expect(output).toMatchObject({
        statusLevel: 'error',
        isNevenadres: false,
        typeAdres: input.hoofdadres?.type_adres,
        size: 'onbekend',
      })

      input = {
        hoofdadres: false,
        oppervlakte: 1000,
      } as unknown as PotentialApiResult

      const mockedLocaleString = '1,000'
      localeStringMock.mockImplementationOnce(() => mockedLocaleString)

      output = adressenVerblijfsobject(input)

      expect(output).toMatchObject({
        statusLevel: undefined,
        isNevenadres: true,
        typeAdres: 'Nevenadres',
        size: `${mockedLocaleString} m²`, // mocked
      })
    })

    it('returns the "gebruiksdoelen', () => {
      input = {
        gebruiksdoel: ['omschrijving'],
      } as unknown as PotentialApiResult

      output = adressenVerblijfsobject(input)

      expect(output).toMatchObject({
        gebruiksdoelen: input.gebruiksdoel?.[0],
      })

      // Checks if multiple lines are used
      input = {
        gebruiksdoel: ['omschrijving 1', 'omschrijving 2'],
      } as unknown as PotentialApiResult

      output = adressenVerblijfsobject(input)

      expect(output).toMatchObject({
        gebruiksdoelen: `omschrijving 1
omschrijving 2`,
      })

      input = {} as unknown as PotentialApiResult

      output = adressenVerblijfsobject(input)

      expect(output).toMatchObject({
        gebruiksdoelen: '',
      })
    })
  })

  describe('normalizes "kadastraalObject', () => {
    let input
    let output
    it('returns the size', async () => {
      input = {
        grootte: 0,
      } as unknown as PotentialApiResult

      output = await kadastraalObject(input)

      expect(output).toMatchObject({
        size: '0 m²',
      })

      input = {
        grootte: 1.12121121212,
      } as unknown as PotentialApiResult

      const mockedLocaleString = '1,21212'
      localeStringMock.mockImplementationOnce(() => mockedLocaleString)

      output = await kadastraalObject(input)

      expect(output).toMatchObject({
        size: `${mockedLocaleString} m²`, // mocked
      })

      input = {} as unknown as PotentialApiResult

      output = await kadastraalObject(input)

      expect(output).toMatchObject({
        size: '',
      })
    })

    it('returns the names', async () => {
      input = {
        kadastrale_gemeente: {
          naam: 'naam',
          gemeente: {
            _display: '_display',
          },
        },
      } as unknown as PotentialApiResult

      output = await kadastraalObject(input)

      expect(output).toMatchObject({
        cadastralName: input.kadastrale_gemeente?.naam,
        // eslint-disable-next-line no-underscore-dangle
        name: input.kadastrale_gemeente?.gemeente._display,
      })

      input = {} as unknown as PotentialApiResult

      output = await kadastraalObject(input)

      expect(output).toMatchObject({
        cadastralName: false,
        name: false,
      })
    })
  })

  describe('normalizes "explosieven"', () => {
    it('parses the dates', () => {
      const input = {
        datum: '2019-12-12',
        datum_inslag: '2019-12-16',
      } as unknown as PotentialApiResult

      const output = explosieven(input)

      expect(output.datum?.getTime()).toEqual(new Date('2019-12-12').getTime())
      expect(output.datum_inslag?.getTime()).toEqual(new Date('2019-12-16').getTime())
    })

    it('ingores the dates when empty', () => {
      const input = {
        datum: null,
        datum_inslag: null,
      } as unknown as PotentialApiResult

      const output = explosieven(input)

      expect(output.datum).toEqual(null)
      expect(output.datum_inslag).toEqual(null)
    })
  })

  describe('normalizes "bekendmakingen', () => {
    let input
    let output
    it('returns the geometry', () => {
      input = {
        wkb_geometry: 'wkb_geometry',
      } as unknown as PotentialApiResult

      output = bekendmakingen(input)

      expect(output).toMatchObject({
        geometry: input.wkb_geometry,
      })
    })

    it('returns the date', () => {
      const date = '12 december 2019'
      // @ts-ignore
      formatDate.mockImplementationOnce(() => date)

      input = {
        datum: 'datum',
      } as unknown as PotentialApiResult

      output = bekendmakingen(input)

      expect(output).toMatchObject({
        date,
      })

      input = {} as unknown as PotentialApiResult

      output = bekendmakingen(input)

      expect(output).toMatchObject({
        date: undefined,
      })
    })
  })

  describe('normalizes dates', () => {
    let input
    let output
    let date: string

    it('for "evenementen', () => {
      date = '11 december 2019'
      // @ts-ignore
      formatDate.mockImplementation(() => date)

      input = {
        startdatum: 'datum',
        einddatum: 'datum',
      } as unknown as PotentialApiResult

      output = evenementen(input)

      expect(output).toMatchObject({
        startDate: date,
        endDate: date,
      })

      // @ts-ignore
      formatDate.mockReset()

      input = {} as unknown as PotentialApiResult

      output = evenementen(input)

      expect(output).toMatchObject({
        startDate: undefined,
        endDate: false,
      })
    })
  })

  describe('normalizes "vastgoed', () => {
    let input
    let output

    it('returns the geometry', () => {
      input = {
        bag_pand_geometrie: 'bag_pand_geometrie',
      } as unknown as PotentialApiResult

      output = vastgoed(input)

      expect(output).toMatchObject({
        geometry: input.bag_pand_geometrie,
      })
    })

    it('returns the "monumentstatus" and year', () => {
      input = {
        monumentstatus: 'monumental_status',
        bouwjaar: 1900,
      } as unknown as PotentialApiResult

      output = vastgoed(input)

      expect(output).toMatchObject({
        monumental_status: input.monumentstatus,
        construction_year: input.bouwjaar,
      })

      input = {
        bouwjaar: YEAR_UNKNOWN,
      } as unknown as PotentialApiResult

      output = vastgoed(input)

      expect(output).toMatchObject({
        monumental_status: 'Geen monument',
        construction_year: 'onbekend',
      })
    })
  })

  describe('normalizes "societalActivities', () => {
    let input
    let output
    it('returns the activities', () => {
      input = {
        activiteiten: [{ field: 'foo' }],
      } as unknown as PotentialApiResult

      output = societalActivities(input)

      expect(output).toMatchObject({
        activities: input.activiteiten,
      })

      input = {} as unknown as PotentialApiResult

      output = societalActivities(input)

      expect(output).toMatchObject({
        activities: [],
      })
    })

    it('returns the "bijzondereRechtstoestand"', () => {
      input = {
        _bijzondere_rechts_toestand: {
          field: 'foo',
          status: 'Voorlopig',
        },
      } as unknown as PotentialApiResult

      output = societalActivities(input)

      expect(output).toMatchObject({
        bijzondereRechtstoestand: {
          // eslint-disable-next-line no-underscore-dangle
          ...input._bijzondere_rechts_toestand,
          surseanceVanBetaling: true,
        },
      })

      input = {
        _bijzondere_rechts_toestand: {
          status: 'Definitief',
        },
      } as unknown as PotentialApiResult

      output = societalActivities(input)

      expect(output).toMatchObject({
        bijzondereRechtstoestand: {
          surseanceVanBetaling: true,
        },
      })

      input = {
        _bijzondere_rechts_toestand: {
          field: 'foo',
        },
      } as unknown as PotentialApiResult

      output = societalActivities(input)

      expect(output).toMatchObject({
        bijzondereRechtstoestand: {
          surseanceVanBetaling: false,
        },
      })
    })
  })

  describe('normalizes "winkelgebied', () => {
    let input
    let output
    it('returns the geometry', () => {
      input = {
        wkb_geometry: 'wkb_geometry',
      } as unknown as PotentialApiResult

      output = winkelgebied(input)

      expect(output).toMatchObject({
        geometry: input.wkb_geometry,
      })
    })
  })

  describe('normalizes "parkeerzones', () => {
    let input
    let output
    it('returns the geometry', () => {
      input = {
        wkb_geometry: 'wkb_geometry',
      } as unknown as PotentialApiResult

      output = parkeerzones(input)

      expect(output).toMatchObject({
        geometry: input.wkb_geometry,
      })
    })
  })

  describe('normalizes "monument', () => {
    let input
    let output
    it('returns the geometry', () => {
      input = {
        monumentcoordinaten: 'monumentcoordinaten',
      } as unknown as PotentialApiResult

      output = monument(input)

      expect(output).toMatchObject({
        geometry: input.monumentcoordinaten,
      })
    })
  })

  describe('normalizes "meetbout', () => {
    let input
    let output
    it('returns the speed', async () => {
      input = {
        zakkingssnelheid: 0.1212121212,
      } as unknown as PotentialApiResult

      output = await meetbout(input)

      expect(output).toMatchObject({
        speed: '0,121',
      })
    })
  })

  describe('normalizes "reclamebelasting', () => {
    let input
    let output
    it('returns the geometry', () => {
      input = {
        wkb_geometry: 'wkb_geometry',
      } as unknown as PotentialApiResult

      output = reclamebelasting(input)

      expect(output).toMatchObject({
        geometry: input.wkb_geometry,
      })
    })

    it('returns the localeDate', () => {
      input = {} as unknown as PotentialApiResult

      output = reclamebelasting(input)

      expect(output).toMatchObject({
        localeDate: '1 januari 2020',
      })
    })
  })

  describe('normalize grex projects', () => {
    it('should format the planstatus', () => {
      expect(
        grexProject({ planstatus: 'A', oppervlakte: 0 } as unknown as PotentialApiResult)
          .planstatusFormatted,
      ).toEqual('Actueel')
      expect(
        grexProject({ planstatus: 'T', oppervlakte: 0 } as unknown as PotentialApiResult)
          .planstatusFormatted,
      ).toEqual('Toekomstig')
      expect(
        grexProject({ planstatus: 'NOPE', oppervlakte: 0 } as unknown as PotentialApiResult)
          .planstatusFormatted,
      ).toEqual('NOPE')
    })

    it('should format the oppervlakte', () => {
      expect(
        grexProject({ planstatus: 'A', oppervlakte: 12 } as unknown as PotentialApiResult)
          .oppervlakteFormatted,
      ).toEqual('12 m²')
    })

    it('should pass along other properties', () => {
      expect(
        grexProject({
          planstatus: 'A',
          oppervlakte: 12,
          foo: 'bar',
          // @ts-ignore
        } as any).foo,
      ).toEqual('bar')
    })
  })

  describe('meetboutTable', () => {
    it('returns converted floating point values', () => {
      const metingData = meetbouwMetingFixture.results
      const output = expect.arrayContaining([
        expect.objectContaining({
          zakking: expect.stringContaining('+'),
          zakking_cumulatief: expect.stringContaining('+'),
          zakkingssnelheid: expect.stringContaining('+'),
        }),
      ])
      expect(meetboutTable(metingData)).toEqual(output)
    })
  })

  describe('getGarbageContainersByBagObject', () => {
    it('should call fetchWithToken with the right arguments', () => {
      const fetchWithTokenMock = jest.spyOn(api, 'fetchWithToken')
      getGarbageContainersByBagObject('123', 'ligplaats')
      expect(fetchWithTokenMock).toHaveBeenCalledWith(
        `${environment.API_ROOT}v1/huishoudelijkafval/bag_object_loopafstand/`,
        { format: 'json', bagObjectType: 'ligplaats', bagObjectId: '123' },
      )
    })
  })

  describe('getGarbageContainersByAddress', () => {
    it('should call fetchWithToken with the right arguments', () => {
      const fetchWithTokenMock = jest.spyOn(api, 'fetchWithToken')
      getGarbageContainersByAddress('123')
      expect(fetchWithTokenMock).toHaveBeenCalledWith(
        `${environment.API_ROOT}v1/huishoudelijkafval/adres_loopafstand/`,
        {
          format: 'json',
          adresseerbaarobjectId: '123',
        },
      )
    })
  })
})
