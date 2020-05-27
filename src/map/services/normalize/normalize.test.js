import formatDate from '../../../shared/services/date-formatter/date-formatter'
import {
  adressenPand,
  adressenVerblijfsobject,
  bekendmakingen,
  evenementen,
  explosieven,
  grexProject,
  kadastraalObject,
  meetbout,
  monument,
  napPeilmerk,
  oplaadpunten,
  parkeerzones,
  reclamebelasting,
  societalActivities,
  vastgoed,
  winkelgebied,
  YEAR_UNKNOWN,
} from './normalize'
import NotificationLevel from '../../../app/models/notification'

jest.mock('../../../shared/services/date-formatter/date-formatter')

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
      }

      output = oplaadpunten(input)

      expect(output).toMatchObject({
        address: `${input.street} ${input.housenumber} ${input.housenumberext}, ${input.city}`,
        geometry: input.wkb_geometry,
      })

      input = {
        street: 'street',
        housenumber: '1',
        city: 'city',
      }

      output = oplaadpunten(input)

      expect(output).toMatchObject({
        address: `${input.street} ${input.housenumber}, ${input.city}`,
      })

      input = {
        street: 'street',
        city: 'city',
      }

      output = oplaadpunten(input)

      expect(output).toMatchObject({
        address: `${input.street}, ${input.city}`,
      })
    })

    it('returns the charger type', () => {
      input = {
        charging_cap_max: 1,
      }

      output = oplaadpunten(input)
      expect(output).toMatchObject({
        type: 'Gewoon laadpunt',
      })

      input = {
        charging_cap_max: 51,
      }

      output = oplaadpunten(input)
      expect(output).toMatchObject({
        type: 'Snellaadpunt',
      })

      input = {
        charging_cap_max: 0,
      }

      output = oplaadpunten(input)
      expect(output).toMatchObject({
        type: null,
      })
    })

    it('returns the current status', () => {
      input = {
        status: 'Available',
        charging_point: 1,
      }

      output = oplaadpunten(input)
      expect(output).toMatchObject({
        currentStatus: 'Beschikbaar',
      })

      input = {
        status: 'Available',
        charging_point: 2,
      }

      output = oplaadpunten(input)
      expect(output).toMatchObject({
        currentStatus: 'Eén of meerdere beschikbaar',
      })

      input = {
        status: 'Something else',
        charging_point: 2,
      }

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
      }

      output = napPeilmerk(input)

      expect(output).toMatchObject({
        wallCoordinates: `${input.x_muurvlak}, ${input.y_muurvlak}`,
        height: `${input.hoogte_nap} m`,
      })

      input = {
        x_muurvlak: false,
        y_muurvlak: 0,
        hoogte_nap: false,
      }

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
      }

      output = adressenPand(input)

      expect(output).toMatchObject({
        statusLevel: NotificationLevel.Attention,
        year: input.oorspronkelijk_bouwjaar,
      })

      input = {
        oorspronkelijk_bouwjaar: `${YEAR_UNKNOWN}`,
      }

      output = adressenPand(input)

      expect(output).toMatchObject({
        statusLevel: false,
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
      }

      output = adressenVerblijfsobject(input)

      expect(output).toMatchObject({
        statusLevel: NotificationLevel.Error,
        isNevenadres: false,
        typeAdres: input.hoofdadres.type_adres,
        size: 'onbekend',
      })

      input = {
        hoofdadres: false,
        oppervlakte: 1000,
      }

      const mockedLocaleString = '1,000'
      localeStringMock.mockImplementationOnce(() => mockedLocaleString)

      output = adressenVerblijfsobject(input)

      expect(output).toMatchObject({
        statusLevel: false,
        isNevenadres: true,
        typeAdres: 'Nevenadres',
        size: `${mockedLocaleString} m²`, // mocked
      })
    })

    it('returns the "gebruiksdoelen', () => {
      input = {
        gebruiksdoel: ['omschrijving'],
      }

      output = adressenVerblijfsobject(input)

      expect(output).toMatchObject({
        gebruiksdoelen: input.gebruiksdoel[0],
      })

      // Checks if multiple lines are used
      input = {
        gebruiksdoel: ['omschrijving 1', 'omschrijving 2'],
      }

      output = adressenVerblijfsobject(input)

      expect(output).toMatchObject({
        gebruiksdoelen: `${input.gebruiksdoel[0]}
${input.gebruiksdoel[1]}`,
      })

      input = {}

      output = adressenVerblijfsobject(input)

      expect(output).toMatchObject({
        gebruiksdoelen: '',
      })
    })
  })

  describe('normalizes "kadastraalObject', () => {
    let input
    let output
    it('returns the size', () => {
      input = {
        grootte: 0,
      }

      output = kadastraalObject(input)

      expect(output).toMatchObject({
        size: '0 m²',
      })

      input = {
        grootte: 1.12121121212,
      }

      const mockedLocaleString = '1,21212'
      localeStringMock.mockImplementationOnce(() => mockedLocaleString)

      output = kadastraalObject(input)

      expect(output).toMatchObject({
        size: `${mockedLocaleString} m²`, // mocked
      })

      input = {}

      output = kadastraalObject(input)

      expect(output).toMatchObject({
        size: '',
      })
    })

    it('returns the names', () => {
      input = {
        kadastrale_gemeente: {
          naam: 'naam',
          gemeente: {
            _display: '_display',
          },
        },
      }

      output = kadastraalObject(input)

      expect(output).toMatchObject({
        cadastralName: input.kadastrale_gemeente.naam,
        name: input.kadastrale_gemeente.gemeente._display,
      })

      input = {}

      output = kadastraalObject(input)

      expect(output).toMatchObject({
        cadastralName: false,
        name: false,
      })
    })
  })

  describe('normalizes "bekendmakingen', () => {
    let input
    let output
    it('returns the geometry', () => {
      input = {
        wkb_geometry: 'wkb_geometry',
      }

      output = bekendmakingen(input)

      expect(output).toMatchObject({
        geometry: input.wkb_geometry,
      })
    })

    it('returns the date', () => {
      const date = '12 december 2019'
      formatDate.mockImplementationOnce(() => date)

      input = {
        datum: 'datum',
      }

      output = bekendmakingen(input)

      expect(output).toMatchObject({
        date,
      })

      input = {}

      output = bekendmakingen(input)

      expect(output).toMatchObject({
        date: undefined,
      })
    })
  })

  describe('normalizes dates', () => {
    let input
    let output
    let date
    it('for "explosieven', () => {
      date = '12 december 2019'
      formatDate.mockImplementationOnce(() => date)

      input = {
        datum: 'datum',
      }

      output = explosieven(input)

      expect(output).toMatchObject({
        date,
      })
    })
    it('for "evenementen', () => {
      date = '11 december 2019'
      formatDate.mockImplementation(() => date)

      input = {
        startdatum: 'datum',
        einddatum: 'datum',
      }

      output = evenementen(input)

      expect(output).toMatchObject({
        startDate: date,
        endDate: date,
      })

      formatDate.mockReset()

      input = {}

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
      }

      output = vastgoed(input)

      expect(output).toMatchObject({
        geometry: input.bag_pand_geometrie,
      })
    })

    it('returns the "monumentstatus" and year', () => {
      input = {
        monumentstatus: 'monumental_status',
        bouwjaar: 1900,
      }

      output = vastgoed(input)

      expect(output).toMatchObject({
        monumental_status: input.monumentstatus,
        construction_year: input.bouwjaar,
      })

      input = {
        bouwjaar: YEAR_UNKNOWN,
      }

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
      }

      output = societalActivities(input)

      expect(output).toMatchObject({
        activities: input.activiteiten,
      })

      input = {}

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
      }

      output = societalActivities(input)

      expect(output).toMatchObject({
        bijzondereRechtstoestand: {
          ...input._bijzondere_rechts_toestand,
          surseanceVanBetaling: true,
        },
      })

      input = {
        _bijzondere_rechts_toestand: {
          status: 'Definitief',
        },
      }

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
      }

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
      }

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
      }

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
      }

      output = monument(input)

      expect(output).toMatchObject({
        geometry: input.monumentcoordinaten,
      })
    })
  })

  describe('normalizes "meetbout', () => {
    let input
    let output
    it('returns the speed', () => {
      input = {
        zakkingssnelheid: 0.1212121212,
      }

      output = meetbout(input)

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
      }

      output = reclamebelasting(input)

      expect(output).toMatchObject({
        geometry: input.wkb_geometry,
      })
    })

    it('returns the localeDate', () => {
      input = {}

      output = reclamebelasting(input)

      expect(output).toMatchObject({
        localeDate: '1 januari 2020',
      })
    })
  })

  describe('normalize grex projects', () => {
    it('should format the planstatus', () => {
      expect(grexProject({ planstatus: 'A', oppervlakte: 0 }).planstatusFormatted).toEqual(
        'Actueel',
      )
      expect(grexProject({ planstatus: 'T', oppervlakte: 0 }).planstatusFormatted).toEqual(
        'Toekomstig',
      )
      expect(grexProject({ planstatus: 'NOPE', oppervlakte: 0 }).planstatusFormatted).toEqual(
        'NOPE',
      )
    })

    it('should format the oppervlakte', () => {
      expect(grexProject({ planstatus: 'A', oppervlakte: 12 }).oppervlakteFormatted).toEqual(
        '12 m²',
      )
    })

    it('should pass along other properties', () => {
      expect(grexProject({ planstatus: 'A', oppervlakte: 12, foo: 'bar' }).foo).toEqual('bar')
    })
  })
})
