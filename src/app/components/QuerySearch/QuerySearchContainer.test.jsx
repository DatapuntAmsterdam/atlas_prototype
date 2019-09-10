import React from 'react'
import { shallow } from 'enzyme'
import configureMockStore from 'redux-mock-store'
import QuerySearchContainer from './QuerySearchContainer'

const initialState = {
  datasets: {
    datasetData: {
      isLoading: false,
      result: {
        numberOfRecords: 1,
      },
    },
    datasetApiSpecification: {
      isLoading: false,
    },
  },
  dataSearch: {
    isLoading: false,
    numberOfResults: 1,
  },
  filter: {
    filters: {},
  },
  user: {
    authenticated: false,
    scopes: [],
  },
}

describe('QuerySearchContainer', () => {
  it('should render', () => {
    const store = configureMockStore()({ ...initialState })
    const component = shallow(<QuerySearchContainer store={store} />).dive()
    expect(component).toMatchSnapshot()
  })
})
