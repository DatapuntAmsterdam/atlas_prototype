import React from 'react'
import { shallow } from 'enzyme'
import AutoSuggestCategory, { MORE_RESULTS_INDEX } from './AutoSuggestCategory'

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
        total_results: 6,
      },
      onSuggestionSelection: jest.fn(),
      query: 'dam',
    }
  })

  it('should render ellipsis when the returned results are less than the total results', () => {
    const wrapper = shallow(<AutoSuggestCategory {...props} />)

    expect(wrapper).toMatchSnapshot()
    const items = wrapper.find('AutoSuggestItem')
    expect(items.length).toBe(4)
  })

  it('should handle the click on an ellipsis option', () => {
    const wrapper = shallow(<AutoSuggestCategory {...props} />)

    const mockEvent = { event: 'event' }
    const itemWrapper = wrapper.find('AutoSuggestItem').at(3).dive()
    itemWrapper.find('button').simulate('click', mockEvent)
    expect(props.onSuggestionSelection).toHaveBeenCalledWith(
      {
        index: MORE_RESULTS_INDEX,
        label: '...',
        type: 'data',
      },
      mockEvent,
    )
  })

  it("should render no ellipsis when there aren't more results returned than the total results", () => {
    props.category.total_results = 3
    const wrapper = shallow(<AutoSuggestCategory {...props} />)

    expect(wrapper).toMatchSnapshot()
    const items = wrapper.find('AutoSuggestItem')
    expect(items.length).toBe(3)
  })
})
