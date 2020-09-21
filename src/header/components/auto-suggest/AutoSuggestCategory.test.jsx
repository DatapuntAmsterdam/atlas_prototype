import React from 'react'
import { shallow } from 'enzyme'
import AutoSuggestCategory from './AutoSuggestCategory'

jest.mock('../../../app/pages/SearchPage/config', () => ({
  TYPES: {
    DATA: 'data',
  },
}))

describe('AutoSuggestCategory', () => {
  let props
  beforeEach(() => {
    props = {
      activeSuggestion: {
        index: -1,
      },
      category: {
        label: 'Straatnamen',
        type: 'data',
        content: [
          {
            category: 'Straatnamen',
            index: 0,
            label: 'Dam',
            uri: 'bag/openbareruimte/03630000003186/',
          },
          {
            category: 'Straatnamen',
            index: 1,
            label: 'Damloperspad',
            uri: 'bag/openbareruimte/03630000001038/',
          },
          {
            category: 'Straatnamen',
            index: 2,
            label: 'Damrak',
            uri: 'bag/openbareruimte/03630000003187/',
          },
        ],
        totalResults: 6,
      },
      onSuggestionSelection: jest.fn(),
      query: 'dam',
    }
  })

  it('should render a "more results" link when the returned results are less than the total results', () => {
    const wrapper = shallow(<AutoSuggestCategory {...props} />)

    const items = wrapper.find('AutoSuggestItem')
    expect(items.length).toBe(3)
  })

  it("should not render a 'more results' link when there aren't more results returned than the total results", () => {
    props.category.totalResults = 3
    const wrapper = shallow(<AutoSuggestCategory {...props} />)

    const items = wrapper.find('AutoSuggestItem')
    expect(items.length).toBe(3)
  })
})
