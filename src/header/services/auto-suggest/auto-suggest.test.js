import autoSuggestSearch, { orderAutoSuggestResults, SORT_ORDER } from './auto-suggest'
import { getAuthHeaders } from '../../../shared/services/auth/auth'

jest.mock('../../../shared/services/auth/auth')

const mockedResults = [
  {
    label: 'Straatnamen (1)',
    content: [
      {
        _display: 'Linnaeusstraat (427 adressen)',
        query: 'Linnaeusstraat',
        uri: 'bag/openbareruimte/123',
        category: 'Straatnamen (1)',
      },
    ],
  },
  {
    label: 'Adressen (2)',
    content: [
      {
        _display: 'Linnaeusstraat 1',
        query: 'Linnaeusstraat 1',
        uri: 'bag/verblijfsobject/123',
        category: 'Adressen (2)',
      },
      {
        _display: 'Linnaeusstraat 2',
        query: 'Linnaeusstraat 2',
        uri: 'bag/verblijfsobject/124',
        category: 'Adressen (2)',
      },
    ],
  },
]

describe('The auto-suggest service', () => {
  beforeEach(() => {
    getAuthHeaders.mockImplementation(() => ({}))
  })

  afterEach(() => {})

  it('search query must be at least three characters', async () => {
    const value = await autoSuggestSearch('li')
    expect(value).toEqual({})
  })

  it('can search and format data', () => {
    fetch.mockResponseOnce(JSON.stringify(mockedResults))
    autoSuggestSearch('linnae').then((suggestions) => {
      expect(suggestions.count).toBe(3)
      expect(suggestions.data.length).toBe(2)

      expect(suggestions.data[0].label).toBe('Straatnamen (1)')
      expect(suggestions.data[0].content.length).toBe(1)

      expect(suggestions.data[0].content[0].label).toBe('Linnaeusstraat (427 adressen)')
      expect(suggestions.data[0].content[0].uri).toBe('bag/openbareruimte/123')
      expect(suggestions.data[0].content[0].category).toBe('Straatnamen (1)')

      expect(suggestions.data[0].content[0].index).toBe(0)

      expect(suggestions.data[1].label).toBe('Adressen (2)')
      expect(suggestions.data[1].content.length).toBe(2)

      expect(suggestions.data[1].content[0].label).toBe('Linnaeusstraat 1')
      expect(suggestions.data[1].content[0].uri).toBe('bag/verblijfsobject/123')
      expect(suggestions.data[1].content[0].index).toBe(1)

      expect(suggestions.data[1].content[1].label).toBe('Linnaeusstraat 2')
      expect(suggestions.data[1].content[1].uri).toBe('bag/verblijfsobject/124')
      expect(suggestions.data[1].content[1].index).toBe(2)
    })
  })

  describe('sortAutoSuggestResults', () => {
    it('should sort the autoresults when all labels are returned', () => {
      const results = SORT_ORDER.map((key) => ({ label: key })).sort(
        (a, b) => b.label.localeCompare(a.label), // sort alphabetically to scrumble results
      )

      const expected = SORT_ORDER.map((key) => ({ label: key }))

      expect(orderAutoSuggestResults(results)).toEqual(expected)
    })

    it('should sort the autoresults when the first four labels are returned', () => {
      const results = SORT_ORDER.map((key) => ({ label: key }))
        .slice(0, 4)
        .sort(
          (a, b) => b.label.localeCompare(a.label), // sort alphabetically to scrumble results
        )

      const expected = SORT_ORDER.map((key) => ({ label: key })).slice(0, 4)

      expect(orderAutoSuggestResults(results)).toEqual(expected)
    })

    it('should sort the autoresults when the last four labels are returned', () => {
      const results = SORT_ORDER.map((key) => ({ label: key }))
        .slice(4)
        .sort(
          (a, b) => b.label.localeCompare(a.label), // sort alphabetically to scrumble results
        )

      const expected = SORT_ORDER.map((key) => ({ label: key })).slice(4)

      expect(orderAutoSuggestResults(results)).toEqual(expected)
    })
  })
})
