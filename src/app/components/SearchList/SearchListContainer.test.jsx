import React from 'react'
import { shallow } from 'enzyme'
import configureMockStore from 'redux-mock-store'
import SearchListContainer from './SearchListContainer'

const initialState = {
  dataSearch: {
    category: {},
    resultsQuery: [],
  },
  user: {
    scopes: [],
  },
}

describe('SearchListContainer', () => {
  it('should render the container with the basic properties', () => {
    const store = configureMockStore()({ ...initialState })
    const props = {
      categoryResults: {
        results: [],
      },
      limit: 1,
    }
    const component = shallow(<SearchListContainer {...props} store={store} />).dive()
    expect(component).toMatchSnapshot()
  })
})
