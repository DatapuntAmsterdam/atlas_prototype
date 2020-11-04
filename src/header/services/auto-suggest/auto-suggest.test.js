import typeaheadFixture from '../../../api/typeahead/typeahead.json'
import autoSuggestSearch, { formatResponse, sortResponse, SORT_ORDER } from './auto-suggest'
import * as api from '../../../shared/services/api/api'

jest.mock('../../../shared/services/auth/auth', () =>
  jest.requireActual('../../../shared/services/auth/auth'),
)

jest.mock('../../../shared/services/api/api', () =>
  jest.requireActual('../../../shared/services/api/api'),
)

describe('The auto-suggest service', () => {
  it('calls API', async () => {
    const fetchProxy = jest.spyOn(api, 'fetchProxy')

    expect(fetchProxy).not.toHaveBeenCalled()

    const response = await autoSuggestSearch({ query: 'zork' })

    expect(response).not.toBeUndefined()
    expect(fetchProxy).toHaveBeenCalled()
  })

  describe('formatResponse', () => {
    it('returns a formatted response', () => {
      const response = formatResponse(typeaheadFixture)

      response.forEach((item) => {
        expect(Object.keys(item).includes('type')).toBeTruthy()
      })
    })

    it('returns filtered response', () => {
      const typeToInclude = 'map'
      const response = formatResponse(typeaheadFixture, typeToInclude)

      response.forEach((item) => {
        expect(item.type).toEqual(typeToInclude)
      })
    })
  })

  describe('sortResponse', () => {
    it('should sort the response when all labels are returned', () => {
      const results = SORT_ORDER.map((key) => ({ label: key })).sort(
        (a, b) => b.label.localeCompare(a.label), // sort alphabetically to scrumble results
      )

      const expected = SORT_ORDER.map((key) => ({ label: key }))

      expect(sortResponse(results)).toEqual(expected)
    })

    it('should sort the response when the first four labels are returned', () => {
      const results = SORT_ORDER.map((key) => ({ label: key }))
        .slice(0, 4)
        .sort(
          (a, b) => b.label.localeCompare(a.label), // sort alphabetically to scrumble results
        )

      const expected = SORT_ORDER.map((key) => ({ label: key })).slice(0, 4)

      expect(sortResponse(results)).toEqual(expected)
    })

    it('should sort the response when the last four labels are returned', () => {
      const results = SORT_ORDER.map((key) => ({ label: key }))
        .slice(4)
        .sort(
          (a, b) => b.label.localeCompare(a.label), // sort alphabetically to scrumble results
        )

      const expected = SORT_ORDER.map((key) => ({ label: key })).slice(4)

      expect(sortResponse(results)).toEqual(expected)
    })
  })
})
