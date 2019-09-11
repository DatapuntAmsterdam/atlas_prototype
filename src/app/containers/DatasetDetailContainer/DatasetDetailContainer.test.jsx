import React from 'react'
import { shallow } from 'enzyme'
import configureMockStore from 'redux-mock-store'
import DatasetDetailContainer from './DatasetDetailContainer'
import linkAttributesFromAction from '../../../shared/services/link-attributes-from-action/linkAttributesFromAction'

const initialState = {
  detail: {
    isLoading: false,
    detailObject: {
      'dct:title': 'foo',
      'dct:description': 'foo foo foo',
      'dct:identifier': 123,
    },
  },
  datasets: {
    datasetApiSpecification: {
      data: {},
    },
  },
  user: {},
  location: {
    payload: {
      id: 2,
    },
  },
}

jest.mock('../../../shared/services/link-attributes-from-action/linkAttributesFromAction')

describe('DatasetDetailContainer', () => {
  it('should render', () => {
    const store = configureMockStore()({ ...initialState })

    linkAttributesFromAction.mockImplementation(() => ({ href: '/foo/foo' }))

    const component = shallow(<DatasetDetailContainer store={store} />)
      .dive()
      .dive()
    expect(component).toMatchSnapshot()
  })
})
