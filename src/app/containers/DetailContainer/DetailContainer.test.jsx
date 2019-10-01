import React from 'react'
import { shallow } from 'enzyme'
import configureMockStore from 'redux-mock-store'
import DetailContainer from './DetailContainer'
import {
  getDetailEndpoint,
  getID,
  getSubType,
  isDetailLoading,
} from '../../../shared/ducks/detail/selectors'
import { getUser } from '../../../shared/ducks/user/user'
import {
  getPanoramaPreview,
  isPanoramaPreviewLoading,
} from '../../../panorama/ducks/preview/panorama-preview'

jest.mock('../../../shared/ducks/detail/selectors')
jest.mock('../../../shared/ducks/user/user')
jest.mock('../../../panorama/ducks/preview/panorama-preview')

describe('DetailContainer', () => {
  beforeEach(() => {
    getDetailEndpoint.mockReturnValue('myEndpoint')
    isDetailLoading.mockReturnValue(false)
    getID.mockReturnValue('1')
    getSubType.mockReturnValue('nummeraanduiding')
    getUser.mockReturnValue({})
    getPanoramaPreview.mockReturnValue({})
    isPanoramaPreviewLoading.mockReturnValue(false)
  })

  it('should render', () => {
    const store = configureMockStore()()
    const component = shallow(<DetailContainer store={store} />)
      .dive()
      .dive()
    expect(component).toMatchSnapshot()
  })
})
