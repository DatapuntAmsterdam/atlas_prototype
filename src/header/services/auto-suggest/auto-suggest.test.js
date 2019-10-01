import autoSuggestSearch, { orderAutoSuggestResults } from './auto-suggest'
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

  it('search query must be at least three characters', () => {
    expect(autoSuggestSearch('li')).toEqual({})
  })

  it('can search and format data', () => {
    fetch.mockResponseOnce(JSON.stringify(mockedResults))
    autoSuggestSearch('linnae').then(suggestions => {
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
    it('should sort the autoresults like follows: data [multiple keys], publications, datasets, articles', () => {
      const data = [{ label: 'foo' }, { label: 'bar' }, { label: 'baz' }]
      const datasets = { label: 'Datasets' }
      const publications = { label: 'Publicaties' }
      const articles = { label: 'Artikelen' }

      const expectationAll = [...data, publications, datasets, articles]
      const expectationFew1 = [...data, datasets, articles]
      const expectationFew2 = [...data, publications, datasets]
      const expectationFew3 = [...data, publications, articles]
      const expectationFew4 = [publications, datasets, articles]

      expect(orderAutoSuggestResults([...data, articles, publications, datasets])).toEqual(
        expectationAll,
      )
      expect(orderAutoSuggestResults([articles, ...data, datasets, publications])).toEqual(
        expectationAll,
      )
      expect(orderAutoSuggestResults([publications, articles, ...data, datasets])).toEqual(
        expectationAll,
      )
      expect(orderAutoSuggestResults([articles, datasets, ...data])).toEqual(expectationFew1)
      expect(orderAutoSuggestResults([datasets, publications, ...data])).toEqual(expectationFew2)
      expect(orderAutoSuggestResults([articles, publications, ...data])).toEqual(expectationFew3)
      expect(orderAutoSuggestResults([datasets, articles, publications])).toEqual(expectationFew4)
    })
  })
})
