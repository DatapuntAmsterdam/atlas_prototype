import formatDate from '../../utils/formatDate'
import {
  aggregateFilter,
  alignRightFilter,
  bagAddressFilter,
  dateFilter,
  hrBezoekAdresFilter,
  modificationDateFilter,
  nevenadresFilter,
  nummerAanduidingTypeFilter,
  truncateHtmlAsTextFilter,
  verblijfsObjectGevormdFilter,
  zipCodeFilter,
} from './Filters'

jest.mock('../../utils/formatDate')

describe('Filters', () => {
  describe('aggregate filter', () => {
    it('return an array with for every string in the input array an entry with the name and # occurences', () => {
      expect(aggregateFilter(['aap', 'aap'])).toEqual([
        {
          name: 'aap',
          count: 2,
        },
      ])
    })

    it('accepts empty tags', () => {
      expect(aggregateFilter(['aap', undefined, undefined, 'aap'])).toEqual([
        {
          name: 'aap',
          count: 2,
        },
        {
          name: undefined,
          count: 2,
        },
      ])
    })

    it('returns an empty array when supplied with an empty array', () => {
      expect(aggregateFilter([])).toEqual([])
    })

    it('returns an array sorted on number of occurences and then on name', () => {
      expect(aggregateFilter(['aap', 'aap', 'noot', 'noot', 'mies'])).toEqual([
        {
          name: 'aap',
          count: 2,
        },
        {
          name: 'noot',
          count: 2,
        },
        {
          name: 'mies',
          count: 1,
        },
      ])
      expect(aggregateFilter(['aap', 'aap', 'noot', 'noot', 'noot', 'mies'])).toEqual([
        {
          name: 'noot',
          count: 3,
        },
        {
          name: 'aap',
          count: 2,
        },
        {
          name: 'mies',
          count: 1,
        },
      ])
      expect(aggregateFilter(['noot', 'noot', 'aap', 'aap', 'mies', 'mies'])).toEqual([
        {
          name: 'aap',
          count: 2,
        },
        {
          name: 'mies',
          count: 2,
        },
        {
          name: 'noot',
          count: 2,
        },
      ])
    })
  })
  describe('align-right filter', () => {
    it('wraps a div with class u-align-right around the input (String)', () => {
      const output = alignRightFilter('some text')

      expect(output).toMatchSnapshot()
    })

    it('uses single quotes around attribute values', () => {
      // Bugfix tg-2333; Firefox 38 (used on ADW) can't use ng-bind-html in combination with
      // double quotes
      const output = alignRightFilter('some text')

      expect(output).toContain("'")
      expect(output).not.toContain('"')
    })
  })
  describe('bag address filter', () => {
    it('returns _openbare_ruimte_naam followed by the huisnummer and an optional huisletter', () => {
      let output

      // huisnummer
      const input = {
        _openbare_ruimte_naam: 'Weesperstraat',
        huisnummer: 113,
        huisletter: '',
        huisnummer_toevoeging: '',
      }
      output = bagAddressFilter(input)
      expect(output).toBe('Weesperstraat 113')

      // huisnummer + huisletter
      input.huisletter = 'B'
      output = bagAddressFilter(input)
      expect(output).toBe('Weesperstraat 113B')
    })

    it('shows an optional huisnummer_toevoeging after the huisnummer+huisletter', () => {
      let output

      // huisnummer
      const input = {
        _openbare_ruimte_naam: 'Weesperstraat',
        huisnummer: 113,
        huisletter: '',
        huisnummer_toevoeging: '1',
      }
      output = bagAddressFilter(input)
      expect(output).toBe('Weesperstraat 113-1')

      // huisnummer + huisletter
      input.huisletter = 'B'
      output = bagAddressFilter(input)
      expect(output).toBe('Weesperstraat 113B-1')
    })
  })
  describe('date filter', () => {
    it('returns empty string when date is unknown', () => {
      const output = dateFilter()
      const formatDateMock = formatDate.mockImplementationOnce(() => '01-02-2018')

      expect(formatDateMock).not.toHaveBeenCalled()
      expect(output).toBe('')

      formatDate.mockClear()
    })

    it('returns the date in dutch format', () => {
      const output = dateFilter('2018-02-01')
      const formatDateMock = formatDate.mockImplementationOnce(() => '01-02-2018')

      expect(formatDateMock).toHaveBeenCalled()
      expect(output).toBe('01-02-2018')

      formatDate.mockClear()
    })
  })
  describe('hr bezoekadres filter', () => {
    it('returns bezoekadres when non mailing indication is true', () => {
      const input = {
        bezoekadres_volledig_adres: 'Weesperstraat 113, Amsterdam',
        non_mailing: true,
      }
      const output = hrBezoekAdresFilter(input)
      expect(output).toBe('Weesperstraat 113, Amsterdam')
    })

    it('returns bezoekadres when non mailing indication is false', () => {
      const input = {
        bezoekadres_volledig_adres: 'Weesperstraat 113, Amsterdam',
        non_mailing: false,
      }
      const output = hrBezoekAdresFilter(input)
      expect(output).toBe('Weesperstraat 113, Amsterdam')
    })
  })
  describe('modification date filter', () => {
    let dateNowSpy

    beforeAll(() => {
      // Lock Time
      dateNowSpy = jest.spyOn(Date, 'now').mockImplementation(() => 1538697600000)
    })

    afterAll(() => {
      // Unlock Time
      dateNowSpy.mockRestore()
    })

    it('expects an object with two dates as input', () => {
      expect(modificationDateFilter()).toBeUndefined()
    })

    it('shows the time as since created: today / 0 days', () => {
      expect(modificationDateFilter('2018-10-05')).toContain('vandaag')
    })

    it('shows the time as since created: yesterday / 1 days', () => {
      expect(modificationDateFilter('2018-10-04')).toContain('gisteren')
    })

    it('shows the time as since created: 4 days', () => {
      expect(modificationDateFilter('2018-10-01')).toContain('4 dagen geleden')
    })

    it('shows the time as since created: future time', () => {
      expect(modificationDateFilter('2018-11-04')).toContain('in de toekomst')
    })
  })

  describe('nevenadres filter', () => {
    it('returns the String "(nevenadres)" when the input (hoofdadres) is "false"', () => {
      expect(nevenadresFilter('False')).toBe('(nevenadres)')
      expect(nevenadresFilter('false')).toBe('(nevenadres)')

      // Return an empty String for all other values
      expect(nevenadresFilter('True')).toBe('')
      expect(nevenadresFilter('')).toBe('')
    })
  })
  describe('nummeraanduiding filter', () => {
    it('returns "(ligplaats)" when there is a ligplaats_id', () => {
      const input = {
        ligplaats_id: '12345',
        standplaats_id: '',
      }
      expect(nummerAanduidingTypeFilter(input)).toBe('(ligplaats)')
    })

    it('returns "(standplaats)" when there is a standplaats_id', () => {
      const input = {
        ligplaats_id: '',
        standplaats_id: '12345',
      }
      expect(nummerAanduidingTypeFilter(input)).toBe('(standplaats)')
    })

    it('returns an empty string when there is no ligplaats_id and no standplaats_id', () => {
      const input = {
        ligplaats_id: '',
        standplaats_id: '',
      }
      expect(nummerAanduidingTypeFilter(input)).toBe('')
    })
  })

  describe('truncate filter', () => {
    const MAX_LENGTH = 250
    const ELLIPSES = '...'
    it('removes HTML code from the input text', () => {
      expect(truncateHtmlAsTextFilter('<div>aap<br></div>noot<p>mies')).toEqual('aapnootmies')
    })

    it('caps the resulting text to a maximum of 250 characters', () => {
      for (let i = MAX_LENGTH - 25; i < MAX_LENGTH + 25; i += 1) {
        expect(truncateHtmlAsTextFilter('a'.repeat(i)).length).toBe(
          i <= MAX_LENGTH ? i : MAX_LENGTH,
        )
      }
    })

    it('adds ... to a text if it is capped', () => {
      for (let i = MAX_LENGTH + 1; i < MAX_LENGTH + 25; i += 1) {
        expect(truncateHtmlAsTextFilter('a'.repeat(i))).toBe(
          'a'.repeat(MAX_LENGTH - ELLIPSES.length) + ELLIPSES,
        )
      }
    })

    it('does not add ... to a text if it is not capped', () => {
      for (let i = MAX_LENGTH - 25; i <= MAX_LENGTH; i += 1) {
        expect(truncateHtmlAsTextFilter('a'.repeat(i))).toBe('a'.repeat(i))
      }
    })

    it('caps the text on the last space, if a space is available', () => {
      expect(truncateHtmlAsTextFilter('a'.repeat(MAX_LENGTH - 50) + ' '.repeat(75)).length).toEqual(
        MAX_LENGTH - 50,
      )
      expect(
        truncateHtmlAsTextFilter('a'.repeat(MAX_LENGTH - 50) + ' '.repeat(25) + 'a'.repeat(50))
          .length,
      ).toEqual(MAX_LENGTH - 50 + ELLIPSES.length)
    })

    it('only works on strings, other input is returned unchanged', () => {
      ;[5, true, { aap: 'noot' }].forEach((e) => {
        expect(truncateHtmlAsTextFilter(e)).toEqual(e)
      })
    })
  })

  describe('verblijfsobject filter', () => {
    it('returns "(verblijfsobject gevormd)" when the input (status_id) is "18"', () => {
      expect(verblijfsObjectGevormdFilter('18')).toBe('(verblijfsobject gevormd)')
    })

    it('returns an empty string for all other input values', () => {
      expect(verblijfsObjectGevormdFilter('17')).toBe('')
      expect(verblijfsObjectGevormdFilter('19')).toBe('')
      expect(verblijfsObjectGevormdFilter('')).toBe('')
    })
  })

  describe('zipcode filter', () => {
    it('does format a 1234AB formatted zipcode', () => {
      expect(zipCodeFilter('1234AB')).toBe('1234 AB')
    })

    it('does not format non valid dutch zipcodes', () => {
      expect(zipCodeFilter('0234AB')).toBe('0234AB')
      expect(zipCodeFilter('1234$$')).toBe('1234$$')
    })

    it('does not format a non-1234AB formatted zipcode', () => {
      expect(zipCodeFilter('X')).toBe('X')
      expect(zipCodeFilter('1234 AB')).toBe('1234 AB')
    })

    it('does show empty zipcodes as (leeg)', () => {
      expect(zipCodeFilter('')).toBe('')
      expect(zipCodeFilter(null)).toBeNull()
      expect(zipCodeFilter(undefined)).toBeUndefined()
    })
  })
})
