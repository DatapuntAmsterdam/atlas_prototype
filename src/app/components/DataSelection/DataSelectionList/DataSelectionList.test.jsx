import configureMockStore from 'redux-mock-store'
import { shallow } from 'enzyme'
import DataSelectionList from './DataSelectionList'

jest.mock('react-redux')

describe('DataSelectionList', () => {
  it('should render without failing', () => {
    const store = configureMockStore()({})
    const component = shallow(
      <DataSelectionList
        store={store}
        content={{
          body: [
            {
              detailEndpoint: 'http://example.com',
              content: [[{}]],
            },
          ],
          formatters: [],
        }}
        navigateToDetail={() => {}}
      />,
    )

    expect(component).toMatchSnapshot()
  })
})
