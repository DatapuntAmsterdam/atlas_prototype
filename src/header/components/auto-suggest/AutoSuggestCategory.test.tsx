import { shallow } from 'enzyme'
import AutoSuggestCategory, { AutoSuggestCategoryProps } from './AutoSuggestCategory'

jest.mock('../../../app/pages/SearchPage/config', () => ({
  TYPES: {
    DATA: 'data',
  },
}))

describe('AutoSuggestCategory', () => {
  let props: AutoSuggestCategoryProps
  beforeEach(() => {
    props = {
      category: {
        label: 'Straatnamen',
        type: 'data',
        content: [
          {
            category: 'Straatnamen',
            type: '',
            index: 0,
            label: 'Dam',
            uri: 'bag/openbareruimte/03630000003186/',
          },
          {
            category: 'Straatnamen',
            type: '',
            index: 1,
            label: 'Damloperspad',
            uri: 'bag/openbareruimte/03630000001038/',
          },
          {
            category: 'Straatnamen',
            type: '',
            index: 2,
            label: 'Damrak',
            uri: 'bag/openbareruimte/03630000003187/',
          },
        ],
        totalResults: 6,
      },
      highlightValue: 'dam',
      inputValue: 'dam',
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
