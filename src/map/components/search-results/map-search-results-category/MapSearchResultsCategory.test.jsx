import { shallow } from 'enzyme'
import MapSearchResultsCategory from './MapSearchResultsCategory'

describe('MapSearchResultsCategory', () => {
  it('should render the component', () => {
    const component = shallow(
      <MapSearchResultsCategory
        category={{
          categoryLabel: '',
          subCategories: [
            {
              categoryLabel: 'label',
              results: [],
              type: '',
            },
            {
              categoryLabel: 'label',
              results: [],
              type: '',
            },
          ],
          results: [
            {
              uri: 'uri',
              label: 'label',
            },
            {
              uri: 'uri',
              label: 'label',
            },
          ],
          type: 'bag/ligplaats',
          uri: '',
          showMore: true,
        }}
        onItemClick={jest.fn()}
        onShowMoreClick={jest.fn()}
      />,
    )
    expect(component).toMatchSnapshot()
  })
})
