import typeaheadFixture from '../../../api/typeahead/typeahead.json'
import autoSuggestSearch, { sortResponse, SORT_ORDER, TypeaheadItem } from './auto-suggest'

describe('The auto-suggest service', () => {
  it('returns data', async () => {
    const suggestions = await autoSuggestSearch({ query: 'linnae' })

    expect(suggestions.length).toBe(typeaheadFixture.length)
  })

  describe('sortResponse', () => {
    it('should sort the response when all labels are returned', () => {
      const results = SORT_ORDER.map((key) => ({ label: key })).sort(
        (a, b) => b.label.localeCompare(a.label), // sort alphabetically to scrumble results
      ) as TypeaheadItem[]

      const expected = SORT_ORDER.map((key) => ({ label: key }))

      expect(sortResponse(results)).toEqual(expected)
    })

    it('should sort the response when the first four labels are returned', () => {
      const results = SORT_ORDER.map((key) => ({ label: key }))
        .slice(0, 4)
        .sort(
          (a, b) => b.label.localeCompare(a.label), // sort alphabetically to scrumble results
        ) as TypeaheadItem[]

      const expected = SORT_ORDER.map((key) => ({ label: key })).slice(0, 4)

      expect(sortResponse(results)).toEqual(expected)
    })

    it('should sort the response when the last four labels are returned', () => {
      const results = SORT_ORDER.map((key) => ({ label: key }))
        .slice(4)
        .sort(
          (a, b) => b.label.localeCompare(a.label), // sort alphabetically to scrumble results
        ) as TypeaheadItem[]

      const expected = SORT_ORDER.map((key) => ({ label: key })).slice(4)

      expect(sortResponse(results)).toEqual(expected)
    })
  })
})
