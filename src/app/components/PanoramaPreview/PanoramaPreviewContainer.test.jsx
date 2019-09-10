import React from 'react'
import { shallow } from 'enzyme'
import configureMockStore from 'redux-mock-store'
import PanoramaPreviewContainer from './PanoramaPreviewContainer'

const initialState = {
  panoramaPreview: {
    isLoading: false,
  },
}

describe('PanoramaPreviewContainer', () => {
  it('should render the container with the basic properties', () => {
    const store = configureMockStore()({ ...initialState })
    const props = {}
    const component = shallow(<PanoramaPreviewContainer store={store} {...props} />).dive()
    expect(component).toMatchSnapshot()
  })
})
