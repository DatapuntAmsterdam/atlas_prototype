import React from 'react'
import configureMockStore from 'redux-mock-store'
import { shallow } from 'enzyme'
import DataSelectionList from './DataSelectionList'

// Todo: DP-6235
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
    ).dive()

    expect(component).toMatchSnapshot()
  })
})
